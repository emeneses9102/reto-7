import express from "express";
import { Server as ioServer } from 'socket.io'
import Api from './src/almacen'
import { options } from './src/dataBase/configDB.js'
const api = new Api(options.mariaDB,'storage')
import http from 'http'
import almacenRoutes from './src/routes/almacen'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const app = express()
const httpServer = http.createServer(app)
const io = new ioServer(httpServer)
//import Mensaje from './mensaje.js'

import Mensaje from './src/mensajes'

let mensajes = new Mensaje(options.sqlite,'mensajes')
let productos = await api.findAll()
let idProducto = 1
let dato = new Date()

import bodyParser from'body-parser'

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

app.use('/',almacenRoutes)

/*let messages = [
    {correo:'Servidor', fechaMessage: fecha, texto:'Saludo del servidor'}
]*/
import handlebars from 'express-handlebars'


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('views','./views')

const iniciarBD=async()=>{
    await api.createTable()
    await mensajes.createTable()
}
iniciarBD()
//NUEVO SERVIDOR
io.on('connection',async (socket)=>{


    console.log('Un cliente se a conectado', socket.id)
    io.sockets.emit('productos', await api.findAll())

    io.sockets.emit('messages',await mensajes.getAll())
    
    socket.on("newMessage", async (message) =>{
        await mensajes.save(message)
        io.sockets.emit('messages', await mensajes.getAll())
    })
})
 

const errorMiddleware = (err, req, res, next)=>{
    if(err){
        return res.status(500).json({error:err})
    }
    next()
}



/*****  Plantillas *******/


//plantilla Handlebars
app.set('view engine','hbs')
app.engine('hbs',handlebars.engine({
    extname: ".hbs",
    defaultLayout:"index.hbs",
    layoutsDir:__dirname+"/views/layouts",
    partialsDir:__dirname+"/views/partials"
}))





const PORT= 8080
const server = httpServer.listen(PORT, (err)=>{
    if(err) console.log(err)
    console.log(`Servidor escuchandose en el puerto ${PORT}`)
})
