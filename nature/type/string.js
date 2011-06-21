/**
 * @fileoverview string 模块, 常用 String 方法.
 * @author nanzhi<nanzhienai@163.com>
 */

define(function() {

	var count = 0;

	/**
	 * string 模块
	 * @name string
	 * @namespace
	 */

	return {

		/**
		 * @lends string
		 * @static
		 */

		/**
		 * 去除字符串两边空格
		 * @memberOf string
		 * @param { String } str 需要清理的字符串.
		 * @param { Boolean } isBigText 是否是大字符串.
		 * @return { String } 返回清除后的字符串.
		 * @spec romove both ends of the blank string.
		 * @example
		 *      string.trim(' test ') => 'test';
		 *      string.trim('      I am nanzhi.') => 'I am nanzhi.';
		 *      string.trim('      I am nanzhi.     ') => 'I am nanzhi.';
		 *      string.trim('      I am nanzhi.     ', true) => 'I am nanzhi.';
		 */
		trim: function(str, isBigText) {

			if (String.prototype.trim) {
				return str.trim();
			}

			if (!isBigText) {
				return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			}

			str = str.replace(/^\s+/, '');

			for (var i = str.length - 1; i >= 0; i--) {
				if (/\S/.test(str.charAt(i))) {
					str = str.substring(0, i + 1);
					break;
				}
			}

			return str;

		},

		/**
		 * 模板/对象匹配替换
		 * @param { String } template 需要替换的模板.
		 * @param { Object } data 相匹配的数据对象.
		 * @param { String } prefix 匹配的前缀, 可选.
		 * @param { String } postfix 匹配的后缀, 可选.
		 * @param { String } postfix 匹配的后缀.
		 * @return { String } 替换后的字符串.
		 * @spec replace specific character by data.
		 * @example
		 *      var str = '{person} is a {role}.',
		 *      	data = { person: 'Nanzhi', role: 'Developer' };
		 *      string.substitute(str, data) => 'Nanzhi is a Developer.';
		 */
		substitute: function(template, data, prefix, postfix) {

			var pre = prefix || '{',
				post = postfix || '}',
				reg = new RegExp(pre + '(.+?)' + post, 'g');

			return template.replace(reg, function(match, value) {

						return data[value];

				   });

		},

		/**
		 * 将首字母大写
		 * @param { String } str 字符串.
		 * @return { String } 转换后的字符串.
		 */
		toUpper: function(str) {

			return str.substr(0, 1).toUpperCase() + str.substr(1);

		},

		/**
		 * 根据设定条件返回唯一字符串
		 * @param { Function } condition 条件函数.
		 * @param { String } prefix 前缀.
		 * @return { String } 生成的唯一字符串.
		 */
		unique: function(condition, prefix) {

			var name = prefix || 'Nature_ID_',
				str;

			do {

				str = name + ++count;

			} while (condition(str));

			return str;

		}

	};

});
