"use strict";

const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const flatten = require("gulp-flatten");
sass.compiler = require("node-sass");
var pxtoviewport = require('postcss-px-to-viewport');
var postcss = require('gulp-postcss');
var processors = [
  pxtoviewport({
      viewportWidth: 750,
      viewportUnit: 'vw'
  })
];

function sass_complie(cb) {
  return src("./templates/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(postcss(processors))
    .pipe(flatten())
    .pipe(dest("./static/css"));
}
watch('./templates/**/*.scss', sass_complie);
module.exports = { sass_complie };
