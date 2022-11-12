const fs = require("fs");

// Remove files if exists
const removeImageFileIfExists = async (file) => {
    if(file) {

        fs.unlink(file.path, (err) => {
            if(err) console.log(`Error while deleting image : ${err}`);
            else console.log(`File deleted.`);
        })
    } else return false;
}

const removeImageFileUsingPath = async (path) => {
    if(path) {
        fs.unlink(path, (err) => {
            if(err) console.log(`Error while deleting image : ${err}`);
            else console.log(`File has been delete from path -> ${path}`); 
        })    
    }
}

module.exports = {
    removeImageFileIfExists,
    removeImageFileUsingPath
}