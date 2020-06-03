'use strict';

var $ = require('jquery'),
	Scheme = require('./Scheme');

module.exports = Scheme.extend({
	__className: 'Scheme1',
	create: function(){

		// this.no_scroll_activation = true;
		// this.activate_by_keycode = 90;

		this._super();

		var self = this;

		this.energy_buffer = 0;
		this.money_transfer_interval = false;

		this.running = {
			energy_generation: 0,
			transfer_money_for_energy: false
		};

		this.onEnergyArrived = function(){
			if(!self.stopped) {
				setTimeout(function(){ self.generate_energy(); },Math.round(Math.random() * 50));
			}
		};
	},
	show: function(){
		var self = this;

		this.plate['solar'].show(function(){
			self.iconed_hint['mvt'].show();
			self.path['solar1'].show();
			self.path['solar2'].show();
			self.path['solar3'].show(function(){
				self.title['miner'].show();
				self.plate['miner'].show(function(){
					self.title['hyperion'].show();
					self.plate['hyperion'].show();
					self.path['energy'].show(function(){
						self.path['money'].show(function(){
							setTimeout(function(){
								self.plate['hyperion'].stack['coin'].pop(true,0,function(){
									self.iconed_hint['exchange'].show();
									self.plate['miner'].stack['coin'].push(true,0,function(){
										self.show_complete();
									});
								});
							},800);
						});
					});
				});
			});
		});
	},
	show_complete: function(){
		this._super();

		var self = this;

		setTimeout(function(){ self.iconed_hint['energy'].show(); },100);

		this.path['solar1'].onComplete = this.onEnergyArrived;
		this.path['solar2'].onComplete = this.onEnergyArrived;
		this.path['solar3'].onComplete = this.onEnergyArrived;

		this.path['solar1'].activate(true);
		this.path['solar2'].activate(true);
		this.path['solar3'].activate(true);

		for(var i=0;i<3;i++){
			this.generate_energy();
		}

		setTimeout(function(){ self.transfer_money_for_energy(); },1000);
	},
	transfer_money_for_energy: function(){
		var self = this;
		self.running.transfer_money_for_energy = true;
		self.iconed_hint['tariff'].show();
		self.path['energy'].transfer();
		self.path['money'].transfer(function(){
			self.plate['miner'].stack['dollar'].push(true,0);
			self.plate['miner'].stack['dollar'].push(true,100);
			self.plate['miner'].stack['dollar'].push(true,200);
			self.plate['miner'].stack['dollar'].push(true,300);

			self.running.transfer_money_for_energy = false;
			self.showed_complete = true;

			if( !self.stopped ) {
				self.transfer_money_for_energy();
			}
		});
	},
	generate_energy: function(){
		var self = this,
			path = ( 1 + Math.round(Math.random() * 2) );
		this.path['solar'+path].transfer(function(){ self.running.energy_generation--; });
		this.running.energy_generation++;
	},
	update_stopped_state: function(){
		var should_be_stopped = !window.app.focused || ( this.scroll_prc <= 0 ) || ( this.scroll_prc >= 1 );
		if( this.stopped !== should_be_stopped ) {
			this.stopped = should_be_stopped;

			if( this.showed_complete && !should_be_stopped ){
				for(var i=this.running.energy_generation;i<3;i++){
					this.generate_energy();
				}

				if(!this.running.transfer_money_for_energy) {
					this.transfer_money_for_energy();
				}
			}
		}
	}
});