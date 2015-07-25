/**
 * Development server script.
 *
 * This server manages web socket connections with clients.
 *
 * @todo: check for hung connections.
 */

'use strict';

/** @const {number}  */
var PORT = 1111;

/**
 * NodeJS modules.
 */
var express    = require('express')
  , path       = require('path')
  , http       = require('http')
  , compressor = require('compression')
  , optimist   = require('optimist')
  , sockets    = require('socket.io')
  , slots      = require('./slots')
  ;

var app    = express()
  , server = http.createServer(app)
  , io     = sockets(server)
  ;

/*
 Checking the command line options
 */

var opts = optimist
      .default({port: PORT, dir: 'dev', compress: true})
      .check(help_needed.bind(null))  // A trick to hide program code
      .usage('Web server script')
      .argv
  , sub  = opts.dir || 'app'
  , dir  = path.normalize(__dirname + '/../' + sub) + '/'
  , port = opts.port
  ;

function help_needed() {
  return !(optimist.argv.help || optimist.argv._.indexOf('help') >= 0);
}

var log = function () {
  /* globals console: false */
  console.log.apply(console, arguments);
};
var debug = log;

/*
 Compression
 */
if (opts.compress) {
  var shouldCompress = function (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }
    // fallback to standard filter function
    return compressor.filter(req, res);
  };

  app.use(compressor({level: 1, filter: shouldCompress}));
} else {
  log('NO compression!');
}

/*
 Ordinary HTTP server stuff here.
 */

app.use(express.static(dir));
app.use('/vendor', express.static(dir + '../vendor'));
app.use('/legacy', express.static(dir + '../legacy'));
app.use('*.html', express.static(dir));

app.get('/', function (req, res) {
  res.redirect(dir + 'index.html');
});

slots(io, debug);

server.listen(port);

log('Server at: ' + dir + ' is listening port', port);
