'use strict'
const { mongo } = require('mongoose');
const { findById } = require('../models/project');
const project = require('../models/project');
var Project=require('../models/project');
// Libreria para eliminar la imagen si la extension no es correcta 
var fs=require('fs');
// propiedad para acceder a la ruta real del servidor 
var path=require('path');
var controller={
    home:function(req, res){
        return res.status(200).send({
            message:"Pagina de inicio"
        })
    },

    test:function(req, res){
        console.log("Dato nombre enviado recuperado con params");
        console.log(req.params.id); //recoger parametros de la url
        console.log("Datos recuperados con req.body");
        console.log(req.body); //body cuerpo de la peticion
        console.log(req.body.nombre); 
        console.log("Datos recuperados con req.query");
        console.log(req.query); //Datos enviados en la url
        return res.status(200).send({
            message:"Metodo de prueba"
        })
    },

    // Crear un projecto nuevo, guardar en la base de datos  
    saveProject:function(req,res){
        // creo nuevo objeto de proyectos 
        var project=new Project();
        // Recupero los datos del body enviados por la api 
        var params=req.body;
        // asigno cada dato del body al modelo project de la base de datos 
        project.name=params.name;
        project.descripcion=params.descripcion;
        project.categoria=params.categoria;
        project.year=params.year;
        project.lenguajes=params.lenguajes;
        project.image=null;

        // envio datos a la base de datos, en este caso a mongo 
        //guarda la información en la base de datos
        project.save((err,projectStored)=>{
            if(err) return res.status(500).send({message:'Error al guardar la información'+err});
            // // si prohectStore no guarda el projecto en la base de datos 
            if(!projectStored) return res.status(404).send({message:'No se ha podido guardar el proyecto por error conexión a la base de datos'});
            return res.status(200).send({
                project:projectStored,
                // mirar datos enviados 
                message_params:"Objeto Params",
                params:params,
                message_project:"Objeto Project",
                project:project,
                message:"Metodo saveProject"
            }); 
        });
        // return res.status(200).send({
        //     // mirar datos enviados 
        //     message_params:"Objeto Params",
        //     params:params,
        //     message_project:"Objeto Project",
        //     project:project,
        //     message:"Metodo saveProject"
        // })
    },

    // metodo que devuelve los elementos guardados en la base de datos por medio de un id de una coleccion 
    getProject:function(req,res){
        var projectID=req.params.id;
        // buscar un objeto cuyo id sea el que se pase en la consulta.
        // findById tiene dos parametros en projectID y una funcion de callback con el objeto err del error y el objecto con los datos project en este caso 
        Project.findById(projectID, (err,project)=>{
            // Condicion para colocar parametro id opcional en la ruta ?
            if(projectID==null) return res.status(404).send({message:'El proyecto no existe'});
            
            if(err) return res.status(500).send({message:'Error al devolver los datos'});
            
            if(!project) return  res.status(404).send({message:'El proyecto no existe'});
            
            return res.status(200).send({
                project //muestro los datos obtenidos de la consulta en el objeto project
            });
        });
    },

    // Recuperar los datos de todos los projects guardados en la base de datos 
    getProjects:function(req, res){
        // Project.find({year:2019}); //proyectos cuyo año sean del 2019 
        // Siguiente consulta devuelve todos los projectos guardados en la base de datos find({})
        // sort Permite ordenar los datos obtenidos. - permite ordenar del mas nuevo al mas antiguo. + al contrario
        Project.find({}).sort('-year').exec((err,projects)=>{
            if(err) return res.status(500).send({message:'Error al devolver los datos'});
            if(!projects) return res.status(404).send({message:'No hay proyectos para mostrar'});
            return res.status(200).send({projects});
        })
    },

    // Actualizar los datos de un proyecto guardado en la base de datos 
    updateProject:function(req, res){
        var projectID=req.params.id; //captura el id de un objeto enviado por la url
        var update=req.body; //captura los datos del body actualizados enviados por la url
        console.log(update);
        console.log("prueba");
        //actualiza el objeto que se pase por medio del id del projectID y paso el nuevo objeto actualizado en este caso update
        // tercero {new:true} permite que el objeto se muestre  actualizado cuando se envia la peticion 
        // cuarto parametro se envia una funcion de callback  con err y el objeto actualizado
        Project.findByIdAndUpdate(projectID, update, {new:true}, (err, projectUpdate)=>{
            if(err) return res.status(500).send({
                message:'Error al actualizar el objeto',
                err
            });
            if(!projectUpdate) return res.status(404).send({message:'No existe el proyecto a actualizar'});
            return res.status(200).send({
                message:'Objeto actualizado con exito',
                project:projectUpdate // al objeto project le paso los datos del nuevo objecto a actualizar en la base de datos
            });
        }); 
    },

    // Metodo eliminar project de la base de datos 
    deleteProject:function(req,res){
        var projectID=req.params.id;
        // Project.findByIdAndDelete(projectID, (err, projectDelete)=>{
            Project.findByIdAndRemove(projectID, (err, projectDelete)=>{
            if(err) return res.status(500).send({message:'No se ha podido borrar el proyecto'});
            if(!projectDelete) return res.status(404).send({message:'Objeto a eliminar no existe'});
            return res.status(200).send({
                message:'Objeto eliminado',
                project:projectDelete
            });
        });
    },

    // Subir imagenes 
    uploadImagen:function(req,res){
        var projectID=req.params.id;
        var fileName="Imagen no subida";
        // si existe la propiedad de un archivo en la peticion
        if(req.files){
            console.log(req.files);
            // configuracion para guardar la informacion de la imagen en la base de datos 
            var filePath=req.files.image.path; //recupera datos de la imagen y la ruta path 
            var fileSplit=filePath.split('/'); //cortar el nombre de la imagen en la ruta "path": "uploads/PWeakhAviIQAS5WOSy3ynqZ2.jpg", luego del separador /
            var fileName=fileSplit[1]; //de fileSplit recogo el indice 1 que es el nombre del archivo
            // Variables para comprobar la extension del archivo si es valido, el  \. despues del punto recorta la extension ya sea .jpg, jpge, etc 
            var extSplit=fileName.split('\.');
            var fileExt=extSplit[1];
            // si se valida la extension es correcta, se guarda la informacion en la base de datos 
            if(fileExt=='png' || fileExt=='jpg' || fileExt=='jpeg' || fileExt=='gif'){
                // guardar informacion de la imagen en la base de datos 
                // {image:filename} guarda en la base de datos en el campo image el nombre obtenido en la variable fileName 
                // new:true es una opcion que permite recuperar el ultimo objeto guardado en la base de datos
                Project.findByIdAndUpdate(projectID,{image:fileName},{new:true},(err,projectUpdate)=>{
                    if(err) return res.status(500).send('La imagen no se ha podido subir al servidor');
                    if(!projectUpdate) return res.status(404).send('El proyecto no existe por lo cual no se ha podido guardar la imagen');
                    return res.status(200).send({
                        message:'datos completos del archivo subido',
                        files:req.files,
                        message1:'Nombre del archivo separado con split',
                        files1:fileName,
                        message2:'Archivo guardado en la base de datos',
                        project:projectUpdate
                    });
                });
            }else{
                fs.unlink(filePath, (err)=>{
                    return res.status(200).send({message:'La extension del archivo a subir no es valida'});
                });
            }            
        }else{
            return res.status(200).send({
                message:fileName // si no se sube la imagen muestra mensaje Imagen no subida
            })
        }
    },

    getImagenFile:function(req, res){
        var file=req.params.image; //image es el parametro que se pasa por la url
        var path_file='./uploads/'+file; //pasamos la ruta del archivo
        fs.exists(path_file, (exist)=>{
            // Verifica si existe imagen del archivo project solicitado 
            if(exist){
                return res.sendFile(path.resolve(path_file)); //devuelve la ruta del archivo de imagen que interesa
            }else{
                return res.status(200).send({
                    message:"No existe la imagen..."
                });
            }
        })
    }
};

module.exports=controller;