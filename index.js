const express = require('express');
const app = express();
const port = 8080;
const fs  = require('fs');
const path = require('path');
const face = require('./faceCheck');


app.set('view engine' ,'ejs');
app.use(express.urlencoded());
app.use("/matchedImages", express.static("./matchedImages"));

app.get ('/',(req,res)=>{
    res.render('index', {images: null, fs: null})
});

  const upload1 = require('./config/uploads')
  app.use('/single', express.static('single'));
const deletefile = (req,res,next)=>{
  try {
    fs.readdirSync('./single').forEach(file => {
      fs.unlinkSync(`./single/${file}`);
    })
    fs.readdirSync('./matchedImages').forEach(file => {
      fs.unlinkSync(`./matchedImages/${file}`);
    })
    next();
  
} catch (error) {
  res.send(err);
}

}
  app.post('/single',[deletefile, upload1.single('avatar')] , (req, res) => {
    console.log("Inside upload");
    if (!req.file) {
      console.log("file not found");
    }
    console.log("before image check");
    const allowedTypes = ['image/jpeg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        console.log("type is not vaild");
      }
      else
      {
        console.log("After check");
        face((err)=>{
          if(err){
            console.log('err');
          }
          else{
            console.log("done");
            res.render('index', {images: true, fs: fs});
          }
        })
      }
    console.log(req.file.path,"file uploads");
})

app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("server start on port" , port);
});

