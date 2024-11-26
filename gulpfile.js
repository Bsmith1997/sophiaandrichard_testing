const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const minifyCss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const gulpif = require('gulp-if');
const revReplace = require('gulp-rev-replace');
const useref = require('gulp-useref');
const rev = require('gulp-rev');
const htmlmin = require('gulp-htmlmin');

// delete everything in the dist folder
function cleanDist() {
    return del(['dist/**/*']);
}

// copy over images, fonts, and other static files
function copyFiles() {
    const imgs = gulp.src('app/images/**/*')
        .pipe(gulp.dest('dist/images'));

    // copy and minify css files
    const cssFiles = ['app/css/swipebox.css', 'app/css/style-v2.css', 'app/css/style-responsive-v2.css'];
    const css = gulp.src(cssFiles)
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));

    const preMinifiedCss = gulp.src('app/css/animate.min.css')
        .pipe(gulp.dest('dist/css'));

    const fonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    // copy over minified JS files
    const minifiedJSArray = [
        'app/js/minified/SmoothScroll.min.js', 
        'app/js/minified/classie.min.js',
        'app/js/minified/jquery.nav.min.js', 
        'app/js/minified/jquery.swipebox.min.js', 
        'app/js/minified/expandableGallery.min.js', 
        'app/js/minified/jquery.counterup.min.js',
        'app/js/minified/jquery-css-transform.min.js', 
        'app/js/minified/jquery-animate-css-rotate-scale.min.js',
        'app/js/minified/jquery.quicksand.min.js', 
        'app/js/minified/headhesive.min.js',
        'app/js/minified/scrollReveal.min.js', 
        'app/js/minified/jquery.countdown.min.js'
    ];
    
    const preMinifiedJS = gulp.src(minifiedJSArray)
        .pipe(gulp.dest('dist/js/minified'));

    const jsFiles = gulp.src(['app/js/modernizr.js', 'app/js/v2.js', 'app/js/jquery.stellar.js', 'app/js/scripts.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    const uiBootstrap = gulp.src('app/js/ui-bootstrap/ui-bootstrap-custom-tpls-2.0.1.tak.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/ui-bootstrap'));

    const templates = gulp.src('app/app/**/*.html')
        .pipe(htmlmin({ removeComments: true, collapseWhitespace: true, conservativeCollapse: true }))
        .pipe(gulp.dest('dist/app'));

    return merge(imgs, css, preMinifiedCss, preMinifiedJS, uiBootstrap, jsFiles, templates, fonts);
}

// build the HTML
function buildHtml() {
    const condition = function (file) {
        const filesToRev = {
            'vendor.css': true,
            'app.js': true,
            'vendor.js': true,
            'app.css': true
        };
        return filesToRev[file.basename];
    };

    return gulp.src('app/index.html')
        .pipe(useref()) // Concatenate with gulp-useref
        .pipe(gulpif('app/*.js', ngAnnotate()))
        .pipe(gulpif('app/*.js', uglify()))
        .pipe(gulpif('css/*.css', minifyCss())) // Minify vendor CSS sources
        .pipe(gulpif(condition, rev())) // Rename the concatenated files
        .pipe(revReplace()) // Substitute in new filenames
        .pipe(gulp.dest('dist'));
}

// minify index HTML
function minifyIndexHtml() {
    return gulp.src('dist/index.html')
        .pipe(htmlmin({ removeComments: true }))
        .pipe(gulp.dest('dist'));
}

// register tasks
gulp.task('clean-dist', cleanDist);
gulp.task('copy-files', copyFiles);
gulp.task('build-html', buildHtml);
gulp.task('minify-index-html', minifyIndexHtml);

// define build task using series and parallel
gulp.task('build', gulp.series(
    'clean-dist',
    gulp.parallel('copy-files'),
    'build-html',
    'minify-index-html'
));