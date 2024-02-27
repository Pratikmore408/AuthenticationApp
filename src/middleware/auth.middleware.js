export const auth = (req, res, next)=>{
    // check if session email is present
    if(req.session.userEmail){
        // call next if yes
        next();
    }else{
        // render signup page if not
        res.redirect('/signup');
    }
}