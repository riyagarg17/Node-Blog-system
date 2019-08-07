module.exports={

    ensureAuthenticated:function(req,res,next){

        if(req.isAuthenticated()){
            return next();
        }
        //req.flash('error_msg','Not authorized! Please login to play');
        res.redirect('/');
    },
    ensureGuest:function(req,res,next){

        if(req.isAuthenticated()){
            res.redirect('/dashboard');
        }
        //req.flash('error_msg','Not authorized! Please login to play');
        else{
            return next();
        }
    }
};