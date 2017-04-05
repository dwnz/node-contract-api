exports.sendMessage = function (email, name, message, callback) {
    // DO SOMETHING HERE
    callback(null, true);
};

exports.status = function (callback) {
    callback(null, false);
};