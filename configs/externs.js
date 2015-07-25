/*
 Externs definitions for Google Closure Compiler.
 @link https://developers.google.com/closure/compiler/docs/api-tutorial3
 */

/**
 * @type {Object}
 */
var proj4;

/**
 * @type {function(string, ...)}
 */
proj4.defs;

/**
 * @constructor
 */
var Emitter = function () {
};

/** @type {function(string, ...)} */
Emitter.prototype.emit;

/** @type {function(string, ...)} */
Emitter.prototype.on;

/** @type {function(string, ...)} */
Emitter.prototype.once;

/** @type {function(string, ...)} */
Emitter.prototype.off;

/** @type {function(string, ...)} */
Emitter.prototype.emit;

/** @type {function(function())} */
Emitter.prototype.hook;

/** @type {function(function())} */
Emitter.prototype.unhook;
