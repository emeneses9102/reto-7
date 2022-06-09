import {options} from './dataBase/configDB'
import knex from 'knex'

export default class Api{
    constructor(options, table){
        this.knex = knex(options)
        this.table=table
    }

    /* métodos para productos*/
    async createTable(){
        try{
            
            await this.knex.schema.dropTableIfExists(this.table)
            await this.knex.schema.createTable(this.table, table=>{
                table.increments('id').primary().unique()
                table.varchar('correo',45).notNullable()
                table.varchar('fechaMessage',15)
                table.varchar('texto',150)
            })
            return 'BD creada'
        } catch(error){
            throw new Error(`Error: ${error}`)
        }
    }
    async save(obj){
        try {
           const nuevoMensaje = await this.knex.from(this.table).insert(obj)
            return nuevoMensaje
        } catch (error) {
            console.log(error) 
        }
    }

    async getAll(){
        try {
            const todos= await this.knex.from(this.table).select("*")
            return todos
        } catch (err) {
            console.log(err)
        }
    }

}