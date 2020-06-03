'use strict';

var $ = require('jquery'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemeTitle',
	pre: function(opt){

	},
	create: function(){
		var self = this;

		this.name = this.element.data('name');
	},
	show: function(){
		this.element.addClass('show');
	},
	hide: function(){
		this.element.removeClass('show');
	}
});