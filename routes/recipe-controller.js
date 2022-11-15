const { ObjectId } = require('mongodb');
const RecipeHelper = require("./recipe-helper.js");

// get all recipes
const getAllRecipes = async () => {

    let recipe, result = {};

    // get all recipes
    recipe = await RecipeHelper.getAllRecipes({});
    
    if(recipe.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.recipes = recipe;
    return result;
}

// get recipe by id
const getRecipeById = async (recipe_id) => {

    let recipe, result = {};

    let query = {
        _id: recipe_id
    }

    // get recipe by Id db call
    recipe = await RecipeHelper.getAllRecipes(query);

    if(recipe.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.recipe = recipe.recipes[0];
    return result;
}

// get latest recipes
const getLatestRecipes = async () => {

    let latest, result = {};
    // show 10 recipes at a time
    const recipe_LIMIT = 10;

    // get latest recipes
    latest = await RecipeHelper.getLatestRecipes({}, recipe_LIMIT);

    if(latest.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.latest_recipes = latest.latest_recipes;
    // result.most_viewed = mostViewed.most_viewed;
    return result;
}

// get most viewed recipes
const getMostViewedrecipes = async () => {

    let mostViewed, result = {};
    // show 10 recipes at a time
    const recipe_LIMIT = 10;

    // get latest recipes
    mostViewed = await RecipeHelper.getMostViewedrecipes({}, recipe_LIMIT);

    if(mostViewed.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.most_viewed = mostViewed.most_viewed;
    return result;
}

// create new recipe
const createNewRecipe = async (req) => {

    let recipe, result = {};
    const {title, category, instructions, ingredients} = req.body;

    let query = {
        title: title,
        category: category,
        instructions: instructions,
        ingredients: ingredients,
        image: req.file.path,
        views: 0
    }

    // create new recipe
    recipe = await RecipeHelper.createNewRecipe(query);

    if(recipe.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.recipe_details = recipe.recipe_details;
    return result;
}

// increment recipe views
const incrementrecipeViewByOne = async (recipe_id) => {

    let recipe, result = {};

    let query = {
        _id: recipe_id 
    };

    // increment recipe views method
    recipe = await RecipeHelper.incrementrecipeViewByOne(query);

    if(recipe.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.recipe = recipe;
    return result;
}

// update recipe details
const updaterecipe = async (recipe_id, req) => {

    let updatedrecipe, result = {};

    let query = {
        _id: ObjectId(recipe_id)
    }

    let newData = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        file: req.file
    };

    updatedrecipe = await RecipeHelper.updaterecipe(query, newData);

    if(updatedrecipe.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.recipe = updatedrecipe.recipe;
    return result;
}


// delete a recipe
const deleterecipe = async (recipe_id) => {

    let recipe, result = {};
    let query = {
        _id: ObjectId(recipe_id)
    }

    // method call to delete a recipe
    recipe = await RecipeHelper.deleterecipe(query);

    if(recipe.databaseError) {
        result.databaseError = true;
        return result;
    } 
    else if (recipe.recipeNotFound) {
        result.recipeNotFound = true;
        return result;
    }

    result.recipeDeleted = recipe.recipeDeleted;
    return result;
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createNewRecipe,
    updaterecipe,
    deleterecipe,
    incrementrecipeViewByOne,
    getLatestRecipes,
    getMostViewedrecipes
}