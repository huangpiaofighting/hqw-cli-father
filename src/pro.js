const webpack = require("webpack");
const config = require("../config/webpack.pro");
const { chalk } = require("hqw-util/lib/cli/console");
const formatWebpackMessages = require("../util/formatWebpackMessages");
const {isEmpty} = require('lodash/lang')
try {
  compiler = webpack(config);
  compiler.run((err, stats) => {
      if(err){
          return
      }
      const messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
      const {errors , warnings} = messages;
      if(!isEmpty(errors)){
        console.log(chalk.red(errors))
      }
      if(!isEmpty(warnings)){
        console.log(chalk.yellow(warnings))
      }
  })
} catch (err) {
  // console.log("err", err);
  console.log(chalk.red("Failed to webpack compile."));
  process.exit(1);
}
