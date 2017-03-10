# gulp-pro
gulp入门指南,搭建Es6环境项目指南,可以预编译ES6,SCSS,压缩css,压缩js

- 这个项目最终想要得到的效果是可以预编译ES6,SCSS,压缩css,压缩js
- 首先确认已经安装好node, 检查是否安装 node -v 如果能看到版本,表示已经安装成功.

### 安装gulp
```
# 全局安装Gulp
$ npm install -g gulp
# 在项目中安装Gulp
$ npm install --save-dev gulp
```
- 运行gulp -v,如果不报错，表示安装成功.

### 新建项目目录,比如gulp-pro,在命令行中进入到改项目目录,执行
```bash
# 在项目中安装Gulp
$ npm install --save-dev gulp
# 让项目生产package.json文件
$ npm init
```

### 创建项目目录结构
```
-------------------gulp-pro
|   |
|   |--------------dist (该文件夹为打包生成的)
|   |   |----------css
|   |   |   |------index-xxxx.css
|   |   |----------js
|   |   |   |------index-xxxx.js
|   |   |----------html
|   |   |   |------index.html
|   |
|   |--------------src
|   |   |----------scss
|   |   |   |------index.scss
|   |   |----------js
|   |   |   |------index.js
|   |   |----------html
|   |   |   |------index.html
|   |
|   |--------------gulpfile.js
|   |--------------package.json
```

### 安装相关插件
```bash
# 安装 Gulp 上 Babel 的插件
$ npm install --save-dev gulp-babel
# 安装 Babel 上将 ES6 转换成 ES5 的插件
$ npm install --save-dev babel-preset-es2015
# 安装 Gulp 上 uglify 压缩插件
$ npm install --save-dev gulp-uglify
# 安装 Gulp 上 sass 插件
$ npm install --save-dev gulp-sass
# 安装 Gulp 上 clean 插件
$ npm install --save-dev gulp-clean
# 安装 Gulp 上 rev 插件
$ npm install --save-dev gulp-rev
# 安装 Gulp 上 rev-collector 插件 
$ npm install --save-dev gulp-rev-collector

```

### gulpfile.js 内容如下
```
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
```

### task执行命令
```bash
# gulp 任务名称
$ gulp toes5 //转为es5
$ gulp css //scss编译
$ gulp js //js压缩
$ gulp reCollector //替换html中的js/css文件
$ gulp clean //清空文件
```

### 说明

- 该文档是自己学习时的记录,如果错误欢迎留言指正,如有转载,请注明出处,谢谢.
