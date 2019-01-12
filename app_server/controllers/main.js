module.exports.about = function(req,res){
    //console.log("Это делается видимым для запрашивающей стороны");
    res.render('index',{title: 'ExpresS'});
}