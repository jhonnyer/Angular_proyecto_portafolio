'use strict'
// Coneccion a la base de datos de mongoose local
var mongoose=require('mongoose');
var app=require('./app'); //Carga configuracion archivo app.js
var port=3700; //puerto del servidor

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/Portafolio')
    .then(()=>{
        console.log("Conexión a la base de datos establecida con exito");
        //Creacion del servidor
        app.listen(port,()=>{
            console.log("Servidor corriendo correctamente en la url: localhost:3700")
        })
    })
    .catch(err=>{
        console.log(err);
    });

