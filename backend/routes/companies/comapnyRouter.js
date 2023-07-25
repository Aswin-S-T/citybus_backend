const express = require('express')
const companyRouter = express.Router()

companyRouter.get('/',(req,res)=>{
    res.send('company user called')
})

companyRouter.post('/add-bus',(req,res)=>{
    let data = req.body
    
    res.send('add bus called')
})

module.exports = companyRouter