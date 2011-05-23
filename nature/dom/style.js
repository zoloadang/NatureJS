/**
 * @fileoverview style module.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../type/lang.js', '../type/string.js', './html.js', '../bom/browser.js'], function(lang, string, html, browser) {

	var win = window,
		doc = document,
		docElem = doc.documentElement,
		SPACE = ' ';

	/**
	 * 样式操作
	 * @name style
	 * @namespace
	 */

	return {

		/**
		 * @lends style
		 * @static
		 */

		/**
		 * 判断节点是否有 class
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } cname class 名字.
		 * @return { Boolean } 如果有则返回 true, 否则返回 false.
		 */
		hasClass: function(node, cname) {

			var	reg = new RegExp('(?:^|\\s+)' + cname + '(?:\\s+|$)');

			return reg.test(html.getAttribute(node, 'class'));

		},

		/**
		 * 判断节点或者父节点是否有 class
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } cname class 名字.
		 * @return { Boolean } 如果有或者父节点有则返回 true, 否则返回 false.
		 */
		hasAncestor: function(node, cname) {

			var host = this,
				ret = host.hasClass(node, cname);

			if (!ret) {

				//尝试获取含有 class 的父节点
				ret = html.parent(node, function(el) {

					      return host.hasClass(el, cname);

					  });

			}

			return !!ret;

		},

		/**
		 * 为节点添加 class
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } cname 需要添加的 class.
		 * @return { String } 添加的 class.
		 */
		addClass: function(node, cname) {

			var host = this,
				cls = html.getAttribute(node, 'class'),
				ret;

			if (!host.hasClass(node, cname)) {

				ret = string.trim(cls + SPACE + cname);
				html.setAttribute(node, 'class', ret);

			}

			return cname;

		},

		/**
		 * 移除节点 class
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } cname 需要移除的 class.
		 * @return { String } 移除的 class.
		 */
		removeClass: function(node, cname) {

			var host = this,
				cls,
				reg,
				ret;

			if (host.hasClass(node, cname)) {

				reg = new RegExp('(?:^|\\s+)' + cname + '(?:\\s+|$)');
				cls = html.getAttribute(node, 'class');
				ret = string.trim(cls.split(reg).join(SPACE));
				html.setAttribute(node, 'class', ret);

			}

			return cname;

		},

		/**
		 * 添加或者移除节点 class
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } cname 需要移除的 class.
		 * @return { String } 添加/移除的 class.
		 */
		toggleClass: function(node, cname) {

			var host = this;

			if (host.hasClass(node, cname)) {

				return host.removeClass(node, cname);

			}

			return host.addClass(node, cname);

		},

		/**
		 * 获取节点 style
		 * @param { String | HTMLelement } node 节点或者节点 id.
		 * @param { String } name 需要获取的 style 名.
		 * @return { String } style 值.
		 * @example
		 * 		dom.getStyle('style', 'opacity');
		 */
		getStyle: function(node, name) {

			var host = this,
				el = html.byId(node),
				property,
				value,
				computed,
				so = 'opacity' === name,
				sf = 'float' === name;

			if (win['getComputedStyle']) {

				property = sf ? 'cssFloat' : name;
				value = el['style'][property];

				if (!value) {

					computed = el['ownerDocument']['defaultView']['getComputedStyle'](el, null);

					if (computed) {

						value = computed[property];

					}

				}

			} else if (el['currentStyle']) {

				if (so) {

					return host._getOpacity(el);

				}

				property = sf ? 'styleFloat' : name;

				value = el['currentStyle'][property];

			}

			return host._fixStyle(el, name, value);

		},

		/**
		 * 修改获取的 style 值, 保持各浏览器一致
		 * @private
		 * @param { HTMLelement } node 节点.
		 * @param { String } name style 名.
		 * @param { String } value style 值.
		 * @return { String } style 值.
		 */
		_fixStyle: function(node, name, value) {

			var host = this,
				_pixelRegExp = /margin|padding|width|height|max|min|offset/;

			//fix auto, only fix width and height
			if ('auto' === value && browser.isIE < 8) {
				//非 ie 以及 ie8 以上浏览器下恒为 0

				if ('width' === name) {

					return node.offsetWidth;

				}

				if ('height' === name) {

					return node.offsetHeight;

				}

			}

			//fix px
			if (_pixelRegExp.test(name)) {

				return host._fixPixel(value);

			}

			//@TODO fix inherit
			/*
			if ('inherit' === value && browser.isIE) {

				if (docElem != node) {

					return host.getStyle(node.parentNode, name);

				}

			}
			*/

			return value;

		},

		/**
		 * 修改获取的 style 类型为 px 值的 style
		 * @private
		 * @param { String } value style 值.
		 * @return { String } style 值.
		 */
		_fixPixel: function(value) {

			return parseFloat(value) || 0;

		},

		/**
		 * 获取透明度
		 * @private
		 * @param { HTMLelement } node 节点.
		 * @return { Number } opacity 值.
		 */
		_getOpacity: function(node) {

			try {

				return node['filters'][ASTR]['opacity'] / 100;

			} catch (e) {

				try {

					return node['filters']['alpha']['opacity'] / 100;

				} catch (e) {

					return 1;

				}

			}

		},

		/**
		 * 设置节点 style
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } name 属性名.
		 * @param { String } value 属性值.
		 * @return { String } value 值.
		 * @example:
		 * 		dom.setStyle('style', 'float', 'left');
		 * 		dom.setStyle(doc.body, { opacity: '0.2' });
		 */
		setStyle: function(node, name, value) {

			var	host = this,
				el = html.byId(node),
				so = 'opacity' === name,
				sf = 'float' === name,
				property,
				i;

			if (lang.isObject(name)) {

				for (i in name) {

					arguments.callee.call(host, node, i, name[i]);

				}

				return false;

			}

			if (so) {

				return host._setOpacity(el, value);

			}

			if (sf) {

				property = win['getComputedStyle'] ? 'cssFloat' : 'styleFloat';

			} else {

				property = name;

			}

			return el['style'][property] = value;


		}

	};

});
