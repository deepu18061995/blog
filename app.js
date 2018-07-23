var express     =require("express"),
    mongoose    =require("mongoose"),
    method      =require("method-override"),
    bodyparser  =require("body-parser"),
    app=express();

//mongoose.connect("mongodb://localhost:27017/blog_post", {useNewUrlParser: true });
mongoose.connect("mongodb://blog:deepak123@ds243441.mlab.com:43441/dkblog", {useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true})); 
app.use(method("_method"));

var blogSchema=new mongoose.Schema({
   name:String,
   image:String,
   body:String,
   created:{type:Date, default:Date.now}
});

var blog=mongoose.model("blog",blogSchema);



app.get("/", function(req, res){
    res.redirect("/blog");
});

app.get("/blog", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs}) ;
        }
    });
   
});

app.get("/blog/new", function(req, res){
   res.render("new"); 
});

app.post("/blog", function(req, res){
   blog.create(req.body.blog, function(err, newblog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blog");
       }
   }) ;
});

//show route
app.get("/blog/:id", function(req,res){
   blog.findById(req.params.id, function(err, foundblog){
       if(err){
           res.redirect("/blog");
       }else{
           res.render("show",{blog:foundblog});
       }
   }) ;
});

//edit route
app.get("/blog/:id/edit", function(req, res){
   blog.findById(req.params.id, function(err, foundblog){
       if(err){
           res.send(err);
       }else{
           res.render("edit",{blog:foundblog});
       }
   }) 
});

//put route
app.put("/blog/:id", function(req, res){
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog){
       if(err){
          res.send(err);
       }else{
           res.redirect("/blog/"+req.params.id);
       }
   }) 
});

//delete route
app.delete("/blog/:id", function(req, res){
   blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blog");
      }else{
          res.redirect("/blog");
      }
   }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running!!"); 
});