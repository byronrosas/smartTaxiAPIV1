var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var driverSchema=new Schema(
    {
    Nombre_tx:String,
    Usuario_tx:String,
    Password_tx:String,
    Cedula_tx:String,         
    Vehiculo_tx: {
                    Placa_tx:String,
                    Modelo_taxi_tx:String,                    
                    Disponibilidad_tx:{type: Boolean, default:true}
                    },
	photo_tx: String, // Avatar o foto del usuario
	createdAt: {type: Date, default: Date.now()}, // Fecha de creación   
    Posicion_tx:{
                    type:[Number],
                    index:'2d'
                }                 
    }    
);

var Driver=mongoose.model('Driver',driverSchema);
module.exports=Driver;