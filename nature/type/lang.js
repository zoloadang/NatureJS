/**
 * @fileoverview lang 模块, 常用类型判断.
 * @author nanzhi<nanzhienai@163.com>
 */

define(function() {

	var win = window,
		op = Object.prototype,
		opts = op.toString;

	/**
	 * lang 模块
	 * @name lang
	 * @namespace
	 */
	return {

		/**
		 * @static
		 * @lends lang
		 */

		/**
		 * 是否是字符串
		 * @param { Anything } it
		 * @return { Boolean } 如果是字符串, 返回 true, 否则返回 false.
		 * @spec check it is or not a string.
		 * @example
		 * 	lang.isString('nanzhi') => true;
		 *	!!lang.isString(undefined) => false;
		 *	lang.isString(12) => false;
		 *	!!lang.isString(null) => false;
		 *	lang.isString([1, 2]) => false;
		 *	lang.isString(Array) => false;
		 */
		isString: function(it) {

			return it && ('string' === typeof it || it instanceof String);

		},

		/**
		 * 是否是数字
		 * @param { Anything } it
		 * @return { Boolean } 如果是数字, 返回 true, 否则返回 false.
		 * @spec check it is or not a number.
		 * @example
		 *  lang.isNumber(12) => true;
		 *	lang.isNumber('nanzhi') => false;
		 *	!!lang.isNumber(undefined) => false;
		 *	!!lang.isNumber(null) => false;
		 *	lang.isNumber([1, 2]) => false;
		 *	lang.isNumber(Array) => false;
		 */
		isNumber: function(it) {

			return it && ('number' === typeof it || it instanceof Number);

		},

		/**
		 * 是否是数组
		 * @param { Anything } it
		 * @return { Boolean } 如果是数组, 返回 true, 否则返回 false.
		 * @spec check it is or not an array.
		 * @example
		 * 	lang.isArray([1, 2]) => true;
		 *	lang.isArray('nanzhi') => false;
		 *	!!lang.isArray(undefined) => false;
		 *	lang.isArray(12) => false;
		 *	!!lang.isArray(null) => false;
		 *	lang.isArray(Array) => false;
		 *	lang.isArray(arguments) => false;
		 *	lang.isArray(document.getElementsByTagName('head')) => false;
		 */
		isArray: function(it) {

			return it && ('array' === typeof it || it instanceof Array);

		},

		/**
		 * 是否是类似数组的东西
		 * @param { Anything } it
		 * @return { Boolean } 它比 isArray 更宽松一点, 如果是类似数组的东西(节点, arguments)或者数组, 返回 true, 否则返回 false.
		 * @spec check it is or not like array.
		 * @example
		 *  lang.isArrayLike([1, 2]) => true;
		 *	lang.isArrayLike(arguments) => true;
		 *	lang.isArrayLike(document.getElementsByTagName('head')) => true;
		 *	lang.isArrayLike('nanzhi') => false;
		 *	!!lang.isArrayLike(undefined) => false;
		 *	lang.isArrayLike(12) => false;
		 *	!!lang.isArrayLike(null) => false;
		 *	lang.isArrayLike(Array) => false;
		 */
		isArrayLike: function(it) {

			var host = this;

			return it && !host.isString(it) && !host.isNumber(it) && !host.isFunction(it) &&
			       !(it.tagName && 'form' === it.tagName.toLowCase()) &&
				   (host.isArray(it) || isFinite(it.length));//@FIXME if length is a custom property, e.x: -1 or 1.2

		},

		/**
		 * 是否是对象
		 * @param { Anything } it
		 * @return { Boolean } 如果是对象, 返回 true, 否则返回 false.
		 * @spec check it is or not a object.
		 * @example
		 *  lang.isObject(null) => true;
		 *	lang.isObject([1, 2]) => true;
		 *	lang.isObject(Array) => true;
		 *	lang.isObject(function() {}) => true;
		 *	lang.isObject(arguments) => true;
		 *	lang.isObject('nanzhi') => false;
		 *	lang.isObject(undefined) => false;
		 *	lang.isObject(12) => false;
		 */
		isObject: function(it) {

			var host = this;

			return !host.isUndefined(it) && (host.isArray(it) || host.isFunction(it) || host.isNull(it) || 'object' === typeof it);

		},

		/**
		 * 是否是函数
		 * @param { Anything } it
		 * @return { Boolean } 如果是函数, 返回 true, 否则返回 false.
		 * @spec check it is or not a Function.
		 * @example
		 *  lang.isFunction(function() {}) => true;
		 *	lang.isFunction('nanzhi') => false;
		 *	!!lang.isFunction(undefined) => false;
		 *	lang.isFunction(12) => false;
		 *	!!lang.isFunction(null) => false;
		 *	lang.isFunction([1, 2]) => false;
		 *	lang.isFunction(Array) => true;
		 *	lang.isFunction(arguments) => false;
		 */
		isFunction: function(it) {

			return it && '[object Function]' === opts.call(it);

		},

		/**
		 * 是否是空对象
		 * @param { Anything } it
		 * @return { Boolean } 如果是 null, 返回 true, 否则返回 false.
		 * @spec heck it is or not null.
		 * @example
		 *  lang.isNull(null) => true;
		 *	lang.isNull('nanzhi') => false;
		 *	lang.isNull(undefined) => false;
		 *	lang.isNull(12) => false;
		 *	lang.isNull([1, 2]) => false;
		 *	lang.isNull(Array) => false;
		 *	lang.isNull(arguments) => false;
		 */
		isNull: function(it) {

			return !this.isUndefined(it) && null === it;

		},

		/**
		 * 是否是 undefined
		 * @param { Anything } it
		 * @return { Boolean } 如果是 undefined, 返回 true, 否则返回 false.
		 * @spec heck it is or not undefined.
		 * @example
		 *  lang.isUndefined(undefined) => true;
		 *	lang.isUndefined('nanzhi') => false;
		 *	lang.isUndefined(12) => false;
		 *	lang.isUndefined(null) => false;
		 *	lang.isUndefined([1, 2]) => false;
		 *	lang.isUndefined(Array) => false;
		 *	lang.isUndefined(arguments) => false;
		 */
		isUndefined: function(it) {

			return 'undefined' === typeof it;

		},

		/**
		 * 转换 arrayLike 为 array
		 * @param { ArrayLike } obj arrayLink.
		 * @param { Number } fromIndex 开始位置.
		 * @return { Array }
		 */
		toArray: function(obj, fromIndex) {

			return Array.prototype.slice.call(obj, fromIndex || 0);

		},

		/**
		 * 绑定事件作用域以及参数
		 * @param { Object } scope 作用域.
		 * @param { Function | String } method 函数或者对象方法.
		 * @param { ... } 函数参数.
		 * @return { Function } 绑定函数作用域和参数的函数.
		 */
		hitch: function(scope, method/*, ... */) {

			var host = this,
				args = arguments,
				pre = [],
				context = scope || win,
				fp = host.isString(method) ? scope[method] : method;

			if (args.length > 2) {

				pre = host.toArray(args, 2);

			}

			return function() {

				var args = host.toArray(arguments);

				return fp && fp.apply(context, pre.concat(args));

			}

		}

	};

});

