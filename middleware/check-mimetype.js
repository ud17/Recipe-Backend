const checkImageMimeType = async (file) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        return true;
    }
    else return false;
}

module.exports = {
    checkImageMimeType
}