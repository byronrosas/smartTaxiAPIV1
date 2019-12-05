var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var serviceSchema=new Schema(
    {        
        _id_us:{type: Schema.ObjectId,ref:"User"},
        _id_tx:{type:Schema.ObjectId,ref:"Driver"},
        Origen_ca:{ // Posición dada por la ubicación actual del usuario.
                    type:[Number],
                    index:'2d'
                    },
        Destino_ca:{ //Dado por el usuario
                    type:[Number],
                    index:'2d'
        },
        Fecha:{type:Date,default:Date.now()},        
        Estado:Boolean
    });


var ServiceTaxi=mongoose.model('ServiceTaxi',serviceSchema);

module.exports=ServiceTaxi;