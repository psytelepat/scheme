'use strict';

var $ = require('jquery'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'SchemeStack',
	pre: function(opt){

	},
	create: function(){
		var self = this;

		this.showed = false;

		this.name = this.element.data('name');
		this.svg_name = this.element.data('svg-name');
		this.limit = parseInt(this.element.data('limit') || 0);

		this.item = [];
		this.count = 0;
	},
	show: function(cb){
		if( this.showed ) return false;

		var self = this,
			i, last = false,
			count = this.element.data('count'),
			onComplete = function(){ self.show_complete(cb); };

		for(i=0;i<count;i++){
			last = ( ( count - 1 ) === i );
			this.push(true,10+i*200,last ? onComplete : null);
		}

		return true;
	},
	show_complete: function(cb){
		this.showed = true;
		if( typeof cb === 'function' ) { cb(this); }
		if( this.onShowComplete === 'function' ) { this.onShowComplete(this); }
	},
	push: function(animated,delay,cb){
		var self = this;

		if( this.limit > 0 && this.limit <= this.count ) {
			if( typeof cb === 'function' ) { cb(self); }
			return;
		}

		var item = $('<img class="'+this.svg_name+'" src="/assets/public/svg/s-'+this.svg_name+'.svg" />').css({ bottom: this.count * 8 }).appendTo(this.element);
		this.element.data('count', ++this.count);
		this.item.push( item );

		if( animated ) {
			var tEvt = this.transitionEndEventName(),
				onComplete = function(){
					$(this).removeClass('animated');
					item.unbind(tEvt,onComplete);
					if( typeof cb === 'function' ) { cb(self); }
				};
			item.bind(tEvt,onComplete).addClass('animated');
		}

		setTimeout(function(){
			item.addClass('active');
			if( !animated && typeof cb === 'function' ) { cb(self); }
		},10+delay);
	},
	pop: function(animated,delay,cb){
		if( this.count < 1 ) {
			return false;
		}

		var self = this,
			item = this.item.pop();
		this.element.data('count', --this.count);

		if( animated ) {
			var tEvt = this.transitionEndEventName(),
				onComplete = function(){
					$(this).removeClass('animated');
					item.unbind(tEvt,onComplete);
					item.remove();
					if( typeof cb === 'function' ) { cb(self); }
				};
			item.bind(tEvt,onComplete).addClass('animated');
		}

		setTimeout(function() {
			item.removeClass('active');
			if( !animated && typeof cb === 'function' ) {
				item.remove();
				cb(self);
			}
		},20+delay);

		return true;
	},
	clear: function(count){
		var i=0, count = count ? Math.min(count,this.count) : this.count;
		for(;i<count;i++){
			this.pop(true,i*100);
		}
	}
});

