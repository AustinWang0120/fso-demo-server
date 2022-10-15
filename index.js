const express = require("express")
const cors = require("cors")
const app = express()

const requestLogger = (req, res, next) => {
    console.log("Method:", req.method)
    console.log("Path:  ", req.path)
    console.log("Body:  ", req.body)
    console.log("-------")
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: "unknown endpoint",
    })
}

app.use(cors())
app.use(express.json())
app.use(express.static("build"))
app.use(requestLogger)

let todos = [
    {
        id: 1,
        content: "learn HTML",
        date: "2019-05-30T17:30:31.098Z",
        completed: false,
    },
    {
        id: 2,
        content: "learn JS",
        date: "2019-05-30T18:39:34.091Z",
        completed: false,
    },
    {
        id: 3,
        content: "learn HTTP",
        date: "2019-05-30T19:20:14.298Z",
        completed: false,
    },
    {
        content: "learn CSS",
        date: "2022-10-14T08:45:09.538Z",
        completed: false,
        id: 4,
    },
]

app.get("/", (req, res) => {
    res.send("<h1>hello world</h1>")
})

app.get("/api/todos", (req, res) => {
    res.json(todos)
})

app.get("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id)
    const todo = todos.find((todo) => todo.id === id)
    if (todo) {
        res.json(todo)
    } else {
        res.status(404).end()
    }
})

app.post("/api/todos", (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: "content missing",
        })
    }

    const maxId =
        todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) : 0
    const todo = {
        id: maxId + 1,
        content: body.content,
        completed: false,
        date: new Date(),
    }
    todos = todos.concat(todo)
    res.json(todo)
})

app.put("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id)
    const body = req.body
    const todo = todos.find((todo) => todo.id === id)
    if (!todo) {
        return res.status(404).json({
            error: "no todo was found",
        })
    } else {
        const newTodo = {
            ...todo,
            ...body,
        }
        todos = todos.map((todo) => (todo.id === id ? newTodo : todo))
        res.json(newTodo)
    }
})

app.delete("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id)
    todos = todos.filter((todo) => todo.id !== id)
    res.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
