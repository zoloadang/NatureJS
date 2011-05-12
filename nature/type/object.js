/**
 * @fileoverview object 模块.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../type/lang.js'], function(lang) {

	//对象自有方法, 属性
	var extraNames = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

	/**
	 * object 模块
	 * @name object
	 * @namespace
	 */
	return {

		/**
		 * @lends object
		 * @static
		 */

		/**
		 * 合并对象
		 * @private
		 * @param { Object } target 目标对象.
		 * @param { Object } source 源对象.
		 * @return { Object } target.
		 */
		_mixin: function(target, source) {

			if (source) {

				var i,
					_s,
					name,
					empty = {},
					len = extraNames.length;

				for (name in source) {

					_s = source[name];

					if (
						!target[name] ||
						target[name] != _s && (!(name in empty) || _s != empty[name])
					) {

						target[name] = source[name];

					}

				}

				//针对 ie 浏览器
				for (i = 0; i < len; i++) {

					name = extraNames[i];
					_s = source[name];

					if (
						!target[name] ||
						target[name] != _s && (!(name in empty) || _s != empty[name])
					) {
						target[name] = _s;
					}

				}

			}

			return target;

		},

		/**
		 * 合并对象元素到目标对象
		 * @param { Object } obj 目标对象.
		 * @param { Object } props 源对象.
		 * @return { Object } obj.
		 */
		mixin: function(obj, props) {

			var host = this,
				args = arguments,
				i = 1,
				o = obj || {},
				len = args.length;

			for (; i < len; i++) {

				host._mixin(o, args[i]);

			}

			return o;

		},

		/**
		 * 为原型添加方法
		 * @param { Function } constructor 构造函数.
		 * @param { Object } props 源对象.
		 * @return { Function } 构造函数.
		 */
		extend: function(constructor, props) {

			var host = this,
				args = arguments,
				i = 1,
				len = args.length;

			for (; i < len; i++) {

				host._mixin(constructor.prototype, args[i]);

			}

			return constructor;

		},

		/**
		 * 合并多个对象为一个对象
		 * @param { Object } props 源对象.
		 * @return { Object } 合并后的对象.
		 */
		merge: function() {

			var o = {};

			return this.mixin.apply(this, [o].concat(lang.toArray(arguments)));

		},

		/**
		 * 转换对象为字符串
		 * @param { Object } obj 对象.
		 * @param { Array } symbol 分隔符, 数组中的第一个为 key, value 之间的间隔符, 第二个为各值之间的间隔.
		 * @param { Boolean } needEncode 是否需要编码中文.
		 * @return { String } 转换成的字符串.
		 * @example
		 * 		object.toString({ a: 'b', c: 'd' }) //a:b,c:d
		 * 		object.toString({ a: 'b', c: 'd' }, ['=', '&']) //a=b&c=d
		 */
		toString: function(obj, symbol, needEncode) {

			var i,
				arr = [],
				sym = symbol || [':', ','];

			for (i in obj) {

				arr.push(i + sym[0] + (!needEncode ? obj[i] : escape(obj[i].toString())));

			}

			return arr.join(sym[1]);

		},

		/**
		 * 转换字符串到对象
		 * @param { String } str 字符串.
		 * @param { Array } symbol 分隔符.
		 * @param { Boolean } needDecode 是否需要解码.
		 * @return { Object } 对象.
		 * @example
		 * 		object.toObject('a:b,c:d') //{a:'b',c:'d'}
		 * 		object.toObject('a=b&c=b', ['=', '&']) //{a:'b',c:'d'}
		 */
		toObject: function(str, symbol, needDecode) {

			var	obj = {},
				sym = symbol || [':', ','],
				arr = str.split(sym[1]),
				i = 0,
				len = arr.length;

			for (; i < len; i++) {

				var kv = arr[i].split(sym[0]);
				obj[kv[0]] = !needDecode ? kv[1] : unescape(kv[1]);

			}

			return obj;

		},

		/**
		 * 转换对象为 url 参数
		 * @param { Object } obj 对象.
		 * @return { String } url 参数字符串.
		 */
		param: function(obj) {

			return this.toString(obj, ['=', '&'], true);

		},

		/**
		 * 转换 url 参数为字符串
		 * @param { String } str url 参数字符串.
		 * @return { Object } 对象.
		 */
		unparam: function(str) {

			return this.toObject(str, ['=', '&'], true);

		}


	};

});
