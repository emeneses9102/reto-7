import { Router } from "express";
import Api from '../almacen.js'

import { options } from '../dataBase/configDB.js'
const router = Router()

const api = new Api(options.mariaDB,'storage')

router.get('/', (req, res)=>{
    res.render('main')
})


router.post('/',async(req, res)=>{
    const obj = req.body
    //console.log(obj)
    await api.create(obj)
    res.redirect('/')
})

export default router