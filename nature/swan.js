/**
 * @fileoverview swan.js
 * @author nanzhi<nanzhienai@163.com> 
 */

if(typeof swan === 'undefined' || !swan) {

	/**
	 * global swan function
	 * @global
	 */
	swan = function() {


	}

}

(function(s) {

	s.global = this;

	s.version = '0.1';

	//�������з���, ����
	s._extraNames = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

	/**
	 * _mixin
	 * @private
	 * @param { Object } target Ŀ�����
	 * @param { Object } source Դ����
	 * @return Object target
	 */
	s._mixin = function(target, source) {

		if(source) {

			var i,
				_s,
				name,
				empty = {},
				extraNames = s._extraNames,
				len = extraNames.length;

			for(name in source) {

				_s = source[name];

				if(
					!target[name] || 
					target[name] != _s && (!(name in empty) || _s != empty[name])
				) {

					target[name] = source[name];

				}

			}

			//��� ie �����
			for(i = 0; i < len; i++) {

				name = extraNames[i];
				_s = source[name];

				if(
					!target[name] || 
					target[name] != _s && (!(name in empty) || _s != empty[name])
				) {
					target[name] = _s;
				}

			}

		}

		return target;

	}

	/**
	 * mixin
	 * @param { Object } obj Ŀ�����
	 * @param { Object } props Դ����
	 * @return Object obj
	 */
	s.mixin = function(obj, props) {

		var args = arguments,
			i = 1,
			o = obj || {},
			len = args.length;

		for(; i < len; i++) {

			s._mixin(o, args[i]);

		}

		return o;

	}
 
})(swan);
