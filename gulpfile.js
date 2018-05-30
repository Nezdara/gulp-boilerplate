"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({stream: true}));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch('sass/**/*.scss', ["style"]);
  gulp.watch('*.html', function(obj) {
    if (obj.type === 'changed') {
      gulp.src( obj.path, { "base": "."})
      .pipe(gulp.dest('build'))
      .pipe(server.reload({stream: true}));
    }
  });
  gulp.watch('js/**/*.js', function(obj) {
    if (obj.type === 'changed') {
      gulp.src( obj.path, { "base": "."})
      .pipe(gulp.dest('build'))
      .pipe(server.reload({stream: true}));
    }
  });
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{otf,ttf,woff,woff2,eot}",
      "img/**/*.{jpg,png,svg,gif}",
      "js/**",
      "css/vendor/**",
      "*.ico",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    fn
  );
});
