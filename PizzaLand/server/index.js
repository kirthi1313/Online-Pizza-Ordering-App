const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const url = require('url');
const app = express()
app.use(cors());
const port = 3000
const db = require('./queries')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})


// app.get('/users', db.getUsers)
// app.post('/users', db.createUser)
app.get('/basePizzen', db.getBasePizzen)
app.get('/ingredients', db.getIngredients)
app.get('/checkPriceBasePizza', db.checkPriceBasePizza)
app.get('/checkTotalPrice', db.checkTotalPrice)
app.get('/orders', db.getOrders)
app.get('/suppliers', db.getSuppliers)
app.get('/checkCustomer',db.checkCustomer)
app.get('/getRestockSuppliers',db.getRestockSuppliers)
app.get('/getAllSuppliers',db.getAllSuppliers)


app.post('/createOrder', db.createOrder)
app.post('/createSupplier', db.createSupplier)
app.post('/updateSupplier', db.updateSupplier)
app.post('/deleteSupplier', db.deleteSupplier)
app.post('/createIngredient', db.createIngredient)
app.post('/updateIngredient', db.updateIngredient)
app.post('/deleteIngredient', db.deleteIngredient)
app.post('/createUser', db.createUser)
app.post('/restockIngredient', db.restockIngredient)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})