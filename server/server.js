const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const {spawn} = require('child_process')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

//middlewares 
app.use(cors())

//authentication



app.get('/', (req, res)=>{
    res.send('Web based linux terminal')
})

io.on('connection', (socket)=>{
    console.log('User connected')

    //handle socketio events

    socket.on('execute', (command)=>{
        const childProcess = spawn(command, {shell: true})

        childProcess.stdout.on('data', (data)=>{
            socket.emit(`output`, data.toString())
        })

        childProcess.on(`disconnect`, (code)=>{
            socket.emit(`output`, `process exited with code ${code}`)
        })
    })

    socket.on('disconnect', ()=>{
        console.log(`User disconnected`)
    })
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})