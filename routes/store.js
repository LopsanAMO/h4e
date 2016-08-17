exports.index = function(req, res){  
  res.render('index', {  title: 'index',
          });
}; 
exports.mapa = function(req, res){  
  res.render('mapa', {  title: 'mapa',
  						todo: req.session.datos
          });
};
exports.equis = function(req, res){  
  res.render('equis', {  title: 'equis',
          });
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
exports.cosas = function(req, res){  
  res.render('cosas', {  title: 'equis',
  						 todo: req.session.datos
          });
}; 
exports.local = function(req, res){  
  res.render('local', {  title: 'equis',
          });
}; 