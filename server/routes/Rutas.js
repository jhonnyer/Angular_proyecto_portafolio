'use strict'
var express=require('express');
// importo rutas del controllador 
var ProjectController=require('../controllers/Project');
// Importo modulo express del router 
var router=express.Router();

// middleware para subir fotos. Se ejecuta antes de cargar el controlador 
var multipart=require('connect-multiparty');
var multipartMiddleware=multipart({uploadDir:'./uploads'})//directorio donde se van a guardar los archivos

// CREAR RUTAS 
router.get('/home',ProjectController.home);
router.post('/test',ProjectController.test);
router.post('/save-project',ProjectController.saveProject);
router.get('/project/:id?',ProjectController.getProject); // ? significa que el dato es opcional
router.get('/projects',ProjectController.getProjects);
router.put('/project/:id',ProjectController.updateProject); //metodo put para actualizar un objeto
router.delete('/project/:id',ProjectController.deleteProject);
// Se carga primero el middleware para cargar el archivo y luego el controlador 
router.post('/upload-image/:id', multipartMiddleware ,ProjectController.uploadImagen);
// Ruta para obtener la imagen del servidor: image es el parametro pasado por url en el backend 
router.get('/get-image/:image',ProjectController.getImagenFile);

module.exports=router;