/**
 * @fileoverview uri 处理.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../type/object.js'], function(lang, object) {

	var	h = location.host,
		QMARK = '?',
		AND = '&';

	/**
	 * @name uri
	 * @namespace
	 */
	return {

		/**
		 * @lends uri
		 * @static
		 */

		/**
		 * 检查是否包含 ?
		 * @param { String } url 需要检查的 url.
		 * @return { Boolean } 如果含有 ?, 返回 true, 否则返回 false.
		 * @spec check is uri has ?.
		 * @example
		 *      uri.checkQmark('http://www.12sui.cn/') => false
		 *      uri.checkQmark('http://www.12sui.cn/?page=1') => true
		 */
		checkQmark: function(url) {

			return url.indexOf(QMARK) > -1;

		},

		/**
		 * 添加时间戳
		 * @param { String } url 需要添加时间戳的 url.
		 * @return { String } 添加时间戳后的 url.
		 * @spec add time stamp to an url.
		 * @example
		 *      uri.addStamp('http://www.12sui.cn/').indexOf('http://www.12sui.cn/?t=') > -1 => true
		 */
		addStamp: function(url) {

			return url + (this.checkQmark(url) ? AND : QMARK) + 't=' + new Date().getTime();

		},

		/**
		 * 构建 url
		 * @param { String } url 初始 url.
		 * @param { String | Object } params 要拼接的参数串.
		 * @return { String } 构建好的字符串.
		 * @spec build a url by some params.
		 * @example
		 *      uri.buildUri('http://www.12sui.cn/', { page: '1' }) => 'http://www.12sui.cn/?page=1'
		 *      uri.buildUri('http://www.12sui.cn/', 'page=1') => 'http://www.12sui.cn/?page=1'
		 */
		buildUri: function(url, params) {

			var host = this,
				mark = host.checkQmark(url) ? AND : QMARK;

			return url + mark + (lang.isObject(params) ? host.param(params) : params);

		},

		/**
		 * 转换对象为 url 参数
		 * @param { Object } obj 对象.
		 * @return { String } url 参数字符串.
		 * @spec Translate object to param string.
		 * @example
		 *      uri.param({a:'b', c:'d'}) => 'a=b&c=d';
		 */
		param: function(obj) {

			return object.toString(obj, ['=', '&'], true);

		},

		/**
		 * 转换 url 参数为字符串
		 * @param { String } str url 参数字符串.
		 * @return { Object } 对象.
		 * @spec Translate param string to object.
		 * @example
		 *      var o = uri.unparam('a=b&c=d');
		 *      o['a'] => 'b';
		 *      o['c'] => 'd';
		 */
		unparam: function(str) {

			return object.toObject(str, ['=', '&'], true);

		}

	};

});
