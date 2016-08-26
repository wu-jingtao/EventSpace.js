/**
 * Created by wujingtao on 2016/8/26 0026.
 */

var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
    return gulp.src("src/*.js")
        .pipe(babel())
        .pipe(gulp.dest("bin"));
});