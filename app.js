var express = require('express')
    , databaseUrl = "mongodb://localhost/fisl" // "username:password@example.com/mydb"
    , collections = ["users"]
    , db = require("mongojs").connect(databaseUrl, collections);

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/update', function( req, res ) {
    db.users.findOne({user: "usernew"}, function(err, user) {
        if( err || !user) console.log("Nenhum usuário encontrado");
        else
            res.json( user );
    });
});

app.post('/update', function( req, res ) {
    db.users.findOne({ user: req.body.user }, function(err, user) {
        if( err ) console.log("Sem usuário");
        if ( user ){
            db.users.update({user:'usernew' }, req.body , function(err, updated) {
                if( err || !updated ) console.log(err);
                else res.send( updated );
            });
        }else{
            db.users.save( req.body , function(err, saved) {
                if( err || !saved ) console.log("User not saved");
                else console.log("User saved");
                res.json( saved );
            });
        }
    });
});


// redirect all others to the index (HTML5 history)
app.get('*', function(req, res){res.send(404)});

// Start server

app.listen(3000, function(){

  console.log("Server started at port 3000");
});
