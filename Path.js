'use strict';

var $ = require('jquery'),
	TweenMax = require('gsap/TweenMax'),
	MorphSVGPlugin = require('./MorphSVGPlugin'),
	MinimalClass = require('./MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemePath',
	pre: function (opt) {

	},
	create: function () {
		var self = this;

		this.name = this.element.data('name');
		this.path = false;
		this.path_length = 0;

		this.is_active = false;

		this.transfering = false;

		this.svg = this.element.find('svg.path');
		this.sprite_id = this.svg.find('use').attr('xlink:href');
		this.sprite_path = false;

		this.icon_svg = this.element.data('icon');
		this.icon_pos = this.element.data('icon-pos') || 'up';

		this.dots = parseInt(this.element.data('dots'));
		this.duration = parseFloat(this.element.data('duration'));

		this.random_delay = parseFloat(this.element.data('random-delay') || 0)
		this.reverse = parseInt(this.element.data('reverse') || 0);

		this.random_emit_timer = false;

		this.delay_between_dots = 0.15;

		this.svg.bind('load', function () {
			self.export_svg_path();
		});

		this.export_svg_path();
	},
	export_svg_path: function () {
		var symbol = $(this.sprite_id);

		if (symbol.length) {
			var path = symbol.find('path');
			if (path.length) {
				this.sprite_path = path;
				if (typeof path[0].getTotalLength === 'function') {
					this.path_length = path[0].getTotalLength();
					this.delay_between_dots = 0.15 * (this.duration / this.path_length * 100);

					this.svg.css({
						'stroke-dasharray': this.path_length + ' ' + this.path_length,
						'stroke-dashoffset': this.path_length * (this.reverse ? -1 : 1)
					});
				}

				this.set_path(path.attr('d'));
				return;
			}
		}

		this.log(self.__className, 'unable to detect path');
	},
	set_path: function (path) {
		this.path = path ? path : false;
		this.animation_path = this.get_path();
	},
	get_path: function () {
		if (!this.path) {
			return false;
		}

		var path = this.path;

		if (this.reverse) {
			path = SmartSVGPath.reverse(path);
		}

		path = MorphSVGPlugin.pathDataToBezier(path);

		return path;
	},
	show: function (cb) {
		var self = this;
		this.element.addClass('show');
		this.svg.animate({'stroke-dashoffset': 0}, 500, function () {
			if (typeof cb === 'function') cb(self);
		});
	},
	hide: function(cb){
		var self = this;
		this.svg.animate({'stroke-dashoffset': this.path_length * (this.reverse ? -1 : 1)}, 500, function () {
			self.element.removeClass('show');
			if (typeof cb === 'function') cb(self);
		});
	},
	transfer: function (cb) {
		var i, last;
		this.activate(true);
		for (i = 0; i < this.dots; i++) {
			last = (i === this.dots - 1);
			this.start_circle(i, last, last ? cb : false);
		}
		this.start_icon();
	},
	start_icon: function () {
		if (!this.animation_path) return;

		if (this.icon_svg) {
			var icon = $('<div></div>').addClass('icon ' + this.icon_pos).css({display: 'none'}).appendTo(this.element);
			$('<svg><use xlink:href="#dot-icon-' + this.icon_svg + '"></use></svg>').appendTo(icon);

			var duration = this.duration,
				delay = ((this.dots - 1) / 2) * this.delay_between_dots;

			var self = this;
			TweenMax.to(icon, duration, {
				bezier: {values: this.animation_path, type: "cubic"},
				delay: delay,
				ease: window.GreenSockGlobals.Linear.easeNone,
				onStart: function () {
					icon.css({display: 'block'})
				},
				onComplete: function () {
					icon.remove();
					icon = null;
				}
			});

			icon.css({
				opacity: 0
			});

			TweenMax.to(icon, 0.4, {
				opacity: 1,
				delay: delay + 0.1,
				ease: window.GreenSockGlobals.Linear.easeNone,
				onComplete: function () {

				}
			});

			TweenMax.to(icon, 0.4, {
				opacity: 0,
				delay: delay + duration - 0.6,
				ease: window.GreenSockGlobals.Linear.easeNone,
				onComplete: function () {
				}
			});
		}
	},
	start_circle: function (i, last, cb) {
		if (!this.animation_path) return;

		var self = this,
			circle = $('<div></div>').addClass('circle').css({display: 'none'}).appendTo(this.element),
			duration = this.duration,
			delay = this.random_delay ? Math.round((Math.random() * this.random_delay * 10)) / 10 : (i ? i * this.delay_between_dots : 0);

		this.transfering = true;

		TweenMax.to(circle, duration, {
			bezier: {values: this.animation_path, type: "cubic"},
			delay: delay,
			ease: window.GreenSockGlobals.Linear.easeNone,
			onStart: function () {
				circle.css({display: 'block'})
			},
			onComplete: function () {
				circle.remove();
				if (last) {
					self.complete(cb);
				}
			}
		});
	},
	complete: function (cb) {
		this.transfering = false;

		if (typeof cb === 'function') {
			cb(this);
		}

		if (typeof this.onComplete === 'function') {
			this.onComplete(this);
		}
	},
	activate: function (dir) {
		if (typeof dir === 'undefined') {
			dir = !this.is_active;
		}
		if( dir === this.is_active ) return;
		dir ? this.element.addClass('active') : this.element.removeClass('active');
		this.is_active = dir;
	}
});