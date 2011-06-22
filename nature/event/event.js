/**
 * @fileoveview 事件注册
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../dom/html.js', '../bom/browser.js'], function(lang, html, browser) {

	var win = window,
		doc = document,
		hasAdd = win.addEventListener,//拥有添加事件方法
//		loaded = false,
//		callbacks = [],
		_listener;

	/**
	 * 事件注册
	 * @name event
	 * @namespace
	 */
	_listener = {

		/**
		 * 添加事件
		 * @private
		 * @param { HTMLElement } node 节点.
		 * @param { String } type 事件类型.
		 * @param { Function } func 回调函数.
		 * @return { Function } 回调函数.
		 */
		add: function(node, type, func) {

			var host = this,
				fp = function(ev) {
					return host._fixCallback(type, func).call(this, ev);
				},
				enter_reg = /mouseenter|mouseleave/i,
				focus_reg = /focusin|focusout/i,
				m;

			//fix mouseenter, mouseleave
			m = type.match(enter_reg);
			if (m && m[0] && !browser.isIE) {

				type = 'mouseenter' === m[0] ? 'mouseover' : 'mouseout';

				//非 ie 浏览器
				fp = function(ev) {

					if (!html.contains(node, ev.relatedTarget)) {

						return host._fixCallback(type, func).call(this, ev);

					}

				};

			}

			//fix focusin, focusout
			m = type.match(focus_reg);
			if (m && m[0] && !browser.isIE) {

				return node.addEventListener('focusin' === m[0] ? 'focus' : 'blur', fp, true);

			}

			//兼容性处理
			if (hasAdd) {

				node.addEventListener(type, fp, false);

			} else {

				node.attachEvent('on' + type, fp);

			}

			return fp;

		},

		/**
		 * 移除事件
		 * @private
		 * @param { HTMLElement } node 节点.
		 * @param { String } type 事件类型.
		 * @param { Function } handle 函数, add 返回值.
		 * @return
		 */
		remove: function(node, type, handle) {

			if (hasAdd) {

				return node.removeEventListener(type, handle, false);

			} else {

				return node.detachEvent('on' + type, handle);

			}

		},

		/**
		 * fix callback
		 * @private
		 * @param { String } type 事件类型.
		 * @param { Function } func 回调函数.
		 * @return { Function } 修改过 ev 的函数.
		 */
		_fixCallback: function(type, func) {

			return function(ev) {

				func.call(this, _listener._fixEvent(ev));

			};

		},

		/**
		 * 为事件对象添加属性, 方法
		 * @private
		 * @param { Event Object } ev 事件对象.
		 * @param
		 * @return { Event Object } 事件对象.
		 */
		_fixEvent: function(ev) {

			ev = ev || win.event;

			var host = this;

			//target
			if (!ev.target) {

				ev.target = ev.srcElement;

			}

			//阻止默认事件
			if (!ev.preventDefault) {

				ev.preventDefault = function() {

					ev.returnValue = false;

					return false;

				};

			}

			//阻止冒泡
			if (!ev.stopPropagation) {

				ev.stopPropagation = function() {

					ev.cancelBubble = true;

				};

			}

			//阻止默认事件和冒泡
			if (!ev.stopEvent) {

				ev.stopEvent = function() {

					ev.preventDefault();
					ev.stopPropagation();

				};

			}

			//修改 key
			host._fixKey(ev);

			return ev;

		},

		/**
		 * 修改 key
		 * @private
		 * @param { Event Object } ev 事件对象.
		 * @return { Event Object } 事件对象.
		 */
		_fixKey: function(ev) {


		}

	};

//	/**
//	 * domready init 函数
//	 * @private
//	 */
//	function _loadinit() {
//
//		if (!loaded) {
//
//			if (win.detachEvent) {
//
//				win.detachEvent('onload', _loadinit);
//
//			}
//
//		}
//
//		loaded = true;
//
//		for (var i = 0, len = callbacks.length; i < len; i++) {
//
//			callbacks[i]();
//
//		}
//
//		callbacks.length = 0;
//
//
//	}
//
//	/**
//	 * check scroll
//	 * @private
//	 */
//	function _doScroll() {
//
//		try {
//
//			if (doc.body) {
//
//				doc.documentElement.doScroll('left');
//				dojo._loadinit();
//
//			}
//
//		} catch (e) {
//
//			setTimeout(arguments.callee, 50);
//
//		}
//
//	}

	return {

		/**
		 * @lends event
		 * @static
		 */

		/**
		 * 添加事件
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { String } type 事件类型.
		 * @param { Function | String } func 事件函数, 或者对象方法名.
		 * @param { Object } scope 函数作用域.
		 * @return { Function } 事件, 用于移除事件.
		 */
		add: function(node, type, func, scope) {

			node = html.byId(node);

			return [node, type, _listener.add(node, type, lang.hitch(scope, func))];

		},

		/**
		 * 解除事件
		 * @param { Function | String } handle add 返回值.
		 */
		remove: function(handle) {

			return _listener.remove.apply(_listener, handle);

//		},
//
//		/**
//		 * onDOMReady
//		 * @param { Function } callback 回调函数.
//		 */
//		onDOMReady: function(callback) {
//
//			callbacks.push(callback);
//
//			if (loaded) {
//
//				_loadinit();
//
//			} else if ('complete' === doc.readyState) {
//
//                _loadinit();
//				
//			} else {
//
//				if (hasAdd) {
//
//					doc.addEventListener('DOMContentLoaded', _loadinit, false);
//					win.addEventListener('load', _loadinit, false);
//
//				} else {
//
//					win.attachEvent('onload', _loadinit);
//					_doScroll();
//
//				}
//
//			}
//
		}

	};

});
