module.exports = function () {
    console.log("Это делается видимым для запрашивающей стороны");
};

module.exports.logThis = function(message){
    console.log(message);
};