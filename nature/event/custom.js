/**
 * @fileoverview 自定义事件.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/string.js'], function(string) {

	var win = window,
		_listener;

	/**
	 * @private
	 */
	_listener = {

		/**
		 * 创建一个 dispatcher function
		 * @private
		 * @return { Function } dispatcher function.
		 */
		getDispatcher: function() {

			return function() {

				var host = this,
					args = arguments,
					func = args.callee,
					target = func.target,
					ls = [].concat(func._listener),
					i = 0,
					len = ls.length,
					r = target && target.apply(host, args);

				for (; i < len; i++) {

					//maybe undefined
					ls[i] && ls[i].apply(host, args);

				}

				return r;

			};

		},

		/**
		 * 添加监听
		 * @private
		 * @param { Object } obj 对象.
		 * @param { String } method 方法.
		 * @param { Function } listener 监听事件.
		 * @return { Array } listeners.
		 */
		add: function(obj, method, listener) {

			obj = obj || win;
			method = 'on' + method;

			var host = this,
				func = obj[method];

			if (!func || !func._listener) {

				var d = host.getDispatcher();

				d.target = func;

				d._listener = [];

				func = obj[method] = d;

			}

			return func._listener.push(listener);

		},

		/**
		 * 移除监听
		 * @private
		 * @param { Object } obj 对象.
		 * @param { String } method 方法.
		 * @param { Number } handle add 返回值.
		 */
		remove: function(obj, method, handle) {

			var f = (obj || win)[method];

			if (f && f._listener && handle--) {

				return delete f._listener[handle];

			}

		}

	};

	/**
	 * 自定义事件
	 * @name custom
	 * @namespace
	 */
	return {

		/**
		 * @lends custom
		 * @static
		 */

		/**
		 * 添加事件
		 * @param { Object } obj 对象.
		 * @param { String } method 方法.
		 * @param { Function } listener 监听.
		 * @return { Array } 用于 remove 参数.
		 */
		add: function(obj, method, listener) {

			return [obj, method, _listener.add(obj, method, listener)];

		},

		/**
		 * 解除事件
		 * @param { Array } handle add 返回值.
		 */
		remove: function(handle) {

			return _listener.remove.apply(_listener, handle);

		}

	};

});
