const path = require('path')
const curProjectPath = process.cwd();


module.exports = ()=>{
  const projectConfig = require(path.resolve(curProjectPath, './project.config.js'));
  const color = require('bash-color')
  if(!projectConfig.key){
    console.log(color.red('错误：缺少项目key'))
    process.exit(1)
  }
  projectConfig.prefix = projectConfig.prefix || ('/' + projectConfig.key); //项目路由前缀
  projectConfig.buildPath = projectConfig.buildPath || 'build'; //项目打包路径

  if(projectConfig.prefix === '/test'){
    console.log(color.red('异常警告：项目key是默认的，请打开 project.config.js修改'))
  }

  if(projectConfig.prefix.length > 1   && !/[a-z]+[a-z0-9\/\-]+/.test(projectConfig.prefix.substr(1))){
    console.log(color.red('错误：项目路由prefix，只能由小写字母、数字、"/", "-"组成'))
    process.exit(1)
  }

  projectConfig.curProjectPath = curProjectPath;
  return projectConfig;
};
