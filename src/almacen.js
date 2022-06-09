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
            //console.log('tabla')
            await this.knex.schema.dropTableIfExists(this.table)
            await this.knex.schema.createTable(this.table, table=>{
                table.increments('id').primary().unique()
                table.varchar('nombre',45).notNullable()
                table.float('precio')
                table.varchar('url',150)
            })
            return 'BD creada'
        } catch(error){
            throw new Error(`Error: ${error}`)
        }
    }
    async findAll(){
        try{
            const todos= await this.knex.from(this.table).select("*")
            return todos
        } catch(error){
            throw new Error(`Error: ${error}`)
        }
    }

    async create(obj){
        try {
            //console.log(obj)
            const nuevoElemento = await this.knex.from(this.table).insert(obj)
            return nuevoElemento
        } catch (error) {
            throw new Error(`Error al registrar un producto: ${error}`)
        }
    }


}