/**
 * @fileoverview dom.html.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../type/lang.js', '../bom/browser.js', '../type/array.js', '../type/string.js'], function(lang, browser, array, string) {

	var win = window,
		doc = document,
		SPACE = ' ',
		EMPTY = '',
		ASTR = 'DXImageTransform.Microsoft.Alpha';

	/**
	 * 节点, 属性等操作
	 * @name html
	 * @namespace
	 */

	return {

		/**
		 * @lends html
		 * @static
		 */

		/**
		 * 获取节点
		 * @param { String | HTMLelement } id 可以是节点 id, 也可以是 DOM 节点.
		 * @return { HTMLelement } 返回第一个节点或者 null.
		 */
		byId: function(id) {

			if (!lang.isString(id)) {

				return id;

			}

			if (browser.isIE) {

				var host = this,
					el = doc.getElementById(id);

				if (el && (id === el.attributes.id.value || id === el.id)) {

					//>=ie 8
					return el;

				} else {

					//<=ie7
					var eles = doc.all[id],
						i = 0;

					if (!eles || eles.nodeName) {

						eles = [eles];

					}

					while (el = eles[i++]) {

						if (id === el.attributes.id.value || id === el.id) {

							return el;

						}

					}

				}

				return null;

			} else {

				return doc.getElementById(id) || null;

			}

		},

		/**
		 * 获取节点的非文本/空子节点
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { Function } filter 过滤条件, 可选.
		 * @return { Array } 节点数组.
		 */
		children: function(node, filter) {

			var host = this,
				children = host.byId(node).childNodes,
				ret = [],
				i = 0,
				len = children.length,
				child;

			for (; i < len; i++) {

				child = children[i];

				if (1 === child.nodeType) {

					if (filter) {

						filter(child) && ret.push(child);

					} else {

						ret.push(child);

					}

				}

			}

			return ret.length > 0 ? ret : null;


		},

		/**
		 * 获取节点的第一个子元素
		 * @param { HTMLelement | String } node 目标节点或者 id.
		 * @return { HTMLelement } 第一个子元素.
		 */
		first: function(node) {

			var host = this,
				children = host.children(node);

			return children ? children[0] : null;

		},

		/**
		 * 获取节点的最后一个子元素
		 * @param { HTMLelement | String } node 目标节点或者 id.
		 * @return { HTMLelement } 最后一个子元素.
		 */
		last: function(node) {

			var host = this,
				children = host.children(node);

			return children ? children[children.length - 1] : null;

		},

		/**
		 * 获取节点的下一个相邻节点
		 * @param { HTMLelement | String } node 目标节点或者 id.
		 * @param { Function } filter 过滤条件, 可选.
		 * @return { HTMLelement } 下一个节点或者 null.
		 */
		next: function(node, filter) {

			return this._getNeighbour(node, filter, 'next');

		},

		/**
		 * 获取节点的上一个相邻节点
		 * @param { HTMLelement | String } node 目标节点或者 id.
		 * @param { Function } filter 过滤条件, 可选.
		 * @return { HTMLelement } 前一个节点或者 null.
		 */
		prev: function(node, filter) {

			return this._getNeighbour(node, filter, 'previous');

		},

		/**
		 * 获取相邻节点
		 * @private
		 * @param { HTMLelement | String } node 目标节点或者 id.
		 * @param { Function } filter 过滤条件, 可选.
		 * @param { String } position 节点相对位置.
		 * @return { HTMLelement } 相邻节点或者 null.
		 */
		_getNeighbour: function(node, filter, position) {

			var host = this,
				ele = host.byId(node),
				type = position + 'Sibling',
				neighbour,
				ret;

			while (neighbour = ele[type]) {

				if (1 === neighbour.nodeType) {

					if (filter) {

						if (filter(neighbour)) {

							ret = neighbour;
							break;

						}

					} else {

						ret = neighbour;
						break;

					}

				}

				ele = ele[type];

			}

			return ret || null;

		},

		/**
		 * 获取节点的父节点
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { Function } filter 过滤条件, 可选.
		 * @return { HTMLelement } 父节点或者 null.
		 */
		parent: function(node, filter) {

			var host = this,
				root = doc.documentElement,
				ele = host.byId(node),
				par;

			if (root != node) {

				if (!filter) {

					return ele.parentNode;

				} else {

					while (par = ele.parentNode) {

						if (filter(par)) {

							break;

						} else {


							if (root == par) {

								par = null;
								break;

							} else {

								ele = ele.parentNode;

							}

						}

					}

					return par;

				}

			} else {

				return null;

			}

		},


		/**
		 * 判断一个节点是否是另一个节点的父节点
		 * @param { HTMLelement | String } ancestor 父节点或者 id.
		 * @param { HTMLelement | String } child 子节点或者 id.
		 * @return { Boolean } 如果是则返回 true, 否则返回 false.
		 */
		contains: function(ancestor, child) {

			var host = this,
				a = host.byId(ancestor),
				c = host.byId(child);

			if (!a || !c) {

				return false;

			}

			//ie, opera, safari
			if (a['contains']) {

				return a['contains'](c);

			}

			//firefox
			if (a['compareDocumentPosition']) {

				return a === c || !!(a['compareDocumentPosition'](c) & 16);

			}


		},

		/**
		 * 清空一个节点的子元素
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @return { HTMLelement } 节点.
		 */
		empty: function(node) {

			var n = this.byId(node);

			if (n) {

				n.innerHTML = EMPTY;

				return n;

			}

		},

		/**
		 * 插入节点到某个节点的后边
		 * @private
		 * @param { HTMLelement } node 新节点.
		 * @param { HTMLelement } refNode 目标节点.
		 * @return { HTMLelement } 新节点.
		 */
		_insertAfter: function(node, refNode) {

			var par = refNode.parentNode,
				next = refNode.nextSibling;

			if (par) {

				if (next) {

					par.insertBefore(node, next);

				} else {

					par.appendChild(node);

				}

				return node;

			}


		},

		/**
		 * 插入节点到某个节点的前边
		 * @private
		 * @param { HTMLelement } node 新节点.
		 * @param { HTMLelement } refNode 目标节点.
		 * @return { HTMLelement } 新节点.
		 */
		_insertBefore: function(node, refNode) {

			var par = refNode.parentNode;

			if (par) {

				par.insertBefore(node, refNode);

				return node;

			}

		},

		/**
		 * 将一个节点按指定位置放入
		 * @param { HTMLelement | String } node 新节点或者节点 id.
		 * @param { HTMLelement | String } refNode 目标节点或者节点 id.
		 * @param { String | Number } position 插入的位置, 可以是字符串 (before, after, replace, only, first, last), 默认为 last, 也可以是数字, 表示子元素的位置.
		 * @return { HTMLelement } 新节点.
		 */
		place: function(node, refNode, position) {

			var host = this,
				n = host.byId(node),
				r = host.byId(refNode),
				par,
				children;

			if (!n || !r) {

				return false;

			}

			par = r.parentNode;
			children = host.children(r);

			if (lang.isNumber(position)) {

				if (position > children.length - 1) {

					r.appendChild(n);

				} else {

					host._insertAfter(n, children[position - 1]);

				}


			} else if (lang.isString(position) || !position) {

				switch (position) {

					case 'after':
						host._insertAfter(n, r);
						break;

					case 'before':
						host._insertBefore(n, r);
						break;

					case 'replace':
						par.replaceChild(n, r);
						break;

					case 'only':
						host.empty(r);
						//continue

					case 'first':
						if (host.first(r)) {
							host._insertBefore(n, host.first(r));
						}
						//else continue
					default:
						r.appendChild(n);

				}

			}

			return n;

		},

		/**
		 * 创建一个节点
		 * @TODO script tag, style tag, iframe, etc.
		 * @param { String } tag 需要创建的标签.
		 * @param { Object } attrs 标签属性, 可选.
		 * @param { HTMLelement | String } refNode 需要插入的节点或者节点 id, 可选.
		 * @param { String | Number } pos 需要插入的位置, 可选.
		 * @return { HTMLelement } 新创建的节点.
		 * @example
		 * 		html.create('div', { id: 'test' }, document.body, first);
		 */
		create: function(tag, attrs, refNode, pos) {

			var host = this,
				isHTML = /<.+>/.test(tag),
				node,
				children,
				temp;

			if (isHTML) {

				//通过 html 字符串创建节点
				temp = doc.createElement('div');
				temp.innerHTML = tag;
				node = doc.createDocumentFragment();

				while (children = host.children(temp)) {

					node.appendChild(children[0]);

				}

				pos = refNode;
				refNode = attrs;

			} else {

				//通过 tag 创建节点
				node = doc.createElement(tag);

				if (attrs) {

					host.setAttribute(node, attrs);

				}

			}

			if (refNode) {

				return host.place(node, refNode, pos);

			}

			return node;


		},

		/**
		 * 获取节点 attribute 属性
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } name attribute 名字.
		 * @return { String } 如果 name 存在则返回 attribute 属性或者 undefined, 如果 name 不存在则返回 attributes 数组.
		 */
		getAttribute: function(node, name) {

			var attributes = this.byId(node).attributes,
				attribute;

			if (name) {

				attribute = attributes[name];

				return attribute ? attribute['value'] : undefined;

			}

			return attributes;

		},

		/**
		 * 设置节点 attribute 属性
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String | Object } name attribute 名字, 如果为对象, 则循环对象设置 key/value.
		 * @param { String } value 需要设置的 attribute 值.
		 * @return { String | Object } 返回设置的值.
		 */
		setAttribute: function(node, name, value) {

			var host = this,
				el = host.byId(node),
				i;

			if (lang.isString(name)) {

				if ('innerHTML' === name) {

					node[name] = value;

				}

				//兼容 ie7, 6
				if ('class' === name && browser.isIE < 8) {

					name = 'className';

				}

				el.setAttribute(name, value);

				return value;

			} else if (lang.isObject(name)) {

				for (i in name) {

					host.setAttribute(el, i, name[i]);

				}

				return name;

			}

		},

		/**
		 * 获取/设置 data-* 属性.
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } name 属性名, 不含 data-.
		 * @param { String } value 属性值.
		 * @return { Object | String } 当 name 不存在时, 返回 data-* 对象, 否则返回属性值.
		 */
		dataset: function(node, name, value) {

			var host = this,
				el = host.byId(node),
				attrs, attr,
				ret = {},
				i, len,
				reg, match,
				supportDataset = !!('dataset' in el);

			if (!supportDataset) {

				if (!name) {

					attrs = el.attributes;

					reg = /^data-(\S+)$/i;

					for (i = 0, len = attrs.length; i < len; i++) {

						attr = attrs[i];

						if (match = attr['name'].match(reg)) {

							match[1] && (ret[match[1]] = attr['value']);

						}

					}

					return ret;

				} else {

					if (value) {

						return host.setAttribute(el, 'data-' + name, value);

					}

					return host.getAttribute(el, 'data-' + name);

				}

			} else {

				attrs = el.dataset;

				if (!name) {

					return attrs;

				}

				if (value) {

					return attrs[name] = value;

				}

				return attrs[name];

			}

		},

		/**
		 * 返回唯一 id
		 * @param { String } prefix 前缀名.
		 * @return { String } 生成的唯一 id 字符串.
		 */
		generateId: function(prefix) {

			return string.unique(this.byId, prefix);

		}

	};

});
