var ppOptions = {
	els : {
		main : {
			width : document.querySelector('#main-width'),
			height : document.querySelector('#main-height'),
			update : document.querySelector('#main-submit'),
			reset : document.querySelector('#main-reset'),
		}
	},
	/**
	 * Populate fields
	 */
	populate : {
		main : function () {
			pplib.options.main().then( options => {
				for (let key in options) {
					ppOptions.els.main[key].value = options[key];
				}
			})
		}
	},
	/**
	 * Update Settings
	 */
	update : {
		main : function (e) {
			e.preventDefault();

			let width = parseInt(ppOptions.els.main.width.value) || 0,
				height = parseInt(ppOptions.els.main.height.value) || 0;

			browser.storage.local.set({
				main : {
					width : width < 100 ? 100 : width,
					height : height < 100 ? 100 : height
				}
			}).then(() => {
				ppOptions.populate.main();
			});
		}
	},
	/**
	 * Update Settings
	 */
	reset : {
		main : function (e) {
			e.preventDefault();

			browser.storage.local.set({
				main : {
					width : pplib.optionsDefault.main.width,
					height : pplib.optionsDefault.main.height,
				}
			}).then(() => {
				ppOptions.populate.main();
			});
		}
	}
};

/**
 * Add Event Listeners Fields
 */

ppOptions.els.main.update.addEventListener('click', ppOptions.update.main);
ppOptions.els.main.reset.addEventListener('click', ppOptions.reset.main);

/**
 * Populate Fields
 */

document.addEventListener('DOMContentLoaded', e => {
	ppOptions.populate.main();
});