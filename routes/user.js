var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    //DButils.execQuery("SELECT user_id FROM users").then((users) => {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      //if (users.find((x) => x.user_id === req.session.user_id)) {
      if (users.find((x) => x.username === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
 router.post('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsWatched(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as watched");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the watched recipes that were saved by the logged-in user
 */
router.get('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getWatchedRecipes(user_id);
    const results = recipes_id;
    //let recipes_id_array = [];
    //recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns the 3 last watched recipes that were saved by the logged-in user
 */
router.get('/watched3', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getWatchedRecipes3(user_id);
    const results = recipes_id;
    //let recipes_id_array = [];
    //recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe details and save this recipe in the personal recipes of the logged-in user
 */
router.post('/personal', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    const picture = req.body.picture;
    const name = req.body.name;
    const time_to_prepare = req.body.time_to_prepare;
    const vegan = req.body.vegan;
    const vegeterian = req.body.vegeterian;
    const ingridients = req.body.ingridients;
    const instructions = req.body.instructions;
    const number_of_servings = req.body.number_of_servings;
    const glutenFree = req.body.glutenFree;
    await user_utils.addPersonalRecipe(user_id,recipe_id,picture,name,time_to_prepare,vegan,vegeterian,ingridients,instructions,number_of_servings,glutenFree);
    res.status(200).send("The Personal Recipe was successfully saved");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the 3 last watched recipes that were saved by the logged-in user
 */
 router.get('/personal', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getPersonalRecipes(user_id);
    const results = recipes_id;
    //let recipes_id_array = [];
    //recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


module.exports = router;
