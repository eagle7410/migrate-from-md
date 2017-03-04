"use strict";
let gulp = require('gulp'), // Сообственно Gulp JS
	concat = require('gulp-concat'), // Склейка файлов
	cssmin = require('gulp-cssmin'); // Мініфикатор

gulp.task('css', () => gulp.src([
		'./static/bower/bootstrap/dist/css/bootstrap.css',
		'./static/bower/bootstrap/dist/css/bootstrap-theme.css',
		'./static/bower/font-awesome/css/font-awesome.min.css',
		'./static/css/main.c9f2eb14.css'
	])
	.pipe(concat('app.css'))
	.pipe(cssmin())
	.pipe(gulp.dest('./static/build/css'))
);

gulp.task('default', ['css']);
