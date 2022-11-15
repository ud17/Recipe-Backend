const { removeImageFileUsingPath } = require("../middleware/check-file");
const Recipe = require("../model/Recipe");

// get all recipes
const getAllRecipes = async (query) => {

    let recipe, result = {}

    try {
        recipe = await Recipe.find(query);
    } catch(err) {
        console.log(`getAllRecipes: ${err}`);
        result.databaseError = true;
        return result;
    }

    result.recipes = recipe;
    return result;
}

// create new recipe
const createNewRecipe = async (query) => {

    let recipe, result = {};

    try {        
        recipe = await new Recipe(query).save();
    } catch (err) {
        console.log(`createNewRecipe -> ${err}`);
        result.databaseError = true;
        return result;
    }

    result.recipe_details = recipe;
    return result;
}

// increment recipe views
const incrementrecipeViewByOne = async (query) => {

    let recipe, result = {};

    try {
        recipe = await recipe.findOneAndUpdate(query, 
            { $inc: {
                views : 1
            }},
            {
                returnOriginal: false
            }
        );
    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.recipe = recipe;
    return result;
}

// get latest recipes
const getLatestrecipes = async (query, limit) => {

    let latest, result = {};

    try {
        latest = await recipe.find(query).sort({"createdAt": -1}).limit(limit);

    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.latest = latest;
    return result;
}

// get most viewed recipes
const getMostViewedrecipes = async (query, limit) => {
    let mostViewed, result = {};

    try {
        mostViewed = await recipe.find(query).sort({"views" : -1}).limit(limit);

    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.most_viewed = mostViewed;
    return result;
}

// update recipe
const updaterecipe = async (query, data) => {

    let recipe, result = {};

    try {
        recipe = await recipe.findOne(query);

        let previous_image = recipe.image;

        let newData = {
            title: data.title ? data.title : recipe.title,
            description: data.description ? data.description : recipe.description,
            location: data.location ? data.location : recipe.location,
            image: data.file ? data.file.path : recipe.image
        }

        recipe = await recipe.findByIdAndUpdate(query, newData, { new: true});

        if(data.file) removeImageFileUsingPath(previous_image);
    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    if(!recipe) {
        result.databaseError = true;
        return result;
    }

    result.recipe = recipe;
    return result;
}

// delete a recipe
const deleterecipe = async (query) => {

    let recipe, result = {};

    try {
        recipe = await recipe.findById(query);

        if(!recipe) {
            result.recipeNotFound = true;
            return result;
        }

        // remove recipe as well as img
        const img = recipe.image;
        await recipe.remove();
        await removeImageFileUsingPath(img);
    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.recipeDeleted = true;
    return result;
}

module.exports = {
    getAllRecipes,
    createNewRecipe,
    updaterecipe,
    deleterecipe,
    incrementrecipeViewByOne,
    getLatestrecipes,
    getMostViewedrecipes
}