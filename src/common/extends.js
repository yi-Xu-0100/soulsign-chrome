import Vue from 'vue';
/**
 * @param {string} [name] 
 * @param {Function} fn 
 */
function loading(name, fn) {
	if (arguments.length < 2) fn = name, name = 'loading';
	if (this[name]) return;
	this[name] = true;
	var that = this;
	return Promise.resolve(fn.call(this)).then(function(data) {
		that[name] = false;
		return data;
	}, function(err) {
		that[name] = false;
		return Promise.reject(err);
	});
};

Vue.prototype.$with = loading;