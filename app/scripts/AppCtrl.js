'use strict';

angular.module('AppCtrl',[])

.controller('AppCtrl',
            ['$scope',
             function ($scope) {
    $scope.model = {
        "enableRemove": true,
        "enableUpload": true,
        "enableZoom": true
    };

    $scope.form = [
        {
            "key": "profpic",
            "type": "imagemodal",
            "title": "Profile Pic",
            "description": "Awesome picture here.",
            "format": "image",
            "enableUpload": $scope.model.enableUpload,
            "enableRemove": $scope.model.enableRemove,
            "enableZoom": $scope.model.enableZoom
        },
        "enableRemove",
        "enableUpload",
        "enableZoom"
    ];

    $scope.schema = {
        "type": "object",
        "title": "Comment",
        "properties": {
            "enableUpload": {
                "type": "boolean",
                "title": "Enable Upload"
            },
            "enableRemove": {
                "type": "boolean",
                "title": "Enable Remove"
            },
            "enableZoom": {
                "type": "boolean",
                "title": "Enable Zoom"
            }
        },
        "required": []
    };

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.form[0].enableRemove = value.enableRemove;
            $scope.form[0].enableUpload = value.enableUpload;
            $scope.form[0].enableZoom = value.enableZoom;
        }
    }, true);
}])