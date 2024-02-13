const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const express = require('express')
const addDays = require('date-fns/addDays')
const path = require('path')
const nodemon = require('nodemon')
var format = require('date-fns/format')
var isValid = require('date-fns/isValid')
const app = express()
app.use(express.json())

const pathDB = path.join(__dirname, 'todoApplication.db')
let database = null
const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: pathDB,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DB ERROR: ${error.message}`)
  }
}
initializeDBAndServer()

const Authentication = (request, response, next) => {
  const {status, category, priority, date} = request.query

  if (status !== undefined) {
    let statuscheck = ['TO DO', 'IN PROGRESS', 'DONE']
    const statusChecked = statuscheck.includes(status)

    try {
      if (statusChecked === true) {
        response.query = status
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Todo Status')
      return
    }
  }

  if (priority !== undefined) {
    let priorityCheck = ['HIGH', 'MEDIUM', 'LOW']
    const checkedPrority = priorityCheck.includes(priority)

    try {
      if (checkedPrority === true) {
        response.query = priority
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Todo Priority')
      return
    }
  }

  if (category !== undefined) {
    let categoryCheck = ['WORK', 'HOME', 'LEARNING']
    const checkedCategory = categoryCheck.includes(category)

    try {
      if (checkedCategory === true) {
        response.query = priority
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Todo Category')
      return
    }
  }

  if (date !== undefined) {
    const myDate = new Date(date)

    var validDate = isValid(new Date(date))

    try {
      if (validDate === true) {
        try {
          formatDate = format(new Date(myDate), 'yyyy-MM-dd')

          response.query = formatDate
        } catch (error) {
          response.status(400)
          response.send('Invalid Due Date')
          return
        }
      } else {
        response.status(400)
        response.send('Invalid Due Date')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Due Date')
      return
    }
  }
  todoId = request.params
  response.params = todoId

  next()
}

const AuthenticationBody = (request, response, next) => {
  const {status, category, priority, dueDate} = request.body

  if (status !== undefined) {
    let statuscheck = ['TO DO', 'IN PROGRESS', 'DONE']
    const statusChecked = statuscheck.includes(status)

    try {
      if (statusChecked === true) {
        response.body = status
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Todo Status')
      return
    }
  }

  if (priority !== undefined) {
    let priorityCheck = ['HIGH', 'MEDIUM', 'LOW']
    const checkedPrority = priorityCheck.includes(priority)

    try {
      if (checkedPrority === true) {
        response.body = priority
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Todo Priority')
      return
    }
  }

  if (category !== undefined) {
    let categoryCheck = ['WORK', 'HOME', 'LEARNING']
    const checkedCategory = categoryCheck.includes(category)

    try {
      if (checkedCategory === true) {
        response.body = priority
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Todo Category')
      return
    }
  }

  if (dueDate !== undefined) {
    const myDate = new Date(dueDate)

    var validDate = isValid(new Date(dueDate))

    try {
      if (validDate === true) {
        try {
          formatDate = format(new Date(myDate), 'yyyy-MM-dd')

          response.body = formatDate
        } catch (error) {
          response.status(400)
          response.send('Invalid Due Date')
          return
        }
      } else {
        response.status(400)
        response.send('Invalid Due Date')
        return
      }
    } catch (error) {
      response.status(400)
      response.send('Invalid Due Date')
      return
    }
  }

  next()
}

const camelCaseFun = responseObg => {
  return {
    id: responseObg.id,
    todo: responseObg.todo,
    priority: responseObg.priority,
    status: responseObg.status,
    category: responseObg.category,
    dueDate: responseObg.due_date,
  }
}

app.get('/todos/', Authentication, async (request, response) => {
  const {priority, status, category, search_q = ''} = request.query

  /*const {status = '', search_q = '', priority = '', category = ''} = request
  console.log(status, search_q, priority, category)
  const getTodosQuery = `
        SELECT 
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate 
        FROM 
            todo
        WHERE 
        todo LIKE '%${search_q}%' AND priority LIKE '%${priority}%' 
        AND status LIKE '%${status}%' AND category LIKE '%${category}%';`

  const todosArray = await database.all(getTodosQuery)
  response.send(todosArray)*/


  switch (true) {
    case status !== undefined:
      console.log(status)
      const ToDoStatusQuery = `SELECT * FROM todo WHERE status='${status}'`
      const ToDoStatusList = await database.all(ToDoStatusQuery)
      response.send(ToDoStatusList.map(eachObj => camelCaseFun(eachObj)))
      break
    case priority !== undefined:
      const ToDoPriorityQuery = `SELECT * FROM todo WHERE priority='${priority}';`
      const ToDoPriorityList = await database.all(ToDoPriorityQuery)
      response.send(ToDoPriorityList.map(eachObj => camelCaseFun(eachObj)))
      break
    case priority !== undefined && status !== undefined:
      const ToDoPriorityAndStatusQuery = `SELECT * FROM todo WHERE priority='${priority}' AND status='${status}';`
      const ToDoToDoPriorityAndStatusList = await database.all(
        ToDoPriorityAndStatusQuery,
      )
      response.send(
        ToDoToDoPriorityAndStatusList.map(eachObj => camelCaseFun(eachObj)),
      )
      break
    case category !== undefined && status !== undefined:
      const ToDoCatAndStaQuery = `SELECT * FROM todo WHERE status='${status}' AND category='${category}';`
      const ToDoCatAndStaList = await database.all(ToDoCatAndStaQuery)
      response.send(ToDoCatAndStaList.map(eachObj => camelCaseFun(eachObj)))
      break
    case category !== undefined:
      const ToDoCategoryQuery = `SELECT * FROM todo WHERE category='${category}';`
      const ToDoCategoryList = await database.all(ToDoCategoryQuery)
      response.send(ToDoCategoryList.map(eachObj => camelCaseFun(eachObj)))
      break
    case category !== undefined && priority !== undefined:
      const ToDoCatAndPriQuery = `SELECT * FROM todo WHERE category='${category}' AND priority='${priority}';`
      const ToDoCatAndPriList = await database.all(ToDoCatAndPriQuery)
      response.send(ToDoCatAndPriList.map(eachObj => camelCaseFun(eachObj)))
      break
    default:
      const ToDoSearchQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`
      const ToDosearchList = await database.all(ToDoSearchQuery)
      response.send(ToDosearchList.map(eachObj => camelCaseFun(eachObj)))
      break
  }
})

app.get('/todos/:todoId/', Authentication, async (request, response) => {
  const {todoId} = request.params
  console.log(todoId)
  const ToDoQuery = `SELECT * FROM todo WHERE id='${todoId}';`
  const ToDoList = await database.get(ToDoQuery)
  response.send(ToDoList)
})

app.get('/agenda/', Authentication, async (request, response) => {
  const dueDate = request.query

  const ToDoDueDateQuery = `SELECT * FROM todo WHERE due_date='${dueDate.date}';`
  const ToDoDueDateList = await database.all(ToDoDueDateQuery)
  response.send(ToDoDueDateList.map(eachObj => camelCaseFun(eachObj)))
})

app.post('/todos/', AuthenticationBody, async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  const postToDoPostQuery = `INSERT INTO todo (id,todo,priority,status,category,due_date) VALUES (${id},'${todo}','${priority}','${status}','${category}','${dueDate}')`
  await database.run(postToDoPostQuery)
  response.send('Todo Successfully Added')
})

app.put('/todos/:todoId/', AuthenticationBody, async (request, response) => {
  const {status, priority, todo, category, dueDate} = request.body
  const {todoId} = request.params

  switch (true) {
    case status !== undefined:
      const ToDoStaQuery = `UPDATE todo SET status='${status}' WHERE id=${todoId}`
      await database.run(ToDoStaQuery)
      response.send('Status Updated')
      break
    case priority !== undefined:
      const ToDopriQuery = `UPDATE todo SET priority='${priority}' WHERE id=${todoId}`
      await database.run(ToDopriQuery)
      response.send('Priority Updated')
      break
    case todo !== undefined:
      const ToDotodQuery = `UPDATE todo SET todo='${todo}' WHERE id=${todoId}`
      await database.run(ToDotodQuery)
      response.send('Todo Updated')
      break
    case category !== undefined:
      const ToDoCatQuery = `UPDATE todo SET category='${category}' WHERE id=${todoId}`
      await database.run(ToDoCatQuery)
      response.send('Category Updated')
      break
    case dueDate !== undefined:
      const ToDoDtQuery = `UPDATE todo SET due_date='${dueDate}' WHERE id=${todoId}`
      await database.run(ToDoDtQuery)
      response.send('Due Date Updated')
      break
  }
})

app.delete('/todos/:todoId/', Authentication, async (request, response) => {
  const {todoId} = request.params
  const ToDoDeleteQuery = `DELETE  FROM todo WHERE id='${todoId}';`
  await database.get(ToDoDeleteQuery)
  response.send('Todo Deleted')
})

module.exports = app
