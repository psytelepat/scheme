'use strict';

var $ = require('jquery'),
	IconedHint = require('./IconedHint'),
	Title = require('./Title'),
	Path = require('./Path'),
	Plate = require('./Plate'),
	MinimalClass = require('../../lib/MinimalClass');

module.exports = MinimalClass.extend({
	__className: 'Scheme',
	pre: function(){
		this.no_scroll_activation = false;
		this.activate_by_keycode = false;
	},
	create: function(){
		var self = this;

		this.scroll_prc = false;
		this.stopped = true;
		this.showed = false;
		this.showed_complete = false;

		this.title = {};
		this.element.find('div.title').each(function(i,elm){
			var title = new Title({ id: i, element: elm, delegate: this });
			self.title[title.name] = title;
		});

		this.plate = {};
		this.element.find('div.plate').each(function(i,elm){
			var plate = new Plate({ id: i, element: elm, delegate: this });
			self.plate[plate.name] = plate;
		});

		this.path = {};
		this.element.find('div.path').each(function(i,elm){
			var path = new Path({ id: i, element: elm, delegate: this });
			self.path[path.name] = path;
		});

		this.iconed_hint = {};
		this.element.find('div.iconed-hint').each(function(i,elm){
			var iconed_hint = new IconedHint({ id: i, element: elm, delegate: this });
			self.iconed_hint[iconed_hint.name] = iconed_hint;
		});

		if( this.activate_by_keycode ){
			$(window).bind('keyup',function(e){
				if( e.keyCode === self.activate_by_keycode ) {
					self.show();
					self.showed = true;
					self.stopped = false;
				}
			});
		}

		window.app.add_scroll(this);
		window.app.add_focus(this);
	},
	show: function(){
		if( this.showed ) { return; }

		var self = this, i = 0, k, start = 0;
		for(k in this.plate) {
			(function(i,k){ setTimeout(function(){ self.plate[k].show(); },i*500+start); })(i,k);
			i++;
		}

		start = 500;
		for(k in this.path) {
			(function(i,k){ setTimeout(function(){ self.path[k].show(); },start+i*200); })(i,k);
			i++;
		}

		i = 0;
		start = 500;
		for(k in this.iconed_hint) {
			(function(i,k){ setTimeout(function(){ self.iconed_hint[k].show(); },start+i*250); })(i,k);
			i++;
		}

		var self = this;
		setTimeout(function(){
			self.show_complete();
		},2000);
	},
	show_complete: function(){
		this.showed_complete = true;
	},
	scroll: function(scrollTop){
		this.scroll_prc = this.calc_element_scroll_prc(this.element[0]);
		if(!this.no_scroll_activation && !this.showed && ( this.scroll_prc >= 0.1 ) && ( this.scroll_prc <= 0.9 )){
			this.show();
			this.showed = true;
			this.stopped = false;
		}
		this.update_stopped_state();
	},
	focus: function(){
		this.update_stopped_state();
	},
	update_stopped_state: function(){}
});