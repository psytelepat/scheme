'use strict';

var $ = require('jquery'),
	Scheme = require('./Scheme');

module.exports = Scheme.extend({
	__className: 'Scheme4',
	create: function(){

		// this.no_scroll_activation = true;
		// this.activate_by_keycode = 86;

		this._super();

		var self = this;
	},
	show: function(){
		var self = this;

		function transfer(e) {
			setTimeout(function(){ e.transfer(transfer); },Math.random()*500);
		};

		this.plate['hyperion'].show(function(){

			for(var i=1;i<=6;i++){
				(function(i){
					setTimeout(function(){
						self.plate['mail'+i].show(function(){
							self.path['mail'+i].show(function(){
								transfer(self.path['mail'+i]);
							});
						});
					},i*100);
				})(i);
			}

			self.show_complete();
		});
	},
	show_complete: function(){
		this._super();

		var self = this;
	},
	update_stopped_state: function(){
		var should_be_stopped = !window.app.focused || ( this.scroll_prc <= 0 ) || ( this.scroll_prc >= 1 );
		if( this.stopped !== should_be_stopped ) {
			this.stopped = should_be_stopped;

			if( this.showed_complete && !should_be_stopped ){

			}
		}
	}
});