
require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const studentRouter =require('./router/student')
const teacherRouter =require('./router/teacher')



var app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use('/student' ,studentRouter);
app.use('/teacher' ,teacherRouter);
app.listen(4000 , function()
{
    console.log("Listening to port 4000")
})