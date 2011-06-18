/**
 * @fileoverview 本地存储.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../util/json.js'], function(lang, json) {

	/**
	 * @name storage
	 * @namespace
	 */
	var	win = window,
		doc = document,
		IDENTITY = 'NatureJS_Storage',
		ls = win['localStorage'],
		elem,
		EMPTY = '',
		storage;

	if (ls) {

		storage = {

			/**
			 * @lends storage
			 * @static
			 */

			/**
			 * 读取本地存储.
			 * @param { String } key 存储名.
			 * @return { String } 本地存储值.
			 * @spec set and get localstorage
			 * @example
			 * 		storage.setItem('a', 'h');
			 * 		storage.setItem('b', {'c': 'd'});
			 * 		storage.getItem('a') => 'h';
			 * 		storage.getItem('b') => '{"c":"d"}';
			 * 		storage.removeItem('b');
			 * 		storage.getItem('b') => null;
			 * 		storage.clear();
			 * 		storage.getItem('a') => null;
			 */
			getItem: function(key) {

				return ls.getItem(key);

			},

			/**
			 * 写入本地存储
			 * @param { String } key 存储名.
			 * @param { Anything } value 需要存储的值.
			 */
			setItem: function(key, value) {

				var ret = value;

				if (lang.isObject(ret)) {

					ret = json.stringify(value);

				}

				return ls.setItem(key, ret);

			},

			/**
			 * 移除本地存储.
			 * @param { String } key 存储名.
			 */
			removeItem: function(key) {

				return ls.removeItem(key);

			},

			/**
			 * 清除所有本地存储
			 * @return
			 */
			clear: function() {

				return ls.clear();

			}

		};

	} else {

		elem = doc.createElement('input');
		elem.type = 'hidden';
		elem.addBehavior('behavior:url(#default#userData)');
		doc.body.appendChild(el);

		storage = {

			getItem: function(key) {

				var ret;

				try {
					elem.load(IDENTITY);
					ret = elem.getAttribute(key);
				} catch (e) {
					//
				}

				return ret;

			},

			setItem: function(key, value) {

				try {
					elem.setAttribute(key, value);
					el.save(IDENTITY);
				} catch (e) {
					//
				}

			},

			removeItem: function(key) {

				try {
					elem.load(IDENTITY);
					elem.removeAttribute(key);
					el.save(IDENTITY);
				} catch (e) {
					//
				}

			},

			clear: function() {

				try {
					elem.load(IDENTITY);
					elem.expires = new Date(1).toUTCString();
					elem.save(IDENTITY);
				} catch (e) {
					//
				}

			}

		};

	}

	return storage;

});
