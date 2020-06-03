'use strict';

var $ = require('jquery'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemePlateOverlay',
	pre: function(opt){

	},
	create: function(){
		var self = this;

		this.prc = 0;
		this.name = this.element.data('name');
	},
	set_prc: function(prc,no_animation){
		this.prc = Math.max(0,Math.min(100,prc));
		if( no_animation ) {
			this.element.stop().css({ width: this.prc + '%' });
		}else{
			this.element.stop().animate({ width: this.prc + '%' }, 2000, 'swing');
		}
		return this.prc;
	},
	add_prc: function(prc){
		prc += this.prc;
		return this.set_prc(prc,false);
	}
});