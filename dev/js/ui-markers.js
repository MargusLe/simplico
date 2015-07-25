/**
 * ui-markers.js
 *
 * Dynamic markers layer for the map view.
 */

/* jshint sub: true */
/* globals goog: false, ol: false, COMPILED: false */

goog.provide('app.ui.mrk');

if (COMPILED) {
  goog.require('app.ui.map');
  goog.require('ol.source.Vector');
  goog.require('ol.layer.Vector');
  goog.require('ol.Feature');
  goog.require('ol.geom.Point');
  goog.require('ol.style.Style');
  goog.require('ol.style.Circle');
  goog.require('ol.style.Fill');
  goog.require('ol.style.Stroke');
  goog.require('ol.Map');
}

define('ui-markers', ['ui-map'], function () {

  'use strict';

  var init = function (conf) {

    /** @type {ol.Map} */
    var map = conf['ui.map'];
    var ee           = conf['emitter']
      , sight        = conf['ui.crosshair.id']
      , vectorSource = new ol.source.Vector()
      , vectorLayer  = new ol.layer.Vector({source: vectorSource})
      , addMarker, setMarker, delMarker, listener
      ;

    /**
     * Create marker on the vector layer and assign ID to it.
     */
    addMarker = function (id, loc) {
      var marker = new ol.Feature({
          geometry: new ol.geom.Point(loc)
        }
      );
      marker.setId(id);
      marker.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill:   new ol.style.Fill({
            color: id
          }),
          stroke: new ol.style.Stroke({
            color: '#000',
            width: 2
          })
        })
      }));
      vectorSource.addFeature(marker);
    };

    setMarker = function uiSetMarker(id, loc) {
      var marker = vectorSource.getFeatureById(id);

      if (marker) {
        marker.setGeometry(new ol.geom.Point(loc));
      } else {
        addMarker(id, loc);
      }
    };

    delMarker = function uiDelMarker(id) {
      var marker = vectorSource.getFeatureById(id);
      if (marker) {
        vectorSource.removeFeature(marker);
      }
    };

    listener = function (cmd, id, loc) {
      switch (cmd) {
        case 'marker.set':
          setMarker(id, loc);
          break;
        case 'marker.kill':
          delMarker(id);
          break;
      }
    };

    if (sight && (sight = document.getElementById(sight))) {
      sight['style']['display'] = 'block';
    }

    map.addLayer(vectorLayer);

    ee.on('uictrl', listener);
  };

  return init;
});
