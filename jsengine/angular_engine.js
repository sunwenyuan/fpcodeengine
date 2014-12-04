/**
 * Created by Wenyuan on 2014/11/28.
 */
(function(){
	"use strict";
	var fs = require('fs');
	var _ = require('lodash');
	var AngularEngine = function(config, encoding, indent, outputFolder){
		this.lineBreak = "\r\n";
		this.useStrictStr = '"use strict";';
		this.indentBase = indent;
		this.encoding = encoding;

		this.outputFolder = outputFolder;
		this.moduleName = config.moduleName;
		this.subModuleName = config.subModuleName;
		this.dependency = config.dependency;

		this.moduleType = config.moduleType;
		this.injected = config.injected;
		this.modelConfig = config.model;
		this.methods = config.methods;
		this.model = config.model;
	};

	AngularEngine.prototype = {
		__getIndentBase: function(){
			return this.indentBase;
		},

		getLineBreak: function(){
			return this.lineBreak;
		},

		getUseStrictStr: function(){
			return this.getIndentStr(1)+this.useStrictStr+this.getLineBreak();
		},

		getIndentStr: function(level){
			if(level === undefined){
				level = 0;
			}
			var indent = this.__getIndentBase();
			var str = '';
			_.forEach(_.range(indent*level), function(){
				str += ' ';
			});
			return str;
		},

		getModuleName: function(){
			return this.moduleName;
		},

		getSubModuleName: function(){
			return this.subModuleName;
		},

		getDependency: function(){
			return this.dependency;
		},

		getModuleType: function(){
			return this.moduleType;
		},

		getInjected: function(){
			return this.injected;
		},

		getModel: function(){
			return this.model;
		},

		getMethods: function(){
			return this.methods;
		},

		getOutputFolder: function(){
			return this.outputFolder;
		},

		getOutputFilePath: function(){
			return this.getOutputFolder()+this.getModuleName()+'.js';
		},

		getEncoding: function(){
			return this.encoding;
		},

		getModuleDefStr: function(){
			var moduleName = this.getModuleName();
			var dependency = this.getDependency();
			var str = this.getIndentStr(1)+'var module = angular.module("'+moduleName+'", [';
			if(_.isArray(dependency)){
				if(dependency.length === 0){
					str += this.getIndentStr(1)+']);';
				}
				else{
					str += this.getLineBreak();
					_.forEach(dependency, function(item, index){
						str += this.getIndentStr(2);
						str += '"'+item+'"';
						if(index !== dependency.length - 1){
							str += ',';
						}
						str += this.getLineBreak();
					}, this);
					str += this.getIndentStr(1)+']);';
				}
			}
			else{
				str += this.getIndentStr(1)+']);';
			}
			return str+this.getLineBreak();
		},

		getContentStr: function(){
			if(this.getModuleType().toLowerCase() === 'controller'){
				return this.getControllerDefStr();
			}
		},

		getControllerDefStr: function(){
			var subModuleName = this.getSubModuleName();
			var str = this.getIndentStr(1)+'module.controller("'+subModuleName+'", ["$scope",';

			var injected = this.getInjected();
			_.forEach(injected, function(item){
				str += '"'+item+'", ';
			}, this);

			str += 'function($scope';
			if(_.isArray(injected) === false || injected.length === 0){
				str += '){';
			}
			else{
				_.forEach(injected, function(item, index){
					str += 'item';
					if(index !== injected.length -1){
						str += ',';
					}
				}, this);
				str += '){';
			}

			str += this.getLineBreak();

			var model = this.getModel();
			var modelStr = '';
			if(_.isArray(model)){
				if(model.length > 0){
					modelStr = this.getIndentStr(2)+'var model = {'+this.getLineBreak();
					_.forEach(model, function(item, index){
						modelStr += this.getIndentStr(3)+item.name+': ';
						var dataType = item.type;
						if(dataType.toLowerCase() === 'boolean'){
							modelStr += item.default;
						}
						else if(dataType.toLowerCase() === 'string'){
							modelStr += '"'+item.default+'"';
						}
						if(index !== model.length - 1){
							modelStr += ',';
						}
						modelStr += this.getLineBreak();
					}, this);
					modelStr += this.getIndentStr(2)+'};'+this.getLineBreak();
				}
			}

			str += modelStr;
			if(modelStr !== ''){
				str += this.getIndentStr(2)+'$scope.model = model;';
			}

			str += this.getLineBreak();
			str += this.getIndentStr(1)+'}]);';

			return str+this.getLineBreak();
		},

		writeToFile: function(str){
			fs.appendFileSync(this.getOutputFilePath(), str, {encoding: this.getEncoding()});
		},

		execute: function(){
			var _this = this;
			fs.exists(this.getOutputFilePath(), function(exists){
				if(exists){
					fs.writeFileSync(_this.getOutputFilePath(), '', {encoding: _this.getEncoding()});
				}
				var start = "(function(){"+_this.getLineBreak();
				var end = "})();";
				_this.writeToFile(start);
				_this.writeToFile(_this.getUseStrictStr());
				_this.writeToFile(_this.getModuleDefStr());
				_this.writeToFile(_this.getContentStr());
				_this.writeToFile(end);
			});
		}
	};

	module.exports = AngularEngine;
})();