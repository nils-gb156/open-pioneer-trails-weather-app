import json
import re
from pathlib import Path
from typing import Any, Dict, List

from openai import OpenAI


LM_STUDIO_BASE_URL = "http://localhost:1234/v1"
LM_STUDIO_API_KEY = "lm-studio"
MODEL_NAME = "qwen/qwen2.5-coder-14b"
MODEL_QUANTIZATION = "Q4_K_M"  # document exact quantization for thesis reproducibility
TEMPERATURE = 0.1

SCRIPT_DIR = Path(__file__).parent
USE_CASES_FILE = SCRIPT_DIR.parent / "use_cases.json"
OUTPUT_DIR = SCRIPT_DIR.parent / "tests" / "stage_1_baseline"
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


def build_prompt(use_case: Dict[str, Any], base_url: str) -> str:
    use_case_json = json.dumps(use_case, indent=2, ensure_ascii=False)

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
- The generated test should focus strictly on the provided use case.
- Prefer robust selectors such as getByRole, getByText, getByLabel, getByTestId if possible.
- If an element is uncertain, use reasonable fallback selectors.
- Keep the test readable and well-structured.
- Add short comments for major steps.
- Use expect assertions based on the expected_result field.
- Avoid unnecessary waits. Prefer Playwright auto-waiting.
- If map interaction is needed and exact selectors are unknown, use a pragmatic interaction strategy that is still realistic.
- If the UI text is uncertain, infer carefully from the use case title and steps.
- Use a single test() block.
- The test title should include the use case id and title.
- Do not generate helper functions outside the test unless necessary.
- Do not generate multiple alternative implementations.
- If assumptions are required, encode them directly in the test as reasonable selectors or comments.
- Always start by navigating to the app using `await page.goto('{base_url}');`.
- If you need to interact with the map, prefer clicking a visible map container or canvas element.
- If selectors are uncertain, choose pragmatic selectors and add a brief inline comment describing the assumption.
- Return only the final TypeScript code.

Use case:
{use_case_json}

Now generate the Playwright TypeScript test file content only.
""".strip()


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


def generate_tests(use_cases: List[Dict[str, Any]], output_dir: Path, base_url: str) -> None:
    for use_case in use_cases:
        try:
            print(f"Generating test for UC {use_case['id']}: {use_case['title']}")

            prompt = build_prompt(use_case, base_url)
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
