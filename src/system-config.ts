// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  "admin-lte": "vendor/admin-lte",
  "font-awesome": "vendor/font-awesome",
  "pace": "vendor/pace",
  "jQuery": "vendor/admin-lte/plugins/jQuery",
  "angular2-modal": "vendor/angular2-modal",
  "select2": "vendor/admin-lte/plugins/select2",
  "ng2-charts": "vendor/ng2-charts",
  "chart.js": "vendor/chart.js",
  'canvas-to-blob': 'vendor/bootstrap-fileinput/js/plugins',
  'fileinput': 'vendor/bootstrap-fileinput/js',
  'bootstrap-slider': 'vendor/admin-lte/plugins/bootstrap-slider',
  'lodash': 'vendor/lodash',
  '@types': 'vendor/@types',
  'underscore': 'vendor/underscore',
  'tooltipster': 'vendor/tooltipster/dist',
};
/** User packages configuration. */
const packages: any = {
  "admin-lte": { defaultExtension: 'js', main: 'dist/js/app.min' },
  "font-awesome": {},
  "pace": { main: 'pace' },
  "jQuery": { defaultExtension: 'js', main: "jQuery-2.2.0.min" },
  "openlayers": { defaultExtension: 'js', main: "dist/ol.js" },
  'angular2-modal': { defaultExtension: 'js', main: 'index' },
  'angular2-modal/plugins/bootstrap': { defaultExtension: 'js', main: 'index' },
  'select2': { main: 'select2.full.min', defaultExtension: 'js' },
  'ng2-charts': { main: 'ng2-charts', defaultExtension: 'js' },
  'chart.js': { main: 'Chart.bundle.min', defaultExtension: 'js' },
  'canvas-to-blob': { main: 'canvas-to-blob.min', defaultExtension: 'js' },
  'fileinput': { main: 'fileinput.min', defaultExtension: 'js' },
  'lodash': { main: 'lodash.js', defaultExtension: 'js' },
  'underscore': { main: 'underscore-min.js', defaultExtension: 'cjs' },
  "@types": {},
  'tooltipster': { main: 'js/tooltipster.bundle.min.js', defaultExtension: 'js' },
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  "@angular/upgrade",

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  /** @cli-barrel */
];

var cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js',
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
