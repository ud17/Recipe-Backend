const { ObjectId } = require('mongodb');
const RecipeHelper = require("./recipe-helper.js");

// get all blogs
const getAllBlogs = async () => {

    let blog, result = {};

    // get all blogs
    blog = await RecipeHelper.getAllBlogs({});
    
    if(blog.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.blogs = blog;
    return result;
}

// get blog by id
const getBlogById = async (blog_id) => {

    let blog, result = {};

    let query = {
        _id: blog_id
    }

    // get blog by Id db call
    blog = await RecipeHelper.getAllBlogs(query);

    if(blog.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.blog = blog.blogs[0];
    return result;
}

// get latest blogs
const getLatestBlogs = async () => {

    let latest, result = {};
    // show 10 blogs at a time
    const BLOG_LIMIT = 10;

    // get latest blogs
    latest = await RecipeHelper.getLatestBlogs({}, BLOG_LIMIT);

    if(latest.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.latest = latest.latest;
    // result.most_viewed = mostViewed.most_viewed;
    return result;
}

// get most viewed blogs
const getMostViewedBlogs = async () => {

    let mostViewed, result = {};
    // show 10 blogs at a time
    const BLOG_LIMIT = 10;

    // get latest blogs
    mostViewed = await RecipeHelper.getMostViewedBlogs({}, BLOG_LIMIT);

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

// increment blog views
const incrementBlogViewByOne = async (blog_id) => {

    let blog, result = {};

    let query = {
        _id: blog_id 
    };

    // increment blog views method
    blog = await RecipeHelper.incrementBlogViewByOne(query);

    if(blog.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.blog = blog;
    return result;
}

// update blog details
const updateBlog = async (blog_id, req) => {

    let updatedBlog, result = {};

    let query = {
        _id: ObjectId(blog_id)
    }

    let newData = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        file: req.file
    };

    updatedBlog = await RecipeHelper.updateBlog(query, newData);

    if(updatedBlog.databaseError) {
        result.databaseError = true;
        return result;
    }

    result.blog = updatedBlog.blog;
    return result;
}


// delete a blog
const deleteBlog = async (blog_id) => {

    let blog, result = {};
    let query = {
        _id: ObjectId(blog_id)
    }

    // method call to delete a blog
    blog = await RecipeHelper.deleteBlog(query);

    if(blog.databaseError) {
        result.databaseError = true;
        return result;
    } 
    else if (blog.blogNotFound) {
        result.blogNotFound = true;
        return result;
    }

    result.blogDeleted = blog.blogDeleted;
    return result;
}

module.exports = {
    getAllBlogs,
    getBlogById,
    createNewRecipe,
    updateBlog,
    deleteBlog,
    incrementBlogViewByOne,
    getLatestBlogs,
    getMostViewedBlogs
}