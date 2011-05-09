/**
 * @fileoverview script 异步载入模块.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../event/event.js', '../bom/browser.js', '../type/lang.js'], function(event, browser, lang) {

	var win = window,
		doc = document;

	/**
	 * script 异步载入模块
	 * @name script
	 * @namespace
	 */
	return {

		/**
		 * @lends script
		 * @static
		 */

		/**
		 * 载入 script
		 * @param { Object } cfg 配置项.
		 * @return { HTMLelement } script node.
		 */
		get: function(cfg) {

			var host = this,
				node = host.create(cfg.url);

			event.add(node, browser.isIE < 9 ? 'readystatechange' : 'load', cfg.success || function() {});

			return node;

		},

		/**
		 * 创建 script 标签
		 * @param { String } url script 地址.
		 * @return { HTMLelement } script node.
		 */
		create: function(url) {

			var s = doc.createElement('script');

			s.src = url;

			s.charset = 'utf-8';

			return doc.head.appendChild(s);

		},

		/**
		 * 移除 script 标签
		 * @param { HTMLelement } node script node.
		 */
		remove: function(node) {

			node.parentNode.removeChild(node);

		},

		/**
		 * jsonp
		 * @param { Object } cfg 配置项.
		 */
		jsonp: function(cfg) {

			var host = this,
				s,
				url = cfg.url,
				success = cfg.success,
				isFunction = lang.isFunction(success),
				id;

			if (isFunction) {

				id = 'nature_jsonp_' + new Date().getTime();
				win[id] = success;

			} else {

				id = success;

			}

			s = host.get({

				url: url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + id,

				success: function() {

					host.remove(s);

					isFunction && delete win[id];

				}

			});

		}

	};

});
