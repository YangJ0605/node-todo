const db = require('./db')
const inquirer = require('inquirer')
const chalk = require('chalk')

const add = async tasks => {
  const list = await db.read()
  tasks.map(task => {
    list.push({
      title: task,
      done: false
    })
  })
  await db.write(list)
}

const getInputTitle = async () => {
  const as = await inquirer.prompt({
    type: 'input',
    name: 'title',
    message: 'Please input a title'
  })
  return as.title
}

const askForAddTask = async list => {
  try {
    const title = await getInputTitle()

    list.push({
      title,
      done: false
    })
    await db.write(list)
    console.log(chalk.green('add a task success'))
  } catch (error) {
    console.log(chalk.red('add a task fail'))
  }
}

const askForActionTask = async (list, index) => {
  const actions = {
    async markAsDone() {
      list[index].done = true
      await db.write(list)
      console.log(chalk.green('mark success'))
    },
    async markAsUnDone() {
      list[index].done = false
      await db.write(list)
      console.log(chalk.green('mark success'))
    },
    async updateTitle() {
      const title = await getInputTitle()
      list[index].title = title
      await db.write(list)
      console.log(chalk.green('update title success'))
    },
    async remove() {
      const removeTitle = list[index].title
      list.splice(index, 1)
      await db.write(list)
      console.log(chalk.green(`remove ${removeTitle} success`))
    }
  }
  const res = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Select a action',
    choices: [
      { name: 'quit', value: 'quit' },
      { name: 'markAsDone', value: 'markAsDone' },
      { name: 'markAsUnDone', value: 'markAsUnDone' },
      { name: 'updateTitle', value: 'updateTitle' },
      { name: 'remove', value: 'remove' }
    ]
  })
  const { action } = res
  actions[action] && actions[action]()
}

const printAll = async list => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'index',
    message: 'What do you want to do?',
    choices: [
      { name: 'quit', value: -1 },
      ...list.map((task, index) => {
        return {
          name: `${task.done ? '[√]' : '[×]'} ${index + 1} - ${task.title}`,
          value: index
        }
      }),
      {
        name: '+ add task',
        value: -2
      }
    ]
  })
  const { index } = answer
  if (index >= 0) {
    askForActionTask(list, index)
  } else if (index === -2) {
    // console.log('create task')
    askForAddTask(list)
  }
}

const showAll = async () => {
  const list = await db.read()
  await printAll(list)
}

const clear = async () => {
  await db.write([])
}

module.exports = {
  add,
  showAll,
  clear
}
