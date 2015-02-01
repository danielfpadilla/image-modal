'use strict';

/**
* imagemodal Module
*
* Description
*/
angular.module('schemaForm')

.run(['$templateCache',
      function($templateCache) {

    $templateCache.put('imagemodal.html',
        '<div' +
        '   class="image-modal-wrapper"' +
        '   ng-class="{' +
        '       uploading:isUploading' +
        '   }">' +
        '   <img' +
        '       ng-class="{clickable: !isUploadable}"' +
        '       ng-show="hasImage"' +
        '       ng-click="onImageClick(); $event.preventDefault()">' +
        '   <input' +
        '       ng-if="isUploadable"' +
        '       accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"' +
        '       type="file"' +
        '       file-reader' +
        '       on-file-change="onImageChange(files)">' +
        '   <span class="img-upload-label" ng-show="!hasImage"></span>' +
        '   <a' +
        '       class="is-removable"' +
        '       href=""' +
        '       ng-if="isRemovable && hasImage"' +
        '       ng-click="removeImage()">Remove</a>' +
        '</div>'
    );

    $templateCache.put('imagemodal-dialog.html',
        '<div' +
        '   class="image-dialog">' +
        '   <div class="image-dialog-vertical-center">' +
        '       <div class="image-dialog-body">' +
        '           <img' +
        '               id="thumb"' +
        '               class="md-card-image"' +
        '               ng-src="{{imgSrc}}">' +
        '       </div>' +
        '       <a' +
        '           href=""' +
        '           title="Close"' +
        '           class="close-btn"' +
        '           ng-click="onCloseOnMask($event); $event.preventDefault()">' +
        '           Close' +
        '       </a>' +
        '       <div class="button-holder">' +
        '           <md-button' +
        '               class="md-raised md-primary"' +
        '               ng-click="onDoneClick(); $event.preventDefault()">' +
        '               Done' +
        '           </md-button>' +
        '       </div>' +
        '   </div>' +
        '</div>'
    );
}])

// File change listener directive
.directive('fileReader',
           [function () {
    return {
        // Declared as attribute to activate
        restrict: 'A',

        // Scope values
        scope: {
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
}])

.directive('imageModal',
           ['imageModalService',
            function (imageModalService) {
    return {
        // Declared as attribute to initialize
        restrict: 'A',

        requires: 'ngModel',

        // Scope values
        scope: {
            imageSrc: '=ngModel',
            isUploadable: '=imageIsUploadable',
            isRemovable: '=imageIsRemovable',
            isZoomable: '=imageIsZoomable'
        },

        templateUrl: 'imagemodal.html',

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
                        imageModalService
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
                imageModalService
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
}])

.factory('imageModalService',
         ['$rootScope',
          '$animate',
          '$compile',
          '$timeout',
          '$templateCache',
          '$http',
          '$q',
          function ($rootScope,
                    $animate,
                    $compile,
                    $timeout,
                    $templateCache,
                    $http,
                    $q) {
    var /* Initialize isolated scope */
        scope = $rootScope.$new(true),

        /* Variable to store body element */
        body,

        /* Variable to hold template string to be compiled */
        dialogElem,

        dialogTemplate = 'imagemodal-dialog.html',

        buildDialog = function (template) {
            var dfd = $q.defer(),
                onResult = function (resultData) {
                    if (resultData) {
                        dfd.resolve(resultData);
                    } else {
                        dfd.reject('ImageModal Canceled');
                    }

                    dismissDialog();
                },
                initZoom = function () {
                    if (window.Magnifier && window.Event) {
                        var evt = new Event(),
                            magnifier = new Magnifier(evt);

                        magnifier.attach({
                            thumb: '#thumb',
                            large: scope.imgSrc,
                            mode: 'inside',
                            zoom: 3,
                            zoomable: true
                        });
                    }
                };

            scope.imgSrc = scope.options.src;

            /* Compiles the template string from $templateCache */
            dialogElem = $compile(template)(scope);

            /* Sanity check */
            if (!body) {
                body = document.getElementsByTagName('body');
            }

            /* Convert body element to angular element */
            body = angular.element(body);

            /* Append to body */
            body.append(dialogElem);

            if (scope.options.isZoomable) {
                setTimeout(function () {
                    var dialogBody =
                        document.getElementsByClassName('image-dialog-body');

                    if (dialogBody && dialogBody.length > 0) {
                        var bod = dialogBody[0],
                            imgElem = bod.getElementsByTagName('img');

                            if (imgElem && imgElem.length > 0) {
                                imgElem = imgElem[0];
                                bod.style.width = imgElem.width + 'px';
                            }
                    }

                    initZoom();
                }, 0);
            }

            /* Bind mask click */
            scope.onCloseOnMask = function ($event) {
                /* Sanity check */
                if (   $event
                    && $event.target
                    && $event.target.className) {
                    var className = $event.target.className;

                    /* Handle only parent container and close buton */
                    if (className == 'close-btn') {
                        dismissDialog();

                        dfd.reject('ImageModal Canceled');
                    }
                }
            };

            // Dialog done button is click
            scope.onDoneClick = function () {
                onResult(scope.options.src);
                dismissDialog();
            };

            return dfd.promise;
        },

        /* Shows the terms popup */
        showPopup = function (options) {
            var dfd = $q.defer(),
                template = $templateCache.get(dialogTemplate);

            scope.options = options ? options : new Object();

            if (template) {
                buildDialog(template)
                    .then(function (result) {
                        dfd.resolve(result);
                    })
                    .catch(function (error) {
                        dfd.reject(error);
                    });
            } else {
                $http.get(dialogTemplate)
                    .success(function (tpl) {
                        $templateCache.put(dialogTemplate, tpl);
                        buildDialog(tpl)
                            .then(function (result) {
                                dfd.resolve(result);
                            })
                            .catch(function (error) {
                                dfd.reject(error);
                            });
                    });
            }

            return dfd.promise;
        },

        /* Dismisses the dialog */
        dismissDialog = function () {
            if (dialogElem) {
                $animate.leave(dialogElem, function () {
                    dialogElem.remove();
                });
            }
        };

    return {
        /* Call this to show dialog */
        show: function (options) {
            return showPopup(options);
        },

        /* Call this to dismiss dialog */
        dismiss: function () {
            dismissDialog();
        }
    }
}]);