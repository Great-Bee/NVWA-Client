define('js/core/element/view/location', [
	'backbone',
	'js/util/string',
	'js/core/element/view/base_element',
	'text!js/core/element/template/location.tpl'
], function(Backbone, StringUtil, BaseElementView, LocationTpl) {
	var LocationView = BaseElementView.extend({
		events: {
			"click .btn_open_location_panel": "openLocationPanel",
			"click .btn_set_location": "setLocation"
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;
			BaseElementView.prototype.initialize.apply(t, arguments);
			window._mapLoadCallback = function() {
				t.defaultAttributes = {};
				attributes = $.extend({}, t.defaultAttributes, attributes);
				t.attributes = attributes;
				t.render();
			}
			var ak = "fyU12pMHVOeuGEUaH2GECzbI";
			var script = document.createElement("script");
			var url = "http://api.map.baidu.com/api?v=1.5&ak=";
			url += ak;
			url += "&callback=_mapLoadCallback";
			script.src = url;
			document.body.appendChild(script);
		},

		//Open Location Panel
		openLocationPanel: function() {
			var t = this;
			this.$el.find(".locationModal").modal('show');

			if (!t.map) {
				t.map = new BMap.Map("map_" + t.eleBean.element.id);
				var point = new BMap.Point(116.331398, 39.897445);
				t.map.centerAndZoom(point, 15);

				var myCity = new BMap.LocalCity();
				myCity.get(function(result) {
					var cityName = result.name;
					t.map.setCenter(cityName);
				});

				t.map.addEventListener("click", function(e) {
					t.point = new BMap.Point(e.point.lng, e.point.lat);

					//创建标注
					if (t.marker) {
						t.map.removeOverlay(t.marker);
						t.marker = null;
					}
					t.marker = new BMap.Marker(t.point);
					t.map.addOverlay(t.marker);
					t.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
					t.marker.enableDragging();
				});
			}
		},

		//Set Location
		setLocation: function() {
			var t = this;
			if (t.point) {
				var geoc = new BMap.Geocoder();
				geoc.getLocation(t.point, function(rs) {
					t.$el.find(".locationModal").modal('hide');
					var addComp = rs.addressComponents;
					var value = $.extend({}, addComp);
					value['lng'] = t.point.lng;
					value['lat'] = t.point.lat;

					t.setValue(JSON.stringify(value));
				});
			} else {
				alert('请设置位置');
			}
		},

		render: function() {
			var t = this;
			this.$el.html(tpl(LocationTpl, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			return this;
		},
		supportAttribute: function() {
			return [];
		},
		supportServerAttribute: function() {
			return ['dataField', 'dataValue'];
		},
		supportEventNames: function() {
			return ['select', 'keyup', 'keydown', 'keypress'];
		},
		supportServerEventNames: function() {
			return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
		},
		getDefaultAttribute: function() {
			return this.defaultAttributes;
		},
		setAttribute: function(attributeName, attributeValue) {},
		getAttribute: function(attributeName) {
			return this.attributes[attributeName];
		},

		setValue: function(value) {
			var t = this;
			value = eval('(' + value + ')');
			var locationDetail = value.province + ", " + value.city + ", " + value.district + ", " + value.street + ", " + value.streetNumber;
			t.$el.find(".location").html(locationDetail);
			t.$el.find(".location").attr("location", JSON.stringify(value));
		},
		getValue: function() {
			var t = this;

			return t.$el.find(".location").attr("location") || null;
		}
	});
	return LocationView;
});