/**
 * @fileoverview cookie 模块.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/object.js', '../type/string.js'], function(object, string) {

	var win = window,
		doc = document;

	/**
	 * cookie 模块
	 * @name cookie
	 * @namespace
	 */
	return {

		/**
		 * @lends cookie
		 * @static
		 */

		/**
		 * 获取 cookie
		 * @param { String } name cookie 名.
		 * @return { String } cookie 值.
		 * @spec set and get cookie.
		 * @example:
  		 *	cookie.set('nick', 'nanzhi', { 'max-age': 2, domain: location.host });
		 *	cookie.set('name', '南芝');
		 *	cookie.set('mail', 'nanzhienai@163.com', { expires: new Date(new Date().getTime() + 24 * 60 * 60 * 3600) });
		 *	cookie.get('nick') => 'nanzhi'
		 *	cookie.get('name') => '南芝'
		 *	cookie.get('mail') => 'nanzhienai@163.com'
		 */
		get: function(name) {

			var cookie = doc.cookie,
				reg = new RegExp('(?:^|;\\s*)' + unescape(string.trim(name)) + '=([^;]*)'),
				match = cookie.match(reg);

			return match ? decodeURIComponent(match[1]) : undefined;

	    },

		/**
		 * 设置 cookie
		 * @param { String } name cookie 名.
		 * @param { String } value cookie 值.
		 * @param { Object } props 其它选项.
		 * @return { String } cookie 值.
		 * @example:
  		 *	cookie.set('nick', 'nanzhi', { 'max-age': 2, domain: location.host });
		 *	cookie.set('name', '南芝');
		 *	cookie.set('mail', 'nanzhienai@163.com', { expires: new Date(new Date().getTime() + 24 * 60 * 60 * 3600) });
		 */
		set: function(name, value, props) {

			props = props || {};

			var str = escape(name) + '=' + encodeURIComponent(value) + ';',
				exp = props['expires'],
				age = props['max-age'];

			if (exp) {

				props['expires'] = exp.toUTCString();

			}

			if (age) {

				props['max-age'] = age * 24 * 60 * 60;

			}

			doc.cookie = str + object.toString(props, ['=', ';']);

		},

		/**
		 * 检测浏览器是否支持 cookie
		 * @return { Boolean } 如果浏览器开启了 cookie. 则返回 true, 否则返回 false.
		 * @spec check browser is supported cookie.
		 *  cookie.isEnable() => true
		 */
		isEnable: function() {

			var host = this,
				nav = win.navigator,
				name = '_natureCookieTest',
				value = '_natureCookieAllowed';

			if (!('cookieEnabled' in nav)) {

				//尝试设置 cookie
				host.set(name, value);
				nav['cookieEnabled'] = value === host.get(name);

				//删除 cookie
				if (nav['cookieEnabled']) {

					host.set(name, '', { 'max-age': -1 });

				}

			}

			return nav['cookieEnabled'];

		}

	};

});
