(function(){
	var Root = 'http://localhost:8080/client/',
	App = {
			gotoLogin : function(){
				location.href = Root + 'web/html/login.html';
			},
			goto404 : function(){
				location.href = Root + 'web/html/error/404.html';
			}
	},
	Ajax = {
			successHandler : function(success, fail){
				success = success || foo;
				fail = fail || foo;
				return function(data){
					Ajax.removeMask();
					if (data.success) {
						success(data);
					} else {
						fail(data);
					}
				};
			},
			errorHandler : function(error){
				error = error || foo;
				return function(jqXHR, tStatus, errorThrown){
					Ajax.removeMask();
					error.apply(null, arguments);
					if(jqXHR.status == '401') {
						App.gotoLogin();
					} else if (jqXHR.status == '404') {
						App.goto404();
					}
				};
			},
			getURL : function(url){
				url = $.trim(url);
				if ('/' == url[0]) {
					url = url.substr(1);
				}
				return Root + url;
			},
			addMask : function(){
				$('body').addClass('loading');
			},
			removeMask : function(){
				$('body').removeClass('loading');
			}
	},
	foo = function(){},
	defaults = {
			type : 'POST',
			data : {},
			dateType : 'json',
			success : foo,
			fail : foo,
			error : foo,
			always : foo
	};
	window.Ajax = {
			json : function(opts){
				var ajaxOpts = $.extend({}, defaults, opts, {
					contentType : 'application/json; charset=UTF-8',
					dataType : 'json',
					url : Ajax.getURL(opts.url),
					data : opts.data ? ($.isPlainObject(opts.data) ? JSON.stringify(opts.data) : opts.data) : JSON.stringify({}) 
				});
				ajaxOpts.success = Ajax.successHandler(opts.success, opts.fail);
				ajaxOpts.error = Ajax.errorHandler(opts.error);
				Ajax.addMask();
				$.ajax(ajaxOpts);
			},
			postJSON : function(opts){
				opts.type = 'POST';
			},
			getJSON : function(opts){
				opts.type = 'GET';
			}
	};
}());