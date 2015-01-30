'use strict';

angular.module('AppCtrl',[])

.controller('AppCtrl',
            ['$scope',
             function ($scope) {

    $scope.images = [
        {
            "src": 'http://resources1.news.com.au/images/2007/10/29/1111119/820369-daniel-johns.jpg',
            "enableZoom": true,
            "enableUpload": true,
            "enableRemove": true
        },
        {
            "src": 'http://cdn.theunlockr.com/wp-content/uploads/2013/04/HTC_One_360_Wide.png',
            "enableZoom": true,
            "enableUpload": true,
            "enableRemove": true
        },
        {
            "src": 'https://eyalvardi.files.wordpress.com/2013/04/angularjs-logo.png',
            "enableZoom": true,
            "enableUpload": true,
            "enableRemove": true
        }
    ];
}])