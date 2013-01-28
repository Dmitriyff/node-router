var util = require('util');
var reg = /\/(?:([^\/\?\:]+(?=:))?(\:)?([^\/\?]*)(\?)?)|\*/g;

var Router = function(options) {
	options = options || {};

	this.routes = options.routes || this.routes;
	this._bind();

	this.initialize.apply(this, options);
};

Router.prototype = {
	initialize: function() { },

	_bind: function() {
		if (!this.routes) return;

		var name, values, maps,
			routes,
			_routes = this._routes = {};

		for (var route in this.routes) {

			routes = this._routes;
			maps = [];

			route.replace(reg, function(_, _def, val, _name, opt, pos, route) {
				// выставляем имя
				// если переменная, то омжет быть константой,
				// иначе наименование объекта

				name = val ? (_def ? _def : '*') 
						   : (_name != undefined ? _name : '*');

				routes[name] = routes[name] || {};

				//если переменная задаем имя
				if (val) routes[name]._name = _name;

				// строим цепочку
				routes = routes[name];

				// если не опциональная
				if (!opt) {
					for(var i in maps) 
						maps[i][name] = maps[i][name] || routes;

					maps = [];
				}

				maps.push(routes);
			});

			var _callback = this.routes[route];

			for (var i in maps) 
			 	maps[i]._callback = _callback;
		}
	},

	_route: function(url) {
		var s = [];

		s[0] = url.charAt(0) == '/' ? 1 : 0;
		url.charAt(url.length -1) == '/' && ( s[1] = -1);
		url = String.prototype.slice.apply(url, s);

		var route = url.split('/'),
			routes = this._routes,
			arr = [],
			obj = {};

		route.map(function(value) {
			if (routes = routes[value] || 
						 routes['*'] || 
						 false) 
				if (routes._name) {
					arr.push(value);
					obj[routes._name] = value;
				}
		});

		if (routes && routes._callback) {
			return {
				params: obj,
				arguments: arr,
				_callback: routes._callback,
			};
		} else {
			return {
				params: obj,
				arguments: arr,
				_callback: this._routes['*']._callback
			};
		}
	},

	routes: {},
	navigate: function(url) {
		// { params, query, _callback, }
		var callback,
			route = this._route(url);

		callback = 	route._callback instanceof Function ? 
					route._callback : this[route._callback];

		callback.apply(null, route.params);		
	}
};

var extend = function(obj) {
	var i,
		target = this.prototype;

	for (i in obj) {
		target[i] = obj[i];
	}

	return this;
};

Router.extend = extend;

module.exports = Router;