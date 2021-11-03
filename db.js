const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const homedir = require('os').homedir()

// console.log(homedir, process.env.HOME)

const home = homedir || process.env.HOME

const dbpath = path.join(home, '.todo')
// console.log(dbpath)

const read = async (p = dbpath) => {
  let taskList = await promisify(fs.readFile)(p, { flag: 'a+' })
  try {
    taskList = JSON.parse(taskList)
  } catch (error) {
    taskList = []
  }
  return taskList
}

const write = async (list, path = dbpath) => {
  await promisify(fs.writeFile)(path, JSON.stringify(list) + '\n', {
    flag: 'w+'
  })
}

module.exports = {
  read,
  write
}
