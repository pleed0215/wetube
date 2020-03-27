import gulp from "gulp";
import gpug from "gulp-pug"
import del from "del";
import ghpages from "gulp-gh-pages";
import ws from "gulp-webserver";
import image from "gulp-image"; // 이미지 최적화를 위한 gulp
import sass from "gulp-sass"; // sass를 컴파일 위해. sass를 css로 컴파일.
import autop from "gulp-autoprefixer"; // css를 여러 브라우저에서 사용할 수 있게끔 만들어준다.
import csso from "gulp-csso"; // css를 한 줄로 .. 
import browserify from "gulp-bro"; // browserify 사용을 위함. import 같은 문법을 브라우저는 이해를 못하므로.. 사용하는 것이라 한다.
import babelify from "babelify"; // babelify 


sass.compiler = require('node-sass');

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug", // 하위 폴더 안까지. **/*.pug,
        dest: "dest"
    },
    img: {
        src: "src/img/*",
        dest: "dest/img"   
    },
    css: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "dest/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "dest/js"
    }
}

const pug = () => gulp
                    .src(routes.pug.src)
                    .pipe(gpug())
                    .pipe(gulp.dest(routes.pug.dest));
const clean = () => del(["dest/"]);
const webserver = () => gulp.src("dest").pipe(ws({livereload: true, open: true}));

const watch = () => {
    gulp.watch (routes.pug.watch, pug);
    gulp.watch (routes.img.src, img);
    gulp.watch (routes.css.watch, styles);
    gulp.watch (routes.js.watch, js);
};

const img = () => gulp
                    .src(routes.img.src)
                    .pipe(image())
                    .pipe(gulp.dest(routes.img.dest));
const styles = () => gulp
                    .src(routes.css.src)
                    .pipe(autop ( { cascade: false }))
                    /*.pipe(csso({
                        restructure: true,
                        sourceMap: true,
                        debug: true
                    }))*/
                    .pipe(sass().on('error', sass.logError))
                    .pipe(csso())
                    .pipe(gulp.dest(routes.css.dest));
const js = () => gulp.src (routes.js.src)
                     .pipe(browserify({
                        transform: [
                            babelify.configure ( {presets: ['@babel/preset-env']}),
                            ['uglifyify', {global: true} ]
                        ]
                     } ))
                     .pipe (gulp.dest (routes.js.dest));

const ghDeploy = () => gulp.src ("dest/**/*")
                            .pipe (ghpages());
                

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const postDev = gulp.parallel([webserver, watch]);


export const build = gulp.series([prepare, assets]);
export const dev =  gulp.series([build, postDev]); // build를 먼저하고 dev에서는 prepare를 빼는것도 고려.
export const deploy = gulp.series([build, ghDeploy]);