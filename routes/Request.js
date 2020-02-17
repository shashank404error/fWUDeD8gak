const request = require('request');
var ApiCredentials = require('./secure-credentials.json');

const metafunc =
    (callback) => {
        request('https://api.spoonacular.com/recipes/complexSearch?query='+global.queryVar+'&maxFat=25&number=9&apiKey='+ApiCredentials.apiKey+'', {json: true}, (err, res, body) => {
               if (err) {
                   return callback(err);
               }
               return callback(body);
           });


       }

const getDetailedInfo =
    (callback) => {
        request('https://api.spoonacular.com/recipes/'+global.recipeId+'/information?includeNutrition=false&apiKey='+ApiCredentials.apiKey+'', {json: true}, (err, res, body) => {
            if (err) {
                return callback(err);
            }
            return callback(body);
        });


    }

const getInstructionInfo =
    (callback) => {
        request('https://api.spoonacular.com/recipes/extract?url='+global.RecipeUrl+'&apiKey='+ApiCredentials.apiKey+'', {json: true}, (err, res, body) => {
            if (err) {
                return callback(err);
            }
            return callback(body);
        });


    }





module.exports.callApi=metafunc;
module.exports.detailedInfoAPI=getDetailedInfo;
module.exports.detailInstructionInfo=getInstructionInfo;