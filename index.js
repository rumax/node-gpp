var spawn = require('child_process').spawn;
var readline = require('readline');
var os = require('os');

var gpp;
var platform = os.platform();


if ('linux' === platform) {
  gpp = 'gpp';
} else if ('win32') {
  gpp = './bin/win/gpp.exe';
} else {
  throw 'GPP: Unsupported platform [' + platform + ']';
}


var Preprocess = function(input) {
  this._input = input;

  this._init();
};


Preprocess.prototype.on = function(event, cb) {
  this._events[event] = cb;
};


Preprocess.prototype._init = function() {
  this._preprocessed = new Buffer(0);
  this._buffer = new Buffer(0);
  this._events = {};
  this.lineReader = readline.createInterface({
    input: this._input,
    terminal: false
  });

  this._initLineReader();
  this._initGpp();
};


Preprocess.prototype._initLineReader = function() {
  this.lineReader.on('line', this._add.bind(this));
  this.lineReader.on('close', this._end.bind(this));
};


Preprocess.prototype._initGpp = function() {
  this._gpp = spawn(gpp);
  this._gpp.stdout.on('data', function (data) {
    this._preprocessed = Buffer.concat([this._preprocessed, data]);
  }.bind(this));

  //Error handling
  this._gpp.stderr.on('data', function (data) {
    this._error('grep stderr: ' + data);
  }.bind(this));

  this._gpp.on('close', function (code) {
    if (code !== 0) {
      this._error('grep process exited with code ' + code);
    }

    if (this._events.end) {
      this._events.end(this._preprocessed);
    }
  }.bind(this));
};


Preprocess.prototype._add = function(line) {
  this._gpp.stdin.write(new Buffer(line + '\n'));
};


Preprocess.prototype._end = function() {
  this._gpp.stdin.end();
};


Preprocess.prototype._error = function(err) {
  if (this._events.error) {
    this._events.error(err);
  } else {
    console.error(err);
  }
};


module.exports = Preprocess;
