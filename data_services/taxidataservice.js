var mongoose=require('mongoose');
var ServiceTaxi=require('../models/serviceSchema');
var User = require('../models/userSchema');
var Driver = require('../models/driverSchema');
var driverService=require('../data_services/driverdataservice');
exports.findNear=function(reqbody,res){
    driverService.near(reqbody,res);
}

exports.create=function(requestBody,res){
    var service = toService(requestBody, ServiceTaxi); 
    service.save(function(error) {
        if(!error)
        {
            service.save();                
        }else
        {
                console.log(error);
                if(response!=null){
                    response.writeHead(500,{'Content-Type':'text/plain'});
                    response.end('Internal server error');
                }
        }
    });

}

exports.cancel=function(_primaryservicenumber,response){
    var dataSocket={
        _id_tx:"",
        _id_us:"",
        _id:""
    };
    console.log('Deleting service with primary number:'+_primaryservicenumber,response);
        ServiceTaxi.findOne({_id:_primaryservicenumber},
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
                    dataSocket._id_tx=data._id_tx;
                    dataSocket._id_us=data._id_us;
                    dataSocket._id=data._id;
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
                        return dataSocket;
                    }                     
                }
            }
        });

}

exports.list=function(response){
   ServiceTaxi.find({}, function(error, result) {
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

exports.selectedTaxi=function(requestBody,res){
    var dataSent=
    {   
        user:{
            _id:requestBody.user._id || "No usuario id",
            Nombre_us:requestBody.user.Nombre_us || "No nombre",
            Telefono_us:requestBody.user.Telefono_us || "No telefono",
            Correo_us:requestBody.user.Correo_us || "No Correo",
            provider_id:requestBody.user.provider_id || "No provider_id",
            photo_us:requestBody.user.photo_us || "No photo_us",
            createdAt:requestBody.user.createdAt || "No dateCreated",
            posicion_o:[requestBody.user.pos_o[0],requestBody.user.pos_o[1]] || [0,0],
            posicion_d:[requestBody.user.pos_d[0],requestBody.user.pos_d[1]] || [0,0]
        },
        driver:{
            _id:requestBody.driver._id || "No conductor id"                                   
        },
        service:{
            _id:requestBody.user._id+requestBody.driver._id+Date.now()
        }        
    };
    return dataSent;    
}

function toService(body, Service) {
  return new Service(
	 {        
        _id_us:body._id_us,
        _id_tx:body._id_tx,
        Origen_ca:body.Origen_ca,
        Destino_ca:body.Destino_ca,
        Fecha:Date.now(),        
        Estado:true
    }
);
  }
