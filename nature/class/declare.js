/**
 * @fileoverview 类的声明, 继承, 模拟多继承(聚合).
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../type/array.js', '../type/object', './extend.js'], function(lang, array, object, extend) {

	/**
	 * 类的创建, 继承.
	 * @name class
	 * @namespace
	 */

	var count = 0,
		prefix = 'NatureJS_Class_',
		DECLARED_CLASS = 'declaredClass',
		_META = '_meta',
		BASES = 'bases';

	/**
	 * @lends class
	 * @static
	 */

	/**
	 * 获取 mro 序列.
	 * @private
	 * @param { Array } cls 超类集合.
	 * @return { Array } base 集合.
	 * @see http://en.wikipedia.org/wiki/C3_linearization
	 * @see http://www.python.org/download/releases/2.3/mro/
	 */
	function c3mro(bases) {

		var i, len, base,
			_meta, lin, j, proto, rec, name, top,
			namemap = {}, clsCount = 1,
			result = [], refs,
			roots = [{cls: 0, refs: []}];//与 namemap 对应

		// build a list of bases naming them if needed
		for (i = 0, len = bases.length; i < len; i++) {

			base = bases[i];
			_meta = base[_META];
			lin = _meta ? _meta[BASES] : [base];

			top = 0;

			for (j = lin.length - 1; j >= 0; j--) {

				proto = lin[j].prototype;

				if (!proto.hasOwnProperty(DECLARED_CLASS)) {
					proto[DECLARED_CLASS] = prefix + count++;
				}

				name = proto[DECLARED_CLASS];

				if (!namemap.hasOwnProperty(name)) {

					namemap[name] = { count: 0, refs: [], cls: lin[j]};
					clsCount++;

				}

				rec = namemap[name];

				if (top && top !== rec) {
					rec.refs.push(top);
					++top.count;
				}

				top = rec;

			}

			++top.count;
			roots[0].refs.push(top);

		}

		// remove classes without external references recursively
		while (roots.length) {
			top = roots.pop();
			result.push(top.cls);
			--clsCount;

			while (refs = top.refs, refs.length == 1) {
				top = refs[0];
				//end
				if (!top || --top.count) {
					top = 0;
					break;
				}
				result.push(top.cls);
				--clsCount;
			}

			if (top) {
				for (i = 0, len = refs.length; i < len; i++) {
					top = refs[i];
					if (!--top.count) {
						roots.push(top);
					}
				}
			}

		}

		if (clsCount) {
			throw new Error('error');
		}

		// calculate the superclass offset
		base = bases[0];
		result[0] = base ?
					base[_META] && base === result[result.length - base[_META][BASES].length] ? base[_META][BASES].length : 1
					: 0;

		return result;

	}

	/**
	 * 检测是否是子类.
	 * @private
	 * @param { Function } superclass 超类.
	 * @return 如果是, 返回 true, 否则 返回 false.
	 */
	function isInstanceOf(superclass) {

		var host = this;
		return array.indexOf(host.constructor[_META][BASES], superclass) > -1 || host instanceof superclass;

	}

	/**
	 * 创建一个构造函数, 并从超类或者一个聚合继承属性, 方法.
	 * @param { String } name 类名.
	 * @param { Array | Function } superclass 多个超类或者一个超类, 如果是数组, 那么默认第一个为超类.
	 * @param { Object } props 类包含的方法.
	 * @return { Object } 新生成的 constructor.
	 * @spec Inherited from one Class.
	 * @example
	 * 		var A = function() {};
	 * 		var B = declare(A);
	 * 		var c = new B;
	 * 		c instanceof A => true
	 * 		c.isInstanceOf(A) => true
	 *
	 * @spec Inherited from multi Classes.
	 * @example
	 * 		var A = declare(null);
	 * 		var B = declare(A);
	 * 		var C = declare([B, A]);
	 * 		var D = declare('haha', [C, B, A]);
	 * 		var c = new C;
	 * 		var d = new D;
	 * 		c instanceof A => true
	 * 		c instanceof B => true
	 * 		c instanceof C => true
	 * 		c.isInstanceOf(A) => true
	 * 		c.isInstanceOf(B) => true
	 * 		c.isInstanceOf(C) => true
	 * 		d instanceof A => true
	 * 		d instanceof B => true
	 * 		d instanceof C => true
	 * 		d instanceof D => true
	 * 		d.isInstanceOf(A) => true
	 * 		d.isInstanceOf(B) => true
	 * 		d.isInstanceOf(C) => true
	 * 		d.isInstanceOf(D) => true
	 * 		d.declaredClass => 'haha'
	 */
	function declare(name, superclass, props) {

		var proto = {},
			ctor = new Function,
			mixin = 1,
			bases, i, len, obj = {};

		if (!lang.isString(name)) {

			props = superclass;
			superclass = name;

		}

		if (lang.isArray(superclass)) {

			bases = c3mro(superclass);

			mixin = bases.length - bases[0];

			superclass = bases[mixin];

		} else {

			bases = [0];
			if (superclass) {
				bases.push(superclass);
			}

		}

		if (superclass) {

			for (i = mixin - 1; i > 0; i--) {

				object.mixin(obj, bases[i].prototype);

			}

			props = object.mixin(obj, props);

		}

		object.mixin(proto, props);

		//add standard method to the prototype, must be added before extend
		proto.isInstanceOf = isInstanceOf;

		//extend
		extend(ctor, superclass, proto, { extend: extend });

		bases[0] = ctor;
		ctor[_META] = { bases: bases, parent: superclass };

		proto = ctor.prototype;
		//add declaredClass
		if (name && lang.isString(name)) {
			object.set(name, ctor);
			proto[DECLARED_CLASS] = name;
		}

		return ctor;

	};

	return declare;

});
