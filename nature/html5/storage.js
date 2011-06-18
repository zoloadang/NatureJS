/**
 * @fileoverview 本地存储.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../util/json.js'], function(lang, json) {

	/**
	 * 本地存储.
	 * @name storage
	 * @namespace
	 */
	var	win = window,
		doc = document,
		IDENTITY = location.host,
		ls = win['localStorage'],
		elem,
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
			 * @spec set and get localstorage.
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
			 * 写入本地存储, 当 value 值为对象时会转换为 json 格式进行存储, 当为其他类型时转换为 toString() 来存储.
			 * @param { String } key 存储名.
			 * @param { Anything } value 需要存储的值.
			 */
			setItem: function(key, value) {

				var ret = value;

				if (lang.isObject(ret)) {

					ret = json.stringify(value);

				}

				return ls.setItem(key, ret.toString());

			},

			/**
			 * 移除本地存储.
			 * @param { String } key 存储名.
			 */
			removeItem: function(key) {

				return ls.removeItem(key);

			},

			/**
			 * 清除所有本地存储.
			 * @return
			 */
			clear: function() {

				return ls.clear();

			}

		};

	} else {

		elem = doc.createElement('input');
		elem.type = 'hidden';
		elem.style.behavior = 'url(#default#userData)';
		doc.body.appendChild(elem);

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

				var ret = value;

				if (lang.isObject(ret)) {

					ret = json.stringify(value);

				}

				try {
					elem.load(IDENTITY);
					elem.setAttribute(key, ret.toString());
					elem.save(IDENTITY);
				} catch (e) {
					//
				}

			},

			removeItem: function(key) {

				try {
					elem.load(IDENTITY);
					elem.removeAttribute(key);
					elem.save(IDENTITY);
				} catch (e) {
					//
				}

			},

			clear: function() {

				try {
					elem.load(IDENTITY);
					elem.expires = new Date(new Date().getTime() - 10000).toUTCString();
					elem.save(IDENTITY);
				} catch (e) {
					//
				}

			}

		};

	}

	return storage;

});
