require('dotenv').config()

const app=require('./src/app')
const connectToDB=require('./src/config/DataBase')

connectToDB()

app.listen(process.env.PORT || 3000,function(){
    console.log(`listening on port ${process.env.PORT || 3000}`)
})