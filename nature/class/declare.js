/**
 * @fileoverview 类的声明, 继承
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../type/array.js', '../type/object'], function(lang, array, object) {
	
	/**
	 * 声明/继承一个或者多个类
	 * @name declare
	 * @function
	 * @param { String } name 类名.
	 * @param { Array | Function } superclass 多个超类或者一个超类.
	 * @param { Object } prop 类包含的方法.
	 * @return { Object } 新生成的 constructor.
	 */
	return function(name, superclass, prop) {
		
		var proto = {},
			args = arguments,
			_ctor,
			ctor,
			F = new Function;

		//@TODO array
		/*
		if (lang.isArray(superclass)) {


		}	
		*/

		if(lang.isFunction(superclass)) {

			F.prototype = superclass.prototype;

			proto = new F;

			F.prototype = null;

			object.mixin(proto, props);

			_ctor = props.constructor;

			ctor = function() {

				if (_ctor) {

					_ctor.apply(this, arguments);

				}

			}

			ctor.superclass = superclass;

			ctor.declaredClass = className;

			ctor.prototype = proto;

			object.set(className, ctor);

			return ctor;

		}

		
	};	
	
});
