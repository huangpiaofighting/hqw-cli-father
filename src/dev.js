const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const { config, serverConfig } = require("../config/webpack.dev");
const { chalk, clearConsole } = require("hqw-util/lib/cli/console");
const formatWebpackMessages = require("../util/formatWebpackMessages");
const { isEmpty } = require("lodash/lang");

const HOST = process.env.HOST || "localhost";
const port = "8002";
try {
  compiler = webpack(config);
  compiler.hooks.invalid.tap("invalid", () => {
    console.log("Compiling...");
  });
  compiler.hooks.done.tap("done", async stats => {
    const messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    );
    const { errors, warnings } = messages;
    if (!isEmpty(errors)) {
      console.log(chalk.red(errors));
    }
    if (!isEmpty(warnings)) {
      console.log(chalk.yellow(warnings));
    }
  });
  const devServer = new WebpackDevServer(compiler, serverConfig);
  devServer.listen(port, HOST, err => {
    if (err) {
      return console.log("11", err);
    }
    clearConsole();
    console.log(chalk.cyan("Starting the development server...\n"));
    //   openBrowser(urls.localUrlForBrowser);
  });
} catch (err) {
  console.log(err);
  console.log(chalk.red("Failed to webpack compile config."));
  process.exit(1);
}
