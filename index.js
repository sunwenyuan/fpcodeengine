/**
 * Created by Wenyuan on 2014/11/28.
 */
"use strict";
var fs = require('fs');
var JSCodeEngine = require('./jsengine/index.js');
module.exports = function(input, outputFolder, encoding, indent){
	encoding = encoding || 'utf8';
	indent = indent || 4;

	var inputContent = fs.readFile('../input/'+input, {encoding: 'utf8'}, function(err, data){
		if(err){
			throw err;
		}
		else{
			var config = JSON.parse(data);
			var fileType = config.fileType;
			if(fileType.toLowerCase() === 'javascript'){
				var mode = config.mode;
				if(mode.toLowerCase() === 'angularjs'){
					var AngularCodeEngine = new JSCodeEngine.AngularEngine(config, encoding, indent, outputFolder);
					AngularCodeEngine.execute();
				}
			}
		}
	});
};