var ppOptions = {
	els : {
		default : {
			width : document.querySelector('#default-width'),
			height : document.querySelector('#default-height'),
			button : document.querySelector('#default-submit')
		}
	},
	/**
	 * Populate fields
	 */
	populate : {
		default : function () {
			pplib.options.default().then( options => {
				for (let key in options) {
					ppOptions.els.default[key].value = options[key];
				}
			})
		}
	},
	/**
	 * Update Settings
	 */
	update : {
		default : function (e) {
			e.preventDefault();

			let width = parseInt(ppOptions.els.default.width.value) || 0,
				height = parseInt(ppOptions.els.default.height.value) || 0;

			browser.storage.local.set({
				default : {
					width : width < 100 ? 100 : width,
					height : height < 100 ? 100 : height
				}
			}).then(() => {
				ppOptions.populate.default();
			});
		}
	}
};

/**
 * Add Event Listeners Fields
 */

ppOptions.els.default.button.addEventListener('click', ppOptions.update.default);

/**
 * Populate Fields
 */

document.addEventListener('DOMContentLoaded', e => {
	ppOptions.populate.default();
});