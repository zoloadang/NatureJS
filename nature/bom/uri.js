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
		 */
		checkQmark: function(url) {

			return url.indexOf(QMARK) > -1;

		},

		/**
		 * 添加时间戳
		 * @param { String } url 需要添加时间戳的 url.
		 * @return { String } 添加时间戳后的 url.
		 * @example:
		 * 		uri.addStamp('http://www.12sui.cn/'); //print: http://www.12sui.cn/?t=1232421394
		 */
		addStamp: function(url) {

			return url + (this.checkQmark(url) ? AND : QMARK) + 't=' + new Date().getTime();

		},

		/**
		 * 构建 url
		 * @param { String } url 初始 url.
		 * @param { String | Object } params 要拼接的参数串.
		 * @return { String } 构建好的字符串.
		 * @example
		 * 		uri.buildUri('http://www.12sui.cn/', { page: '1' }) // http://www.12sui.cn/?page=1
		 * 		uri.buildUri('http://www.12sui.cn/', 'page=1') // http://www.12sui.cn/?page=1
		 */
		buildUri: function(url, params) {

			var mark = this.checkQmark(url) ? AND : QMARK;

			return url + mark + (lang.isObject(params) ? object.param(params) : params);

		}

	};

});
