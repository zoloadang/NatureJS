/**
 * @fileoverview 类的声明, 继承.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../type/array.js', '../type/object', './extend.js'], function(lang, array, object, extend) {

	/**
	 * 创建一个构造函数
	 * @name declare
	 * @namespace
	 */

	/**
	 * @lends declare
	 * @static
	 */

	/**
	 * 获取 base
	 * @private
	 * @param { Array } cls 超类集合.
	 * @return { Array } base 集合.
	 */
	function _getBases(cls) {

		var i = 0,
			len = cls.length,
			ret = [], base;

		for (; i < len; i++) {

			base = cls[i];

			var _meta = base['_meta'],
				cli = [];

			if (_meta) {

				cli = _meta['bases'];

			} else {

				0 !== i && (cli = [base]);

			}

			if (cli && cli.length) {

				ret = ret.concat(cli);

			}

		}

		return ret;

	}

	/**
	 * 检测是否是子类
	 * @private
	 * @param { Function } superclass 超类.
	 * @return 如果是, 返回 true, 否则 返回 false.
	 */
	function isInstanceOf(superclass) {

		var host = this;

		return array.indexOf(host.constructor['_meta']['bases'], superclass) > -1 || host instanceof superclass;

	}

	/**
	 * 创建一个构造函数
	 * @param { String } name 类名.
	 * @param { Array | Function } superclass 多个超类或者一个超类, 如果是数组, 那么默认第一个为超类.
	 * @param { Object } props 类包含的方法.
	 * @return { Object } 新生成的 constructor.
	 * @spec Inherited from one Class.
	 * @example
	 * 	var A = function() {};
	 * 	var B = declare(A);
	 * 	var c = new B;
	 * 	c instanceof A => true
	 * 	c.isInstanceOf(A) => true
	 *
	 * @spec Inherited from multi Classes.
	 * 	var A = declare(null);
	 * 	var B = declare(A);
	 * 	var C = declare([A, B]);
	 * 	var d = new C;
	 * 	d instanceof A => true
	 * 	d instanceof B => false
	 * 	d instanceof C => true
	 * 	d.isInstanceOf(A) => true
	 * 	d.isInstanceOf(B) => true
	 * 	d.isInstanceOf(C) => true
	 */
	function declare(name, superclass, props) {

		var proto = {},
			ctor,
			cls, i, len, obj = {};

		if (!lang.isString(name)) {

			props = superclass;
			superclass = name;
			ctor = function() {};

		} else {

			ctor = object.get(name, true);

		}

		//add meta
		ctor['_meta'] = { bases: [] };

		if (lang.isArray(superclass)) {

			cls = _getBases(superclass);

			superclass = superclass[0];

			for (i = 0, len = cls.length; i < len; i++) {

				object.mixin(obj, cls[i].prototype);
				ctor['_meta']['bases'].push(cls[i]);

			}

			props = object.mixin(obj, props);

		}

		object.mixin(proto, props);

		//add standard method to the prototype, must be added before extend
		proto.isInstanceOf = isInstanceOf;

		//extend
		extend(ctor, superclass, proto, { extend: extend });

		return ctor;

	};

	return declare;

});
