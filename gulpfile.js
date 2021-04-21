"use strict";

const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const flatten = require("gulp-flatten");
sass.compiler = require("node-sass");

function sass_complie(cb) {
  return src("./templates/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(flatten())
    .pipe(dest("./static/css"));
}
watch('./templates/**/*.scss', sass_complie);
module.exports = { sass_complie };
