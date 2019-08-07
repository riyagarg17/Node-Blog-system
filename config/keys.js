if(process.env.NODE_ENV==='production'){
    mongoURI=process.env.productionURI;
}
else{
   mongoURI=process.env.devURI;
}

module.exports={
    mongoURI:mongoURI,
    googleClientID:'125332293933-taq5b4oi1rasat2fpm4fufigid6qi4hi.apps.googleusercontent.com',
    googleClientSecret:'-D2_CITC5WF9I_Af1CAvRfg1'
};