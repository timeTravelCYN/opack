'use strict';

const run = () => {
  const inquirer = require('inquirer');
  const result = inquirer
    .prompt([
      {
        type: 'list',
        name: 'suiteName',
        message: '选择哪个套件?',
        choices: [
          'react',
          'vue',
        ]
      },
    ])
  return result;
}
module.exports = run;
