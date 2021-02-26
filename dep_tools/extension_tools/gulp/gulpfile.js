const { series,src,dest } = require('gulp');

function autoprefixer(){
    const autoprefixer = require('autoprefixer')
    const postcss = require('gulp-postcss')
    return src('../../static/css/*.css')
           .pipe(postcss([ autoprefixer({
                overrideBrowserslist:["> 1%","last 2 versions","Firefox ESR"],
                cascade: false}) ]))
           .pipe(dest('../../static/css/autoprefixer/'))
}

exports.autoprefixer = autoprefixer;