const { chalk } = require("hqw-util/lib/cli/console");
function createCompiler({ config, webpack }) {
  let compiler;
  try {
    // console.log("config", config);
    compiler = webpack(config);
  } catch (err) {
    // console.log("err", err);
    console.log(chalk.red("Failed to webpack compile."));
    process.exit(1);
  }

  compiler.hooks.invalid.tap("invalid", () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log("Compiling...");
  });
  compiler.hooks.done.tap("done", async stats => {
    // if (isInteractive) {
    //   clearConsole();
    // }
    console.log("done...");
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    });
    console.log("statsData", statsData);
  });

  return compiler;
}

module.exports = {
  createCompiler
};
