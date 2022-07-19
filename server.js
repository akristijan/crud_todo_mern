//Decalre variables
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const TodoTask = require('./models/todotask')


require('dotenv').config()
const PORT = process.env.PORT

//add model variable

//Set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log("Connected to DB")
})

//Get method
app.get('/', async (req,res) => {
    try {
        TodoTask.find({}, (err, tasks)=> {
            res.render('index', {todoTasks: tasks})
        })
    } catch (error) {
        if(error) return res.status(500).send(error)    
    }
    
})

//EDIT or UPDATE METHOD
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id
        TodoTask.find({}, (err, tasks) => {
            res.render('edit', {todoTasks: tasks, idTask: id})
        })
    })
    .post((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if(err) return res.status(500).send(err)
                res.redirect('/')
            }
        )
    })

//POST 
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )

    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    }
    catch(err) {
        if(err) return res.status(500).send(err)
        res.redirect('/')
    }
})


app.listen(PORT, ()=> {console.log(`Server is running on port ${PORT}`)})

