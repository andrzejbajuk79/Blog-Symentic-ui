var     bodyParser  = require("body-parser"),
        exprSan     = require('express-sanitizer'),
        mongoose    = require('mongoose'),
        express     = require('express'),
        override    = require('method-override'),
        app         = express();
//ap config      
mongoose.connect('mongodb://localhost/restFullBlogApp');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(exprSan());
app.use(override("_method"));

//mongoose model config
var blogSchema = new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    created : {type:Date,default : Date.now}
});

var Blog = mongoose.model('Blog',blogSchema)

// Blog.create({
//     title: 'fajny pies',
//     image : "https://farm4.staticflickr.com/3940/15473596487_5ed985dd35.jpg",
//     body : ' rasa niemiecka'
   
// })
//routes, restful routes
app.get('/',function(req,res){
    res.redirect('/blogs');
})

//index route
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log('nie ma blogow')
        }else{
            res.render('index',{blogs:blogs})
        }
    })
 
})

//new route
app.get('/blogs/new',function(req,res){
    res.render('new')
})
//create route

app.post('/blogs',function(req,res){
//create block
console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log('=====================================');
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render('new');
            console.log('zle');
        }else{
            res.redirect('/blogs');
            console.log('dobrze');
        }
    })

})
//show routes
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect('/blogs')
        }else {
             res.render('show',{blog: foundBlog});
        }
    })
   
})
//edit routes

app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log('cos poszlo nie tak');
            res.redirect('/blogs');
        }else{
            res.render('edit',{blog:foundBlog})
        }
    })
   
})
//update route
app.put('/blogs/:id',function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs/' + req.params.id)
        }
    })
})
//delete route
app.delete('/blogs/:id',function(req,res){
    //destroy
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs')
        }
    })
   
})


app.listen(process.env.PORT,process.env.IP,function(){
    console.log('server is running');
})