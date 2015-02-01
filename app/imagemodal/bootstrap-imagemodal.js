angular.module('schemaForm')
.run(['$templateCache',
      function($templateCache) {
    $templateCache
        .put('directives/decorators/bootstrap/imagemodal/imagemodal.html',
            '<div class="form-group" ng-class="{\'has-error\': hasError()}">' +
            '<label class="control-label">{{form.title}}</label>' +
            '    <img' +
            '        name="{{form.key}}"' +
            '        class="form-control"' +
            '        schema-validate="form"' +
            '        ng-model="$$value$$"' +
            '        image-modal' +
            '        image-is-zoomable="form.enableZoom"' +
            '        image-is-uploadable="form.enableUpload"' +
            '        image-is-removable="form.enableRemove">' +
            '    <span class="help-block">' +
            '        {{ (hasError() && errorMessage(schemaError())) || form.description}}' +
            '    </span>' +
            '</div>');
}])
.config(['schemaFormProvider',
         'schemaFormDecoratorsProvider',
         'sfPathProvider',
         function(schemaFormProvider,
                  schemaFormDecoratorsProvider,
                  sfPathProvider) {

    var imagemodal = function(name, schema, options) {
        if (schema.type === 'imagemodal' && schema.format === 'image') {
            var f = schemaFormProvider.stdFormObj(name, schema, options);
            f.key = options.path;
            f.type = 'imagemodal';
            options.lookup[sfPathProvider.stringify(options.path)] = f;
            return f;
        }
    };

    schemaFormProvider.defaults.string.unshift(imagemodal);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider
        .addMapping('bootstrapDecorator',
                    'imagemodal',
                    'directives/decorators/bootstrap/imagemodal/imagemodal.html');
    schemaFormDecoratorsProvider
        .createDirective('imagemodal',
        'directives/decorators/bootstrap/imagemodal/imagemodal.html');
}]);