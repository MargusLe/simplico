/**
 * ui-root.js
 *
 * A shim file for hiding UI plugin structure from application code.
 *
 * Here we assemble necessary modules that will be compiled and loaded
 * as one in production mode.
 */

/* jshint sub: true */
/* globals goog: false, COMPILED: false */

goog.provide('app.ui.maproot');

if (COMPILED) {
  goog.require('app.ui.map');
  goog.require('app.ui.mrk');
  goog.require('app.ui.location');
  //goog.require('ol.control.LayerSwitcher');
}

define('ui_root',
  ['ui-map', 'ui-markers', 'ui-location'],
  function (mMap, mMrk, mLoc) {

    'use strict';

    var init = function (config) {
      var map
        , ee    = config['emitter']
        , doc   = document
        , zoomI = doc.getElementById('zoom-in')
        , zoomO = doc.getElementById('zoom-out')
        ;

      config['ui.crosshair.id'] = 'crosshair';
      config['ui.map'] = map = mMap(config);
      config['ui.markers'] = mMrk(config);
      config['ui.location'] = mLoc(config);

      //map.addControl(new ol.control.LayerSwitcher());

      if (ee && zoomI && zoomO) {
        zoomI.addEventListener('click', function () {
          ee.emit('ui.map.zoom', 1);
        }, false);
        zoomO.addEventListener('click', function () {
          ee.emit('ui.map.zoom', -1);
        }, false);
        zoomI['style']['display'] = zoomO['style']['display'] = 'block';
      }
      /*
       enableCompass = enableCompass ? true : pageParams.orient;

       geoLocation = initGeolocation(view);
       */
    };

    return init;
  });
