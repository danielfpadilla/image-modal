'use strict';

angular.module('ImageModalDtv', [])

.directive('imageModalDirective',
           ['ImageModalService',
            function (ImageModalService) {

    return {
        // Declared as attribute to initialize
        restrict: 'A',

        // Scope values
        scope: {
            imageSrc: '@',
            isUploadable: '=imageIsUploadable',
            isRemovable: '=imageIsRemovable',
            isZoomable: '=imageIsZoomable'
        },

        templateUrl: 'scripts/ImageModal/partials/ImageModalDtv.html',

        replace: true,

        link: function (scope, element, attr) {
            var key = Date.now(),
                formData,
                img = element.find('img')[0],
                supportedFileType = [ 'image/jpg',
                                      'image/jpeg',
                                      'image/png',
                                      'image/gif',
                                      'image/bmp'];

            var previewImage = function (file) {
                    // Check if
                    if (file) {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        // Called when after readAsDataURL on fileReader
                        fileReader.onloadend = function (res) {
                            img.src = res.target.result;
                        };
                        scope.hasImage = true;
                    } else if (scope.imageSrc){
                        img.src = scope.imageSrc;

                        scope.hasImage = true;
                    }
                },
                init = function () {
                    var storedImageSrc = localStorage.getItem(attr.id);

                    if (storedImageSrc) {
                        if (storedImageSrc != 'null') {
                            scope.imageSrc = storedImageSrc;
                        } else {
                            scope.imageSrc = null;
                        }
                    }

                    // Check if there's an image src from imageOptions
                    if (scope.imageSrc) {
                        // Then preview the image
                        previewImage();
                    }
                },
                saveToLocalStorage = function (dataUri) {
                    localStorage.setItem(attr.id, dataUri);
                },
                dataURItoBlob = function (dataURI) {
                    // convert base64/URLEncoded data component to raw binary data held in a string
                    var byteString;
                    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                        byteString = atob(dataURI.split(',')[1]);
                    } else {
                        byteString = unescape(dataURI.split(',')[1]);
                    }

                    // separate out the mime component
                    var mimeString = dataURI
                        .split(',')[0]
                        .split(':')[1]
                        .split(';')[0];

                    // write the bytes of the string to a typed array
                    var ia = new Uint8Array(byteString.length);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }

                    return new Blob([ia], {type:mimeString});
                };

            /* Called when image file has change from fileUploader directive */
            scope.onImageChange = function (files) {
                 var file = files[0];

                 if (supportedFileType.indexOf(file.type) != -1 ) {

                    var fileReader = new FileReader(),
                        imgChecker = new Image();

                    fileReader.readAsDataURL(file);

                    // Called when after readAsDataURL on fileReader
                    fileReader.onloadend = function (res) {
                        imgChecker.src = res.target.result;
                    };

                    // Called when dataUrl loaded on the imgChecker
                    imgChecker.onload = function() {
                        // Show Image cropper
                        ImageModalService
                            .show({
                                "src": imgChecker.src,
                                "isZoomable": scope.isZoomable
                            })
                            .then(function (result) {

                                img.src = result;

                                if (scope.isUploadable) {
                                    saveToLocalStorage(result);
                                }

                                scope.hasImage = true;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                } else {
                    // Throw file not supported error
                    alert('File type not supported');
                }
            };

            scope.onImageClick = function () {
                // Show Image cropper
                ImageModalService
                    .show({
                        "src": img.src,
                        "isZoomable": scope.isZoomable
                    })
                    .then(function (result) {
                        // Do nothing
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            };

            scope.removeImage = function () {
                scope.imageSrc = null;

                img.src = '';
                scope.hasImage = false;

                localStorage.setItem(attr.id, 'null');
            };

            // Initialize
            init();
        }
    }
}]);