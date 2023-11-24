const Pool = require('pg').Pool
const pool = new Pool({
    user: 'db2311168_rw',
    host: 'pgsql.hrz.tu-chemnitz.de',
    database: 'db2311168',
    password: 'zae5Co6ueghi',
    port: 5432,
})
const url = require('url');
const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBasePizzen = (request, response) => {

    pool.query("SELECT * FROM public.pizzen where pizzasize='25 cm'", (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getIngredients = (request, response) => {

    pool.query("select getIngredients();", (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getOrders = (request, response) => {
    pool.query("select getOrders()", (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getSuppliers = (request, response) => {
    pool.query("select getSuppliers()", (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getAllSuppliers = (request, response) => {
    pool.query("select getAllSuppliers()", (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getRestockSuppliers = (request, response) => {
    const queryObject = url.parse(request.url, true).query;
    pool.query("select getSuppliersRestock($1)",[queryObject.id], (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const checkPriceBasePizza = (request, response) => {
    const queryObject = url.parse(request.url, true).query;
    console.log(queryObject);

    pool.query("select checkPriceBasedOnSize($1, $2)", [queryObject.size, queryObject.name], (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// select checkPriceOverall('{1,2,3}','30 cm','Pizza Tuna, Medium')
const checkTotalPrice = (request, response) => {
    const queryObject = url.parse(request.url, true).query;
    console.log(queryObject);

    pool.query("select checkPriceOverall($1, $2, $3)", [queryObject.arr, queryObject.size, queryObject.name], (error, results) => {
        if (error) {
            console.log("error", error)
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// const createUser = (request, response) => {
//     console.log(request);
//     const { name, email } = request.body

//     pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(201).send(`User added with ID: ${results.insertId}`)
//     })
//   }

const createOrder = (request, response) => {
    const { totalprice, pizzaname, ingredientlist,customerEmail } = request.body
    console.log("---", totalprice, pizzaname, ingredientlist, customerEmail)
    pool.query('select addOrders ($1, $2, $3, $4)', [totalprice, pizzaname, ingredientlist, customerEmail], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const createUser = (request, response) => {
    const { userName, email, password } = request.body
    console.log("---", userName, email, password)
    pool.query('select addCustomer ($1, $2, $3)', [userName, email, password], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

    const createSupplier = (request, response) => {
        const { supplierName, supplierContact, supplierEmail, supplierAddress } = request.body
        console.log("---",supplierName, supplierContact, supplierEmail, supplierAddress)
        pool.query('select addSupplier ($1, $2, $3, $4)', [supplierName, supplierContact, supplierEmail, supplierAddress], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const updateSupplier = (request, response) => {
        const { supplierName, supplierContact, supplierEmail, supplierAddress, hide, supplierId } = request.body
        console.log("---",supplierName, supplierContact, supplierEmail, supplierAddress, hide, supplierId)
        pool.query('select editSupplier($1, $2, $3, $4, $5, $6)', [supplierName, supplierContact, supplierEmail, supplierAddress, hide, supplierId], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const deleteSupplier = (request, response) => {
        const { supplierId } = request.body
        console.log("---", supplierId)
        pool.query('select deleteSupplier($1)', [supplierId], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const createIngredient = (request, response) => {
        const { ingredientName, ingredientPrice, quantity, supplierAddress, supplierId} = request.body
        console.log("---",ingredientName, ingredientPrice, quantity, supplierAddress, supplierId)
        pool.query('select addIngredient ($1, $2, $3, $4, $5)', [ingredientName, ingredientPrice, quantity, supplierAddress, supplierId], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const updateIngredient = (request, response) => {
        const {ingredientName, ingredientPrice, quantity, supplierAddress, hide,  stockid,supplierId  } = request.body
        console.log("---",ingredientName, ingredientPrice, quantity, supplierAddress, hide ,stockid,supplierId)
        pool.query('select editIngredients($1, $2, $3, $4, $5, $6, $7)', [ingredientName, ingredientPrice, quantity, supplierAddress, hide ,stockid, supplierId ], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const deleteIngredient = (request, response) => {
        const { stockid } = request.body
        console.log("---", stockid)
        pool.query('select deleteingredient($1)', [stockid], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const restockIngredient = (request, response) => {
        const {ingredientId,supplierId,quantity} = request.body
        console.log("---",ingredientId,supplierId,quantity)
        pool.query('select add_stock($1, $2, $3)', [ingredientId,supplierId,quantity ], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.insertId}`)
        })
    }

    const checkCustomer = (request, response) => {
        // const {email,pwd} = request.body
        // console.log(email,pwd)
        const queryObject = url.parse(request.url, true).query;
        pool.query('select check_customer($1,$2)', [queryObject.email,queryObject.pwd], (error, results) => {
            if (error) {
                throw error
            }
            console.log("results ",results)
        response.status(200).json(results.rows)

        })
    }

module.exports = {
    getOrders,
    getBasePizzen,
    getIngredients,
    getSuppliers,
    getAllSuppliers,
    checkPriceBasePizza,
    checkTotalPrice,
    deleteSupplier,
    deleteIngredient,
    createOrder,
    createSupplier,
    updateSupplier,
    createIngredient,
    updateIngredient,
    createUser,
    restockIngredient,
    checkCustomer,
    getRestockSuppliers
}