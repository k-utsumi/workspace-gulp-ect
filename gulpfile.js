var
  browserSync = require("browser-sync"),
  gulp        = require("gulp"),

  concat      = require("gulp-concat"),    // ファイル連結
  ect         = require("gulp-ect"),       // テンプレートエンジン
  imagemin    = require("gulp-imagemin"),  // 画像圧縮
  sass        = require("gulp-sass"),
  minifycss   = require("gulp-minify-css"),
  uglify      = require("gulp-uglify"),    // JS 圧縮


  path = {
    bower  : "bower_components/",
    src    : "source/",
    dist   : "htdocs/",
    assets : "assets/",
  },


  conf = {

    // サイト全体で使用する変数
    ectData: {

      // ファイルごとに設定するため参照直前で設定
      pageID      : "", // ナビゲーションのカレント設定用
      pagePath    : "", // 現在のページ URL 指定用

      pathAssets  : "/" + path.assets,

      siteTitle   : "xxxxxxxxxxSite_Namexxxxxxxxxx",
      siteURL     : "http://xxxxxxxxxx.com/",
      fbAppID     : "",
      ogImage     : "/" + path.assets + "images/og-image.png",
    },

    // JS の連結・圧縮対象ファイル
    concatTargetJS: [
      path.src + "js/**/*.js",
    ],

    sassOption: {
      style: "compressed",
    }
  };




gulp.task("default", ["js", "sass", "ect", "watch", "browser-sync"]); // 通常時
gulp.task("all", ["init", "js", "sass", "imagemin", "ect", "watch", "browser-sync"]); // 全部
gulp.task("out", ["init", "js", "sass", "imagemin", "ect"]); // 書き出しのみ

// _init 内のファイルを path.dis 内に格納 ＋ α
gulp.task("init", function() {
  gulp.src(path.src + "_init/**/*.*")
    .pipe(gulp.dest(path.dist));
});

// JS ファイルを結合・圧縮
gulp.task("js", function() {
  return gulp.src(conf.concatTargetJS)
    .pipe(concat("script.js"))
    .pipe(uglify({preserveComments: "some"})) // Licence 表記を消さない
    .pipe(gulp.dest(path.dist + path.assets + "js"));
});

// Sass のコンパイル
gulp.task("sass", function() {
  return sass(path.src + "sass/*.scss", conf.sassOption)
    .on("error", sass.logError)
    .pipe(gulp.dest(path.dist + path.assets + "css"));
});

// 画像の圧縮
gulp.task("imagemin", function() {
  return gulp.src([
          path.src + "images/**/*.+(jpg|jpeg|png|gif|svg)",
    "!" + path.src + "images/_*/*.+(jpg|jpeg|png|gif|svg)", // _ から始まるディレクトリは無視
  ])
  .pipe(imagemin({optimizationLevel: 7}))
  .pipe(gulp.dest(path.dist + path.assets + "images"));
});

// テンプレートから HTML ファイルを生成
gulp.task("ect", function() {
  return gulp.src([
            path.src + "ect/**/*.ect",
      "!" + path.src + "ect/**/_*.ect", // _ から始まるファイルは無視
      "!" + path.src + "ect/_*/*.ect"   // _ から始まるディレクトリは無視
    ])
    .pipe(ect({data: function(filename, cb) {

      var temp =
        conf.ectData.pageID = filename.replace(path.src + "ect/",""); // ページ ID を設定

      // pagePath を設定 - index ページの場合はファイル名を含めない
      conf.ectData.pagePath =
        temp == "index" ?
          temp.replace("index", "") :
          temp + ".html";

      console.log(filename); // エラーファイルの検出用
      cb(conf.ectData);
    }}))
    .pipe(gulp.dest(path.dist));
});

// 監視ファイルと実行タスクの設定
gulp.task("watch", function() {
  gulp.watch(path.src + "js/**/*.js", [ "js", browserSync.reload ]);
  gulp.watch(path.src + "sass/**/*.scss", [ "sass", browserSync.reload ]);
  gulp.watch(path.src + "images/**/*.+(jpg|jpeg|png|gif|svg)", [ "imagemin", browserSync.reload ]);

  gulp.watch(path.src + "ect/**/*.ect", [ "ect" ]);
  // ect のタイムラグ対策に html ファイルが更新されたらリロードさせる
  gulp.watch(path.dist + "**/**/*.html", [ browserSync.reload ]);
});

// ブラウザシンク
gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: path.dist,
      directory: false, // ディレクトリ詳細 or index 相当ページの表示設定
    }
  });
});
