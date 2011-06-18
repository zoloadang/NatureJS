/**
 * @fileoverview JSON 模块.
 * @author nanzhi<nanzhienai@163.com>
 */
define(function(object) {

	var json = window['JSON'];

	/**
	 * JSON 模块
	 * @name json
	 * @namespace
	 */
	return {

		/**
		 * @lends json
		 * @static
		 */

		/**
		 * 解析 json
		 * @param { String } str JSON 字符串.
		 * @return { Object } 解析后的 JSON 对象.
		 * @spec translate json string to object.
		 * @example
		 *      var a = json.parse('{"a": "b"}');
		 *      a['a'] => 'b'
		 */
		parse: function(str) {

			if (json) {

				return json.parse(str);

			}

			return eval('(' + str + ')');

		},

		/**
		 * 转换 json 为字符串
		 * @param { Object } obj json 对象.
		 * @return { String } 转换后的字符串.
		 * @spec translate json object to string.
		 * @example
		 *      json.stringify({"a":"b"}) => '{"a":"b"}'
		 */
		stringify: function(obj) {

			var i,
				str = '';

			for (i in obj) {

				str += ',"' + i + '":"' + obj[i].toString() + '"';

			}

			return '{' + str.substr(1) + '}';

		}

	};

});
