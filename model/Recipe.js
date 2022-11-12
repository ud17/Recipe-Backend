const mongoose = require("mongoose");

const Recipe = new mongoose.Schema({
    title : {
        type: String
    },

    image: {
        type: String
    },

    category: {
        type: String,
        enum: ['Indian', 'Italian', 'American', 'Thai']
    },

    instructions: [
        String
    ],

    ingredients: [
        String
    ],

    views: {
        type: Number
    }
    
} , {timestamps: true});

module.exports = mongoose.model("Recipe", Recipe);