/**
 * @fileoverview screen 模块.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../bom/browser.js', './html.js'], function(browser, html) {

	var win = window,
		doc = document,
		body = doc.body,
		docElem = doc.documentElement,
		OFFSET_WIDTH = 'offsetWidth',
		OFFSET_Height = 'offsetHeight',
		INNER_WIDTH = 'innerWidth',
		INNER_HEIGHT = 'innerHeight',
		CLIENT_WIDTH = 'clientWidth',
		CLIENT_HEIGHT = 'clientHeight',
		SCROLL_TOP = 'scrollTop',
		SCROLL_LEFT = 'scrollLeft',
		LEFT = 'left',
		RIGHT = 'right',
		TOP = 'top',
		BOTTOM = 'bottom';

	/**
	 * 文档尺寸, 节点位置获取
	 * @name screen
	 * @namespace
	 */

	return {

		/**
		 * @lends screen
		 * @static
		 */

		/**
		 * 获取滚动条已滚的范围
		 * @return { Object } 返回已滚的范围对象.
		 */
		scroll: function() {

			var node = browser.isQuirks ? body : docElem;

			return { x: node[SCROLL_LEFT] || 0, y: node[SCROLL_TOP] || 0 };

		},

		/**
		 * 获取纵向滚动条已滚范围
		 * @return { Number } 返回纵向滚动条已滚范围.
		 */
		scrollTop: function() {

			return this.scroll()['y'];

		},

		/**
		 * 获取横向滚动条已滚范围
		 * @return { Number } 返回横向滚动条已滚范围.
		 */
		scrollLeft: function() {

			return this.scroll()['x'];

		},

		/**
		 * 获取节点位置
		 * @param { HTMLelement | String } node 节点或者节点 id.
		 * @param { Boolean } includeScroll 计算时是否包含滚动条.
		 * @return { Object } { x: 100, y: 100, w: 100, h: 100 }.
		 * @TODO fix ie7 2px bug
		 */
		position: function(node, includeScroll) {

			var host = this,
				scroll,
				el = html.byId(node),
				coord = el.getBoundingClientRect(),
				ret = { x: coord[LEFT], y: coord[TOP], w: coord[RIGHT] - coord[LEFT], h: coord[BOTTOM] - coord[TOP] };

			if (includeScroll) {

				scroll = host.scroll();

				ret['x'] += scroll['x'];
				ret['y'] += scroll['y'];

			}

			return ret;

		},

		/**
		 * 获取文档大小
		 * @return { Array } 数组, 第一个是文档宽度, 第二个是文档高度.
		 */
		docSize: function() {

			return [

				Math.max(body[OFFSET_WIDTH], docElem[OFFSET_WIDTH]),
				Math.max(body[OFFSET_HEIGHT], docElem[OFFSET_HEIGHT])

			];

		},

		/**
		 * 获取文档高度
		 * @return { Number } 文档高度.
		 */
		docHeight: function() {

			return this.docSize()[1];

		},

		/**
		 * 获取文档宽度
		 * @return { Number } 文档宽度.
		 */
		docWidth: function() {

			return this.docSize()[0];

		},

		/**
		 * 获取文档可视大小
		 * @return { Array } 文档可视大小, 第一个元素为可视宽度, 第二个为可视高度.
		 */
		viewport: function() {

			return [

				win[INNER_WIDTH] || docElem[CLIENT_WIDTH],
				win[INNER_HEIGHT] || docElem[CLIENT_HEIGHT]

			];

		},

		/**
		 * 获取文档可视宽度
		 * @return { Number } 文档可视宽度.
		 */
		viewportWidth: function() {

			return this.viewport()[0];

		},

		/**
		 * 获取文档可视高度
		 * @return { Number } 文档可视高度.
		 */
		viewportHeight: function() {

			return this.viewport()[1];

		}

	};

});
