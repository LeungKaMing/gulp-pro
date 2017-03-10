var gulp = require("gulp");
var babel = require("gulp-babel");    // 用于ES6转化ES5
var uglify = require('gulp-uglify'); // 用于压缩 JS
var sass = require('gulp-sass'); //scss编译
var rev = require('gulp-rev'); //rev hash码
var reCollector = require('gulp-rev-collector'); //
var clean = require('gulp-clean');//清空文件夹里所有的文件

// ES6转化为ES5
// 在命令行使用 gulp toes5 启动此任务
gulp.task("toes5", () => {
    return gulp.src("src/js/*.js")// ES6 源码存放的路径
        .pipe(babel())
        .pipe(gulp.dest("dist/js")); //转换成 ES5 存放的路径
});

//scss编译
gulp.task('css', () => {
    gulp.src('src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'               //编译并输出压缩过的文件
        }))
        .pipe(rev())                                //给css添加哈希值
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())                       //给添加哈希值的文件添加到清单中
        .pipe(gulp.dest('rev/css'));
});
//压缩js
gulp.task('js', () => {
    gulp.src('src/js/*.js')
        .pipe(babel()) //转换成 ES5 
        .pipe(uglify()) //压缩js
        .pipe(rev()) //给js添加哈希值
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest()) //给添加哈希值的文件添加到清单中
        .pipe(gulp.dest('rev/js'));
});

//将处理过的css，js引入html
gulp.task('reCollector', () => {
    gulp.src(['rev/**/*.json', 'src/html/*.html', 'src/html/**/*.html'])
        .pipe(reCollector({
            replaceReved: true,  //模板中已经被替换的文件是否还能再被替换,默认是false
            dirReplacements: {   //标识目录替换的集合, 因为gulp-rev创建的manifest文件不包含任何目录信息,
                'css/': 'css/',
                'js/': 'js/'
            }
        }))
        .pipe(gulp.dest('dist/html'))
});

//每次打包时先清空原有的文件夹
gulp.task('clean', () => {
    gulp.src(['dist', 'rev'], {read: false}) //这里设置的dist表示删除dist文件夹及其下所有文件
        .pipe(clean());
});