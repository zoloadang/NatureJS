/**
 * @fileoverview 扩展类的方法.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['./object.js', '../type/object.js', '../type/array.js'], function(create, object, array) {

	/**
	 * @name class
	 * @namespace
	 */

	/**
	 * @lends class
	 * @static
	 */

	/**
	 * 添加 meta
	 * @private
	 * @param { Function } ctor 子类.
	 * @param { Function } stor 超类.
	 * @return { Array } _meta.
	 */
	function _addMeta(ctor, stor) {

		//add meta
		var _meta = ctor['_meta'],
			bases;

		if (!_meta) {
			_meta = ctor['_meta'] = {};
		}

		//add base
		bases = _meta['bases'];

		if (!bases) {
			bases = _meta['bases'] = [];
			//断言, 存在 bases, 一定已经包含
			if (-1 === array.indexOf(bases, ctor)) {
				bases.push(ctor);
			}
		}

		if (-1 === array.indexOf(bases, stor)) {
			bases.push(stor);
		}

		//add parents
		_meta['parents'] = stor;

		//add ctor
		_meta['ctor'] = ctor;

		return _meta;

	}

	/**
	 * 扩展类的方法
	 * @param { Function } r 需要接收扩展的 constructor.
	 * @param { Function } s 需要提供扩展的 constructor.
	 * @param { Object } px 需要添加的原型方法集合.
	 * @param { Object } sx 需要添加的静态方法集合.
	 * @return { Function } 构造器 r.
	 * @spec extend a constructor
	 * @example
	 *      var A = function() {};
	 *      var B = function() {};
	 *      extend(B, A);
	 *      var c = new B;
	 *      c instanceof A => true
	 *      c instanceof B => true
	 */
	function extend(r, s, px, sx) {

		if (!r || !s) {

			return false;

		}

		var sp = s.prototype,
			proto = create(sp);

		r.prototype = proto;
		proto.constructor = r;
		r.superclass = sp;

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

		_addMeta(r, s);

		return r;

	}

	return extend;

});
