/**
 * @fileoverview array 模块, Array 常用方法.
 * @author nanzhi<nanzhienai@163.com>
 */

define(['./lang.js'], function(lang) {

	var win = window,
		proto = Array.prototype;

	/**
	 * array 模块
	 * @name array
	 * @namespace
	 * @require lang.js
	 */
	return {

		/**
		 * @static
		 * @lends array
		 */

		/**
		 * 正向查找元素在数组中的第一个位置
		 * @param { Array } arr 数组.
		 * @param { Object } value 元素.
		 * @param { Number } fromindex 开始位置.
		 * @param { Boolean } fromlast 是否从后开始查找.
		 * @return { Number } 索引.
		 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
		 * @spec locates the first index of the provided value in the passed array.
		 * @example
		 * 	array.indexOf([1, 2, 1, 4], 1) => 0
		 *	array.indexOf([1, 2, 1, 4], 1, 1) => 2
		 *	array.indexOf([1, 2, 1, 4], 1,  -1) => -1
		 *	array.indexOf([1, 2, 1, 4], 1, -2) => 2
		 */
		indexOf: function(arr, value, fromindex, fromlast) {

			if (proto.indexOf) {

				return arr.indexOf(value, lang.isUndefined(fromindex) ? 0 : fromindex);

			}

			var end = arr.length,
				step,
				i = !lang.isUndefined(fromindex) ? (fromindex < 0 ? (fromindex + end) : fromindex) : -1;

			if (!fromlast) {

				step = 1;
				i = i == -1 ? 0 : i;

			} else {

				i = i == -1 ? (end - 1) : i;
				end = step = -1;

			}

			for (; i != end; i += step) {

				if (arr[i] == value) {

					return i;

				}

			}

			return -1;

		},

		/**
		 * 反向查找元素在数组中的最后一个位置
		 * @param { Array } arr 数组.
		 * @param { Object } value 元素.
		 * @param { Number } fromindex 开始位置.
		 * @return { Number } 索引.
		 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
		 * @spec locates the last index of the provided value in the passed array.
		 * @example
		 * 	array.lastIndexOf([1, 2, 1, 4], 1) => 2
		 *	array.lastIndexOf([1, 2, 1, 4], 1, 1) => 0
		 *	array.lastIndexOf([1, 2, 1, 4], 1, -1) => 2
		 *	array.lastIndexOf([1, 2, 1, 4], 1, -2) => 2
		 */
		lastIndexOf: function(arr, value, fromindex) {

			if (proto.lastIndexOf) {

				return arr.lastIndexOf(value, lang.isUndefined(fromindex) ? (arr.length - 1) : fromindex);

			}

			return this.indexOf(arr, value, fromindex, true);

		},

		/**
		 * 循环数组, 并对数组元素进行函数调用
		 * @param { Array } arr 数组.
		 * @param { Function } callback 函数.
		 * @param { Object } thisObject 作用域.
		 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
		 * @spec for every item in arr, callback is invoked.
		 * @example
		 * 	var str = '';
		 *	array.forEach([1, 2], function(item, i, a) {
		 *		str += item + ',' + i + ',' + a.join(',');	
		 *	});	
		 *	str => '1,0,1,22,1,1,2'
		 */
		forEach: function(arr, callback, thisObject) {

			if (proto.forEach) {

				return arr.forEach(callback, thisObject);

			}

			for (var i = 0, len = arr.length; i < len; ++i) {

				callback.call(thisObject || win, arr[i], i, arr);

			}

		},

		/**
		 * 是否所有数组元素都能通过函数校验
		 * @param { Array } arr 数组.
		 * @param { Function } callback 校验函数.
		 * @param { Object } thisObject 作用域.
		 * @return { Boolean } 如果全部通过校验则返回 true, 否则返回 false.
		 * @see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/every
		 * @spec Determines whether or not every item in arr satisfies the condition implemented by callback.
		 * @example
		 * 	var a = array.every([1, 2], function(i) {
		 *		 		return 'number' == typeof i;
		 *		 	}),	
		 *	 	b = array.every([1, '2'], function(i) {
		 *	 		    return 'number' == typeof i;
		 *	 	    });
		 *	a => true
		 *	b => false
		 */
		every: function(arr, callback, thisObject) {

			if (proto.every) {

				return arr.every(callback, thisObject);

			}

			return this._everyOrSome(true, arr, callback, thisObject);

		},

		/**
		 * 是否所有数组元素都能通过函数校验
		 * @private
		 * @param { Boolean } every 是否检验所有.
		 * @param { Array } arr 数组.
		 * @param { Function } callback 校验函数.
		 * @param { Object } thisObject 作用域.
		 * @return { Boolean }
		 */
		_everyOrSome: function(every, arr, callback, thisObject) {

			var i = 0,
				len = arr.length,
				result;

			for (; i < len; ++i) {

				result = !!callback.call(thisObject || win, arr[i], i, arr);

				if (every ^ result) {

					return result; // Boolean

				}

			}

			return every; // Boolean

		},

		/**
		 * 是否有数组元素能够通过函数校验
		 * @param { Array } arr 数组.
		 * @param { Function } callback 校验函数.
		 * @param { Object } thisObject 作用域.
		 * @return { Boolean } 如果有元素通过校验则返回 true, 否则返回 false.
		 * @see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/some
		 * @spec Determines whether or not any item in arr satisfies the condition implemented by callback.
		 * @example
		 * 	var a = array.some([1, 2], function(i) {
		 *				return 'number' == typeof i;
		 *			}),
		 *		b = array.some([1, '2'], function(i) {
		 *				return 'number' == typeof i;
		 *			}),	
		 *		c = array.some(['1', '2'], function(i) {
		 *				return 'number' == typeof i;
		 *			});
		 *	a => true
		 *	b => true
		 *	c => false
		 */
		some: function(arr, callback, thisObject) {

			if (proto.some) {

				return arr.some(callback, thisObject);

			}

			return this._everyOrSome(false, arr, callback, thisObject);

		},

		/**
		 * 对数组每个元素作为函数参数运行, 返回由结果组成的数组
		 * @param { Array } arr 数组.
		 * @param { Function } callback 函数.
		 * @param { thisObject } 作用域.
		 * @return { Array } 给定函数运行结果的集合.
		 * @see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
		 * @spec applies callback to each element of arr and returns an Array with the results.
		 * @example
		 * 	var r = array.map([1, 2, 3], function(i) {
		 *		        return i * 2;	
		 *			});
		 *	r.join(',') => '2,4,6'
		 */
		map: function(arr, callback, thisObject) {

			if (proto.map) {
				return arr.map(callback, thisObject);
			}

			var i = 0,
				len = arr.length,
				result = [];

			for (; i < len; ++i) {

				result.push(callback.call(thisObject || win, arr[i], i, arr));

			}

			return result;

		},

		/**
		 * 对数组每个元素进行校验, 最终返回通过检验的元素组成的数组
		 * @param { Array } arr 数组.
		 * @param { Function } callback 函数.
		 * @param { thisObject } 作用域.
		 * @return { Array } 通过校验的元素数组.
		 * @see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
		 * @spec Returns a new Array with those items from arr that match the condition implemented by callback.
		 * @example
		 *  var r = array.filter([1, 2, '3'], function(i) {
	 	 *				return 'number' == typeof i;
		 *			});
		 *	r.join(',') => '1,2'
		 */
		filter: function(arr, callback, thisObject) {

			if (proto.filter) {
				return arr.filter(callback, thisObject);
			}

			var i = 0,
				len = arr.length,
				result = [];

			for (; i < len; ++i) {

				if (!!callback.call(thisObject || win, arr[i], i, arr)) {

					result.push(arr[i]);

				}

			}

			return result;

		}

	};

});
