/**
 * sync.js
 *
 * Synchronization module using web socket services.
 *
 * @package SimpleMap
 * @version 0.0.2
 * @author Villem Alango <villem.alango@gmail.com>
 * @created 16.06.15 18:44
 * @license http://opensource.org/licenses/MIT
 */

define(function () {

  /* jshint sub: true */
  /* globals io: false */

  'use strict';

  /** @const {string} */
  var MY_KEY = 'sync-socket'
    ;

  return function (conf) {

    var noop   = conf['noop']
      , debug  = conf['debug'] || noop
      , ee     = conf['emitter']
      , socket = conf[MY_KEY]
      , id     = null
      , tracer
      , trr    = noop
      , trs    = noop
      ;

    if (!socket) {
      if ('function' === typeof io) {
        socket = io();
      } else {
        debug('SYNC:', 'can not initialize!');
        return;
      }
    }
    if ((tracer = conf['modules']) && (tracer = tracer['tracer'])) {
      (trr = tracer(debug, 'SRECV:')) && (trs = tracer(debug, 'SSEND:'));
    }

    ee.once('ui.ready', function (data) {
      var pos = data && data['position'] || [0, 0];
      trs(['join', pos]);
      socket.emit('join', pos);
    });

    ee.once('app.window.unload', function () {
      id && (trs(['leave']) || socket.emit('leave', id));
    });

    ee.on('ui.position.change', function (place) {
      var fire = false;

      if (!fire) {
        fire = true;
        setTimeout(function () {
          trs(['move', place]);
          socket.emit('move', place);
          fire = false;
        }, 100);
      }
    });

    socket.on('assign-id', function (arg) {
      trr(['assign-id', arg]);
      id = arg;
    });

    socket.on('refused', function (arg) {
      debug('refused', arg);
    });

    socket.on('has-moved', function (arg) {
      ee.emit('uictrl', 'marker.set', arg.id, arg.loc);
    });

    socket.on('has-joined', function (arg) {
      trr(['has-joined', arg]);
      ee.emit('uictrl', 'marker.set', arg.id, arg.loc);
    });

    socket.on('has-left', function (arg) {
      ee.emit('uictrl', 'marker.kill', arg);
    });

    //  If connection is lost, application may decide if to retry or not.
    socket.on('reconnect_error', function (err) {
      debug('Connection failed:', err.message);
      ee.emit('error', MY_KEY, err.message) || socket.close();
    });
  };
});
