/**
 * @fileoverview 扩展类的方法.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['./object.js', '../type/object.js'], function(create, object) {

	/**
	 * @name class
	 * @namespace
	 */

	/**
	 * @lends class
	 * @static
	 */

	/**
	 * 扩展类的方法
	 * @param { Function } r 需要接收扩展的 constructor.
	 * @param { Function } s 需要提供扩展的 constructor.
	 * @param { Object } px 需要添加的原型方法集合.
	 * @param { Object } sx 需要添加的静态方法集合.
	 * @return { Function } 构造器 r.
	 * @spec extend a constructor
	 * @example:
	 * 	var A = function() {};
	 * 	var B = function() {};
	 * 	extend(B, A);
	 * 	var c = new B;
	 * 	c instanceof A => true
	 * 	c instanceof B => true
	 */
	function extend(r, s, px, sx) {

		var sp = s.prototype,
			proto = create(sp);

		r.prototype = proto;
		proto.constructor = r;
		r.superclass = s;

		//处理来源函数
		if (Object != s && s != sp.constructor) {
			sp.constructor = s;
		}

		if (px) {
			object.mixin(proto, px);
		}

		if (sx) {
			object.mixin(r, sx);
		}

		return r;

	}

	return extend;

});
