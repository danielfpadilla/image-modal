'use strict';

angular.module('AppCtrl',[])

.controller('AppCtrl',
            ['$scope',
             function ($scope) {

    $scope.form = [
        {
            "key": "profpic",
            "type": "imagemodal",
            "format": "image",
            "enableZoom": true,
            "enableUpload": true,
            "enableRemove": true
        },
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
            "profpic": {
                "title": "Profile Pic",
                "type": "imagemodal",
                "description": "My Face"
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

    $scope.model = {};
}])