const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
//const passport =require('passport');


//require('../models/user');
const User = mongoose.model('users');

module.exports = function(passport){
    
     passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
         //console.log(password)
         User.findOne({
             email:email,
             password:password
         }).then(user =>{
             if(!user){
                return done(null,false, {message:'Incorrect email or password.'})
             }else{
                return done(null,user);
            }

            //  bcrypt.compare(password, user.password,(err, isMatch)=>{
            //      if(err) throw err
            //      if(isMatch){
            //         return done(null,user)
            //      }else{
            //      return done(null,false, {message:'Password incorrect'})                  
            //      }
            //  })
         })
      }))
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}