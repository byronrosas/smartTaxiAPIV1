// Rutas de la aplicación

exports.driver = function(req, res){
  // Renderiza la plantilla 'index' cuando en el navegador
  // nos encontremos en la raiz '/' --> http://localhost:puerto/
  res.end(JSON.stringify(req.driver));
};


