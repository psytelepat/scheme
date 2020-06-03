'use strict';

var $ = require('jquery'),
	Scheme = require('./Scheme');

module.exports = Scheme.extend({
	__className: 'Scheme4',
	create: function(){
		this._super();

		var self = this;

		this.show();
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
	scroll: function(){},
	show_complete: function(){
		this._super();
	}
});