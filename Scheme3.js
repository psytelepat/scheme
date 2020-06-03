'use strict';

var $ = require('jquery'),
	Scheme = require('./Scheme');

module.exports = Scheme.extend({
	__className: 'Scheme3',
	create: function(){

		// this.no_scroll_activation = true;
		// this.activate_by_keycode = 67;

		this._super();
		var self = this;

		this.ppa_drawn = false;
		this.clients_drawn = false;

		this.funding_interval = false;
		this.energy_from_government_started = false;
		this.money_from_government_started = false;

		this.running = {
			send_money_from_government: false,
			money_from_clients: false
		};
	},
	show: function(){
		var self = this;

		self.plate['solar'].show(function() {

			self.plate['hyperion'].show();
			self.iconed_hint['hyperion'].show();
			setTimeout(function(){ self.path['funding'].show(); },500);
			setTimeout(function(){ self.path['funding'].transfer(function(){
				self.path['funding'].activate(false);
			}); },700);

			setTimeout(function(){
				self.path['solar1'].show();
				self.path['solar2'].show();
				self.path['solar3'].show(function(){
					self.run_energy_from_sun_station();
					self.iconed_hint['miner'].show();
					self.plate['miner'].show(function(){
						self.path['miner_energy'].show();
						self.path['miner_money'].show();
					});
				});
			},1000);
		});
	},
	show_complete: function(){
		this._super();
		this.showed_complete = true;
	},
	run_energy_from_sun_station: function(){
		var self = this,
			energy_generated = 0;

		function transfer(e) { if(!self.showed_complete || !self.stopped){ e.transfer(transfer); } };
		setTimeout(function(){ transfer(self.path['solar1']); }, Math.round(Math.random() * 500));
		setTimeout(function(){ transfer(self.path['solar2']); }, Math.round(Math.random() * 500));
		setTimeout(function(){ transfer(self.path['solar3']); }, Math.round(Math.random() * 500));

		self.path['solar1'].activate(true);
		self.path['solar2'].activate(true);
		self.path['solar3'].activate(true);

		setTimeout(function(){ self.draw_ppa(); },1000);
	},
	draw_ppa: function(){
		if(this.ppa_drawn){ return; }
		this.ppa_drawn = true;

		var self = this;

		this.path['fund2ppa'].show(function(){
			self.plate['ppa'].show();
			self.iconed_hint['ppa'].show();
			self.path['ppa2fund'].show();

			self.path['ppa2gov'].show();
			self.path['gov2ppa'].show();

			self.iconed_hint['government'].show();
			self.plate['government'].show();
			self.draw_clients();
		});
	},
	draw_clients: function(){
		if(this.clients_drawn) return;
		this.clients_drawn = true;

		var self = this;

		this.path['energy1'].show();
		this.path['energy2'].show();
		this.path['energy3'].show(function(){
			self.plate['clients'].show(function(){
				self.path['client_money'].show(function(){
					self.send_energy_from_miner();
				});
			});
		});

		return true;
	},
	send_energy_from_miner: function(){
		var self = this;

		self.path['miner_energy'].activate(true);
		self.path['fund2ppa'].activate(true);
		self.path['ppa2gov'].activate(true);

		self.path['gov2ppa'].activate(true);
		self.path['ppa2fund'].activate(true);
		self.path['miner_money'].activate(true);

		self.path['miner_energy'].transfer(function(){
			self.send_energy_to_government();
		});
	},
	start_money_from_government: function(){
		if( this.money_from_government_started ) return;
		this.money_from_government_started = true;

		var self = this;
		this.send_money_from_government();
		setTimeout(function(){
			self.send_money_from_government();
		},1500);
	},
	send_energy_to_government: function(){
		var self = this;

		self.path['fund2ppa'].transfer(function(){
			self.path['ppa2gov'].transfer(function(){
				self.start_energy_from_government();
			});
		});
	},
	start_energy_from_government: function(){
		if( this.energy_from_government_started ) return;
		this.energy_from_government_started = true;

		var self = this;

		function transfer(e) { if( !self.showed_complete || !self.stopped ) { e.transfer(transfer); }; };
		setTimeout(function(){ transfer(self.path['energy1']); }, Math.round(Math.random() * 500));
		setTimeout(function(){ transfer(self.path['energy2']); }, Math.round(Math.random() * 500));
		setTimeout(function(){ transfer(self.path['energy3']); }, Math.round(Math.random() * 500));

		self.path['energy1'].activate(true);
		self.path['energy2'].activate(true);
		self.path['energy3'].activate(true);

		this.start_money_from_clients();
	},
	send_money_from_government: function(){
		var self = this;

		this.running.send_money_from_government = true;
		self.path['gov2ppa'].transfer(function(){
			self.path['ppa2fund'].transfer(function(){
				self.path['miner_money'].transfer(function(){
					self.path['miner_energy'].transfer(function() { self.send_energy_to_government(); });

					self.running.send_money_from_government = false;
					self.showed_complete = true;

					if( !self.showed_complete || !self.stopped ) {
						self.send_money_from_government();
					}
				});
			});
		});
	},
	start_money_from_clients: function(){
		var self = this,
			m1 = this.path['client_money'];

		function transfer(e){
			if(!self.showed_complete || !self.stopped) {
				self.running.money_from_clients = true;
				e.transfer(function(e){
					self.start_money_from_government();
					e.transfer(transfer);
				});
			}else{
				self.running.money_from_clients = false;
			}
		};
		setTimeout(function(){ transfer(m1); }, 1000);
	},
	update_stopped_state: function(){
		var self = this,
			should_be_stopped = !window.app.focused || ( this.scroll_prc <= 0 ) || ( this.scroll_prc >= 1 );

		function transfer(e) { if(!self.stopped){ e.transfer(transfer); } };

		if( this.stopped !== should_be_stopped ) {
			this.stopped = should_be_stopped;

			if( this.showed_complete && !should_be_stopped ){

				if( !self.running.send_money_from_government ) {
					this.send_money_from_government();
					setTimeout(function(){ self.send_money_from_government(); },1500);
				}

				if( !self.path['solar1'].transfering )
					setTimeout(function(){ transfer(self.path['solar1']); }, Math.round(Math.random() * 500));
				if( !self.path['solar2'].transfering )
					setTimeout(function(){ transfer(self.path['solar2']); }, Math.round(Math.random() * 500));
				if( !self.path['solar3'].transfering )
					setTimeout(function(){ transfer(self.path['solar3']); }, Math.round(Math.random() * 500));

				if( !self.path['energy1'].transfering )
					setTimeout(function(){ transfer(self.path['energy1']); }, Math.round(Math.random() * 500));
				if( !self.path['energy2'].transfering )
					setTimeout(function(){ transfer(self.path['energy2']); }, Math.round(Math.random() * 500));
				if( !self.path['energy3'].transfering )
					setTimeout(function(){ transfer(self.path['energy3']); }, Math.round(Math.random() * 500));

				if(!self.running.money_from_clients) {
					self.start_money_from_clients();
				}
			}
		}
	}
});