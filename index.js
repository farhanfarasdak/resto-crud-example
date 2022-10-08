const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const { Menu } = require('./models')

const app = express()
const jsonParser = bodyParser.json()

app.use('/css', express.static(__dirname+'/css'))
app.use('/js', express.static(__dirname+'/js'))
app.set('view engine', 'ejs')

// VIEWS
app.get('/dashboard', async (req, res) => {
  const resp = await fetch('http://localhost:7070/menu')
  const data = await resp.json()


  res.render('dashboard', { menus: data})
})

app.use(cors())

// CREATE
app.post('/menu', jsonParser, async (req,res) => {
  try {
    const dataMenu = await Menu.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    })
    res.status(201).send(dataMenu)
  } catch (error) {
    res.status(422).send('UNABLE TO INSERT DATA')
  }
})

// READ
app.get('/menu', jsonParser, async(req, res) => {
  const dataMenu = await Menu.findAll()
  res.send(dataMenu)
})

// UPDATE
app.put('/menu/:id', jsonParser, async(req,res) => {
  try{
    const dataMenu = await Menu.findByPk(req.params.id)
    dataMenu.name = req.body.name
    dataMenu.description = req.body.description
    dataMenu.price = req.body.price
    await dataMenu.save()
    res.status(202).send(dataMenu)
  }catch(error){
    res.status(422).send('UNABLE TO UPDATE DATA')
  }
})

// DELETE
app.delete('/menu/:id', async (req, res) => {
  try{
    const dataMenu = await Menu.findByPk(req.params.id)
    dataMenu.destroy()
    res.status(202).send('DELETED')
  }catch(error){
    res.status(422).send('UNPROCESSABLE')
  }
})

app.listen(7070, () => {
  console.log('APP IS RUNNING')
})
