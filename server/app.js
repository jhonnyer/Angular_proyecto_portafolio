'use strict'
var express=require('express');
var bodyParser=require('body-parser');

// ejecuto funcion de express 
var app=express();

//Cargar archivos de rutas
var project_routes=require('./routes/Rutas');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
// Cualquier tipo de peticion que llegue va a convertirlo en formato json 
app.use(bodyParser.json());

//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Rutas: /api/home, test ..
app.use('/api',project_routes);

// app.get('/',(req,res)=>{
//     res.status(200).send( 
//         "<h1>Pagina de Inicio</h1>"
//     ) 
//  });

// app.get('/test',(req,res)=>{
//    res.status(200).send({
//        message:"Hola mundo desde APi de Node Js"
//    }) 
// });

// Sin parametro id 
// app.post('/post',(req,res)=>{
// Peticion con parametro id  
// app.post('/post/:id',(req,res)=>{
//     console.log("Dato nombre enviado recuperado con params");
//     console.log(req.params.id); //recoger parametros de la url
//     console.log("Datos recuperados con req.body");
//     console.log(req.body); //body cuerpo de la peticion
//     console.log(req.body.nombre); 
//     console.log("Datos recuperados con req.query");
//     console.log(req.query); //Datos enviados en la url
//     res.status(200).send({
//         message:"Hola mundo desde APi de Node Js"
//     }) 
//  });

//Exportar variable app que tiene toda las configuraciones 
module.exports=app;