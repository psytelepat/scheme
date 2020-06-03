'use strict';

var $ = require('jquery'),
	Scheme = require('./Scheme');

module.exports = Scheme.extend({
	__className: 'Scheme2',
	create: function(){

		// this.no_scroll_activation = true;
		// this.activate_by_keycode = 88;

		this._super();
		var self = this;

		this.is_sold = false;

		this.ci_income = 0;

		this.running = false;
	},
	show: function(){
		var self = this;

		this.running = true;

		this.plate['solar'].show(function(){

			self.plate['solar'].image['ppa'].show();

			setTimeout(function() {
				self.iconed_hint['ppa'].show();
			},1200);
			setTimeout(function(){

				self.iconed_hint['hyperion'].show();
				self.iconed_hint['bank'].show();
				self.plate['money_fund'].show();
				self.plate['paper_fund'].show(function(){
					setTimeout(function(){
						self.path['money_fund'].show();
						self.path['paper_fund'].show(function(){
							setTimeout(function(){
								self.invest();
							},300);
						});
					},300);
				});
			},2000);
		});
	},
	invest: function(cb){
		var self = this;

		this.path['money_fund'].transfer(function(){
			self.path['money_fund'].activate(false);
		});
		this.path['paper_fund'].transfer(function(){
			self.path['paper_fund'].activate(false);
			self.plate['solar'].image['ppa'].hide();
			self.iconed_hint['ppa'].hide();
			self.plate['solar'].plate_overlay.add_prc(100);
			setTimeout(function(){
				self.iconed_hint['doubled'].hide();
			},1000);
			setTimeout(function(){
				self.ppa();
			},1500);
		});
	},
	ppa: function(){
		var self = this;

		self.path['solar2ppa'].show();
		self.path['ppa2solar'].show();

		self.iconed_hint['ppa2'].show();
		self.iconed_hint['government'].show();

		self.plate['ci'].show();
		self.iconed_hint['ci'].show();
		self.path['solar2ci'].show();

		self.plate['ppa'].show();
		self.plate['government'].show(function(){
			self.path['ppa2gov'].show();

			self.path['gov2ppa'].show(function(){
				self.transfer_to_government();
				self.show_complete();
			});
		});
	},
	show_complete: function(){
		this._super();

		var self = this;

		this.core_investor_procedure();
	},
	core_investor_procedure: function(){
		var self = this;
		this.path['ci'].show(function(){
			self.path['fund2bank'].show();
			self.sold(true);
			self.path['ci'].transfer(function(){
				self.path['ci'].activate(false);
				self.path['fund2bank'].transfer(function(){
					self.path['fund2bank'].activate(false);
					setTimeout(function(){
						self.path['fund2bank'].hide(function(){
							self.path['ci'].hide();
						});
					},500);
				});
			});
		});
	},
	create_double: function(){
		var self = this;

		this.running = true;

		this.path['money_fund'].show();
		this.path['paper_fund'].show();
		this.iconed_hint['doubled'].show();
		this.plate['solar'].show(function(){
			self.invest();
		});
	},
	transfer_to_government: function(){
		var self = this;

		self.path['ppa2gov'].activate(true);
		self.path['ppa2solar'].activate(true);

		self.path['solar2ppa'].transfer(function(){
			self.path['ppa2gov'].transfer();
		});

		self.path['gov2ppa'].transfer(function(){
			self.path['ppa2solar'].transfer(function(){
				self.path['solar2ci'].transfer(function(){
					self.ci_income++;
					if( self.ci_income >= 4 ) {
						self.ci_income = 0;

						setTimeout(function(){

							self.path['solar2ci'].activate(false);

							self.path['solar2ppa'].activate(false);
							self.path['ppa2solar'].activate(false);
							self.path['ppa2gov'].activate(false);
							self.path['gov2ppa'].activate(false);

							self.plate['ci'].hide();
							self.iconed_hint['ci'].hide();
							self.plate['ppa'].hide();
							self.iconed_hint['ppa2'].hide();
							self.plate['government'].hide();
							self.iconed_hint['government'].hide();

							self.path['solar2ppa'].hide();
							self.path['ppa2solar'].hide();
							self.path['ppa2gov'].hide();
							self.path['gov2ppa'].hide();

							self.path['solar2ci'].hide();

							self.plate['solar'].hide(function(){
								self.plate['solar'].element.removeClass('sold');
								self.is_sold = false;
								self.plate['solar'].plate_overlay.set_prc(0,true);

								self.showed_complete = true;
								self.running = false;

								if(!self.stopped) {
									setTimeout(function () {
										self.create_double();
									}, 500);
								}
							});

						},300);

					}else{
						self.transfer_to_government();
					}
				});
			});
		});
	},
	sold: function(dir){
		if( typeof dir === 'undefined' ) { dir = !this.is_sold; }

		if( dir ) {
			this.plate['solar'].element.addClass('sold');
			this.path['money_fund'].hide();
			this.path['paper_fund'].hide();
		}else{
			this.plate['solar'].element.removeClass('sold');
			this.path['money_fund'].show();
			this.path['paper_fund'].show();
		}

		this.is_sold = dir;
	},
	update_stopped_state: function(){
		var should_be_stopped = !window.app.focused || ( this.scroll_prc <= 0 ) || ( this.scroll_prc >= 1 );
		if( this.stopped !== should_be_stopped ) {
			this.stopped = should_be_stopped;

			if( this.showed_complete && !should_be_stopped ){
				if(!this.running){
					this.create_double();
				}
			}
		}
	}
});