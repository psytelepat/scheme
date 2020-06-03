'use strict';

var $ = require('jquery'),
	TweenMax = require('gsap/TweenMax'),
	TimelineLite = require('gsap/TimelineLite'),
	MinimalClass = require('../../lib/MinimalClass');

window.jQuery = window.$ = $;

module.exports = MinimalClass.extend({
	__className: 'SchemeDot',
	pre: function(opt){
		this.diameter = 10;
	},
	create: function(){
		var self = this;

		this.element = $('<div></div>');

		this.element.css({
			position: 'fixed',
			top: 100,
			left: 100,
			width: this.diameter,
			height: this.diameter,
			borderRadius: '50%',
			backgroundColor: '#00AA00',
			zIndex: 10000
		});

		this.element.appendTo( document.body );

		var tl = new TimelineLite();

		tl.add(TweenMax.to(this.element, 1, { left: 500 }), 0);
		tl.add(TweenMax.to(this.element, 2, { left: 600 }), 1);
		tl.add(TweenMax.to(this.element, 1, { left: 900 }), 3);
	}
});