/**
 * @fileoverview style module.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../type/lang.js', '../type/string.js', './html.js'], function(lang, string, html) {

	var win = window,
		doc = document,
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
		 * @TODO 同时检测子元素
		 */
		hasClass: function(node, cname) {

			var	reg = new RegExp('(?:^|\\s+)' + cname + '(?:\\s+|$)');

			return reg.test(html.getAttribute(node, 'class'));

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
		 * @param { String } style 需要获取的 style 名.
		 * @return { String } style 值.
		 * @example
		 * 		dom.getStyle('style', 'opacity');
		 */
		getStyle: function(node, style) {

			var host = this,
				el = html.byId(node),
				property,
				value,
				computed,
				so = 'opacity' === style,
				sf = 'float' === style;

			if (win['getComputedStyle']) {

				property = sf ? 'cssFloat' : style;
				value = el['style'][property];

				if (!value) {

					computed = el['ownerDocument']['defaultView']['getComputedStyle'](el, null);

					if (computed) {

						value = computed[property];

					}

				}

				return value;

			} else if (el['currentStyle']) {

				if (so) {

					return host._getOpacity(el);

				}

				property = sf ? 'styleFloat' : style;

				return el['currentStyle'][property];

			}

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
