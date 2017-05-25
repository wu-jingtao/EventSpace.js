const gulp = require("gulp");
const ts = require("gulp-typescript").createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require("webpack");
const webpack_config = require('./webpack.config');

//编译TS代码
gulp.task("compile", function () {
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('bin'));
});

//打包web版
gulp.task('package', function (done) {
    gulp.src('./src/Browser/**/*.d.ts')
        .pipe(gulp.dest('./bin/browser/'))

    webpack(webpack_config, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error(err);
        }
        done();
    });
})