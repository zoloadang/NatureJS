/**
 * @fileoverview 浏览器信息.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['../type/lang.js'], function(lang) {

	/**
	 * 浏览器信息
	 * @name browser
	 * @namespace
	 * @require lang.js
	 */
	var win = window,
		doc = document,
		n = navigator,
		ua = n.userAgent,
		av = n.appVersion,
		tv = parseFloat(av),
		UNDEFINED = undefined,
		opera = win.opera,
		mode,
		browser = {};

	/**
	 * @lends browser
	 * @static
	 */

	if (!lang.isUndefined(win)) {

		/**
		 * 是否是浏览器
		 * @property
		 */
		browser.isBrowser = true;

		/**
		 * 是否是 Opera
		 * @property
		 */
		browser.isOpera = opera ? parseFloat(opera.version()) : UNDEFINED;

		/**
		 * 是否是 Khtml 浏览器
		 * @proprety
		 */
		browser.isKhtml = av.indexOf('Konqueror') > -1 ? tv : UNDEFINED;

		/**
		 * 是否是 WebKit 浏览器
		 * @property
		 */
		browser.isWebKit = parseFloat(ua.split('WebKit/')[1]) || UNDEFINED;

		/**
		 * 是否是 Chrome 浏览器
		 * @property
		 */
		browser.isChrome = parseFloat(ua.split('Chrome/')[1]) || UNDEFINED;

		/**
		 * 是否是 Maxthon 浏览器
		 * @property
		 */
		browser.isMaxthon = parseFloat(ua.split('Maxthon/')[1]) || UNDEFINED;

		/**
		 * 是否是 Safari 浏览器
		 * @property
		 */
		if (browser.isWebKit && !browser.isChrome && !browser.isMaxthon && ua.indexOf('Safari') > -1) {

			browser.isSafari = parseFloat(ua.split('Version/')[1]) || UNDEFINED;

		}

		/**
		 * 是否是 Gecko 核心浏览器 (等同于 isMozilla, isMoz)
		 * @property
		 */
		browser.isGecko = browser.isMozilla = browser.isMoz = ua.indexOf('Gecko') > -1 && !browser.isWebKit && !browser.isKhtml ? tv : UNDEFINED;

		/**
		 * 是否是 Firefox 浏览器 (等同于 isFF)
		 * @property
		 */
		browser.isFirefox = browser.isFF = browser.isGecko ? parseFloat(ua.split('Firefox/')[1]) : UNDEFINED;

		/**
		 * 是否是 IE 浏览器
		 * @property
		 */
		if (doc.all && !browser.isOpera) {

			mode = doc.docMode;

			browser.isIE = mode && 5 !== mode ? mode : parseFloat(ua.split('MSIE ')[1]);

		}

		/**
		 * 是否是怪异模式
		 * @property
		 */
		browser.isQuirks = 'BackCompat' === doc.compatMode;

	}

	return browser;

});
