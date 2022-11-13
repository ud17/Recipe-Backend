require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import routes
const recipes = require("./routes/recipe");
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Running Version 1.0.0
// Comment
// development
const URL = process.env.MONGO_URL;
const VERSION = process.env.VERSION;
const PORT = process.env.PORT;

// Config options to pass in mongoose.connect() method
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Routes
app.use("/uploads" , express.static(path.join(__dirname, "uploads")));
app.use("/recipe" , recipes);

// home route
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to Recipe Node JS App Backend!</h1>
        <h2>Version: ${VERSION}</h2>
        <h4>Development in progress!</h4>
    `);
});

// Error handling route
app.all("*", (req, res) => {
    res.status(404).json({code: 404, message: 'Error 404! Route not found!'});
})

// mongodb connection
mongoose.connect( URL, options ).then((result) => {
    app.listen(PORT , (req , res) => {
        console.log(`Server has started successfully on port: ${PORT}`);
    })
})
.catch((err) => {
    console.log(`Server error -> ${err}`);
});