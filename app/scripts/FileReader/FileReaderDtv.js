'use strict';

/**
* FileReader Module
*
* Description
*/
angular.module('FileReader', [])

.directive('fileReader', [function () {
    return {
        // Declared as attribute to activate
        restrict: 'A',

        // Scope values
        scope: {
            config: '=',
            onFileChange: '&',
            onFileChangeError: '&'
        },

        link: function (scope, element) {
            element.on('change', function (event) {
                onFileChange(event.target.files);
            });

            // Use native event ondrop instead of angularjs
            element[0].ondrop = function (event) {
                event.preventDefault && event.preventDefault();
                onFileChange(event.dataTransfer.files);
            };

            element[0].ondragenter = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            element[0].ondragover = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            function onFileChange(files) {
                if(files.length > 0) {
                    // Pass callback to parent implementor
                    scope.onFileChange({'files': files});
                    // Clear value on the input field to allow re-upload file
                    element.val(undefined);
                    scope.$apply();
                }
            }

            element.attr('type', 'file');
        }
    }
}]);