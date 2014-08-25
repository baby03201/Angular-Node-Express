var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    req.getConnection(function(req,connection){
        console.log("GET users listing");
        connection.query('SELECT user.id, username, email,permissionGroup.id as gid,  description FROM user' 
            + "\n" 
            + 'LEFT JOIN permissionGroup ON permissionGroup.id = user.permissionGroupID', 1, function(err,rows) {
                if (err) 
                    console.log("List users error: %s", err);
                console.log("Output API");
                res.json(rows);
            });
    });
});


/* POST users */
router.post('/register', function(req, res){
    req.getConnection(function(req, connection){
        
        var data = {
        };

        console.log("Add user into list");
        connection.query('INSERT INTO user SET ?', data, function(err,rows){
            var response = {
                success : 0,
                error   : {}
            };

            if (err) {
                response.success = 0;
                response.error = err;
            } 
            else {
                response.success = 1;
                response.error = {};
            }
            res.json(response);
        });
    });
});

/* PUT users */
router.put('/update/:id', function(req, res){
    var id = req.params.id;
    var data = {
        username    : input.username,
        password    : input.password,
        email       : input.email
    };
    req.getConnection(function(req,connection) {
    connection.query('UPDATE user SET ? WHERE id = ?', [data,id], function(err,rows){
       var response = {
            success : 0,
            error   : {}
       };

        if (err) {
            console.log('Error while update');
            response.success = 0;
            response.error = err;
        }
        else {
            response.success = 1;
            response.error = 0;
        }
        
        res.json(response);
    });
    });
});

/* DELET users */
router.delete('/:id', function(req, res){
    var id = req.params.id;
    console.log("Delete user ing"); 
    req.getConnection(function(req,connection) {
    connection.query('DELETE from user WHERE id = ?',[id], function(err,rows){
        var response = {
            success: 0,
            error  : {}
        };

        if (err) {
            console.log(err);
            response.success = 0;
            response.error = err;
        }
        else {
            response.success = 1;
            response.error = {};
        }
        res.json(response);
    });
    });
});

/* GET user group */
router.get('/group', function(req,res){
    console.log("select group list");
    req.getConnection(function(req,connection){
        connection.query('SELECT * FROM permissionGroup',1, function(err,rows){
            if (err)
                console.log('select group list failed');    
            res.json(rows);
        });
    });
});

/* POST user group */
router.post('/:id/group/:gid', function(req,res){
    var userID = req.params.id;
    var groupID = req.params.gid;

    req.getConnection(function(req,connection){
        connection.query('UPDATE user SET permissionGroupID = ? WHERE id = ?',[groupID,userID], function(err, rows){
            var response = {
                success : 0,
                error   : {}
            };
            if (err){
                response.success = 0;
                response.error = err;
            }
            else {
                response.success = 1;
                response.error = {};
            }
            res.json(response);
        });
    });
});

module.exports = router;
