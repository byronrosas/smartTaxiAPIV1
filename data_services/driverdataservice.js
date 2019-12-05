var mongoose = require('mongoose');
var Driver = require('../models/driverSchema');
var crypto=require('crypto');
exports.loginDriver=function(req,requestBody,response){    
    var usuario=requestBody.Usuario_tx;
    var password=requestBody.Password_tx;        
    console.log("user:"+usuario+"/ pass"+password);
    
    var passcrypto=crypto.createHmac('sha1',usuario).update(password).digest('hex');
    Driver.findOne({Usuario_tx:usuario}).where("Password_tx").equals(passcrypto).exec(function(err,driver){        
        if(err){
            console.log(err);
            if(response!=null){
                    response.writeHead(500,{'Content-Type':'text/plain'});
                    response.end('Internal server error');
                }
            return;
        }else{
            if(!driver)
            {
                console.log('The driver does no exist, or pass or user invalid.');
            }else{
            	if (response != null) {
		            response.setHeader('content-type', 'application/json');
		            response.end(JSON.stringify(driver));                    
                    console.log("Found.."+JSON.stringify(driver));
                    req.session.o=driver;
                    return 25;                    
		        }		        
            }
        }
    });
}
exports.registroDriver = function(requestBody,response) {
    var driver = toDriver(requestBody, Driver);
  var primarynumber = requestBody._id;
  var usuarioReq=requestBody.Usuario_tx;
  driver.save(function(error) {
    if (!error) {
      driver.save();
    }else{
        console.log('Checking driver exist:'+primarynumber);
        Driver.findOne({$or:[{_id:primarynumber},{Usuario_tx:usuarioReq}]},function(error,data){
            if(error){
                console.log(error);
                if(response!=null){
                    response.writeHead(500,{'Content-Type':'text/plain'});
                    response.end('Internal server error');
                }
                return;                            
            }else{
                var driver=toDriver(requestBody,Driver);
                if(!data){
                    console.log('The driver does no exist. It will be created');
                    driver.save(function(error){
                        if(!error)
                        {
                            driver.save();
                        }else{
                            console.log(error);
                        }
                    });
                    if(response!=null)
                    {
                        response.writeHead(201,{'Content-Type':'text/plain'});
                        response.end('Created');
                    }
                    return;

                }else{
                       console.log('Updatib driver with primary driver number:'+primarynumber);
                        data.Nombre_tx=driver.Nombre_tx;
                        data.Usuario_tx=driver.Usuario_tx;
                        data.Password_tx=driver.Password_tx;
                        data.Cedula_tx=driver.Cedula_tx;                
                        data.Vehiculo_tx.Placa_tx=driver.Vehiculo_tx.Placa_tx;
                        data.Vehiculo_tx.Modelo_taxi_tx=driver.Vehiculo_tx.Modelo_taxi_tx;
                        data.Posicion_tx[0]=driver.Posicion_tx[0]; //Se actualizan los valores cada 5min
                        data.Posicion_tx[1]=driver.Posicion_tx[1];                                                            
                        data.Vehiculo_tx.Disponibilidad_tx=driver.Vehiculo_tx.Disponibilidad_tx;                                                                                              
                        data.photo_tx=driver.photo_tx; // Avatar o foto del usuario
                        data.createdAt=driver.createdAt; // Fecha de creación
                        data.save(function(error){
                            if(!error)
                            {
                                data.save();
                                response.end('Update');
                                console.log('Successfully Update driver with primary driver number:'+primarynumber);
                            }else{
                                console.log('Error while saving driver ith primary driver number:'+primarynumber);
                                console.log(error);
                            }
                        });                        
                }
            }
        });    
    }
  });

};

exports.list=function(response){
	Driver.find({}, function(error, result) {
		if (error) {
		console.error(error);
		return null;
		}
		if (response != null) {
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(result));
		}
		return JSON.stringify(result);
	});	    
}

exports.findbynumber=function(req, _primarydrivernumber,response){
        Driver.findOne({_id: _primarydrivernumber}, 
        function(error, result) {
            if (error) {
            console.error(error);
            response.writeHead(500,
                {'Content-Type' : 'text/plain'});
            response.end('Internal server error');
            return;
            } else {
            if (!result) {
                if (response != null) {
                response.writeHead(404, {'Content-Type' : 'text/plain'});
                response.end('Not Found');
            }
            return;
            }
            if (response != null){
            response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(result));
            }
            console.log(result);
            }
        });
}

exports.updateDriver=function(requestBody,response){
	var idDriver=requestBody._id;
    Driver.findOne({_id: idDriver},function(error,data){
        if(error)
        {
            console.log(error);
            if(response!=null)
            {
                response.writeHead(500,{'Content-Type':'text/plain'});
                response.end('Internal server error');
            }
            return;
        }else{
            var driverUp=toDriver(requestBody,Driver);
            if(!data){
                console.log('Driver wiith primary nnumber: '+idDriver+'does not exist. The driver will be created.');
                driverUp.save(function(error){
                    if(!error) 
                    driverUp.save();
                });
                if(response !=null){
                    response.writeHead(201,{'Content-Type':'text/plain'});
                    response.end('Created');
                }
                return;
            }
            //actualizar documento
                data.Nombre_tx=driverUp.Nombre_tx;
                data.Usuario_tx=driverUp.Usuario_tx;
                data.Password_tx=driverUp.Password_tx;
                data.Cedula_tx=driverUp.Cedula_tx;                
                data.Vehiculo_tx.Placa_tx=driverUp.Vehiculo_tx.Placa_tx;
                data.Vehiculo_tx.Modelo_taxi_tx=driverUp.Vehiculo_tx.Modelo_taxi_tx;                                                                           
                data.Vehiculo_tx.Disponibilidad_tx=driverUp.Vehiculo_tx.Disponibilidad_tx;                                                                      
               // data.provider_id=driverUp.provider_id; // ID que proporciona Twitter o Facebook
                data.photo_tx=driverUp.photo_tx; // Avatar o foto del usuario
                data.createdAt=driverUp.createdAt; // Fecha de creación 
                data.Posicion_tx[0]=driverUp.Posicion_tx[0]; //Se actualizan los valores cada 5min
                data.Posicion_tx[1]=driverUp.Posicion_tx[1];  
            //Save           
            data.save(function(error){
                if(!error)
                {
                    console.log('Successfully update driver with primary number: '+ idDriver);
                    data.save();
                }else{
                    console.log('error on save');
                }
            });
            if(response !=null)
            {
                response.send('update');
            }
        }
    });
}

exports.near=function(requestBody,res){
    var distance=requestBody.maxDistance;
    var limitDrivers=requestBody.limit;
    var query=Driver.find({$and:[{
        Posicion_tx:{
                        $near:requestBody.Posicion_tx,
                        $maxDistance:distance
                    }    
    },{"Vehiculo_tx.Disponibilidad_tx":true}]}).limit(limitDrivers);
    query.exec(function(err,driver){
        if (err) {
            console.log(err);
            throw err;
        }

        if (!driver) {
            res.json({});
            console.log('Drivers dont found');
        } else {
            console.log('Found drivers:' + driver);
            res.end(JSON.stringify(driver));
            return driver;
        }
    });
}

exports.removeDriver=function(_primarydrivernumber,response){
	console.log('Deleting driver with primary number:'+_primarydrivernumber,response);
    Driver.findOne({_id:_primarydrivernumber},
    function(error,data){
        if(error){
            console.log(error);
            if(response!=null)
            {
                response.writeHead(500,{'Content-Type':'text/plain'});
                response.end('Internal server error');
            }
            return;
        }else{
            if(!data)
            {
                console.log('not found');
                if(response!=null)
                {
                    response.writeHead(404,{'Content-Type':'text/plain'});
                    response.end('Not Found');
                }
                return;

            }else{
                data.remove(function(error){
                    if(!error)
                    {
                        data.remove();
                    }else
                    {
                        console.log(error);
                    }
                });
                if(response!=null)
                {
                    response.send('Deleted');
                } 
                return;
            }
        }
    });
}

function toDriver(body, Driver) {
    var passEncryp = crypto.createHmac('sha1',body.Usuario_tx).update(body.Password_tx).digest('hex');
  return new Driver(
	  { 
           
        Nombre_tx:body.Nombre_tx,
        Usuario_tx:body.Usuario_tx,
        Password_tx:passEncryp,
        Cedula_tx:body.Cedula_tx,          
        Vehiculo_tx:{      
            Placa_tx:body.Vehiculo_tx.Placa_tx,
            Modelo_taxi_tx:body.Vehiculo_tx.Modelo_taxi_tx,                                                                    
            Disponibilidad_tx:body.Vehiculo_tx.Disponibilidad_tx
        },                                                                              
        photo_tx:body.photo_tx || "/images/prueba.jpeg",// Avatar o foto del usuario
        createdAt:body.createdAt || Date.now(),// Fecha de creación  
        Posicion_tx:[body.Posicion_tx[0],body.Posicion_tx[1]]//Se actualizan los valores cada 5min          
}
);
  }
