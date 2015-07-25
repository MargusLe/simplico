/**
 * ui-location.js
 *
 * @link http://openlayers.org/en/v3.0.0/apidoc/ol.Geolocation.html
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
 * @link https://developer.mozilla.org/en-US/Apps/Build/gather_and_modify_data/Plotting_yourself_on_the_map
 */

/* jshint sub: true */
/* globals goog: false, ol: false, COMPILED: false */

goog.provide('app.ui.location');

if (COMPILED) {
  goog.require('app.ui.map');
  goog.require('ol.Geolocation');
  goog.require('ol.View');
  goog.require('ol.Map');
}

define('ui-location', [], function () {

  'use strict';

  var isTracking = false
      /** {@type ol.Geolocation} */
    , geoLocation
      /** {@type ol.Map} */
    , map
      /** {@type ol.View} */
    , view
    , resolutions
    , debug
    , ee
    ;

  /**
   * Initialize Geolocation.
   *
   * Used by: mapFunction().
   */
  function init(config) {

    map = config['ui.map'];
    resolutions = map['properties']['resolutions'];
    ee = config['emitter'];
    debug = config['debug'];
    view = map.getView();

    geoLocation = new ol.Geolocation({
      projection:      view.getProjection(),
      tracking:        true,
      trackingOptions: {
        maximumAge:         10000,
        enableHighAccuracy: true,
        timeout:            600000
      }
    });

    geoLocation.once('change:position', function () {
      var pan = ol.animation.pan({
        source: view.getCenter()
      });
      var zoom = ol.animation.zoom({
        resolution: view.getResolution(),
        duration:   3000
      });
      map.beforeRender(pan, zoom);
      view.setCenter(geoLocation.getPosition());
      view.setResolution(resolutions[12]);
    });

    geoLocation.on('error', function (error) {
      isTracking = false;
      geoLocation.setTracking(false);
      //gButton.style.background = gColors[gState]; // @todo
      //featuresOverlay.getFeatures().clear();
      if (error.code === error.PERMISSION_DENIED) {
        debug('LOCATION_ERROR:', error);
        /* globals alert: false */
        alert('Oled keelanud oma asukoha kasutamise? ' +
          'Kui mõtlesid ümber, siis lae kaart uuesti.');
      }
    });
    return geoLocation;
  }

  /**
   * Used by: compassFunction(), northUp()
   *
   * X@returns {ol.Coordinate}
   *
   function getMyPosition() {
    var position = geoLocation.getPosition();
    if (geoLocation.getTracking() && position) {
      var extent = view.calculateExtent(map.getSize());
      if (ol.extent.containsCoordinate(extent, position)) {
        return position;
      }
    }
    return view.getCenter();
  }*/

  return init;
});
