/**
 * @fileoverview object 模块.
 * @author nanzhi<nanzhienai@163.com>
 */

define(function() {

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

				arr.push(i + sym[0] + (!needEncode ? obj[i] : escape(obj[i])));

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
				arr = str.split(sym[0]),
				i = 0,
				len = arr.length;

			for (; i < len; i++) {

				var kv = arr[i].split(sym[1]);
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