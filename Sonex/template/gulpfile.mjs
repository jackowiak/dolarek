import gulp from "gulp";
import pug from "gulp-pug";
import stylus from "gulp-stylus";
import postcss from "gulp-postcss";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import uncss from "gulp-uncss";
import imagemin from "gulp-imagemin";
import autoprefixer from "autoprefixer";
import perfectionist from "perfectionist";
import prettify from "gulp-html-prettify";
import concat from "gulp-concat";
import tinypng from "gulp-tinypng";
import browserSync from "browser-sync"; // Dodanie BrowserSync

const src = "./src/";
const dist = "./dist/";

// Pug
gulp.task("pug", function () {
  return gulp
    .src([src + "pug/*.pug", "!" + src + "pug/layout/*.pug"])
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(pug({ pretty: "\t" }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream()); // Odświeżenie po zmianach
});

// Stylus
gulp.task("stylus", function () {
  const processors = [autoprefixer, perfectionist];
  return gulp
    .src([src + "styl/*.styl"])
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(stylus())
    .pipe(postcss(processors))
    .pipe(gulp.dest(dist + "css"))
    .pipe(browserSync.stream()); // Odświeżenie po zmianach
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
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream()); // Odświeżenie po zmianach
});

// JS Concat
gulp.task("concatjs", function () {
  return gulp
    .src([src + "js/*.js", "!" + src + "js/functions.js"])
    .pipe(concat("plugins.min.js"))
    .pipe(gulp.dest(dist + "js"))
    .pipe(browserSync.stream()); // Odświeżenie po zmianach
});

// TinyPNG
gulp.task("tinypng", function () {
  return gulp
    .src(src + "img/**/*.png")
    .pipe(tinypng("PqKQpry0jDgslSo32t_IEdE-1TJZjuZ1"))
    .pipe(gulp.dest(dist + "img"));
});

// Serwer lokalny z browserSync (Hot reloading)
gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: dist, // Ścieżka do katalogu, który ma być serwowany
    },
    notify: false, // Wyłącza powiadomienia o połączeniu
    open: true, // Otwiera stronę w domyślnej przeglądarce
  });
});

// Watch (Wykonuje obserwowanie zmian w plikach)
gulp.task("watch", function () {
  gulp.watch(src + "pug/**/*.pug", gulp.series("pug")); // tylko źródłowe pliki Pug
  gulp.watch(src + "styl/**/*.styl", gulp.series("stylus")); // tylko źródłowe pliki Stylus
  gulp.watch(src + "js/**/*.js", gulp.series("concatjs")); // tylko źródłowe pliki JS
  gulp.watch(src + "img/**/*", gulp.series("imagemin")); // tylko źródłowe obrazy
});

// Default task (Uruchamia wszystkie taski)
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("pug", "stylus", "concatjs", "prettify"), // Najpierw kompilacja
    gulp.parallel("serve", "watch") // Potem uruchomienie serwera i watcherów
  )
);
