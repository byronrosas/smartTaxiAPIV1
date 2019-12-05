// Rutas de la aplicación

exports.index = function(req, res){
  // Renderiza la plantilla 'index' cuando en el navegador
  // nos encontremos en la raiz '/' --> http://localhost:puerto/
  req.session.u=JSON.stringify(req.user);  
  res.end(JSON.stringify(req.user));
  res.redirect('/prueba');
};
