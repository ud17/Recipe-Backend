const { removeImageFileUsingPath } = require("../middleware/check-file");
const Recipe = require("../model/Recipe");

// get all blogs
const getAllBlogs = async (query) => {

    let blog, result = {}

    try {
        blog = await Blog.find(query);
    } catch(err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.blogs = blog;
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

// increment blog views
const incrementBlogViewByOne = async (query) => {

    let blog, result = {};

    try {
        blog = await Blog.findOneAndUpdate(query, 
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

    result.blog = blog;
    return result;
}

// get latest blogs
const getLatestBlogs = async (query, limit) => {

    let latest, result = {};

    try {
        latest = await Blog.find(query).sort({"createdAt": -1}).limit(limit);

    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.latest = latest;
    return result;
}

// get most viewed blogs
const getMostViewedBlogs = async (query, limit) => {
    let mostViewed, result = {};

    try {
        mostViewed = await Blog.find(query).sort({"views" : -1}).limit(limit);

    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.most_viewed = mostViewed;
    return result;
}

// update blog
const updateBlog = async (query, data) => {

    let blog, result = {};

    try {
        blog = await Blog.findOne(query);

        let previous_image = blog.image;

        let newData = {
            title: data.title ? data.title : blog.title,
            description: data.description ? data.description : blog.description,
            location: data.location ? data.location : blog.location,
            image: data.file ? data.file.path : blog.image
        }

        blog = await Blog.findByIdAndUpdate(query, newData, { new: true});

        if(data.file) removeImageFileUsingPath(previous_image);
    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    if(!blog) {
        result.databaseError = true;
        return result;
    }

    result.blog = blog;
    return result;
}

// delete a blog
const deleteBlog = async (query) => {

    let blog, result = {};

    try {
        blog = await Blog.findById(query);

        if(!blog) {
            result.blogNotFound = true;
            return result;
        }

        // remove blog as well as img
        const img = blog.image;
        await blog.remove();
        await removeImageFileUsingPath(img);
    } catch (err) {
        console.log(err);
        result.databaseError = true;
        return result;
    }

    result.blogDeleted = true;
    return result;
}

module.exports = {
    getAllBlogs,
    createNewRecipe,
    updateBlog,
    deleteBlog,
    incrementBlogViewByOne,
    getLatestBlogs,
    getMostViewedBlogs
}