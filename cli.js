#!/usr/bin/env node
const commander = require('commander')
const chalk = require('chalk')
const pkg = require('./package.json')
const api = require('./index')

const program = new commander.Command()

program.version(pkg.version)

// program.option('-x --xx', 'test x')

program
  .command('add <tasks...>')
  .description('add tasks')
  .action(source => {
    // console.log(source, des, x)
    api
      .add(source)
      .then(() => {
        console.log(chalk.green('tasks add success'))
      })
      .catch(() => {
        console.log(chalk.red('tasks add fail'))
      })
  })

program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api
      .clear()
      .then(() => {
        console.log(chalk.green('clear all task success'))
      })
      .catch(() => {
        console.log('clear all task fail')
      })
  })

program.parse(process.argv)

// console.log(process.argv)

// console.log(program.opts())

if (process.argv.length === 2) {
  api.showAll()
}
