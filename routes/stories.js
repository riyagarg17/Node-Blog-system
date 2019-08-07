const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer')
const moment = require('moment');
const fs=require('fs');
//const upload = multer({ dest: './public/images' });
const { ensureAuthenticated, ensureGuest } = require('../helper/auth');
const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname + '-' + moment(Date.now()).format("MM-DD-YYYY"));
    }
  });
  
var upload = multer({ storage : storage });
//load  models
const story = mongoose.model('stories');
const user = mongoose.model('users');

//stories index
/*router.get('/', (req, res) => {
    story.find({ status: 'public' })
        .populate('user')
        .sort({ date: 'desc' })
        .then(story => {
            res.render('stories/index', {
                story: story
            });
        });
}); */

//add story form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

//edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    story.findOne({ _id: req.params.id }) 
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/');
            } else {
                res.render('stories/edit', {
                    story: story
                });
            }
        });
});

//show single story
router.get('/show/:id', (req, res) => {
    story.findOne({ _id: req.params.id }).populate('user')
        .populate('comments.commentUser')
        .then(story => {
                res.render('stories/show', {
                    story: story
                });
        });
});

//list story from specific user
router.get('/user/:userId', (req, res) => {
    story.find({ user: req.params.userId})
        .populate('user')
        .then(stories => {
            res.render('stories/singleUser', {
                story: stories,
                storyUser:stories[0].user
            });
            //console.log(stories[0].user);
        });
}); 

//categorize story by specific user
router.post('/user/:userId', (req, res) => {
    //console.log(req.body.category);
    story.find({ user: req.params.userId,category:{ $in : req.body.category }})
        .populate('user')
        .then(stories => {
            if(stories.length!=0){
                res.render('stories/singleUser', {
                    story: stories,
                    storyUser:stories[0].user
                });
            }else{
                req.flash('error_msg','No Posts matching this category found');
                res.redirect('/stories/user/'+req.params.userId);
            }
           /*res.render('stories/singleUser', {
                story: stories,
                
            });*/
            //res.send(`${stories.length}`);
        });
}); 

//list my story route
router.get('/my', ensureAuthenticated, (req, res) => {
    story.find({ user: req.user.id })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                story: stories
            });
        });
});

//process story form
router.post('/add', ensureAuthenticated,upload.array('image',4) ,(req, res,next) => {

    var mainimage=[];
    // Check Image Upload
    if (req.files) {
         for(i=0;i<req.files.length;i++){
             mainimage.push(req.files[i].filename);
         }
    } else {
         mainimage = ' ';
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        user: req.user.id,
        category:req.body.category,
        image:mainimage
    };

    //new story
    new story(newStory).save()
        .then(story => {
            res.redirect('/dashboard');
        });
});


//edit form process
router.put('/edit/:id',ensureAuthenticated,upload.array('image',4) , (req, res) => {    
    var mainimage=[];
    story.findOne({ _id: req.params.id }).populate('user')
        .then(story => {

            //set new values
            story.title= req.body.title;
            story.body = req.body.body;
            story.user= req.user.id;
            story.category=req.body.category;
             // Check Image Upload
            if (req.files) {
                for(i=0;i<req.files.length;i++){
                   // mainimage.push(req.files[i].filename);
                   story.image.unshift(req.files[i].filename);
                }
                console.log(mainimage);
                //story.image.unshift(mainimage);
        }
            if(req.body.removeImage){
            
                for(i=0;i<req.files.length;i++){
                    /*fs.unlink(req.files[i].destination,(err)=> {            
                        if (err) {                                                 
                            console.error(err);                                    
                        }                                                          
                       console.log('File has been Deleted');                           
                    });*/
                    res.send(req.files[i].destination);  
                 }
                
                //story.image=' ';
            }
           story.save().then(story => {
                res.redirect('/dashboard');
            });
        });

});


//delete story
router.delete('/delete/:id', (req, res) => {
    story.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/dashboard');
        });
}); 

//add comment
router.post('/comment/:id',ensureAuthenticated, (req, res) => {
    story.findOne({ _id: req.params.id })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            };
            //console.log(newComment);
            story.comments.unshift(newComment);
            //console.log(story);
            story.save().then(story => {
                res.redirect(`/stories/show/${story.id}`);
            });
        });
});

//search results
router.post('/search',(req,res)=>{
    story.find(
        { "$or":[{"title": { "$regex": `\\b${req.body.Search}\\b`, "$options": "i" }},
        {"category": { "$regex": `\\b${req.body.Search}\\b`, "$options": "i" }}]})
    .populate('user')
    .then(story=>{
        res.render('stories/search',{
            story:story
        });
    });
});
module.exports = router;