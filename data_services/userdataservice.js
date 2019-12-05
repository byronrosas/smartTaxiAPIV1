var mongoose = require('mongoose');
var User = require('../models/userSchema');
// Estrategia de autenticación con Facebook
var FacebookStrategy = require('passport-facebook').Strategy;
// Fichero de configuración donde se encuentran las API keys
// Este archivo no debe subirse a GitHub ya que contiene datos
// que pueden comprometer la seguridad de la aplicación.
var config = require('../config');

exports.loginUser = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);		
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	
	// Configuración del autenticado con Facebook
	passport.use(new FacebookStrategy({
		clientID			: config.facebook.id,
		clientSecret	: config.facebook.secret,
		callbackURL	 : '/auth/facebook/user/callback',
		profileFields : ['id', 'displayName', /*'provider',*/ 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		// El campo 'profileFields' nos permite que los campos que almacenamos
		// se llamen igual tanto para si el usuario se autentica por Twitter o
		// por Facebook, ya que cada proveedor entrega los datos en el JSON con
		// un nombre diferente.
		// Passport esto lo sabe y nos lo pone más sencillo con ese campo
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
			if(!err && user!= null)
			{				
				console.log('hola'+user);
				return done(null, user);	


			} 		 //done(null, user);
			// Al igual que antes, si el usuario ya existe lo devuelve
			// y si no, lo crea y salva en la base de datos
			var user = new User({
				provider_id	: profile.id,
				provider		 : profile.provider,
				Nombre_us				 : profile.displayName,
				photo_us				: profile.photos[0].value
			});
			user.save(function(err) {
				if(err) throw err;
				done(null, user);//done(null, user);
			});
		});
	}));

};

exports.list=function(response){
	User.find({}, function(error, result) {
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

exports.findbynumber=function( _primaryusernumber,response){
	User.findOne({_id: _primaryusernumber}, 
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
			response.send(result);
		}
		console.log(result);
		}
	});
}

exports.updateUser=function(requestBody,response){
	var idUser=requestBody._id;
    User.findOne({_id: idUser},function(error,data){
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
            var userUp=toUser(requestBody,User);
            if(!data){
                console.log('User wiith primary nnumber: '+idUser+'does not exist. The user will be created.');
                userUp.save(function(error){
                    if(!error) 
                    userUp.save();
                });
                if(response !=null){
                    response.writeHead(201,{'Content-Type':'text/plain'});
                    response.end('Created');
                }
                return;
            }
            //actualizar documento
				data.Nombre_us=userUp.Nombre_us,
				data.Telefono_us=userUp.Telefono_us,
				data.Correo_us=userUp.Correo_us,
				data.provider_id=userUp.provider_id, // ID que proporciona Twitter o Facebook
				data.photo_us=userUp.photo_us, // Avatar o foto del usuario
				data.createdAt= userUp.createdAt // Fecha de creación
            //Save           
            data.save(function(error){
                if(!error)
                {
                    console.log('Successfully update user with primary number: '+ idUser);
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

exports.removeUser=function(_primaryusernumber,response){
	console.log('Deleting user with primary number:'+_primaryusernumber,response);
    User.findOne({_id:_primaryusernumber},
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

function toUser(body, User) {
  return new User(
	  {    
    Nombre_us:body.Nombre_us,
    Telefono_us:body.Telefono_us,
    Correo_us:body.Correo_us,
    provider_id :body.provider_id, // ID que proporciona Twitter o Facebook
	photo_us:body.photo_us, // Avatar o foto del usuario
	createdAt: body.createdAt // Fecha de creación
}
);
  }
