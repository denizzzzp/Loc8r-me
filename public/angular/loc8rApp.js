angular.module('loc8rApp', []);

var ratingStars = function (){
  return {
    scope: {
      thisRating : '=rating'
    },
    templateUrl: '/angular/rating-stars.html'
  };
};

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {
  return function (distance) {
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
};

/*var locationListCtrl = function ($scope) {
  $scope.data= {
    locations: [{
      name: 'Burger Queen',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '0.296456',
      _id: '5370a35f2536f6785f8dfb6a'
    }]
  }
}*/

/*var locationListCtrl = function ($scope, loc8rData) {
  console.log("TEST")
  $scope.data = { locations: loc8rData}
}*/


var locationListCtrl = function ($scope, loc8rData) {
  loc8rData
    .success(function(data) {
      console.log(data)
      $scope.data = { locations: data };   
  })
    .error(function(e) {
      console.log("Error"+e)
  })
};

var loc8rData = function ($http){
  console.log("TEST")
  return $http.get('/api/locations?lng=30.624961&lat=50.386061&maxDistance=15000')
}

/*var loc8rData = function (){
  return[{
    name: 'Burger Queen1',
    address: '11125 High Street, Reading, RG6 1PS',
    rating: 4,
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    distance: '0.296456',
    _id: '5370a35f2536f6785f8dfb6a'
  }]
}*/

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData);