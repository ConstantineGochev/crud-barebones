var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


module.exports = {
    ensureAuthenticated: function(req,res,next){
        
          if(req.isAuthenticated()){
              return next();
          }
          req.flash('error_msg', 'Not authorized');
          res.redirect('/users/login');
    },
   
}