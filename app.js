// Archivo principal del Backend, configuración del servidor
// y otras opciones

var express = require('express'); // Express: Framework HTTP para Node.js
var routes = require('./routes'); // Dónde tenemos la configuración de las rutas
var path = require('path');
var session=require('express-session');
var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios
var events=require("events");
var emitter=new events.EventEmitter();
// Importamos el modelo usuario y la configuración de passport
require('./models/userSchema');
require('./models/driverSchema');
var userService=require('./data_services/userdataservice');
var driverService=require('./data_services/driverdataservice');
var taxiService=require('./data_services/taxidataservice');

var taxi_user;
userService.loginUser(passport);
// Conexión a la base de datos de MongoDB que tenemos en local
mongoose.connect('mongodb://127.0.0.1:27017/passport-example', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

// Iniciamos la aplicación Express
var app = express();

var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// Configuración (Puerto de escucha, sistema de plantillas, directorio de vistas,...)
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

// Middlewares de Express que nos permiten enrutar y poder
// realizar peticiones HTTP (GET, POST, PUT, DELETE)
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(path.join(__dirname, 'public')));
// Indicamos que use sesiones, para almacenar el objeto usuario
// y que lo recuerde aunque abandonemos la página
app.use(express.session({ secret: 'lollllo' }));

// Configuración de Passport. Lo inicializamos
// y le indicamos que Passport maneje la Sesión
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Rutas de la aplicación */
// Cuando estemos en http://localhost:puerto/ (la raiz) se ejecuta el metodo index
// del modulo 'routes'


app.get('/logUser', routes.index);
/* Rutas de Passport */
// Ruta para desloguearse
app.get('/logoutUser', function(req, res) {
  req.logout();
  req.session.destroy(function(err){
      if(err) {
        console.log(err);
      } else {
        res.redirect('/logUser');
  }
  });
  
});



app.get('/login',function(req,res){
  res.end('Fallo login');
});
// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook/user',passport.authenticate('facebook'));

// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/user/callback', passport.authenticate('facebook',
  { successRedirect: '/logUser', failureRedirect: '/login' }
));

app.get('/user/logged',function(req,res){ 
  res.setHeader('content-type', 'application/json'); 
  res.end(req.session.u);  
});


app.get('/user/:idUser',function(req,res){
  console.log(req.url+':querying for '+req.params.idUser);
  userService.findbynumber(req.params.idUser,res);
});
app.get('/user',function(req,res){
  userService.list(res);  
});
app.post('/user',function(req,res){
  userService.updateUser(req.body,res);
});

app.delete('/user/:idUser',function(req,res){
  userService.removeUser(req.params.idUser,res);
});




//////////////////////////////////////DRIVER////////////////////////////////////////////

app.get('/driver/logged',function(req,res){ 
  res.setHeader('content-type', 'application/json'); 
  res.end(JSON.stringify(req.session.o));  
});
app.get('/driver/:idDriver',function(req,res){
  console.log(req.url+':querying for '+req.params.idDriver);
  driverService.findbynumber(req,req.params.idDriver,res);
});
app.get('/driver',function(req,res){
  driverService.list(res);  
});


app.get('/out',function(req,res){
  if(req.session.o!=undefined)
  {
      req.session.destroy(function(err){
      if(err) {
        console.log(err);        
      }       
      else{
        res.setHeader('content-type', 'application/json');
        res.end("Sesión cerrada");
      }      
    });
  } 
  else{
    res.setHeader('content-type', 'application/json');
        res.end("No existen sesiones activas");
  }
});


app.post('/auth/driver',function(req,res){  
  driverService.loginDriver(req,req.body,res);
  //console.log("hoi"+req.session.o);
  //req.session.driverLogged  
});

app.post('/reg/driver',function(req,res){
  driverService.registroDriver(req.body,res);
});
app.post('/driver',function(req,res){
  driverService.updateDriver(req.body,res);
});

app.delete('/driver/:idDriver',function(req,res){
  driverService.removeDriver(req.params.idDriver,res);
});



/////////////////////////////////////SERVICE////////////////////////////////////////



app.post('/service/near',function(req,res){
  taxiService.findNear(req.body,res);
});

app.get('/service',function(req,res){
  taxiService.list(res);
});

app.delete('/service/cancel/:idService',function(req,res){
  var dataSocket=taxiService.cancel(req.params.idService,res);
  if(dataSocket!=null)
  emitter.emit('delete_service',dataSocket);
});

app.post('/service/create',function(req,res){
  var serviciocreado=req.body;
  taxiService.create(req.body,res);
  emitter.emit('create-service',serviciocreado);
});

app.post('/service/selectedTaxi',function(req,res){
  taxi_user=taxiService.selectedTaxi(req.body,res);
  emitter.emit('event-socket',taxi_user);
  console.log(taxi_user); 
});
//Prueba 
app.get('/prueba',function(req,res){
  res.render('pruebaSoc');
});

io.on('connection', function(client) { 
  emitter.on('event-socket',function(taxi_user){
        client.emit('taxi_user',JSON.stringify(taxi_user)); 
  });
  emitter.on('delete_service',function(dataSocket){
        client.emit('taxi_delete',JSON.stringify(dataSocket));
  });
  emitter.on('create-service',function(serviciocreado){
        client.emit('taxi_create',JSON.stringify(serviciocreado));
  });
    console.log('Client connected...');        
  }); 






// Inicio del servidor
 server.listen(app.get('port'), function(){
   console.log('Aplicación Express escuchando en el puerto ' + app.get('port'));
 });