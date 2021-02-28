const { series,src,dest,watch } = require('gulp');

function autoprefixer(){
    const autoprefixer = require('autoprefixer')
    const postcss = require('gulp-postcss')
    return src(['../../../static/css/*.css','../../../static/css/root/dist/root.css'])
           .pipe(postcss([ autoprefixer({
                overrideBrowserslist:["> 1%","last 2 versions","Firefox ESR"],
                cascade: false}) ]))
           .pipe(dest('../../../static/css/autoprefixer/'))
}

function watch_autoprefixer(){
    watch(['../../../static/css/*.css','../../../static/css/root/dist/root.css'],autoprefixer)
}




exports.watch_autoprefixer = watch_autoprefixer;