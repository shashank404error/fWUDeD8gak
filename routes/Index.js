var express = require('express');
var router = express.Router();
require('../App.js');
var mysql = require('mysql');
const apiRequestCall = require('./Request');
var mysqlConnCredentials = require('./secure-credentials.json');

con = mysql.createConnection({
  host: mysqlConnCredentials.host,
  user: mysqlConnCredentials.user,
  password: mysqlConnCredentials.password,
  database: mysqlConnCredentials.database
});

  var wlcmmsg = "Hello, User";
  var resultDB;

con.query("SELECT * FROM commonAppTable", function (err, result, fields) {
    if (err) throw err;

    var resDB = result;

    //All Logic goes here
    /* GET home page. */
    router.get('/', function (req, res, next) {

      //variables for the view
      var titleName = 'FoodServer | homepage'
      //Fetch user info from DB userInfo

      //fetch origin using API
      var fOrigin = 'It was invented in Manit Hostel'
      resDB.forEach(function (item) {
        console.log(item.imgSrc)
      });
      res.render('index', {
        title: titleName,
        welcomeMsg: wlcmmsg,
        foodObj: resDB,
        foodOrigin: fOrigin,
        headerFileDisplayProperty: "block",
        headerFileLoggedInDisplayProperty: "none",
        desc: "Home"
      });

    });

    router.post('/detailprod', function (req, res, next) {
      if (req.body.isName == "Hello, User") {
        var userHeaderName = "Hello, User";
        var headerFileDisplayPropertyInst = "block";
        var headerFileLoggedInDisplayPropertyInst = "none";
      } else {
        var userHeaderName = req.body.isName;
        var headerFileDisplayPropertyInst = "none";
        var headerFileLoggedInDisplayPropertyInst = "block";
      }

      con.query("SELECT * FROM commonAppTable where fid=" + req.body.foodId + "", function (err, result1, fields) {
        if (err) throw err;
          con.query("SELECT * FROM commonAppTable", function (err, resDB1, fields) {
              if (err) throw err;
              res.render('product', {
                  title: 'FoodServer | ' + result1[0].fName,
                  welcomeMsg: userHeaderName,
                  desc: 'home/' + result1[0].fName,
                  foodObj: resDB1,
                  currFoodObj: result1,
                  headerFileDisplayProperty: headerFileDisplayPropertyInst,
                  headerFileLoggedInDisplayProperty: headerFileLoggedInDisplayPropertyInst,
                  foodOrigin: "manit Hostel"
              });
          });
      });
    });

    router.post('/recipieUpload', function (req, res, next) {
      con.query("SELECT * FROM userInfo where email= '" + req.body.userId + "' ", function (err, result2, fields) {
        if (err) throw err;
        res.render('upload-recipie', {
          title: 'FoodServer | upload',
          welcomeMsg: req.body.userId,
          desc: 'home/upload',
          userObj: result2,
          headerFileDisplayProperty: "none",
          headerFileLoggedInDisplayProperty: "block"
        });
      });
    });

    router.post('/updateRecipie', function (req, res, next) {
      var foodDetails = {
        fName: req.body.foodName,
        owner: req.body.fullName,
        emailR: req.body.emailRecipiter,
        ingredients: req.body.ingredients,
        equiptments: req.body.equipments,
        recipie: req.body.recipie,
        foodImgFile1: req.body.foodImgfile
      }
        //upload the image
        var file;
        if(!req.files)
        {res.send("File was not found");
            return;
        }
        file = req.files.foodImgfile;

      //updating database table commonAppTable
      var sql = "INSERT INTO commonAppTable (fid,imgSrc,fName,owner,ingredients,equipments,recipie) VALUES (NULL,'" + file.name + "','" + foodDetails.fName + "','" + foodDetails.emailR + "','" + foodDetails.ingredients + "','" + foodDetails.equiptments + "','" + foodDetails.recipie + "')";
      con.query(sql, function (err, result3) {
        if (err) throw err;

          //render index after moving the file to /pubic/images/ folder of server
          file.mv('../public/images/'+file.name);
          con.query("SELECT * FROM commonAppTable", function (err, resDB2, fields) {
              if (err) throw err;
              res.render('index', {
                      title: "FoodServer | homepage",
                      welcomeMsg: foodDetails.owner,
                      foodObj: resDB2,
                      foodOrigin: "fOrigin",
                      headerFileDisplayProperty: "none",
                      headerFileLoggedInDisplayProperty: "block",
                      desc: "Home"
                  });
          });

      });

    });
    router.post('/fetchDetailsFromSpoonacular',function (req,res,next) {
        recipeId=req.body.foodId;
        if (req.body.isName == "Hello, User") {
            var userHeaderName = "Hello, User";
            var headerFileDisplayPropertyInst = "block";
            var headerFileLoggedInDisplayPropertyInst = "none";
        } else {
            var userHeaderName = req.body.isName;
            var headerFileDisplayPropertyInst = "none";
            var headerFileLoggedInDisplayPropertyInst = "block";
        }

        apiRequestCall.detailedInfoAPI(function (response) {
            var jsonToString = JSON.stringify(response);
            var stringToJson = JSON.parse(jsonToString);

            RecipeUrl = stringToJson.sourceUrl;
            apiRequestCall.detailInstructionInfo(function (response1) {
                var jsonToString1 = JSON.stringify(response1);
                var stringToJson1 = JSON.parse(jsonToString1);
                if(typeof stringToJson1.analyzedInstructions[0] !== "undefined"){
                    var a2z = stringToJson1.analyzedInstructions[0].steps;
                }
                else{
                    var a2z = [];
                }

                res.render('external-product', {
                    title: 'FoodServer | ' + stringToJson.title,
                    foodImg: stringToJson.image,
                    foodName: stringToJson.title,
                    welcomeMsg: userHeaderName,
                    desc: 'home/' + stringToJson.title,
                    foodObj: resDB,
                    foodObj1: global.globalRecipeResultReturnedInstance,
                    currIngrediants:stringToJson.extendedIngredients ,
                    currInstruction: a2z,
                    headerFileDisplayProperty: headerFileDisplayPropertyInst,
                    headerFileLoggedInDisplayProperty: headerFileLoggedInDisplayPropertyInst,
                    foodOrigin: "Sent via spoonacular"
                });
                res.end();
            });
        });
    });

    router.post('/search',function(req,res,next){
        queryVar = req.body.searchQuery;
        console.log(queryVar);
        if(req.body.welcmmsg=="Hello, User"){
            welcomeMsgsearch = "Hello, User";
            var headerFileDisplayPropertyIns = "block";
            var headerFileLoggedInDisplayPropertyInst = "none";
        }
        else{
            welcomeMsgsearch = req.body.welcmmsg;
            var headerFileDisplayPropertyIns = "none";
            var headerFileLoggedInDisplayPropertyInst = "block";
        }
        apiRequestCall.callApi(function (response) {
            var jsonToString = JSON.stringify(response);
            var stringToJson = JSON.parse(jsonToString);

            globalRecipeResultReturnedInstance = stringToJson.results

            res.render('search', {
                title: "FoodServer | search-result",
                welcomeMsg: welcomeMsgsearch,
                foodObj1: stringToJson.results,
                foodOrigin: "spoonacular.com",
                foodObj : resDB,
                headerFileDisplayProperty: headerFileDisplayPropertyIns,
                headerFileLoggedInDisplayProperty: headerFileLoggedInDisplayPropertyInst,
                desc: "search/"+queryVar
            });

            res.end();
        });
    });

  });

//Search spoonacular website through it's api





    module.exports = router;
