const yargs = require('yargs');
const fs = require('fs-extra');
const color = require('bash-color');
const shell = require('shelljs');
const path = require('path');
const inquire = require('./inquire')
const packagePath = path.resolve('./package.json');
const curProjectPath = process.cwd();
const suiteJson = require('../suite.json')

// const setSuiteName = (value) => {
//   const filepath = packagePath;
//   const config = {
//     name: 'test',
//     version: '1.0.0',
//     description: '',
//     main: 'index.js',
//     opackConfig: {
//       suiteName: value
//     },
//     scripts: {
//       dev: 'NODE_ENV=development opack dev',
//       build: 'NODE_ENV=production opack build',
//       init: 'opack init',
//       pub: 'NODE_ENV=production opack pub'
//     },
//     keywords: [],
//     author: '',
//     license: 'ISC'
//   };
//   fs.writeFileSync(filepath, JSON.stringify(config, null, 2), 'utf8');
//   console.info(color.green(`suite"${value}"配置在 ${filepath} 写入成功`));
// };

const installSuite = (suiteName) => {
  console.log('suiteName:', suiteName);
  const curProjectPath = process.cwd();
  shell.cd(curProjectPath);
  let installCode = `npm install ${suiteName} -D --no-package-lock`;
  console.log(`正在安装 ${installCode}，请稍等`);
  const child = shell.exec(installCode);
  if (child.code !== 0) {
    console.log(color.red(`模块 安装失败`));
    console.log('Program output:', child.stdout);
    console.log('Program stderr:', child.stderr);
  } else {
    console.log(color.green(`suite安装成功`));
  }
};

const tryGetSuite = ()=>{
  let opackConfig = {};
  try {
    const packageJson = require(packagePath);
    opackConfig = packageJson.opackConfig || {};
  } catch (e) {
    return null;
  }
  if (!opackConfig.suiteName) {
    return null;
  }
  try{
    const suiteModule = require(path.resolve(curProjectPath, './node_modules/' + opackConfig.suiteName));
    return suiteModule;
  }catch(e){
    return null;
  }
}
const checkSuite = () => {
  let opackConfig = {};
  try {
    const packageJson = require(packagePath);
    opackConfig = packageJson.opackConfig || {};
  } catch (e) {
    console.error('请初始化 suite');
    process.exit(1);
  }
  if (!opackConfig.suiteName) {
    console.error('suite配置有误，请确认是否正常初始化');
    process.exit(1);
  }
  try{
    const suiteModule = require(path.resolve(curProjectPath, './node_modules/' + opackConfig.suiteName));
    return suiteModule;
  }catch(e){
    console.error(e)
    console.error('请重新安装 node_modules 下的依赖')
    process.exit(1)
  }
};

function isFile(filepath) {
  try {
    let stat = fs.lstatSync(filepath);
    return stat.isFile();
  } catch (err) {
    return false;
  }
}

const cli = () => {
  const suiteModule = tryGetSuite();
  function checkSuiteModule(){
    if(!suiteModule){
      checkSuite();
    }
  }
  const commands = [
    {
      name: 'init',
      desc: '初始化',
      setOptions: function (yargs) {
        yargs.option('suite', {

        })
      },
      run: async function (argv) {
        if(suiteModule){
          console.log('已存在 suiteModule，无需初始化')
          return;
        }
        const filepath = path.resolve(curProjectPath, './.lock');
        if (isFile(filepath)) {
          console.log('存在 lock 文件，已初始化');
          process.exit(1);
        }
        let selectSuiteName = argv.suite || '';
        if(!selectSuiteName){
          const result = await inquire();
          selectSuiteName = result.suiteName;
        }
        console.log(`选择 suite:`, selectSuiteName)

        checkSuite().init();
        installSuite(suite);
      }
    },
    {
      name: 'dev',
      desc: '本地开发',
      setOptions: function (yargs) {
        yargs.option('suite', {
          default: 'react'
        });
      },
      run: function () {
        checkSuiteModule()
        suiteModule.dev();
      }
    },
    {
      name: 'build',
      desc: '构建',
      setOptions: function () {

      },
      run: function () {
        checkSuiteModule()
        suiteModule.build();
      }
    },
    {
      name: 'pub',
      desc: '发布talos',
      setOptions: function () {

      },
      run: function () {
        checkSuiteModule();
        suiteModule.pub();
      }
    }
  ];
  if(suiteModule && suiteModule.$others && typeof suiteModule.$others === 'object'){
    Object.keys(suiteModule.$others).forEach(key=>{
      let c = suiteModule.$others[key];
      commands.push({
        name: key,
        desc: c.title,
        setOptions: c.setOptions || (()=>{}),
        run: c.run
      })
    })
  }
  commands.forEach((item) => {
    let commandName = item.name;
    yargs.command(commandName, item.desc, item.setOptions, async (...args)=>{
      item.run(...args)
    });
  });

  // 运行
  yargs.argv;
};

exports.cli = cli;
exports.getProjectConfig = require('./getProjectConfig')
