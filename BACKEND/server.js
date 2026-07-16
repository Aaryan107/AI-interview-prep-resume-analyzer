require('dotenv').config()

const app=require('./src/app')
const connectToDB=require('./src/config/DataBase')

connectToDB()

app.listen(3000,function(){
    console.log('listening on port 3000')
})