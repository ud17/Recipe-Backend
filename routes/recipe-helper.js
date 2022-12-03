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

// get recipe by category
const getRecipeByCategory = async (query, currentPage) => {

    let recipe, totalCount, result = {};
    const PER_PAGE = 10;

    try {
        recipe = await Recipe.find(query).skip((currentPage - 1)*PER_PAGE).limit(PER_PAGE);
        totalCount = Math.ceil((await Recipe.find(query)).length/10);
    } catch(err) {
        console.log(`getRecipeByCategory -> ${err}`);
        result.databaseError = true;
        return result;
    }

    result.count = recipe.length;
    result.totalCount = totalCount;
    result.recipe_details = recipe;
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
const incrementRecipeViewByOne = async (query) => {

    let recipe, result = {};

    try {
        recipe = await Recipe.findOneAndUpdate(query, 
            { 
                $inc: {
                    views : 1
                }
            },
            {
                returnOriginal: false
            }
        );
    } catch (err) {
        console.log(`incrementRecipeViewByOne: ${err}`);
        result.databaseError = true;
        return result;
    }

    result.recipe = recipe;
    return result;
}

// get latest recipes
const getLatestRecipes = async (query, limit) => {

    let latest_recipes, result = {};

    try {
        latest_recipes = await Recipe.find(query).sort({"createdAt": -1}).limit(limit);

    } catch (err) {
        console.log(`getLatestRecipes: ${err}`);
        result.databaseError = true;
        return result;
    }

    result.latest_recipes = latest_recipes;
    return result;
}

// get most viewed recipes
const getMostViewedRecipes = async (query, limit) => {
    let mostViewed, result = {};

    try {
        mostViewed = await Recipe.find(query).sort({"views" : -1}).limit(limit);

    } catch (err) {
        console.log(`getMostViewedRecipes: ${err}`);
        result.databaseError = true;
        return result;
    }

    result.most_viewed = mostViewed;
    return result;
}

// find all reicpes by title
const lookupRecipesByTitle = async (query, page) => {
    let recipes, totalCount, result = {};
    const LIMIT = 10;

    try {
        recipes = await Recipe.find(query).skip((page-1) * LIMIT).limit(LIMIT);
        totalCount = Math.ceil((await Recipe.find(query)).length/10);
    } catch (err) {
        console.log(`lookupRecipesByTitle -> ${err}`)
        result.databaseError = true;
        return result;
    }

    result.recipes = recipes;
    result.count = recipes.length;
    result.totalCount = totalCount;
    return result;
}

// update recipe
const updateRecipe = async (query, req) => {

    let recipe, result = {};

    try {
        recipe = await Recipe.findOne(query);

        let previous_image = recipe.image;

        let newData = {
            title: req.body.title ? req.body.title : recipe.title,
            category: req.body.category ? req.body.category : recipe.category,
            instructions: req.body.instructions ? req.body.instructions : recipe.instructions,
            ingredients: req.body.ingredients ? req.body.ingredients : recipe.ingredients,
            image: req.file ? req.file.path : recipe.image
        }

        recipe = await Recipe.findByIdAndUpdate(query, newData, { new: true});

        if(req.file) removeImageFileUsingPath(previous_image);
    } catch (err) {
        console.log(`updateRecipe: ${err}`);
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
const deleteRecipe = async (query) => {

    let recipe, result = {};

    try {
        recipe = await Recipe.findById(query);

        if(!recipe) {
            result.recipeNotFound = true;
            return result;
        }

        // remove recipe as well as img
        const img = recipe.image;
        await recipe.remove();
        await removeImageFileUsingPath(img);
    } catch (err) {
        console.log(`deleteRecipe ${err}`);
        result.databaseError = true;
        return result;
    }

    result.recipeDeleted = true;
    return result;
}

module.exports = {
    getAllRecipes,
    createNewRecipe,
    updateRecipe,
    deleteRecipe,
    incrementRecipeViewByOne,
    getLatestRecipes,
    getMostViewedRecipes,
    getRecipeByCategory,
    lookupRecipesByTitle
}