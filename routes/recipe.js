const express = require("express");
const Response = require("../global/response.js");
const ResponseCode = require("../global/code.js");
const ResponseMessage = require("../global/message.js");
const CONSTANT = require("../global/constants.js");
const FileUpload = require("../middleware/upload-recipe.js");
const { removeImageFileIfExists } = require("../middleware/check-file.js")
const { checkImageMimeType } = require("../middleware/check-mimetype.js")
const { body, validationResult, param } = require('express-validator');

// Controller
const RecipeController = require("./recipe-controller.js");

const router = express.Router();

// path - /recipe/get-all-recipes
// GET
router.get("/get-all-recipes",

    async(req , res, next) => {

        const response = await RecipeController.getAllRecipes();

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response
        else if(response.recipes) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_ALL_RECIPES_FOUND, response.recipes);
    }
)

// path - /recipe/get-recipe/:recipe_id
// GET
router.get("/get-recipe/:recipe_id",

    async( req, res, next) => {
        const recipeId = req.params.recipe_id;

        const response = await RecipeController.getRecipeById(recipeId);

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);
        
        // send success response otherwise
        else if(response.recipe) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_RECIPE_FOUND, response.recipe);
    }
)

// path - /recipes/get-latest-recipes
// GET
router.get("/get-latest-recipes", 

    async (req, res, next) => {

        const response = await RecipeController.getLatestRecipes();

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response otherwise
        else if(response.latest_recipes) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_LATEST_RECIPES_FOUND, response.latest_recipes);
    }
)

// path - /recipes/get-most-viewed-recipes
// GET
router.get("/get-most-viewed-recipes",

    async (req, res, next) => {

        const response = await RecipeController.getMostViewedRecipes();

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response otherwise
        else if(response.most_viewed_recipes) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_MOST_VIEWED_RECIPES_FOUND, response.most_viewed_recipes);
    }
)

// path - /recipe/create-recipe
// POST
router.post("/create-recipe",

    // Middleware to check file upload
    FileUpload.single("image"),

    // Parameter Validators
    [
        body("title").isLength(CONSTANT.RECIPE_TITLE_LENGTH).withMessage( ResponseMessage.ERROR_TITLE_LENGTH ),
        body("category").notEmpty().withMessage( ResponseMessage.ERROR_RECIPE_CATEGORY ),
        body("instructions").isArray().notEmpty().withMessage( ResponseMessage.ERROR_INSTRUCTIONS_EMPTY ),
        body("ingredients").isArray().notEmpty().withMessage( ResponseMessage.ERROR_INGREDIENTS_EMPTY ),
    ],

    async(req , res, next) => {

        // check if params are valid
        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            // Remove file if exists
            removeImageFileIfExists(req.file);

            return Response.error(res , ResponseCode.BAD_REQUEST , errors.array().map((error) => ({
                field: error.param,
                errorMessage: error.msg
            })));            
        }

        // check if imageFile is passed
        if( !req.file ) return Response.error( res , ResponseCode.UNPROCESSABLE_ENTITY , ResponseMessage.ERROR_IMAGE_FILE_EMPTY );

        
        // check image file mimetype
        const isImageFileValid = await checkImageMimeType(req.file)

        if ( !isImageFileValid ){ 
            // Remove file if exists
            removeImageFileIfExists(req.file);
            
            return Response.error( res , ResponseCode.UNPROCESSABLE_ENTITY , ResponseMessage.INVALID_IMAGE_MIMETYPE ); 
        }

        const response = await RecipeController.createNewRecipe(req);

        // send database error if exists
        if(response.databaseError) {
            // remove image file
            removeImageFileIfExists(req.file);

            return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE )
        }
        
        // send success response if blog created
        else if( response.recipe_details ) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_RECIPE_CREATED, response.recipe_details );
    }
)

// path - /recipe/increment-recipe-view/:recipe_id
// PATCH
router.patch("/increment-recipe-view/:recipe_id",

    [
        param("recipe_id").isMongoId().withMessage( ResponseMessage.INVALID_RECIPE_ID )
    ],

    async (req, res, next) => {

        // check if params are valid
        const errors = validationResult(req);

        if(!errors.isEmpty()) {

            return Response.error(res , ResponseCode.BAD_REQUEST , errors.array().map((error) => ({
                field: error.param,
                errorMessage: error.msg
            })));            
        }

        const recipe_id = req.params.recipe_id;

        // method to increment recipe view
        const response = await RecipeController.incrementRecipeViewByOne(recipe_id);

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response
        else if(response.recipe) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_RECIPE_VIEW_INCREMENTED, response.recipe);
    }
)

// path - /recipe/update-recipe/:recipe_id
// PATCH
router.patch("/update-recipe/:recipe_id",

    // file upload middleware
    FileUpload.single("image"),

    [
        body("title").optional().isLength(CONSTANT.RECIPE_TITLE_LENGTH).withMessage( ResponseMessage.ERROR_TITLE_LENGTH ),
        body("category").optional().notEmpty().withMessage( ResponseMessage.ERROR_RECIPE_CATEGORY ),
        body("instructions").optional().isArray().notEmpty().withMessage( ResponseMessage.ERROR_INSTRUCTIONS_EMPTY ),
        body("ingredients").optional().isArray().notEmpty().withMessage( ResponseMessage.ERROR_INGREDIENTS_EMPTY ),
    ],

    async ( req, res, next) => {

        // check if params are valid
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            // remove file is exists
            removeImageFileIfExists(req.file);

            return Response.error(res , ResponseCode.BAD_REQUEST , errors.array().map((error) => ({
                field: error.param,
                errorMessage: error.msg
            })));            
        }

        const recipe_id = req.params.recipe_id;

        // method call to update recipe
        const response = await RecipeController.updateRecipe(recipe_id, req);

        // send database error if exist
        if(response.databaseError) {
            // remove file is exists
            removeImageFileIfExists(req.file);
            
            return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);
        }

        // send success response otherwise
        else if(response.recipe) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_RECIPE_DETAILS_UPDATED, response.recipe );
    }
)

// path - /recipe/get-by-category/:type
router.get("/get-by-category/:type/:current_page",

    [
        param("type").notEmpty().withMessage(ResponseMessage.ERROR_RECIPE_CATEGORY),
        param("current_page").notEmpty().withMessage(ResponseMessage.ERROR_CURRENT_PAGE)
    ],
    async(req, res, next) => {
        // check if params are valid
        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            return Response.error(res , ResponseCode.BAD_REQUEST , errors.array().map((error) => ({
                field: error.param,
                errorMessage: error.msg
            })));            
        }

        const type = req.params.type;
        const currentPage = req.params.current_page;

        const response = await RecipeController.getRecipeByCategory(type, currentPage);

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response otherwise
        else if(response.recipe_details) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_RECIPE_FOUND, response);
    }
)

// path - /recipe/search/:recipe
router.get("/search/:recipe/:page",
    [
        param("recipe").notEmpty().withMessage(ResponseMessage.ERROR_RECIPE_TERM),
        param("page").notEmpty().withMessage(ResponseMessage.ERROR_CURRENT_PAGE)
    ],

    async (req, res, next) => {
        // check if params are valid
        const errors = validationResult(req)

        if(!errors.isEmpty()) {

            return Response.error(res , ResponseCode.BAD_REQUEST , errors.array().map((error) => ({
                field: error.param,
                errorMessage: error.msg
            })));            
        }

        const term = req.params.recipe;
        const page = req.params.page;

        const response = await RecipeController.lookupRecipe(term, page);

        // send database error if exists
        if(response.databaseError) return Response.error(res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response otherwises
        else if(response.recipes) return Response.success(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_ALL_RECIPES_FOUND, response);
    }
)

// path - /recipe/delete-recipe/:recipe_id
// DELETE
router.delete("/delete-recipe/:recipe_id",

    [
        param("recipe_id").notEmpty().withMessage(ResponseMessage.INVALID_RECIPE_ID)
    ],

    async( req, res, next) => {
        // check if params are valid
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            // remove file is exists
            removeImageFileIfExists(req.file);

            return Response.error(res , ResponseCode.BAD_REQUEST , errors.array().map((error) => ({
                field: error.param,
                errorMessage: error.msg
            })));            
        }

        const recipe_id = req.params.recipe_id;

        const response = await RecipeController.deleteRecipe(recipe_id);

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send error if recipe not found
        else if(response.recipeNotFound) return Response.error( res, ResponseCode.NOT_FOUND, ResponseMessage.ERROR_RECIPE_NOT_FOUND);

        // send success response otherwise
        else if(response.recipeDeleted) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_RECIPE_DELETED);
    }
)

module.exports = router;