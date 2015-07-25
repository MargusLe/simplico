/**
 * app.js
 *
 * Setting up the configurations and orchestrating the modules.
 */

/*
 Application main module.
 */

requirejs(['../../vendor/eventist/lib/eventist'], function (emitter) {

  'use strict';

  var EMITTER = 'emitter'
    , MODULES = 'modules'
    , TRACER  = 'tracer'
    , DEBUG   = 'debug'
    , NOOP    = 'noop'
    ;

  var bus     = emitter()
    , global  = window
    , silence = false
    ;

  var debug = function () {
    /* globals console: false */
    if (!silence) {
      console.log.apply(console, arguments);
    }
  };

  var noop = function () {
  };

  var tracer = function (sink, label) {
    return function (args) {
      var d = Array.prototype.slice.call(args);
      d.unshift(label);
      sink.apply(null, d);
    };
  };

  var trace = tracer(debug, 'EVENT:') || noop;

  /**
   * Static settings and modules.
   *
   * @dict
   */
  var modules = {};

  modules[TRACER] = tracer;
  modules[EMITTER] = emitter;

  /**
   * General configuration.
   *
   * @dict
   */
  var config = {};

  config[DEBUG] = debug;
  config[EMITTER] = bus;
  config[NOOP] = noop;
  config[MODULES] = modules;

  //
  bus.hook(function (args) {
    trace(args);
  });

  /* jshint +W069 */

  global.addEventListener('load', function () {
    bus.emit('app.window.load');
  });
  global.onunload = function () {
    silence = true;
    bus.emit('app.window.unload');
  };
  require(['sync', 'ui_root'], function (sync, ui) {
    sync(config);
    ui(config);
  });
  bus.emit('app.init');

});
