/**
 *  Tests for sync.js
 *
 *  todo: fix the bug - require callback in beforeAll() never fires!
 */
define(function () {

  'use strict';

  /* jshint sub: true */
  /* globals window: false */

  var dCnt, dArg
    , noop     = function () {
      }
    , nomodule = function () {
        return noop;
      }
    , conf     = {noop: noop, modules: {tracer: nomodule}}
    , debug    = function (arg) {
        dCnt += 1;
        dArg = arg;
      }
    , em
    , mEm
    , sync
    , mSync
    , socket
    ;

  describe('sync tests', function () {

    beforeAll(function (done) {
      require(['vendor/eventist/lib/eventist', 'dev/js/sync'], function (me, ms) {
        mEm = me;
        mSync = ms;
        done();
      });
    });

    describe('initial state behavior', function () {

      var checkInitialization = function () {
        var f = jasmine.any(Function);
        expect(socket.on).toHaveBeenCalledWith('assign-id', f);
        expect(socket.on).toHaveBeenCalledWith('has-moved', f);
        expect(socket.on).toHaveBeenCalledWith('has-joined', f);
        expect(socket.on).toHaveBeenCalledWith('has-left', f);
        expect(socket.on).toHaveBeenCalledWith('refused', f);
      };

      beforeEach(function () {
        (dCnt = 0) || (dArg = null);
        socket = jasmine.createSpyObj('io', ['emit', 'on']);
        conf['sync-socket'] = socket;
        conf['emitter'] = em = mEm();
        sync = mSync(conf);
      });

      it('should use global io()', function () {
        delete conf['debug'];
        delete conf['sync-socket'];
        window['io'] = function () {
          return jasmine.createSpyObj('io', ['emit', 'on']);
        };
        sync = mSync(conf);
        checkInitialization();
        delete window['io'];
      });

      it('socket should have been initiated', function () {
        checkInitialization();
      });

      it('should not respond while id is not set', function () {
        em.emit('app.window.unload');
        expect(socket.emit).not.toHaveBeenCalled();
      });

      it('should respond to "ui.ready" defult', function () {
        em.emit('ui.ready');
        expect(socket.emit).toHaveBeenCalledWith('join', [0, 0]);
      });

      it('should respond to "ui.ready"', function () {
        var pos = [11, 12];
        em.emit('ui.ready', {position: pos});
        expect(socket.emit).toHaveBeenCalledWith('join', pos);
      });
    });

    describe('initialized state behavior', function () {
      var id           = 'blue'
        , socketEvent  = null
        ;

      beforeEach(function () {
        (dCnt = 0) || (dArg = null);
        socket = mEm();

        socket.hook( function(args){
          socketEvent = args.slice(); // get copy
        });
        conf['sync-socket'] = socket;
        conf['debug'] = debug;
        conf['emitter'] = em = mEm();
        sync = mSync(conf);
        socket.emit('assign-id', id);
      });

      it('should respond to "app.window.unload"', function () {
        em.emit('app.window.unload');
        expect(socketEvent[0]).toBe('leave');
        expect(socketEvent[1]).toBe(id);
      });

      it('should respond to "ui.position.change"', function (done) {
        var pos = [11, 12];

        spyOn(socket, 'emit').and.callThrough();

        //  Here we test for (potentially) asynchronous behavior!
        socket.on('move', function (arg) {
          expect(arg).toBe(pos);
          done();
        });
        em.emit('ui.position.change', pos);
      });

      describe('responses to socket events', function () {
        var t1    = ['uictrl', 'marker.set', 'black', [13, 14]]
          , t2    = ['uictrl', 'marker.kill', 'black']
          , event = 0
          ;
        beforeEach(function () {
          em.hook(function (args) {
            event = args.slice();
          });
        });

        it('should respond to "has-joined"', function () {
          socket.emit('has-joined', {id: t1[2], loc: t1[3]});
          expect(event).toEqual(t1);
        });

        it('should respond to "has-moved"', function () {
          socket.emit('has-moved', {id: t1[2], loc: t1[3]});
          expect(event).toEqual(t1);
        });

        it('should respond to "has-left"', function () {
          socket.emit('has-left', t2[2]);
          expect(event).toEqual(t2);
        });

        it('should respond to "refused"', function () {
          socket.emit('refused', t2[2]);
          expect(dCnt).toBe(1);
          expect(dArg).toBe('refused');
        });

        it('should process "reconnect_error"', function () {
          var closed = false, e = new TypeError('testing');

          socket.close = function () {
            closed = true;
          };
          socket.emit('reconnect_error', e);
          expect(event).toEqual(['error', 'sync-socket', e.message]);
          expect(closed).toBe(true);
        });
      });
    });
  });
});
