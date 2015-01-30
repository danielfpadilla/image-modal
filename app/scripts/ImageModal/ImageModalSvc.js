/**
* ImageModalSvc Module
*
* Description
*/
angular.module('ImageModalSvc', [])

.factory('ImageModalService',
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

        dialogTemplate = 'scripts/ImageModal/partials/ImageModalSvc.html',

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