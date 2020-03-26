import gulp from "gulp";
import gpug from "gulp-pug"
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autop from "gulp-autoprefixer";
import csso from "gulp-csso";
import browserfy from "gulp-bro";
import babelify from "babelify";

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
        src: "src/js/*",
        dest: "dest/js"
    }
}

const pug = () => gulp
                    .src(routes.pug.src)
                    .pipe(gpug())
                    .pipe(gulp.dest(routes.pug.dest));
const clean = () => del(["dest"]);
const webserver = () => gulp.src("dest").pipe(ws({livereload: true, open: true}));

const watch = () => {
    gulp.watch (routes.pug.watch, pug);
    gulp.watch (routes.img.src, img);
    gulp.watch (routes.css.watch, styles);
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
                     .pipe

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles]);
const postDev = gulp.parallel([webserver, watch]);


export const dev =  gulp.series([prepare, assets, postDev]);