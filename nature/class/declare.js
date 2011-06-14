/**
 * @fileoverview 类的声明, 继承.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../type/lang.js', '../type/array.js', '../type/object'], function(lang, array, object) {

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
	 * 创建一个构造函数
	 * @param { String } name 类名.
	 * @param { Array | Function } superclass 多个超类或者一个超类, 如果是数组, 那么默认第一个为超类.
	 * @param { Object } props 类包含的方法.
	 * @return { Object } 新生成的 constructor.
	 * @spec Inherited form one Class.
	 * @example
	 * 	function Shape(name) {
	 *		this.name = name;
	 * 	}
	 * 	Shape.prototype.toString = function() {
	 *
	 * 		return this.name;
	 *
	 * 	}
	 * 	declare('Square', Shape, {
	 *
	 * 		constructor: function(name, width, height) {
	 *
	 * 			this.name = name;
	 * 			this.width = width;
	 * 			this.height = height;
	 *
	 * 		},
	 *
	 * 		getArea: function() {
	 *
	 * 			return this.width * this.height;
	 *
	 * 		}
	 *
	 * 	});
	 * 	var haha = new Square('haha', 1, 2);
	 * 	haha.toString() => 'haha'
	 * 	haha.getArea() => 2
	 *
	 * 	@spec Inherited form multi Classes.
	 * 	@example:
     *  dojo.declare("VanillaSoftServe", null, {
     *    constructor: function() { console.debug ("mixing in Vanilla"); }
     *  });
     *  
     *  dojo.declare("MandMs", null, {
     *    constructor: function() { console.debug("mixing in MandM's"); },
     *    kind: "plain"
     *  });
     *  
     *  dojo.declare("CookieDough", null, {
     *    chunkSize: "medium"
     *  });
     *  
     *  dojo.declare("Blizzard", [VanillaSoftServe, MandMs, CookieDough], {
     *  	  constructor: function() {
     *  		   console.debug("A blizzard with " +
     *  			   this.kind + " M and Ms and " +
     *  			   this.chunkSize +" chunks of cookie dough."
     *  		   );
     *  	  }
     *  });
     *  
     *  // make a Blizzard:
     *  var bb = new Blizzard();
     *  bb.kind => 'plain'
     *  bb.chunkSize => 'medium'
     *  bb instanceof VanillasoftServe => true
     *  bb instanceof MandMs => false
     *  bb instanceof CookieDoug => false
	 */
	function declare(name, superclass, props) {

		var proto,
			_ctor, ctor,
			cls, i, len, obj = {},
			F = new Function;

		if (!lang.isString(name)) {

			props = superclass;
			superclass = name;

		}

		if (lang.isArray(superclass)) {

			cls = superclass.concat();

			superclass = cls[0];
			
			for (i = 1, len = cls.length; i < len; i++) {

				object.mixin(obj, cls[i].prototype);

			}

			props = object.mixin(obj, props)

		}

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

		ctor.declaredClass = name;

		ctor.prototype = proto;

		lang.isString(name) && object.set(name, ctor);

		return ctor;

	};

	return declare;

});
