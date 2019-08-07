const express=require('express');
const mongoose=require('mongoose');
const {ensureAuthenticated,ensureGuest}=require('../helper/auth');
const router=express.Router();

const story=mongoose.model('stories');
const user=mongoose.model('users');

router.get('/',ensureGuest,(req,res)=>{
    res.render('index/homepage',{layout: 'homepage'});
});

router.get('/dashboard',(req,res)=>{
    story.find().populate('user')
    .then(stories=>{
        res.render('index/dashboard',{
            story:stories
        });
    });  
});

router.get('/category/:type',(req,res)=>{
    story.find({category:req.params.type}).populate('user')
    .then(stories=>{
        res.render('index/dashboard',{
            story:stories
        });
    });  
});
module.exports=router;