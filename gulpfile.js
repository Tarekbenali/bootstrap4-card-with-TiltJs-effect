//Importing dependencies
const gulp = require("gulp"),
      autoprefixer = require("gulp-autoprefixer"),
      browserSync = require("browser-sync").create(),
      sass = require("gulp-sass"),
      cleanCSS = require("gulp-clean-css"),
      del = require("del"),
      htmlmin = require("gulp-htmlmin"),
      imagemin = require("gulp-imagemin"),
      uglify = require("gulp-uglify");

//Declaring Paths
const paths = {
  css: {
    src: "./src/scss/*.scss",
    dest: "./dist/css"
  },
  js: {
    src: "./src/*.js",
    dest: "./dist/js"
  },
  html: {
    src: "./src/*.html",
    dest: "./dist/"
  },
  images: {
    src: "./src/images/*.+(png|jpg|jpeg|gif|svg)",
    dest: "./dist/images",
  },
  bootstrap: {
    Btsrp_Css: "node_modules/bootstrap/dist/css/bootstrap.min.css",
    Btsrp_Js: "node_modules/bootstrap/dist/js/bootstrap.min.js",
    Btsrp_Jq: "node_modules/jquery/dist/jquery.slim.js",
    Btsrp_popr: "node_modules/popper.js/dist/umd/popper.min.js"
  },
  tilt: {
    src: "node_modules/tilt.js/dest/tilt.jquery.js"    
  },
  fonts: {
    src:  [
      "./node_modules/@fortawesome/fontawesome-free/**/*",
      "!./node_modules/@fortawesome/fontawesome-free/{less,less/*}",
      "!./node_modules/@fortawesome/fontawesome-free/{scss,scss/*}",
      "!./node_modules/@fortawesome/fontawesome-free/.*",
      "!./node_modules/@fortawesome/fontawesome-free/*.{txt,json,md}"
    ],
    dest:"./dist/fonts/font-awesome"
  },
  
};

// Fonts Awesome
function custom_fonts() {
  return (
    gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
      
    );}

// BrowserSync init
function serve(done) {
    browserSync.init({
      server: {
        baseDir: "./dist/"
      },
      port: 8080
    });
    done();
}

// BrowserSync Reload
function reload(done) {
    browserSync.reload();
    done();
}

//Compiling & Moving Custom SASS Files
function custom_sass() {
  return (
    gulp
      .src([
        paths.bootstrap.Btsrp_Css])
      .pipe(gulp.dest(paths.css.dest))
  );
}

function custom_sass2() {
  return (
    gulp
      .src(paths.css.src)
      .pipe(sass({ outputStyle: "expanded" }))
      .on("error", sass.logError)
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
           flexbox: `no-2009` ,
           cascade: false
      })
      )
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.css.dest))
  );
}

//Custom Scripts
function custom_js() {
  return (
    gulp
      .src([
        paths.bootstrap.Btsrp_Js,
        paths.bootstrap.Btsrp_Jq,
        paths.bootstrap.Btsrp_popr,
        paths.tilt.src
      ])
      .pipe(gulp.dest(paths.js.dest))
  );
}

function custom_js2() {
  return (
    gulp
      .src(paths.js.src)
      .pipe(uglify())
      .pipe(gulp.dest(paths.js.dest))
  );
}

//custom html pages
function custom_html() {
  return gulp
    .src(paths.html.src)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest(paths.html.dest));
}


//custom images
function custom_images() {
  return gulp
    .src(paths.images.src)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ],
      {
        verbose: true
      }))
    .pipe(gulp.dest(paths.images.dest));
}

// clean ./dist folder 
function clean() {
  return del(["dist"]);

}

//Watching File
function watch() {
  gulp.watch(paths.css.src, gulp.series(custom_sass2, reload));
  gulp.watch(paths.images.src, gulp.series(custom_images, reload));
  gulp.watch(paths.js.src, gulp.series(custom_js2, reload));
  gulp.watch(paths.html.src, gulp.series(custom_html, reload));
}

// building files 
const build = gulp.series(
    clean,
    custom_js,
    custom_js2,
    custom_fonts,
    custom_html,
    gulp.parallel(custom_sass, custom_sass2),
    custom_images,
    gulp.parallel(serve, watch)
);
gulp.task(build);
gulp.task("default", build);
