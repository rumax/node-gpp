//TODO: command options accepted by the C preprocessor

var fs = require('fs');
var path = require('path');
var Preprocess = require('./index.js');

var inputFile = process.argv[2] ? path.resolve(process.argv[2]) : null;
var outputFile = process.argv[3] ? path.resolve(process.argv[3]) : null;

var input = null === inputFile ?
  process.stdin : fs.createReadStream(inputFile);

var output = null === outputFile ?
  process.stdout : fs.createWriteStream(outputFile);

var preprocess = new Preprocess(input);

preprocess.on('end', function(data) {
  output.write(data);

  if (null !== outputFile) {
    output.end();
  }
});
