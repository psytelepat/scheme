'use strict';

var $ = require('jquery'),
	SchemeStack = require('./Stack'),
	SunEnergy = require('./SunEnergy'),
	PlateImage = require('./PlateImage'),
	PlateOverlay = require('./PlateOverlay'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemePlate',
	create: function(){
		var self = this;

		this.name = this.element.data('name');

		var sun_energy = this.element.find('.js-sun-energy');
		this.sun_energy = sun_energy.length ? new SunEnergy({ element: sun_energy, delegate: self }) : false;

		var plate_overlay = this.element.find('.js-plate-overlay');
		this.plate_overlay = plate_overlay.length ? new PlateOverlay({ element: plate_overlay, delegate: self }) : false;

		if( this.plate_overlay ) {
			this.element.click(function(){
				self.plate_overlay.add_prc(5);
			});
		}

		this.stack = {};
		this.element.find('.js-stack').each(function(i,elm){
			var stack = new SchemeStack({ element: elm, delegate: self });
			self.stack[stack.name] = stack;
		});

		this.image = {};
		this.element.find('.js-plate-image').each(function(i,elm){
			var image = new PlateImage({ element: elm, delegate: self });
			self.image[image.name] = image;
		});
	},
	show: function(cb){
		var self = this;
		this.element.addClass('show');
		setTimeout(function(){
			var k;
			for(k in self.stack) {
				self.stack[k].show();
			}
			for(k in self.image) {
				self.image[k].show(true);
			}
			if( typeof cb === 'function' ) {
				cb(self);
			}
		},500);
	},
	hide: function(cb){
		var self = this;
		this.element.removeClass('show');

		for(var k in self.image) {
			self.image[k].hide(true);
		}

		setTimeout(function(){
			if( typeof cb === 'function' ) {
				cb(self);
			}
		},500);
	}
});