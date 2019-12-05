var socket = io.connect();
$(document).ready(function() {    
    var $wrapper_user_ui=$("#user-wrapper");
    var $wrapper_driver_ui=$("#driver-wrapper");
    var $register_driver_form=$("#register-driver-form");
    var $logger_driver_form=$("#logger-driver-form");
    var $logger_user_form=$("#logger-user-form");
    var $driver_perfil=$("#driver-perfil");
    var $user_perfil=$("#user-perfil");
    var usuarioActual;
    var driverActual;    
    getDriverlogged();        
    getUserlogged();    

    $("#userUI").click(function()
    {
        $wrapper_driver_ui.css("display","none");
        $wrapper_user_ui.css("display","block");        
    });
    $("#driverUI").click(function(){
        $wrapper_driver_ui.css("display","block");
        $wrapper_user_ui.css("display","none");
    });

    $("#enviarloguser").click(function(){
        var $txt_usuario=$("#txtusuario");
        var $txtpassword=$("#txtpassword"); 
        $logger_user_form.css("display","none");   
        getUserLogin();
    });
    $("#enviarlogdriver").click(function(){
        var $txt_usuariodriver=$("#txtdriver").val();
        var $txtpassworddriver=$("#txtpassworddriver").val();       
        var o={
            Usuario_tx:$txt_usuariodriver,
            Password_tx:$txtpassworddriver
        }
        postDriverLogin(o);
                
    });



    $("#saveDriver").click(function(){
        var $txt_driver_nombre=$("#txtdrivernombre").val();
        var $txt_driver_usuario=$("#txtdriverusuario").val();
        var $txt_driver_password=$("#txtdriverpassword").val();
        var $txt_driver_cedula=$("#txtdrivercedula").val();
        var $txt_driver_placa=$("#txtdriverplaca").val();
        var $txt_driver_modelo=$("#txtdrivermodelo").val();
        var $txt_driver_posicionx=$("#txtdriverposicionx");
        var $txt_driver_posiciony=$("#txtdriverposiciony");
        var txt_driver_disponibilidad;
        var photo="/images/prueba.jpeg"; 
        if((Math.random() * (2 - 1) + 1)==1)
        {
            txt_driver_disponibilidad=true;
        }else{
            txt_driver_disponibilidad=false;
        }
        var o={    
            Nombre_tx:$txt_driver_nombre || "No dato",
            Usuario_tx:$txt_driver_usuario || "No dato" ,
            Password_tx:$txt_driver_password || "No dato",
            Cedula_tx:$txt_driver_cedula || "No dato",          
            Vehiculo_tx:{      
                Placa_tx:$txt_driver_placa || "No dato",
                Modelo_taxi_tx:$txt_driver_modelo || "No dato",
                //Posicion_tx:[parseFloat($txt_driver_posicionx),parseFloat($txt_driver_posiciony)] || "No dato", //Se actualizan los valores cada 5min
                                                                         
                Disponibilidad_tx:txt_driver_disponibilidad || "No dato", 
            },                                                                     
            photo_tx:photo || "/images/prueba.jpeg",// Avatar o foto del usuario   
           Posicion_tx:[Math.random() * (100- 0) + 0.5,Math.random() * (100- 0) + 0.5]                                            
        }           
        postDriverSign(o);
    });


    /*var dataLogin={
            Usuario_tx:"byronman",
            Password_tx:"holamundo"
        };
    postDriverLogin(dataLogin);*/
});




/*function  getUserLogin() {
     $.ajax({
         type: "GET",
         url: "/auth/facebook/user",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);             
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });
} */  
function getDriverlogged()
{           
        $.ajax({
         type: "GET",
         url: "/driver/logged",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log("data"+data);
             if(data)
             {
                 data;
                 perfilDriverUI(data);
                 console.log("data"+data);    
                 socketDriver(data);
             }else{
                loginUI(); 
             }                          
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });
}
function getUserlogged()
{
   $.ajax({
         type: "GET",
         url: "/user/logged",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log("datassss"+data);
             if(data)
             {
                 usuarioActual=data;
                 perfilUserUI(data);
                 socketUser(data);
                 console.log("data"+data);
             }else{
                loginuserUI();                 
             }                          
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });    
}
function getLogoutUser()
{
    $.ajax({
         type: "GET",
         url: "/logoutUser",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });    
}

function postDriverLogin(dataLoginDriver){            
    $.ajax({
         type: "POST",
         url: "/auth/driver",
         data:JSON.stringify(dataLoginDriver),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);
             if(data) {       
             location.href="/prueba";
                perfilDriverUI(data);
            }                
            else
                loginUI();
         },

         error: function (jqXHR, status) {
             // error handler             
             console.log(status);
         }
    });
}

function postDriverSign(dataSignDriver)
{
    $.ajax({
         type: "POST",
         url: "/reg/driver",
         data:JSON.stringify(dataSignDriver),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });
}

function getLogoutDriver()
{    
    $.ajax({
         type: "GET",
         url: "/out",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });    
}

function postNear(configService)
{
    $.ajax({
         type: "POST",
         url: "/service/near",
         data:JSON.stringify(configService),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);
             taxisCercanosUI(data);
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });    
} 

function postSelectedTaxi(dataSent)
{
    $.ajax({
         type: "POST",
         url: "/service/selectedTaxi",
         data:JSON.stringify(dataSent),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);
             taxisCercanosUI(data);
         },

         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    });    
} 
function postCreateServicio(servicio)
{
        $.ajax({
         type: "POST",
         url: "/service/create",
         data:JSON.stringify(servicio),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (data, status, jqXHR) {
             console.log(data);             
         },
         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
    }); 

}

function deleteCancelService(servicio)
{
         jQuery.ajax({
         type: "DELETE",
         url: "/service/cancel/"+servicio,
         contentType: "application/json; charset=utf-8",       
         dataType: "json",
         data: JSON.stringify({}),
         success: function (data, status, jqXHR) {
             // do something
             console.log(data);
         },
     
         error: function (jqXHR, status) {
             // error handler
             console.log(status);
         }
     });
}
function perfilDriverUI(driver)
{    
    console.log(driver.Cedula_tx);
        var $register_driver_form=$("#register-driver-form");
        var $logger_driver_form=$("#logger-driver-form");
        var $driver_perfil=$("#driver-perfil");
        var $selectUser_wrapper=$("#selectUser-wrapper");

        $register_driver_form.css("display","none");
        $logger_driver_form.css("display","none");
        $selectUser_wrapper.css("display","none");
        $driver_perfil.css("display","block");
        $driver_perfil.html("<h2>Usuario:</h2>"+driver.Usuario_tx+"<br>");
        $driver_perfil.append("<h2>Cedula:</h2>"+driver.Cedula_tx+"<br>");
        $driver_perfil.append("<h2>Nombre:</h2>"+driver.Nombre_tx+"<br>");
        $driver_perfil.append("<h2>Modelo:</h2>"+driver.Vehiculo_tx.Modelo_taxi_tx+"<br>");
        $driver_perfil.append("<h2>Disponibilidad:</h2>"+driver.Vehiculo_tx.Disponibilidad_tx+"<br>");
        $driver_perfil.append("<h2>Posicion Lat:</h2>"+driver.Posicion_tx[0]+"<br>");
        $driver_perfil.append("<h2>Posicion Long:</h2>"+driver.Posicion_tx[1]+"<br>");
        $driver_perfil.append('<button id="cerrar-session-driver" onclick="getLogoutDriver()">Cerrar Session</button>');
}

function perfilUserUI(user)
{    
    console.log("nombre"+user.Nombre_us);
        var $register_driver_form=$("#register-driver-form");
        var $logger_driver_form=$("#logger-driver-form");
        var $user_perfil=$("#user-perfil");
        var $selectUser_wrapper=$("#selectUser-wrapper");
        var $driver_perfil=$('driver-perfil');
        $register_driver_form.css("display","none");
        $logger_driver_form.css("display","none");
        $selectUser_wrapper.css("display","none");
        $driver_perfil.css("display","none");
        $user_perfil.css("display","block");                
        $user_perfil.append("<h2 style='blue'>Nombre:</h2>"+user.Nombre_us+"<br>");
        $user_perfil.append("<h2>Telefono:</h2>"+user.Telefono_us+"<br>");
        $user_perfil.append("<img  src="+user.photo_us+">");
        $user_perfil.append('<button id="cerrar-session-user" onclick="getLogoutUser()">Cerrar Session</button>');
        $user_perfil.append('<button id="taxis-cercanos" onclick="taxisCercanos()" >Taxis Cercanos</button>');

        
}

function taxisCercanosUI(drivers)
{
    var $user_perfil=$("#user-perfil");
    $user_perfil.html("");   
    var taxis=new Array();
    taxis=drivers; 
    for(var i=0;i<taxis.length;i++)
    {        
        $user_perfil.append('<br><button id="'+i+'drivernear" onclick=seleccionTaxi('+JSON.stringify(taxis[i])+') >'+taxis[i].Usuario_tx+'</button>');
        console.log("Taxis cercanos:"+taxis[i].Usuario_tx);        
    }    
}
function seleccionTaxi(driver)
{
        var dataSent=
    {   
        user:{
            _id:usuarioActual._id || "No usuario id",
            Nombre_us:usuarioActual.Nombre_us || "No nombre",
            Telefono_us:usuarioActual.Telefono_us || "No telefono",
            Correo_us:usuarioActual.Correo_us || "No Correo",
            provider_id:usuarioActual.provider_id || "No provider_id",
            photo_us:usuarioActual.photo_us || "No photo_us",
            createdAt:usuarioActual.createdAt || "No dateCreated",
            pos_o:[50,55] || [0,0],
            pos_d:[120,125.5] || [0,0]
        },
        driver:{
            _id:driver._id || "No conductor id"                                   
        },
        service:{
            _id:usuarioActual._id+driver._id+Date.now()
        }        
    };
    postSelectedTaxi(dataSent);
    console.log(driver);
}
function loginUI()
{
        var $register_driver_form=$("#register-driver-form");
        var $logger_driver_form=$("logger-driver-form");
        var $driver_perfil=$("#driver-perfil");
        var $selectUser_wrapper=$("#selectUser-wrapper");
        $register_driver_form.css("display","block");
        $logger_driver_form.css("display","block");
        $driver_perfil.css("display","none");
        $selectUser_wrapper.css("display","block");
}

function taxisCercanos()
{
    
        var config={
            maxDistance:80,
            limit:10,
            Posicion_tx:[50,55]
        }
        postNear(config);    
}

function socketDriver(driverActual)
{        
        var usuarioSolicitante;            
    socket.on('taxi_user',function(taxi_user){         
        newService=JSON.parse(taxi_user)  
        console.log(newService.driver._id+"==="+driverActual._id);                             
        if(newService.driver._id===driverActual._id)
        {
            $( "#notificacion-solicitud-driver" ).append( "<p>Ha llegado una notificación</p>");
            $( "#notificacion-solicitud-driver" ).append( "<p>El usuario:</p>"+newService.user._id);
            $( "#notificacion-solicitud-driver" ).append( "<p>nombre:</p>"+newService.user.Nombre_us);
            $( "#notificacion-solicitud-driver" ).append( "<p>telefono:</p>"+newService.user.Telefono_us);
            $( "#notificacion-solicitud-driver" ).append( "<p>Longitud origen:</p>"+newService.user.posicion_o[0]);
            $( "#notificacion-solicitud-driver" ).append( "<p>Latitud origen:</p>"+newService.user.posicion_o[1]);
            $( "#notificacion-solicitud-driver" ).append( "<p>Longitud destino:</p>"+newService.user.posicion_d[0]);
            $( "#notificacion-solicitud-driver" ).append( "<p>Latitud destino:</p>"+newService.user.posicion_d[1]);
            $( "#notificacion-solicitud-driver" ).append( "<p><img src="+newService.user._id+"></p>");
            $( "#notificacion-solicitud-driver" ).append( "<p>Solicita servicio</p>");
            var idnot=newService.user._id.concat("notificacion");
            //$( "#notificacion-solicitud-driver" ).append( "<p><button id='notificacion' onclick='aceptarServicio("+newService+")'>Aceptar</button><button id='declinenotificacion' onclick='rechazarServicio("+JSON.stringify(newService)+",declinenotificacion)'>Rechazar</button></p>");
            var serviceJSON= {
                _id:newService.service._id,
                _id_us:newService.user._id,
                _id_tx:newService.driver._id,
                Origen_ca:newService.user.posicion_o,
                Destino_ca:newService.user.posicion_d                                   
             };       
            $( "#notificacion-solicitud-driver" ).append( '<p><button id="'+idnot+'" onclick=aceptarServicio('+JSON.stringify(serviceJSON)+',"'+idnot+'")>Aceptar</button></p>');
            usuarioSolicitante=newService.user._id;           
        }
        
        
    });

    socket.on('taxi_create',function(serviciocreado){
        newserviciocreado=JSON.parse(serviciocreado);
        if(newserviciocreado._id_tx===driverActual._id)
        {
            $("#aceptarSol").html("<p>Servicio Aceptado</p>");
        }
    });

    socket.on('taxi_delete',function(dataSocket){
        newdataSocket=JSON.parse(dataSocket);
        if(newdataSocket._id_tx===driverActual._id)
        {
            $("#aceptarSol").html("<p>Servicio Cancelado</p>");
        }
    });
}
function socketUser(userActual)
{
    console.log("holamunfod");                       

    socket.on('taxi_create',function(serviciocreado){
        newserviciocreado=JSON.parse(serviciocreado);
        console.log("llego el mssn");
        if(newserviciocreado._id_us===userActual._id)
        {
            $("#aceptarSol").html("<p>Servicio Aceptado</p>");
            console.log("servicio creado");
        }
    });

    socket.on('taxi_delete',function(dataSocket){
        newdataSocket=JSON.parse(dataSocket);
        if(newdataSocket._id_us===userActual._id)
        {
            $("#aceptarSol").html("<p>Servicio Cancelado</p>");
        }
    });
}
function aceptarServicio(servicio,idbutton)
{
    console.log("hola");
    console.log($("#"+idbutton));
    $("#"+idbutton).html("servicio aceptado");

    postCreateServicio(servicio);
}

function rechazarServicio(servicio,idbutton)
{    
    $("#"+idbutton).html("servicio cancelado");
    deleteCancelService(JSON.parse(servicio._id));
}
/* 
Login y registro de usuario:
GET   /auth/facebook/user
Return:  JSON  usuario logeado

---------------------------------------------------
Login de conductor:
POST  /auth/driver
FormatoDatos: {
            Usuario_tx:String,
            Password_tx:String
        }
Return: JSON conductor logeado
--------------------------------------------------

Registro del conductor:
POST /reg/driver
FormatoDatos:{ 
    Nombre_tx:String,
    Usuario_tx:String,
    Password_tx:String,
    Cedula_tx:String,         
    Vehiculo_tx: {
                    Placa_tx:String,
                    Modelo_taxi_tx:String,
                    Posicion_tx:{type:[Number],index:'2d'},
                    Disponibilidad_tx:{type: Boolean, default:true}
                    },
    provider_id : {type: String, unique: true}, // ID que proporciona Twitter o Facebook
	photo_tx: String, // Avatar o foto del usuario
	createdAt: {type: Date, default: Date.now()} // Fecha de creación                    
} 
-----------------------------------------------------
Cerrar sesión User:
GET /logoutUser
-----------------------------------------------------
Cerrar sesión Driver:
GET /driver/logout
-----------------------------------------------------
Obtener Perfil de conductor
GET /driver/:idDriver
return driver
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
-----------------------------------------------------
  script.
    var socket = io.connect();
    socket.on('taxi_user',function(taxi_user){
        newService=JSON.parse(taxi_user)
        if(newService.user.Nombre_us==="Byon")
        {
            $( ".inner" ).html( "<p>Usuario valido</p>");
        }
        else
        {
            $( ".inner" ).html( "<p>Usuario no valido</p>");            
        }    
        
    });

*/