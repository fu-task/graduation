(function(){
	$.fn.j2f = function(obj){
		obj = obj || {};
		var $this = $(this);
		$this.find("input[name]").each(function(){
			this.value = obj[this.name] || "";
		});
		$this.find("select[name]").each(function(){
			$(this).select("value", obj[this.name]);
		});
	};
	var orderStatus = {
			0 : '未接单',
			1 : '已接单',
			2 : '配送中',
			3 : '完成',
			4 : '取消',
			5 : '关闭',
			6 : '删除'
	};
	var payStatus = {
			0 : '未支付',
			1 : '已支付'
	};
	var payMethod = {
			0 : '货到付款',
			1 : '在线支付',
			2 : '赊账'
	};
	var URL = {
		 ORDER_SEARCH : "order/search.json",
		 SCHEDULE_ORDER_SEARCH :'order/scheduleOrder.json',
		 ORDER_SAVE : "order/saveOrUpdate.json",
		 GET_DELIVERIERS : 'delivery/search.json',
		 ORDER_COMPLETE : 'order/orderComplelte.json'
	},OrderQuery = {
			$m : $("#query"),
			init : function(){
				var _self = this;
				this._bindEvent();
				var $list = this.$m.find(".list");
				$list.grid({
					single : true,
					height : 400,
					columns : [{title:"编号",field:"id",width:80},
					{title : "下单日期", field : "date",width:120, formatter : function(ui, data){
						return data.cell ? $.formatDate(new Date(data.cell), "yyyy-MM-dd") : "";
					}},
					{title : "配送日期", field : "deliveryDate",width:180, formatter : function(ui, data){
						return data.cell ? $.formatDate(new Date(data.cell), "yyyy-MM-dd") + ' ' + data.row.deliveryTime : "";
					}},
					{title : "订单状态", field : "status",width:100, formatter:function(ui, data){
						return orderStatus[data.cell];
					}},
					{title : "订单金额", field : "total",width:100},
					{title : "支付状态", field : "payStatus",width:100, formatter:function(ui, data){
						return payMethod[data.row.payMethod] + ' <span class="' + (data.cell == 0 ? 'error' : '') + '">' + payStatus[data.cell] + '</span>';
					}},
					{title : "联系电话", field : "phone",width:120},
					{title : "送货地址", field : "address",width:200}],
					pagination : true,
					pager : {
						select : function(pageNum, pageSize){
							_self.search($.extend({}, {
								pageSize : pageSize,
								pageNumber : pageNum
							}, _self.$m.f2j()));
						}
					}
				});
				$list.find(".ui-tb").css({
					height : ""
				});
				$('#order_add_dialog').dialog({
					width: 610,
					height: 250,
					title: '新增订单',
					autoOpen: false
				});
				getProds(function(d){
					var data = d.datas,
						m = {};
					for (var i = 0, len = data.length; i < len; i++) {
						m[data[i].id] = data[i].productName;
					}
					$('#prodList').select('data', m);
					$('#prodNum, #prodList').change(function(){
						_self.total();
					});
				});
			},
			total: function(){
				var pid = $('#prodList').val(),
					num = $('#prodNum').val();
				if (pid && num) {
					$('#total').text(+num * prodMap[pid].price);
				} else {
					$('#total').text(0);
				}
			},
			save : function(data, fn){
				$.ajaxJSON({
					url : URL.ORDER_SAVE,
					data : data,
					success : function(d){
						$.msg("保存成功");
						fn && fn(d);
					}
				});
			},
			search : function(data){
				var $m = this.$m;
				$.ajaxJSON({
					url : URL.ORDER_SEARCH,
					data : data,
					success : function(d){
						$m.find(".list").grid("loadData", {rows : d.list, total : d.count || d.list.length,
							currentPage : data.pageNumber || 1, pageSize : d.pageSize || 10});
					}
				});
			},
			addDialog : function(){
				$('#order_add_dialog').dialog('open').find('input').val('');
			},
			_bindEvent : function(){
				var $m = this.$m,
					_self = this,
					$grid = $m.find(".list");
				$m.on("click", ".btn", function(){
					var $this = $(this);
					if ($this.is(".search")) {
						_self.search($m.f2j());
					} else if ($this.is(".import")) {
						$("#client-excel").click();
					} else if ($this.is(".export")) {
						_self.exportExcel($m.f2j());
					} else if ($this.is(".add")) {
						_self.addDialog({});
					}
				});
				$grid.on("click", "a", function(){
					var $link = $(this),
						index = $link.parents("tr").attr("findex"),
						row = $grid.grid("getRow", index);
					if ($link.is(".edit-link")) {
						
					} else if ($link.is(".delete-link")) {
						
					}
				});
				$('#order_add_dialog').find('.btn').click(function(){
					$('#order_add_dialog').find('input').trigger('blur');
					var len = $('#order_add_dialog').find('.error').length;
					if (len > 0) {
						return;
					}
					var data = $('#order_add_dialog').f2j();
					data.name = '系统';
					data.clientId = '0';
					data.address = data.area + '区' + data.department + '幢' + data.floor + '楼' + data.room;
					data.items = [];
					data.items.push({
						productId : data.productId,
						productName : $('#prodList option:selected').text(),
						num : data.num
					});
					delete data.productId;
					delete data.num;
					data.total = $('#total').text();
					_self.save(data, function(){
						$('#order_add_dialog').dialog('close');
					});
				});
			}
	},
	Delivery = {
			$m : $("#delivery"),
			init : function(){
				var _self = this;
				this._bindEvent();
				this.$m.find(".list").grid({
					height : 400,
					single : true,
					columns : [{title : "编号", field : "id", width : 80},
					{title : "学号", field : "name", width: 140},
					{title : "配送日期", field : "deliveryDate",width:180, formatter : function(ui, data){
						return data.cell ? $.formatDate(new Date(data.cell), "yyyy-MM-dd") + ' ' + data.row.deliveryTime : "";
					}},
					{title : "送货地址", field : "address",width:200},
					{title : "订单状态", field : "status",width:100, formatter:function(ui, data){
						return orderStatus[data.cell];
					}},
					{title : "订单金额", field : "total",width:100},
					{title : "支付状态", field : "payStatus",width:100, formatter:function(ui, data){
						return $('<div>').html(payMethod[data.row.payMethod] + ' <span class="' + (data.cell == 0 ? 'error' : '') + '">' + payStatus[data.cell] + '</span>');
					}},
					{title : "联系电话", width: 150, field : "phone"},
					{title : "操作", field : "opera", width : 120, formatter : function(ui, data){
						var text, link; 
						switch(+data.row.status){
						case 0:
							if(data.row.payStatus == 0){
								text = '标记为已支付';
								link = 'pay';	
							} else {
								text = '接单';
								link = 'recive';
							}
							break;
						case 1:
							text = '配送';
							link = 'delivery';
							break;
						case 2:
							text = '配送中, 点击完成';
							link = 'complete';
							break;
						case 3:
							text = '完成';
							link = 'completed';
							break;
						}
						return "<a href='javascript:void(0);' class='" + link + "'>" + text + "</a>&nbsp;&nbsp;"; 
					}}],
					pagination : true,
					pager : {
						select : function(pageNumber, pageSize){
							_self.search($.extend({},{
								pageSize : pageSize,
								pageNumber : pageNumber
							},_self.$m.f2j()));
						}
					}
				});
				this.$m.find(".list").find(".ui-tb").css({
					height : ""
				});
				$("#gift_add").dialog({
					autoOpen : false,
					height : "auto",
					width : 400,
					title : "登记",
					modal : true
				}).find(".btn").click(function(){
					var data = $("#gift_add").f2j();
					$.ajaxJSON({
						url : URL.GIFT_SAVE,
						data : data,
						success : function(d){
							$("#gift_add").dialog("close");
							$.msg("保存成功");
						}
					});
				});
				$("#gift_add_date").datetimepicker();
				$('#delivery-box').dialog({
					title : '选择水工',
					width :  200,
					height: 135,
					autoOpen: false
				});
				this.search({});
			},
			getAllDelivery: function(fn){
				$.ajaxJSON({
					url : URL.GET_DELIVERIERS,
					data : {},
					success : function(data){
						fn && fn(data);
					}
				});
			},
			_bindEvent : function(){
				var $m = this.$m,
					_self = this,
					order = null;
				$('#delivery-box').find('button').click(function(){
					if (null != order) {
						order.deliveryId = $('#delivery-box select').val();
						order.status = 2;
						OrderQuery.save(order, function(){
							$('#delivery-box').dialog('close');
							$m.find('.search').trigger('click');
						});
					}
				});
				$m.on("click", ".btn", function(){
					var $this = $(this);
					if ($this.is(".add")) {
						_self.editGift({});
					} else if ($this.is(".search")) {
						_self.search($m.f2j());
					} else if ($this.is(".import")) {
						$("#gift_excel").click();
					} else if ($this.is(".export")) {
						_self.exportExcel($m.f2j());
					}
				});
				$m.find(".list").on("click", "a", function() {
					var $link = $(this),
						index = $link.parents("tr[findex]").attr("findex"),
						row = $m.find(".list").grid("getRow", index);
					order = row;
					function save(){
						order.status = 1;
						OrderQuery.save(order, function(){
							$m.find(".list").grid('updateRow', index);
						});
					}
					if ($link.is(".recive")) {
						if (row.payStatus == 0) {
							$.msg({
								msg : '该订单未支付！'
							});
						} else {
							save();
						}
					} else if ($link.is('.pay')) {
						order.payStatus = 1;
						OrderQuery.save(order, function(){
							$m.find(".list").grid('updateRow', index);
						});
					} else if ($link.is(".delivery")) {
						_self.getAllDelivery(function(data){
							var list = data.datas,
							result = [];
							if (list.length) {
								for (var i = 0, len = list.length; i < len; i++) {
									result[i] = {
											text  : list[i].name,
											value : list[i].id
									};
								}
								$('#delivery-box').dialog('open').find('select').select('data', result);
							} else {
								$.msg('当前没有水工');
							}
						});
					} else if ($link.is(".complete")) {
						order.status = 3;
						$.ajaxJSON({
							url : URL.ORDER_COMPLETE,
							data : order,
							success : function(data){
								$.msg('更新成功');
								$m.find(".list").grid('updateRow', index);
							}
						});
					}
				});
			},
			search : function(data){
				var $m = this.$m;
				$.ajaxJSON({
					url : URL.SCHEDULE_ORDER_SEARCH,
					data : data,
					success : function(d){
						$m.find(".list").grid("loadData", {
							rows : d.list,
							total : d.count,
							pageSize : d.pageSize,
							currentPage : d.pageNumber
						});
					}
				});
			}
	},
	Complete = {
			$m : $("#complete"),
			init : function(){
				var $m = this.$m,
					_self = this;
				this._bindEvent();
				$m.find(".list").grid({
					single : true,
					height : 400, 
					columns : [
					       {title : "编号", field : "id", width : 80},
					       {title : "省", field : "prov"},
				           {title : "市", field : "city"},
				           {title : "专柜状态", field : "shopState"},
				           {title : "操作", field : "opera", formatter : function(ui, data){
				        	   return "<a href='javascript:void(0);' data-index='" + data.index + 
				        	   	"' class='edit-link'>修改</a> &nbsp;&nbsp;<a href='javascript:void(0);' " +
				        	   	"class='delete-link' data-index='" + data.index + "'>删除</a>";
				           }}] 
				});
				$m.find(".list").find(".ui-tb").css({
					height : ""
				});
				$("#area_update_dialog").dialog({
					height : "auto",
					autoOpen : false,
					modal : true,
					width : 400,
					title : "更新"
				}).find(".submit-update").click(function(){
					_self.saveOrUpdate($("#area_update_dialog").f2j(), function(d){
						$("#area_update_dialog").dialog("close");
					});
				});
			},
			saveOrUpdate : function(area, fn){
				if (area.prov && area.city) {
					$.ajaxJSON({
						url : URL.AREA_SAVE_OR_UPDATE,
						data : area,
						success : function(d){
							$.msg("保存成功");
							fn && fn(d);
							initProvCity();
						}
					});
				} else {
					$.msg("请输入省，市");
				} 
			},
			search : function(data){
				var _self = this;
				$.ajaxJSON({
					url : URL.AREA_SEARCH,
					data : data,
					success : function(d){
						_self.$m.find(".list").grid("loadData", {
							rows : d.list
						});
					}
				});
			},
			exportExcel : function(data){
				$.dlFile({
					url : URL.AREA_EXPORT,
					data : data,
					fileName : "区域名单.xls"
				});
			},
			_bindEvent : function(){
				var $m = this.$m,
					_self = this;
				$m.on("click", ".btn", function(){
					var $this = $(this);
					if ($this.is(".search")) {
						_self.search($m.find(".fm-row").f2j());
					} else if ($this.is(".import")) {
						$("#area-excel").click();
					} else if ($this.is(".export")) {
						_self.exportExcel($m.find(".fm-row").f2j());
					} else if ($this.is(".add")) {
						_self.editArea({});
					}
				});
				$m.find(".list").on("click", "a", function(){
					var $link = $(this),
						index = $link.attr("data-index"),
						row = $m.find(".list").grid("getRows")[index]; 
					if ($link.is(".edit-link")) {
						_self.editArea(row);
					} else if ($link.is(".delete-link")) {
						$.msg({
							type : "confirm",
							msg : "确定删除？",
							ok : function(){
								_self.deleteArea(row.id, function(){
									$m.find(".list").grid("deleteRow", index);
									$m.find(".list").grid("reload");
								});
							}
						});
					}
				});
				$("#area-excel").change(function(){
					var file = this.files[0];
					$.ajaxMultiForm({
						url : URL.AREA_IMPORT,
						data : {
							file : file
						},
						success : function(d){
							$.msg("导入成功");
						}
					});
					$("#area-excel").val("");
				});
			},
			editArea : function(area){
				if (area.id) {
					$("#area_update_dialog").dialog("option", {
						title : "更新"
					}).find("input").prop("readonly", true);
				} else {
					$("#area_update_dialog").dialog("option", {
						title : "新建"
					}).find("input").prop("readonly", false);
				}
				$("#area_update_dialog").dialog("open").j2f(area);
			},
			deleteArea : function(id, fn){
				$.ajaxJSON({
					url : URL.AREA_DELETE,
					data : {
						id : id
					},
					success : function(d){
						$.msg("删除成功");
						fn && fn(d);
						initProvCity();
					}
				});
			}
	};
	// init 
	(function(){
		var m = {
				query : OrderQuery,
				delivery : Delivery,
				complete : Complete
		};
		$(".tab").on("click", "li", function(){
			var name = $(this).attr("data-module");
			if (m[name].init) {
				m[name].init();
				m[name].init = false;
			} 
			$(".tab-cons").hide();
			$("#" + name).show();
			$(".tab").find("li").removeClass("tab-active");
			$(this).addClass("tab-active");
		});
		$(".tab").find("li").eq(0).click();
	})();
	var now = new Date();
	$(".date").datetimepicker({
		endDate: new Date(now.setDate(2 + now.getDate()))
	});
	$('#deliveryDate').datetimepicker('setStartDate', new Date());
	$('#deliveryDate').change(function(){
		var date = $(this).val();
	});
	var prodMap = {};
	function getProds(fn){
		$.ajaxJSON({
			url : 'product/findAll.json',
			data : {},
			success : function(d){
				var list = d.datas;
				for (var i = 0, len = list.length; i < len; i++) {
					prodMap[list[i].id] = list[i];
				}
				fn && fn(d);
			}
		});
	}
}());