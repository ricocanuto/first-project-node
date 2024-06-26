const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3000
const app = express()
app.use(express.json())
app.use(cors())

const portDeploy = process.env.PORT || 3000;

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({ message: "User not found"})
    }
    
    request.userIndex = index
    request.userId = id

    next()
}

app.get('/Users', (request, response) => {
    return response.json(users)
})

app.post('/Users', (request, response) => {
    const { name, age, email } = request.body

    const user = { id: uuid.v4(), name, age, email }

    users.push(user)

    return response.status(201).json(user)
})

app.put('/Users/:id', checkUserId, (request, response) => {
    
    const { name, age, email } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age, email }
    
    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/Users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

