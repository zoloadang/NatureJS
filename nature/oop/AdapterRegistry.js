/**
 * @fileoverview 多态函数，搜索以及匹配相应条件并执行函数，减少大量 if 的使用，强制 oop.
 * @author nanzhi<nanzhienai@163.com>
 */

define(function() {

	/**
	 * @name oop
	 * @namespace
	 */

	/**
	 * 多态函数
	 * @constructor
	 * @memberof oop
	 * @spec match some ...
	 * @example
	 *		var reg = new AdapterRegistry();
	 *		reg.register('checkString', function(a) { return typeof a === 'string' }, function(str) { return str.toUpperCase(); });
	 *		reg.register('checkArr', function(a) { return typeof a === 'array' || a instanceof Array }, function(arr) { return arr.join('-'); });
	 *		reg.match('you are great.') => 'YOU ARE GREAT.';
	 *		reg.match(['a', 'b']) => 'a-b';
	 */
	var AdapterRegistry = function() {
		this.pairs = {};
	};

    AdapterRegistry.prototype = {

		/**
		 * @lends oop.AdapterRegistry
		 */

        /**
		 * 注册新的匹配
		 * @param { String } name 名字.
		 * @param { Function } check 第一次检测，返回布尔值.
		 * @param { Function } wrap 通过检测后执行的回调函数.
		 * @return this.pairs { Array } 匹配.
		 */
        register: function(name, check, wrap) {

            return this.pairs[name] = [check, wrap];

        },

        /**
		 * 执行匹配处理
		 * @method match
		 * @param { Anything } arguments 参数.
		 * @return this 实例.
		 */
        match: function(/*...*/) {

            var host = this,
				pairs = host.pairs,
				name,
				pair,
				args = arguments;

            for (name in pairs) {

				pair = pairs[name];

				if (pair[0].apply(host, args)) {

					return pair[1].apply(host, args);

				}

            }

        },

        /**
		 * 解除注册
		 * @method unregister
		 * @param { String } name 名字.
		 * @return this.pairs { Array }
		 */
        unregister: function(name) {

            var host = this,
				pairs = host.pairs;

			if (pairs[name]) {

				delete pairs[name];

			}

        }

    };

    return AdapterRegistry;

});

