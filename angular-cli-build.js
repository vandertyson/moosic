var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

var Funnel = require('angular-cli/node_modules/broccoli-funnel');
var mergeTrees = require('angular-cli/node_modules/broccoli-merge-trees');

module.exports = function(defaults) {
    var lazyVendorFiles = [
        'admin-lte/plugins/jQuery/jQuery-2.2.0.min.js',
        'admin-lte/bootstrap/js/bootstrap.min.js',
        'admin-lte/dist/js/app.min.js',
        'admin-lte/dist/js/demo.js',
        'admin-lte/plugins/select2/select2.full.min.js',
        'eonasdan-bootstrap-datetimepicker/node_modules/moment/min/moment.min.js',
        'eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
        'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
        'chart.js/dist/Chart.bundle.min.js',
        'bootstrap-fileinput/js/fileinput.min.js',
        'bootstrap-fileinput/js/plugins/*.+(js)',
        'admin-lte/plugins/ionslider/ion.rangeSlider.min.js',
        'admin-lte/plugins/bootstrap-slider/bootstrap-slider.js',
        'underscore/underscore-min.js',
        'tooltipster/dist/css/tooltipster.bundle.min.css',
        'tooltipster/dist/js/tooltipster.bundle.min.js',
        'underscore.string/dist/underscore.string.min.js',
        'howler/dist/**/*.+(js)',
        'jquery-ui-1.12.1.custom/jquery-ui.min.+(js|css)',
        'CircularContentCarousel/**/*.+(js|css|png)'
    ];

    var appTree = new Angular2App(defaults, {
        vendorNpmFiles: [
            'systemjs/dist/system-polyfills.js',
            'systemjs/dist/system.src.js',
            'zone.js/dist/**/*.+(js|js.map)',
            'es6-shim/es6-shim.js',
            'reflect-metadata/**/*.+(ts|js|js.map)',
            'rxjs/**/*.+(js|js.map)',
            '@angular/**/*.+(js|js.map)',
            'admin-lte/**/*.+(js|js.map|css|woff|woff2|ttf|css.map)',
            'font-awesome/**/*.+(js|js.map|css|woff|woff2|ttf)',
            'pace/**/*.+(js|js.map|css)',
            'eonasdan-bootstrap-datetimepicker/node_modules/moment/min/moment.min.js',
            'eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
            'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
            'angular2-modal/**/*.+(js|js.map|ts)',
            'ng2-charts/**/*.+(js|js.map|ts)',
            'chart.js/dist/*.+(js|js.map)',
            'admin-lte/plugins/jQuery/jQuery-2.2.0.min.js',
            'bootstrap-fileinput/css/fileinput.min.css',
            'bootstrap-fileinput/img/*.+(gif)',
            'bootstrap-fileinput/js/fileinput.min.js',
            'bootstrap-fileinput/js/plugins/*.+(js)',
            'admin-lte/plugins/ionslider/**/*.+(js|js.map|css|png)',
            'admin-lte/plugins/bootstrap-slider/**/*.+(js|js.map|css)',
            'lodash/**/*.+(js|js.map|ts|css)',
            '@types/**/*.' + '(js|js.map|ts|css)',
            'underscore/**' + '(js|js.map|ts|css)',
            'morris.js-0.5.1/**/*' + '(js|js.map|ts|css)',
            'tooltipster/dist/css/tooltipster.bundle.min.css',
            'tooltipster/dist/js/tooltipster.bundle.min.js',
            'underscore.string/dist/underscore.string.min.js',
            'howler/dist/**/*.+(js)',
            'jquery-ui-1.12.1.custom/jquery-ui.min.+(js|css)',
            'CircularContentCarousel/**/*.+(js|css|png)',
        ].concat(lazyVendorFiles.slice())
    });

    var lazyVendorFilesTree = new Funnel('node_modules', {
        include: lazyVendorFiles.slice(),
        destDir: 'vendor'
    });

    return mergeTrees([lazyVendorFilesTree, appTree], {
        overwrite: true
    });
};