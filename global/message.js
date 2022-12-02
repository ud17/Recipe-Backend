const CONSTANTS = require("./constants");

module.exports = {
    // General Error Messages
    ERROR_DATABASE: "Unable to write to database",
    ERROR_TITLE_LENGTH: `Title length should be ${CONSTANTS.RECIPE_TITLE_LENGTH.min} to ${CONSTANTS.RECIPE_TITLE_LENGTH.max} characters long.`,
    ERROR_LOCATION: "Location cannot be empty.",
    ERROR_IMAGE_FILE_EMPTY: "Image File cannot be empty",
    ERROR_INSTRUCTIONS_EMPTY: "Instructions cannot be empty",
    ERROR_INGREDIENTS_EMPTY: "Ingredients cannot be empty",
    ERROR_RECIPE_CATEGORY: "Recipe category cannot be empty",
    ERROR_RECIPE_ID_EMPTY: "Recipe id is empty or not found.",
    ERROR_RECIPE_NOT_FOUND: "Recipe not found with given id.",
    ERROR_RECIPE_TERM: "Recipe search param cannot be empty.",
    ERROR_CURRENT_PAGE: "Current page cannot be empty",
    
    INVALID_IMAGE_MIMETYPE: "Invalid image file mimetype.",
    INVALID_RECIPE_ID: "Recipe id invalid.",
    INVALID_RECIPE_CATEGORY: "Invalid Recipe Caetegory",

    // General Success Messages
    SUCCESS_RECIPE_CREATED: "Recipe has been created successfully.",
    SUCCESS_ALL_RECIPES_FOUND: "All Recipes have been found successfully.",
    SUCCESS_LATEST_RECIPES_FOUND: "Latest Recipe have been found successfully.",
    SUCCESS_MOST_VIEWED_RECIPES_FOUND: "Most Viewed Recipe have been found successfully.",
    SUCCESS_RECIPE_DETAILS_UPDATED: "Recipe details have been updated successfully.",
    SUCCESS_RECIPE_DELETED: "Recipe has been deleted successfully.",
    SUCCESS_RECIPE_FOUND: "Recipe found successfully.",
    SUCCESS_RECIPE_VIEW_INCREMENTED: "Recipe view has been incremented successfully."
}