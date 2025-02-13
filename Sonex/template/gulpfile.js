var gulp = require("gulp");
var pug = require("gulp-pug");
var stylus = require("gulp-stylus");
var postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var uncss = require("gulp-uncss");
var imagemin = require("gulp-imagemin");
var autoprefixer = require("autoprefixer");
var perfectionist = require("perfectionist");
var prettify = require("gulp-html-prettify");
var concat = require("gulp-concat");
var tinypng = require("gulp-tinypng");

var src = "./src/";
var dist = "./dist/";

// Pug
gulp.task("pug", function () {
  return gulp
    .src([src + "pug/*.pug", "!" + src + "pug/layout/*.pug"])
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(
      pug({
        pretty: "\t",
      })
    )
    .pipe(gulp.dest(dist));
});

// Stylus
gulp.task("stylus", function () {
  var processors = [autoprefixer, perfectionist];
  return gulp
    .src([src + "styl/*.styl"])
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(stylus())
    .pipe(postcss(processors))
    .pipe(gulp.dest(dist + "css"));
});

// Uncss
gulp.task("uncss", function () {
  return gulp
    .src(dist + "css/*.css")
    .pipe(
      uncss({
        html: [dist + "*.html"],
      })
    )
    .pipe(gulp.dest(dist + "uncss"));
});

// Imagemin
gulp.task("imagemin", function () {
  return gulp
    .src(src + "img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest(dist + "img"));
});

// HTML Prettify
gulp.task("prettify", function () {
  return gulp
    .src(dist + "*.html")
    .pipe(
      prettify({
        indent_char: "\t",
        indent_size: 1,
      })
    )
    .pipe(gulp.dest(dist));
});

// JS Concat
gulp.task("concatjs", function () {
  return gulp
    .src([src + "js/*.js", "!" + src + "js/functions.js"])
    .pipe(concat("plugins.min.js"))
    .pipe(gulp.dest(dist + "js"));
});

// Watch
gulp.task("watch", function () {
  gulp.watch(src + "pug/*.pug", ["pug"]);
  gulp.watch(src + "styl/*.styl", ["stylus"]);
});

// TinyPNG
gulp.task("tinypng", function () {
  return gulp
    .src(src + "img/**/*.png")
    .pipe(tinypng("PqKQpry0jDgslSo32t_IEdE-1TJZjuZ1"))
    .pipe(gulp.dest(dist + "img"));
});

// Default
gulp.task("default", ["pug", "stylus", "concatjs", "prettify", "watch"]);
