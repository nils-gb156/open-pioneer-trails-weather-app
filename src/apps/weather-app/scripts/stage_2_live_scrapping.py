import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from openai import OpenAI
from playwright.sync_api import sync_playwright, Page


LM_STUDIO_BASE_URL = "http://localhost:1234/v1"
LM_STUDIO_API_KEY = "lm-studio"
MODEL_NAME = "qwen/qwen2.5-coder-14b"
MODEL_QUANTIZATION = "Q4_K_M"
TEMPERATURE = 0.1

SCRIPT_DIR = Path(__file__).parent
USE_CASES_FILE = SCRIPT_DIR.parent / "use_cases.json"
OUTPUT_DIR = SCRIPT_DIR.parent / "tests" / "stage_2_live_scrapping"
BASE_URL = "http://localhost:5173/open-pioneer-trails-weather-app/"

client = OpenAI(
    base_url=LM_STUDIO_BASE_URL,
    api_key=LM_STUDIO_API_KEY,
)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def load_use_cases(file_path: Path) -> List[Dict[str, Any]]:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "use_cases" not in data or not isinstance(data["use_cases"], list):
        raise ValueError("JSON file must contain a 'use_cases' array.")

    return data["use_cases"]


# ---------------------------------------------------------------------------
# Locator scraping via Playwright
# ---------------------------------------------------------------------------

def scrape_app_context(base_url: str) -> Optional[str]:
    """
    Navigates to the app with a real browser, extracts:
    - All data-testid attributes
    - Accessibility snapshot (roles, labels, states)

    Returns a formatted string to inject into the LLM prompt.
    Returns None if the app is not reachable.
    """
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(base_url, wait_until="domcontentloaded", timeout=15000)
            page.wait_for_selector("[data-testid]", timeout=10000)

            test_ids = _extract_test_ids(page)
            aria_snapshot = _get_accessibility_snapshot(page)
            aria_text = _format_aria_snapshot(aria_snapshot)

            browser.close()

        sections = []

        if test_ids:
            sections.append(
                "data-testid attributes found in the app:\n"
                + "\n".join(f"  - {tid}" for tid in test_ids)
            )

        if aria_text:
            sections.append("Accessibility tree (roles and labels):\n" + aria_text)

        if not sections:
            return None

        return "\n\n".join(sections)

    except Exception as exc:
        print(f"  [warn] Could not scrape app context: {exc}")
        return None


def _extract_test_ids(page: Page) -> List[str]:
    """Returns all unique data-testid values found on the page, including inside shadow DOM."""
    raw = page.evaluate("""
        () => {
            function collect(root, ids) {
                const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
                let node = walker.nextNode();
                while (node) {
                    if (node.shadowRoot) collect(node.shadowRoot, ids);
                    const tid = node.getAttribute && node.getAttribute('data-testid');
                    if (tid) ids.add(tid);
                    node = walker.nextNode();
                }
            }
            const ids = new Set();
            collect(document.body, ids);
            return [...ids];
        }
    """)
    return sorted(raw) if raw else []


def _get_accessibility_snapshot(page: Page) -> Optional[Dict]:
    """Returns the accessibility snapshot if supported by the Playwright version."""
    try:
        if hasattr(page, "accessibility"):
            return page.accessibility.snapshot()
        if hasattr(page, "accessibility_snapshot"):
            return page.accessibility_snapshot()
    except Exception:
        return None
    return None


def _format_aria_snapshot(node: Optional[Dict], indent: int = 0) -> str:
    """Recursively formats the accessibility tree into readable text."""
    if not node:
        return ""

    role = node.get("role", "")
    name = node.get("name", "")
    children = node.get("children", [])

    line = "  " * indent + f"[{role}]" + (f' "{name}"' if name else "")
    lines = [line]

    for child in children or []:
        lines.append(_format_aria_snapshot(child, indent + 1))

    return "\n".join(filter(None, lines))


# ---------------------------------------------------------------------------
# Prompt building
# ---------------------------------------------------------------------------

def build_prompt(
    use_case: Dict[str, Any],
    base_url: str,
    app_context: Optional[str],
) -> str:
    use_case_json = json.dumps(use_case, indent=2, ensure_ascii=False)

    context_section = (
        f"""
The following locators and UI structure were extracted from the live application.
Use these as your primary source for selectors — do not invent selectors that are not listed here.

{app_context}
"""
        if app_context
        else """
The live application could not be reached. Use reasonable selector assumptions
and add inline comments marking them as unverified.
"""
    )

    return f"""
You are an expert QA engineer and Playwright test automation specialist.

Your task is to generate exactly ONE Playwright end-to-end test in TypeScript for the given use case.

Important requirements:
- Output ONLY valid TypeScript code.
- Do NOT wrap the answer in markdown code fences.
- Use Playwright test syntax with:
  import {{ test, expect }} from '@playwright/test';
- The test must be runnable as a `.spec.ts` file.
- Use the base URL: {base_url}
- Prefer getByTestId() for elements listed in the locator context below.
- Only fall back to getByRole/getByText if no matching testid exists.
- Never invent testid values that are not listed in the context.
- Keep the test readable and well-structured with short step comments.
- Use expect assertions based on the expected_result field.
- Avoid unnecessary waits. Prefer Playwright auto-waiting.
- Use a single test() block.
- The test title should include the use case id and title.
- Do not test canvas or map rendering directly.
- Always start by navigating to the app using `await page.goto('{base_url}');`.
- Return only the final TypeScript code.

{context_section}

Use case:
{use_case_json}

Now generate the Playwright TypeScript test file content only.
""".strip()


# ---------------------------------------------------------------------------
# LLM call
# ---------------------------------------------------------------------------

def extract_typescript_code(response_text: str) -> str:
    text = response_text.strip()
    fenced_match = re.search(
        r"```(?:typescript|ts)?\s*(.*?)```",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if fenced_match:
        return fenced_match.group(1).strip()
    return text


def validate_generated_code(ts_code: str) -> None:
    if not ts_code.strip():
        raise ValueError("Model returned empty output.")
    if not re.search(r"from\s+['\"]@playwright/test['\"]", ts_code):
        raise ValueError("Generated code does not contain the expected Playwright import.")
    if "test(" not in ts_code:
        raise ValueError("Generated code does not contain a Playwright test() block.")
    if "page.goto(" not in ts_code:
        raise ValueError("Generated code does not navigate to the application.")


def call_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You generate executable Playwright end-to-end tests in TypeScript. "
                    "Return only valid TypeScript code without markdown fences."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=TEMPERATURE,
    )
    content = response.choices[0].message.content
    if content is None:
        raise ValueError("Model returned no content.")
    return content


# ---------------------------------------------------------------------------
# File output
# ---------------------------------------------------------------------------

def save_test_file(
    output_dir: Path,
    use_case: Dict[str, Any],
    ts_code: str,
    prompt: str,
) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    slug = f"uc-{int(use_case['id']):02d}-{slugify(use_case['title'])}"
    file_path = output_dir / f"{slug}.spec.ts"
    file_path.write_text(ts_code + "\n", encoding="utf-8")
    (output_dir / f"{slug}.prompt.txt").write_text(prompt, encoding="utf-8")
    return file_path


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def generate_tests(
    use_cases: List[Dict[str, Any]],
    output_dir: Path,
    base_url: str,
) -> None:
    print("Scraping live app for locators...")
    app_context = scrape_app_context(base_url)

    if app_context:
        print("  App context scraped successfully.")
    else:
        print("  Could not reach app — generating without live context.")

    for use_case in use_cases:
        try:
            print(f"Generating test for UC {use_case['id']}: {use_case['title']}")
            prompt = build_prompt(use_case, base_url, app_context)
            raw_response = call_llm(prompt)
            ts_code = extract_typescript_code(raw_response)
            validate_generated_code(ts_code)
            file_path = save_test_file(output_dir, use_case, ts_code, prompt)
            print(f"  Saved: {file_path}")
        except Exception as exc:
            print(f"  Failed UC {use_case.get('id')}: {exc}")


def main() -> None:
    use_cases = load_use_cases(USE_CASES_FILE)
    generate_tests(use_cases, OUTPUT_DIR, BASE_URL)


if __name__ == "__main__":
    main()