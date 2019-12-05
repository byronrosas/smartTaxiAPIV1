var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({    
    Nombre_us:String,
    Telefono_us:String,//Opcional
    Correo_us:String,
    provider_id : {type: String, unique: true}, // ID que proporciona Twitter o Facebook
	photo_us: String, // Avatar o foto del usuario
	createdAt: {type: Date, default: Date.now()} // Fecha de creación
});

var User=mongoose.model('User',userSchema);

module.exports=User;