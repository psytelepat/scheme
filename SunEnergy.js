'use strict';

var $ = require('jquery'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemeSunEnergy',
	pre: function(opt){

	},
	create: function(){
		var self = this;

		this.name = this.element.data('name');

		this.interval = false;
		this.item = [];
		this.element.find('.dot').each(function(i,elm){
			var item = {
				obj: $(elm),
				active: false,
				activate: function(dir){
					if( this.active === dir ) return;
					dir ? this.obj.addClass('show') : this.obj.removeClass('show');
					this.active = dir;
				}
			};

			self.item.push(item);
		});
	},
	show: function(){
		this.start_animation();
	},
	start_animation: function(){
		var self = this;
		this.interval = setInterval(function(){ self.update_state(); },300);
	},
	update_state: function(){
		var id = Math.floor( Math.random() * ( this.item.length - 1 ) );
		this.item[id].activate( Math.random() > .5 );
	},
	stop_animation: function(){
		if( this.interval ) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}
});