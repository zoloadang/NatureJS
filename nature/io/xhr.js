/**
 * @fileoverview ajax 模块.
 * @author nanzhi<nanzhienai@163.com>
 */
define(['../event/custom.js', '../type/string.js'], function(custom, string) {

	var win = window,
		doc = document;

	/**
	 * ajax 模块
	 * @name xhr
	 * @namespace
	 */
	return {

		/**
		 * @lends xhr
		 * @static
		 */

		/**
		 * 创建一个 xhr 请求
		 * @private
		 */
		_create: function() {

			if (win.XMLHttpRequest) {

				return new XMLHttpRequest();

			}

			return new ActiveXObject('Microsoft.XMLHTTP');

		},

		/**
		 * 监听 xhr
		 * @private
		 * @param { Object } xhr xhr 对象.
		 * @param { Object } cfg 配置参数.
		 */
		_watch: function(xhr, cfg) {

			var	onSuccess = xhr.onSuccess,
				onFailure = xhr.onFailure,
				onTimeout = xhr.onTimeout,
				timeout = cfg.timeout || 5000,
				ok = false;

			/** @private */
			xhr.onreadystatechange = function() {

				if (4 === xhr.readyState) {

					ok = true;

					if (200 === xhr.status) {

						onSuccess && onSuccess(xhr);

					} else {

						onFailure && onFailure(xhr);

					}

				}

			};

			xhr.send(cfg.postData || null);

			//超时处理
			setTimeout(function() {

				if (!ok) {

					xhr.abort();

					onTimeout && onTimeout(xhr);

				}

			}, timeout);

		},

		/**
		 * 设置参数
		 * @private
		 * @param { Object } xhr xhr 对象.
		 * @param { Object } cfg 配置参数.
		 * @return { Object } cfg 配置.
		 */
		_setArgs: function(xhr, cfg) {

			var success = cfg.success,
				failure = cfg.failure,
				timeout = cfg.timeout,
				form = cfg.form;

			if (success) {

				custom.add(xhr, 'Success', success);

			}

			if (failure) {

				custom.add(xhr, 'Failure', failure);

			}

			if (timeout) {

				custom.add(xhr, 'Timeout', timeout);

			}

			if (form) {

				//TODO 表单数据获取
				cfg.postData = host.setForm(form);

			}

		},

		/**
		 * 设置表单参数
		 * @param { HTMLelement } form 表单节点.
		 * @return { String } 表单参数组成的字符串.
		 */
		setForm: function(form) {

			var elements = form.elements,
				i = 0,
				len = elements.length,
				param = [];

			for (; i < len; i++) {

				var el = elements[i],
					name = el.name;

				if (name) {

					param.push(name + '=' + escape(el.value));

				}

			}

			return param.join('&');

		},

		/**
		 * 同域异步请求
		 * @param { String } method 请求方法.
		 * @param { Object } cfg 配置参数.
		 * @return { Object } xhr 对象.
		 */
		xhr: function(method, cfg) {

			var host = this,
				request = host._create();

			request.open(method || 'GET', cfg.url, true);

			host._setArgs(request, cfg);
			host._watch(request, cfg);

			return request;

		},

		/**
		 * 同域 get 请求
		 * @param { Object } cfg 配置参数.
		 * @return { Object } xhr 对象.
		 * @example
		 * 		xhr.get({
		 *			url: 'http://www.naturejs.com/',
		 *			success: function(data) { console.log(data); },
		 *			failure: function(data) { console.log('error'); },
		 *			timeout: function(data) { console.log('timeout');  }
		 * 		});
		 */
		get: function(cfg) {

			return this.xhr('GET', cfg);

		},

		/**
		 * 同域 post 请求
		 * @param { Object } cfg 配置参数.
		 * @return { Object } xhr 对象.
		 * @example
		 * 		xhr.post({
		 *			url: 'http://www.naturejs.org',
		 *			success: function(data) { console.log(data); },
		 *			form: document.getElementById('form')
		 * 		});
		 *
		 * 		xhr.post({
		 *			url: 'http://www.naturejs.org',
		 *			success: function(data) { console.log(data); },
		 *			postData: 'a=b&c=d'
		 * 		});
		 */
		post: function(cfg) {

			return this.xhr('POST', cfg);

		}

	};

});
