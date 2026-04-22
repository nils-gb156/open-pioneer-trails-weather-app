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

## License

Apache-2.0 (see `LICENSE` file)
