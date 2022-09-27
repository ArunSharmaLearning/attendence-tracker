const express = require('express');
const studentRouter =require('./router/student')
const staffRouter =require('./router/staff')

require('./database/db');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use('/student' ,studentRouter);
app.use('/staff' ,staffRouter);

app.listen(4000 , function()
{
    console.log("Listening to port 4000");
})