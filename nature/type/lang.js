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
		 */
		isString: function(it) {

			return it && ('string' === typeof it || it instanceof String);

		},

		/**
		 * 是否是数字
		 * @param { Anything } it
		 * @return { Boolean } 如果是数字, 返回 true, 否则返回 false.
		 */
		isNumber: function(it) {

			return it && ('number' === typeof it || it instanceof Number);

		},

		/**
		 * 是否是数组
		 * @param { Anything } it
		 * @return { Boolean } 如果是数组, 返回 true, 否则返回 false.
		 */
		isArray: function(it) {

			return it && ('array' === typeof it || it instanceof Array);

		},

		/**
		 * 是否是类似数组的东西
		 * @param { Anything } it
		 * @return { Boolean } 它比 isArray 更宽松一点, 如果是类似数组的东西(节点, arguments)或者数组, 返回 true, 否则返回 false.
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
		 */
		isObject: function(it) {

			var host = this;

			return !host.isUndefined(it) && (host.isArray(it) || host.isFunction(it) || host.isNull(it) || 'object' === typeof it);

		},

		/**
		 * 是否是函数
		 * @param { Anything } it
		 * @return { Boolean } 如果是函数, 返回 true, 否则返回 false.
		 */
		isFunction: function(it) {

			return it && '[object Function]' === opts.call(it);

		},

		/**
		 * 是否是空对象
		 * @param { Anything } it
		 * @return { Boolean } 如果是 null, 返回 true, 否则返回 false.
		 */
		isNull: function(it) {

			return !this.isUndefined(it) && null === it;

		},

		/**
		 * 是否是 undefined
		 * @param { Anything } it
		 * @return { Boolean } 如果是 undefined, 返回 true, 否则返回 false.
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

