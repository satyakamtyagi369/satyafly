const express= require("express");
const path = require("path");

const port = 3000;
const app = express();
app.use(express.static(path.join(__dirname,'../frontend/public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/public/index.html'));
})

app.listen(port,()=>{
    console.log(`Server is listening on http://localhost:${port}`);
})