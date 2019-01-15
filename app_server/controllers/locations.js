/* GET на Домашняя страница */
var request = require('request');
var os = require("os");
var hostname = os.hostname();
var apiOptions = {
  server : "http://localhost:3000"
};

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  
  var _formatDistance = function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
      if (distance > 1000) {
        numDistance = parseFloat(distance / 1000.10).toFixed(1);
        unit = ' km';
      } else {
        numDistance = parseInt(distance).toFixed(1);
        unit = ' m';
      }
      return numDistance + unit;
    } else {
      return "?";
    }
  };

module.exports.homelist = function(req,res){
  //renderHomepage(req,res);
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
      lng : 30.624961,
      lat : 50.386061,
      maxDistance : 15000
    }
  };
  request(
    requestOptions,
    function(err, response, body) {
      var i, data;
      data = body;
      if (response.statusCode === 200 && data.length) {
        //console.log(data);
        for (i=0; i<data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomepage(req, res, data);
    }
  );
}

/* GET на (О Нас) */
module.exports.locationsInfo = function(req,res){
  getLocationInfo(req, res, function(req, res, responseData){
    renderDetilePage(req, res, responseData);
  });
}

module.exports.addReview = function(req, res){
  getLocationInfo(req, res, function(req, res, responseData){
    //console.log("test: "+responseData)
    renderReviewForm(req, res, responseData);
  });
}

var getLocationInfo = function(req, res, callback){
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng : body.coords[0],
          lat : body.coords[1]
        };
        callback(req, res, data);
      } else {
        _showError (req, res, response.statusCode);
      }
    }
  )
} 

var renderDetilePage = function(req, res, locDetail){
  res.render('location-info',{
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    api_key: 'AIzaSyD3cH-OsJpvjOq-NHcLvM-n5oc81iVxffE',
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.'
    },
    location: locDetail
  });
};


var renderHomepage = function(req, res, responseBody){
    var message;
    if (!(responseBody instanceof Array)) {
      message = "API lookup error";
      responseBody = [];
    } else {
      if (!responseBody.length) {
        message = "No places found nearby";
      }
      
    }
    res.render('locations-list', {
      title: 'Loc8r - find a place to work with wifi',
      pageHeader: {
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you! on HOST: '+hostname
      },
      sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
      locations: responseBody,
      message: message
    });
  };

var renderHomepage_static = function(req, res, responseBody){
    res.render('locations-list',{
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: [{
            name: 'Starcups',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 1,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '101m'
        }, {
            name: 'Cafe Hero',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 4,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '202m'
        }, {
            name: 'Burger Queen',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 2,
            facilities: ['Food', 'Premium wifi'],
            distance: '253m'
        }],
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
    });
}

var renderDetilePage_static = function(req, res, responseBody){
  res.render('location-info',{
    title: 'Starcups',
    pageHeader: {
        title: 'Starcups'
    },
    sidebar: {
        context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
        callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    api_key: 'AIzaSyD3cH-OsJpvjOq-NHcLvM-n5oc81iVxffE',
    location: {
        name: 'Starcups',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        coords: {
            lat: 50.38573263,
            lng: 30.62476248
        },
        openingTimes: [{
            days: 'Monday - Friday',
            opening: '7:00am',
            closing: '7:00pm',
            closed: false
        }, {
            days: 'Saturday',
            opening: '8:00am',
            closing: '5:00pm',
            closed: false
        }, {
            days: 'Sunday',
            closed: true
        }],
        reviews: [{
            author: 'Simon Holmes',
            rating: 5,
            timestamp: '16 July 2013',
            reviewText: '1What a great place. I can\'t say enough good things about it.'
        }, {
            author: 'Charlie Chaplin',
            rating: 3,
            timestamp: '16 June 2013',
            reviewText: '1It was okay. Coffee wasn\'t great, but the wifi was fast.'
        }]
    }
});
}

var _showError = function (req, res, status) {
  var title, content;
  console.log (status)
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

module.exports.doAddReview = function(req, res){
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = "/api/locations/"+locationid+"/reviews";
  //console.log(path);
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  console.log(postdata)
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText ) {
    res.redirect('/location/'+locationid+'/review/new?err=val');
  }else{
  request(
    requestOptions,
    function(err, response, body){
      if (response.statusCode === 201) {
        res.redirect('/location/'+locationid);
        
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" || body.review) {
        res.redirect('/location/'+locationid+'/review/new?err=val');
      } else {
        _showError (req, res, response.statusCode);
      }
    }
  )
  }
};

var renderReviewForm = function (req, res, locDetail){
  res.render('location-review-form', {
    title: 'Review '+ locDetail.name + ' on Loc8r',
    pageHeader: { title: 'Review '+ locDetail.name },
    error: req.query.err
  });
};