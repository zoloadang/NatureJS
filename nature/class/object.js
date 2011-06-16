/**
 * @fileoverview 创建原型实例.
 * @author nanzhi<nanzhienai@163.com>
 */
define(function() {

	/**
	 * @name class
	 * @namespace
	 */

	/**
	 * @lends class
	 * @static
	 */

	/**
	 * 创建原型实例
	 * @param { Object } o 原型对象.
	 * @return { Object } 实例.
	 * @spec create an instance
	 * @example
	 *      var A = function() {};
	 *      A.prototype.toString = function() { return '1'; };
	 *      var b = object(A.prototype);
	 *      b instanceof A => true
	 *      b.toString() => '1'
	 */
	function object(o) {

		var F = function() {};
		F.prototype = o;
		return new F;

	};

	return object;

});
