'use strict';

var $ = require('jquery'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemeIconedHint',
	pre: function(opt){

	},
	create: function(){
		var self = this;

		this.name = this.element.data('name');
		this.icon = this.element.find('.icon');
		this.line1 = this.element.find('.line1');
		this.line2 = this.element.find('.line2');
	},
	show: function(){
		this.element.addClass('show');
	},
	hide: function(){
		this.element.removeClass('show');
	}
});