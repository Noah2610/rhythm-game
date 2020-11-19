const path = require("path");

const CONFIGS = {
    app: {
        entry: "./src/index.ts",
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts"],
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "public"),
        },
    },

    server: {
        entry: "./server.ts",
        target: "node",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: "tsconfig.server.json",
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".js", ".ts"],
        },
        output: {
            filename: "server.js",
            path: path.resolve(__dirname),
        },
    },
};

const target = process.env.TARGET || "app"; // "app" || "server"

if (!["app", "server"].includes(target)) {
    console.error('Environment variable `TARGET` must be "app" or "server"');
    process.exit(1);
}

module.exports = CONFIGS[target];
