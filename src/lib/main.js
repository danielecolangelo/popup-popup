var pplib = {

	vars : {
		/**
		 * Store last active window ID
		 */
		lastActiveWindowID : false,
	},


	menu : {
		/**
		 * Generate contextual menu to move a page into a popup
		 */
		toPopup : function(w) {
			browser.menus.create({
				id       : 'popup-popup-contextMenus-page',
				contexts : ['page'],
				title    : 'Move in a Popup',
				onclick  : pplib.action.toPopup
			});
		},

		/**
		 * Generate contextual menu to move back a popup into a normal window
		 */
		toWindow : function(w) {
			browser.menus.create({
				id       : 'popup-popup-contextMenus-page',
				contexts : ['page'],
				title    : 'Move Popup back',
				onclick  : pplib.action.toWindow
			});
		},
	},


	action : {
		/**
		 * Move to popup
		 */
		toPopup : function(info,tab) {
			pplib.getOptions().then( options => {
				browser.windows.create({
					type   : 'popup',
					tabId  : tab.id,
					height : parseInt(options['popup-height']),
					width  : parseInt(options['popup-width'])
				});
			});
		},

		/**
		 * Move Popup Back into a window
		 */
		toWindow : function(info,tab) {
			if (pplib.vars.lastActiveWindowID) {
				let w = browser.windows.get(pplib.vars.lastActiveWindowID, { windowTypes : ['normal'] });
				w.then( w => {
					pplib.internal.move(w, tab)
				}, e => {
					pplib.internal.getAnotherWindow(tab);
				})
			} else {
				pplib.internal.getAnotherWindow(tab);
			}
		},
	},

	getOptions : function() {
		return browser.storage.local.get({
			'popup-width'  : 640,
			'popup-height' : 360
		});

	},

	internal : {
		/**
		 * if lastActiveWindow doesn't exist get the last normal window
		 * if there are no normal windows create a new one
		 */
		getAnotherWindow : function (tab) {
			browser.windows.getAll({
				windowTypes : ['normal']
			}).then( windowList => {
				if( windowList.length > 0 ){
					console.log(windowList)
					let w = windowList[windowList.length - 1];
					pplib.internal.move(w, tab)
				} else {
					browser.windows.create({
						type   : 'normal',
						tabId  : tab.id
					});
				}
			})
		},

		/**
		 * Move the tab in the selected window
		 */
		move : function(w, tab) {
			browser.tabs.move(tab.id, {
				windowId : w.id,
				index    : -1
			}).then( tabs => {
				browser.windows.update(tabs[0].windowId, {focused: true});
				browser.tabs.update(tabs[0].id, {active: true});
			})
		}
	}

};