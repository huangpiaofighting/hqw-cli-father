const fs = require('fs');
const path = require('path');
const crossSpawn = require('hqw-util/lib/cli/crossSpawn');
const execa = require('execa');
const { printSuccess, printError, chalk } = require('hqw-util/lib/cli/console');
const inquirer = require('inquirer');

const eslintrc = `const config = {
  extends: [require.resolve('hqw-fabric')],
}
module.exports = config`;
function execaYarnVersion() {
  try {
    const { stdout } = execa.sync('yarn -v');
    printSuccess(`yarn version:${stdout}`);
  } catch (error) {
    printError('请安装yarn');
    process.exit();
  }
}
function findfabric() {
  let cwd = process.cwd();
  const packagePath = path.join(cwd, '/package.json');
  if (fs.existsSync(packagePath)) {
    const package = require(packagePath);
    if (package.devDependencies && package.devDependencies['hqw-fabric']) {
      //   printSuccess('项目中已存在hqw-fabric');
      console.log(chalk.yellowBright.bold('项目中已存在hqw-fabric'));
    } else {
      execaYarnVersion();
      const result = crossSpawn.sync('yarn', ['add', 'hqw-fabric', '-D'], {
        stdio: 'inherit',
      });
      if (result.signal) {
        printError('hqw-fabric安装失败');
        process.exit(1);
      } else {
        printSuccess('hqw-fabric安装成功');
      }
    }
  }
}

async function writeEslint() {
  const tt = await fs.promises.writeFile('.eslintrc.js', eslintrc, 'utf8');
  if (!tt) {
    printSuccess('eslintrc创建成功！');
  } else {
    printError('eslintrc创建失败！', tt);
  }
}

async function writePrettierrc() {
  const prettierrc = `"hqw-fabric/.prettierrc.js"`;
  const tt = await fs.promises.writeFile('.prettierrc', prettierrc, 'utf8');
  if (!tt) {
    printSuccess('prettierrc创建成功！');
  } else {
    printError('prettierrc创建失败！', tt);
  }
}

async function existEslint() {
  const eslintrcPath = path.join(process.cwd(), '/.eslintrc.js');
  if (fs.existsSync(eslintrcPath)) {
    const answer = await inquirer.prompt([
      {
        name: 'eslintrc',
        message: '是否要覆盖.eslintrc.js文件',
        type: 'confirm',
      },
    ]);
    if (answer.eslintrc) {
      await writeEslint();
    }
  } else {
    await writeEslint();
  }
}
async function existPrettierrc() {
  const prettierrcPath = path.join(process.cwd(), '/.prettierrc');
  if (fs.existsSync(prettierrcPath)) {
    const answer = await inquirer.prompt([
      {
        name: 'prettierrc',
        message: '是否要覆盖.prettierrc文件',
        type: 'confirm',
      },
    ]);
    if (answer.prettierrc) {
      writePrettierrc();
    }
  } else {
    writePrettierrc();
  }
}
async function isInstalleslintrc() {
  const answer = await inquirer.prompt([
    {
      name: 'installEslintrc',
      message: '是否安装.eslintrc.js文件',
      type: 'confirm',
    },
  ]);
  if (answer.installEslintrc) {
    await existEslint();
  }
}
async function isInstallprettierrc() {
  const answer = await inquirer.prompt([
    {
      name: 'installprettierrc',
      message: '是否安装.prettierrc文件',
      type: 'confirm',
    },
  ]);
  if (answer.installprettierrc) {
    await existPrettierrc();
  }
}
findfabric();
(async () => {
  await isInstalleslintrc();
  await isInstallprettierrc();
})();
