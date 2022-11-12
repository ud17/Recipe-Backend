// Success response to return
const success = (res, code, message, data) => {
    res.status(code).json({code: code, message: message, data: data});
}

// Error response to return
const error = (res, code, message) => {
    res.status(code).json({code: code, message: message});
}

module.exports = {
    success,
    error
};