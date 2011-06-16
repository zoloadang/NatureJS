/**
 * @fileoverview object 模块.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../type/lang.js'], function(lang) {

	//对象自有方法, 属性
	var win = window,
		extraNames = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

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
		 * @spec Mix many object to one object.
		 * @example
		 * 	var t = { a: 'b' },
		 *		a = { c: 'd' },
		 *		b = { e: 'f' };
		 *	object.mixin(t, a, b)
		 *	t['c'] => 'd';
		 *	t['e'] => 'f';
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
		 * 合并多个对象为一个对象
		 * @param { Object } props 源对象.
		 * @return { Object } 合并后的对象.
		 * @spec Merge some object to one.
		 * @example
		 * 	var o1 = { a: 'b' },
		 *		o2 = { c: 'd' },
		 *		o3 = { e: 'f' },
		 *		o = object.merge(o1, o2, o3);
		 *	o['a'] => 'b';
		 *	o['c'] => 'd';
		 *	o['e'] => 'f';
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
		 * @spec Translate an object to string.
		 * @example
		 * 	object.toString({ a: 'b', c: 'd' }) => 'a:b,c:d'
		 * 	object.toString({ a: 'b', c: 'd' }, ['=', '&']) => 'a=b&c=d'
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
		 * @spec Translate a string to object.
		 * @example
		 * 	var o1 = object.toObject('a:b,c:d'),
		 *		o2 = object.toObject('a=b&c=d', ['=', '&']);
		 *	o1['a'] => 'b';
		 *	o1['c'] => 'd';
		 *	o2['a'] => 'b';
		 *	o2['c'] => 'd';
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
		 * @spec Translate object to param string.
		 * @example
		 *  object.param({a:'b', c:'d'}) => 'a=b&c=d';
		 */
		param: function(obj) {

			return this.toString(obj, ['=', '&'], true);

		},

		/**
		 * 转换 url 参数为字符串
		 * @param { String } str url 参数字符串.
		 * @return { Object } 对象.
		 * @spec Translate param string to object.
		 * @example
		 *  var o = object.unparam('a=b&c=d');
		 *	o['a'] => 'b';
		 *	o['c'] => 'd';
		 */
		unparam: function(str) {

			return this.toObject(str, ['=', '&'], true);

		},

		/**
		 * 获取对象
		 * @private
		 * @param { String } parts 名字.
		 * @param { Boolean } create 是否创建对象.
		 * @param { Object } context 上下文对象.
		 * @return { Object } 对象.
		 */
		_getProp: function(parts, create, context) {

			var obj = context || win,
				len = parts.length,
				i = 0;

			for (; i < len; i++) {

				if (obj[parts[i]]) {

					obj = obj[parts[i]];
					continue;

				} else {

					obj = create ? (obj[parts[i]] = {}) : 'undefined';

				}

			}

			return obj;

		},

		/**
		 * 设置对象
		 * @param { String } name 名字.
		 * @param { Anything } value 值.
		 * @param { Object } context 上下文对象.
		 * @return { Object } 要设置的对象.
		 */
		set: function(name, value, context) {

			var host = this,
				parts = name.split('.'),
				p = parts.pop(),
				obj = host._getProp(parts, true, context);

			if (obj && p) {

				return (obj[p] = value);

			}

		},

		/**
		 * 根据字符串获取对象
		 * @param { String } name 名字.
		 * @param { Boolean } create 如果对象不存在是否创建.
		 * @param { Object } context 上下文对象.
		 * @return { Object } 对象.
		 * @spec set and get object.
		 * @example
		 *  object.set('nature.dom', { name: 'dom' });
		 *	var o = object.get('nature.dom');
		 *	o.name => 'dom';
		 */
		get: function(name, create, context) {

			return this._getProp(name.split('.'), create, context);

		}

	};

});
