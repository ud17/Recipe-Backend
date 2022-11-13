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
router.get("/get-all-recipes" ,

    async(req , res, next) => {

        const response = await RecipeController.getAllBlogs();

        // send database error is exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response
        else if(response.blogs) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_ALL_BLOGS_FOUND, response.blogs);
    }
)

// path - /recipe/:recipe_id
// GET
router.get("/get-recipe/:recipe_id",

    async( req, res, next) => {
        const blogId = req.params.blog_id;

        const response = await RecipeController.getBlogById(blogId);

         // send database error is exists
         if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);
         
         // send success response otherwise
         else if(response.blog) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_BLOG_FOUND, response.blog);
    }
)

// path - /blog/get-latest-recipes
// GET
router.get("/get-latest-recipes", 

    async (req, res, next) => {

        const response = await RecipeController.getLatestBlogs();

        // send database error is exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response otherwise
        else if(response.latest) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_LATEST_BLOGS_FOUND, response.latest);
    }
)

// path - /blog/get-most-viewed-blogs
// GET
router.get("/get-most-viewed-blogs",

    async (req, res, next) => {

        const response = await RecipeController.getMostViewedBlogs();

        // send database error is exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response otherwise
        else if(response.most_viewed) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_MOST_VIEWED_BLOGS_FOUND, response.most_viewed);
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

// path - /blog/increment-blog-view/:blog_id
// PATCH
router.patch("/increment-blog-view/:blog_id",

    [
        param("blog_id").isMongoId().withMessage( ResponseMessage.INVALID_BLOG_ID )
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

        const blog_id = req.params.blog_id;

        // method to increment blog view
        const response = await RecipeController.incrementBlogViewByOne(blog_id);

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send success response
        else if(response.blog) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_BLOG_VIEW_INCREMENTED, response.blog);
    }
)

// path - /blog/update-blog/:blog_id
// PATCH
router.patch("/update-blog/:blog_id",

    // file upload middleware
    FileUpload.single("image"),

    [
        body("title").isLength(CONSTANT.BLOG_TITLE_LENGTH).withMessage( ResponseMessage.ERROR_TITLE_LENGTH ).optional(),
        body("description").isLength(CONSTANT.BLOG_DESCRIPTION_LENGTH).withMessage( ResponseMessage.ERROR_DESCRIPTION_LENGTH ).optional(),
        body("location").notEmpty().withMessage( ResponseMessage.ERROR_LOCATION ).optional()
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

        const blog_id = req.params.blog_id;

        // method call to update blog
        const response = await RecipeController.updateBlog(blog_id, req);

        // send database error if exist
        if(response.databaseError) {
            // remove file is exists
            removeImageFileIfExists(req.file);
            
            return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);
        }

        // send success response otherwise
        else if(response.blog) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_BLOG_DETAILS_UPDATED, response.blog );
    }
)


// path - /blog/delete-blog/:blog_id
// DELETE
router.delete("/delete-blog/:blog_id",

    [
        param("blog_id").notEmpty().withMessage(ResponseMessage.ERROR_BLOG_ID_EMPTY)
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

        const blog_id = req.params.blog_id;

        const response = await RecipeController.deleteBlog(blog_id);

        // send database error if exists
        if(response.databaseError) return Response.error( res, ResponseCode.DATABASE_ERROR, ResponseMessage.ERROR_DATABASE);

        // send error if blog not found
        else if(response.blogNotFound) return Response.error( res, ResponseCode.NOT_FOUND, ResponseMessage.ERROR_BLOG_NOT_FOUND);

        // send success response otherwise
        else if(response.blogDeleted) return Response.success( res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS_BLOG_DELETED);
    }
)

module.exports = router;