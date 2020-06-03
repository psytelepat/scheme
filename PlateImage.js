'use strict';

var $ = require('jquery'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemePlateImage',
	pre: function(opt){

	},
	create: function(){
		var self = this;
		this.name = this.element.data('name');
		this.noautoshow = parseInt(this.element.data('noautoshow') || 0);
	},
	show: function(auto){
		if( auto && this.noautoshow ) return;
		this.element.addClass('show');
	},
	hide: function(auto){
		this.element.removeClass('show');
	}
});