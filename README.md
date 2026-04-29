# Weather App - Open Pioneer Trails

Take Home Assignment for Open Pioneer Trails Weather App

## Quick start

Ensure that you have [Node](https://nodejs.org/en/) (Version 20 or later) and [pnpm](https://pnpm.io/) (Version 10.x) installed.

Then execute the following commands to get started:

```bash
$ git clone https://github.com/nils-gb156/open-pioneer-trails-weather-app.git # Clone the repository
$ cd open-pioneer-trails-weather-app
$ pnpm install                                                                # Install dependencies
$ pnpm run dev                                                                # Launch development server
$ cp .env.example .env
```

Enter API Keys for Opencage and OpenWeatherMap in `.env`.

Vite will print the project's local address (usually <http://localhost:5173/>).
Point your browser at it and start exploring!

## Deployment

To deploy the Weather App locally for production testing:

1. Build the optimized production bundle:

    ```bash
    pnpm run build
    ```

    This will generate the production-ready files in the `./dist` directory.

2. Start the local preview server:
    ```bash
    pnpm preview
    ```
    This serves the built app at a local address (default: <http://localhost:4173/>).

For detailed deployment instructions (including deploying to a real server or cloud), see [How to deploy an app](/docs/tutorials/HowToDeployAnApp.md).

## Testing

### 1. Setup LLM (LM Studio)

This project uses a locally running LLM via LM Studio to generate Playwright end-to-end tests from predefined use cases.

- Install and open [LM Studio](https://lmstudio.ai/)
- Download a suitable model (recommended: `Qwen2.5-Coder-14B` or `Qwen2.5-Coder-7B`)
- Load the model inside LM Studio
- Start the local API server

The server should be available at:

    http://localhost:1234/v1

You can verify it by opening:

    http://localhost:1234/v1/models

### 2. Generate Playwright Tests

Use cases are defined in:

    src/apps/weather-app/use_cases/use_cases.json

To generate Playwright tests from these use cases:

    cd src/apps/weather-app/scripts
    python generate_playwright_tests.py

This will:

- Send each use case to the LLM
- Generate a Playwright test in TypeScript
- Save the tests to:
  src/apps/weather-app/tests/generated/

### 3. Run Playwright Tests

Make sure the app is running:

    pnpm run dev

Then execute the generated tests in ui:

    nnpx playwright test src/apps/weather-app/tests/generated/ --ui

## License

Apache-2.0 (see `LICENSE` file)
