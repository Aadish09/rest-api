const express = require("express");
const app =express();
const morgan = require('morgan');//gives log
const bodyparser =require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const port = process.env.PORT || 3000;

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

//database connection
mongoose.connect(`mongodb://<username>:${process.env.pw}@ds151076.mlab.com:51076/rest-api`, {useNewUrlParser: true, useFindAndModify: false}, (err) => {
  if (err) console.error.bind(console, 'connection error: ');
  console.log("Connected to Data Base");
});

mongoose.Promise=global.Promise;
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//allowing CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept, Authorization'  );
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, PATCH, DELETE, POST,GET');
    return res.status(200).json({});
}
next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

// req other than above rotes should get error
app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status=404;
    next(error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  if (err.status == undefined)
      res.status(500).render('error-500');
  else
    res.status(err.status || 503)
        .render(`error-${err.status}`);
});

const server = http.createServer(app);
server.listen(port, ()=>{
    console.log("Server Started on port 3000");
});