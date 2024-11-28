import fs from 'fs';
import path from 'path';

import { src, dest, watch, series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import rename from '@sequencemedia/gulp-rename'
import fonter from 'gulp-fonter-unx';
import ttf2woff2 from 'gulp-ttf2woff2';
import { deleteAsync } from 'del';
import babel from 'gulp-babel';
import fileInclude from 'gulp-file-include';
import svgSprite from 'gulp-svg-sprite';
import fontfaceGen from 'gulp-fontfacegen-extended'
import browserslist from 'browserslist';

import svgSpriteConfig from './sprite.config.js';

const sassCompiler = gulpSass(sass);
const bs = browserSync.create();

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const paths = {
  styles: {
    src: 'src/styles/main.scss',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  },
  html: {
    src: 'src/*.html',
    dest: 'assets/'
  },
  htmlIncludes: {
    src: 'src/html/**/*.html'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png,svg,gif}',
    dest: 'assets/images/'
  },
  svg: {
    src: 'src/images/svg/*.svg',
    dest: 'assets/images/',
  },
  svgIcons: {
    src: 'src/images/svg/icons/*.svg',
    dest: 'assets/images/'
  },
  fonts:{
    src:'src/fonts/*.ttf',
    dest:'assets/fonts/'
  },
  library:{
    src:'src/library/**/*.*',
    dest:'assets/library/'
  },
};

export function clean() {
  return deleteAsync(['assets']);
}

export function styles() {
  ensureDir(path.dirname(paths.styles.dest));
  
  return src(paths.styles.src)
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(postcss([autoprefixer({ overrideBrowserslist: browserslist() })]))
    .pipe(dest(paths.styles.dest))
    .pipe(bs.stream())
    .on('end', () => console.log('Styles task completed successfully'));
}

export function scripts() {
  ensureDir(path.dirname(paths.scripts.dest));

  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest(paths.scripts.dest))
    .pipe(bs.stream());
}

export function html() {
  return src(paths.html.src)
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest(paths.html.dest))
    .pipe(bs.stream());
}

export function images() {
    return src([paths.images.src, `!${paths.svgIcons.src}`], { encoding: false })
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationLevel: 5
    })))
      .pipe(dest(paths.images.dest))
      .pipe(bs.stream());
  }

export function svgSpriteTask() {
    return src(paths.svgIcons.src)
      .pipe(svgSprite(svgSpriteConfig))
      .pipe(dest(paths.svgIcons.dest));
  }

  export function fonts() {
    return src([paths.fonts.src],{
      encoding: false,
      removeBOM: false,
    })
    .pipe(fonter({
      formats: ['woff']
    }))
    .pipe(dest(paths.fonts.dest))
    .pipe(ttf2woff2())
    .pipe(dest(paths.fonts.dest))
    .pipe(fontfaceGen({
          filepath: "./assets/styles",
          filename: "fonts.css",
          destpath: "../fonts",
       })
  )
  }

  export function library() {
    return src(paths.library.src)
      .pipe(dest(paths.library.dest))
      .pipe(bs.stream());
  }

  export function serve() {
    bs.init({
      server: {
        baseDir: paths.html.dest
      }
    });
  
    watch('src/styles/**/*.scss', styles);
    watch(paths.scripts.src, scripts);
    watch([paths.html.src, paths.htmlIncludes.src], html);
    watch(paths.images.src, images);
    watch(paths.svgIcons.src, svgSpriteTask);
  }

const build = series(clean, parallel(styles, scripts, html, images, svgSpriteTask, fonts, library));
export default series(build, serve);
