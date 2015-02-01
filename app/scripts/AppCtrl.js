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
            "description": "My Face",
            "format": "image",
            "enableUpload": $scope.model.enableUpload,
            "enableRemove": $scope.model.enableRemove,
            "enableZoom": $scope.model.enableZoom
        },
        "enableRemove",
        "enableUpload",
        "enableZoom",
        "name",
        "email",
        {
            "key": "comment",
            "type": "textarea",
            "placeholder": "Make a comment"
        },
        {
            "type": "submit",
            "style": "btn-info",
            "title": "OK"
        }
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
            },
            "name": {
                "title": "Name",
                "type": "string"
            },
            "email": {
                "title": "Email",
                "type": "string",
                "pattern": "^\\S+@\\S+$",
                "description": "Email will be used for evil."
            },
            "comment": {
                "title": "Comment",
                "type": "string",
                "maxLength": 20,
                "validationMessage": "Don't be greedy!"
            }
        },
        "required": [
            "name",
            "email",
            "comment"
        ]
    };

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.form[0].enableRemove = value.enableRemove;
            $scope.form[0].enableUpload = value.enableUpload;
            $scope.form[0].enableZoom = value.enableZoom;
        }
    }, true);
}])