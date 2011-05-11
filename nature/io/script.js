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
				node = host.create(cfg.url),
				cb = cfg.success || function() {},
				status = /loaded|complete/;

			if (browser.isIE < 9) {

				event.add(node, 'readystatechange', function() {

					if (status.test(node.readyState)) {

						cb();

					}
						
				});

			} else {

				event.add(node, 'load', cb);

			}

			return node;

		},

		/**
		 * 创建 script 标签
		 * @param { String } url script 地址.
		 * @return { HTMLelement } script node.
		 */
		create: function(url) {

			var s = doc.createElement('script'),
				head = doc.head || doc.getElementsByTagName('head')[0];

			s.type = 'text/javascript';

			s.charset = 'utf-8';

			s.src = url;

			return head.appendChild(s);

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

					if (isFunction) {

						//under ie, can make an error
						try {

							delete win[id];

						} catch(e) {

							//

						}

					}

				}

			});

		}

	};

});
