import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import jasmineReporter from 'jasmine-console-reporter';
import babelPolyfill from 'babel-polyfill';

// Load all plugins
const $ = gulpLoadPlugins();

const src = [
    './src/**/*.js',
    '!./src/**/*-spec.js',
    '!./src/**/*-spec-integration.js'
];
const srcCoverage = [
    './src/**/*.js',
    '!./src/**/*-spec.js',
    '!./src/**/*-spec-integration.js',
    '!./src/**/*-model.js',
    '!./src/**/*-schema.js'
];
const srcSpec = [
    './src/**/*-spec.js'
];
const srcSpecIntegration = [
    './src/**/*-spec-integration.js'
];

gulp.task('pre-test', function () {
   return gulp.src(srcCoverage)
       .pipe($.babelIstanbul())
       .pipe($.babelIstanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
   return gulp.src(srcSpec)
       .pipe($.jasmine({
          reporter: new jasmineReporter({
             colors: 1,
            cleanStack: 1,
            verbosity: 4,
            listStyle: 'indent',
            activity: false
         })
      }))
       .pipe($.babelIstanbul.writeReports({
          dir: './coverage',
          reporters: [ 'html', 'lcov' ]
       }))
       .pipe($.babelIstanbul.enforceThresholds({ thresholds: { global: 70 } }))
       .on('end', () => process.exit(0));
});

gulp.task('test:integration', () => {
    return gulp.src(srcSpecIntegration)
        .pipe($.jasmine({
            reporter: new jasmineReporter({
                colors: 1,
                cleanStack: 1,
                verbosity: 4,
                listStyle: 'indent',
                activity: false
            })
        }))
        .on('end', () => process.exit(0));
});

gulp.task('lint', () => {
   return gulp.src(src.concat(['!./src/test-utils.js']))
       .pipe($.jshint({esversion: 6}))
       .pipe($.jshint.reporter('jshint-stylish'))
       .pipe($.eslint())
       .pipe($.eslint.format())
       .pipe($.eslint.failAfterError())
       ;
});

gulp.task('compile', () => {
   return gulp.src(src)
       .pipe($.babel({ presets: ['es2015'] }))
       .pipe(gulp.dest('build'));
});

gulp.task('build', ['lint', 'compile']);

gulp.task('dev', ['build'], () => gulp.watch(src, ['build']));

gulp.task('dev:test', ['test'], () => gulp.watch(['./src/**/*.js'], ['test']));

gulp.task('default', ['build']);
