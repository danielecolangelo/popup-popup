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
			return pplib.options.default().then( options => {
				return browser.windows.create({
					type   : 'popup',
					tabId  : tab.id,
					height : options['height'],
					width  : options['width'],
				});
			});
		},

		/**
		 * Move Popup Back into a window
		 */
		toWindow : function(info,tab) {
			let win;
			if (pplib.vars.lastActiveWindowID) {
				win = browser.windows.get(pplib.vars.lastActiveWindowID, { windowTypes : ['normal'] })
					.then( w => {
						return pplib.internal.move(w, tab)
					}, e => {
						pplib.internal.getAnotherWindow(tab);
					})
			} else {
				win = pplib.internal.getAnotherWindow(tab);
			}
			return win;
		},
	},

	options : {
		default : function(){
			return browser.storage.local.get({
				default : {
					width : 640,
					height : 360
				}
			}).then( values => values.default );
		}
	},

	internal : {
		/**
		 * if lastActiveWindow doesn't exist get the last normal window
		 * if there are no normal windows create a new one
		 */
		getAnotherWindow : function (tab) {
			return browser.windows.getAll({
				windowTypes : ['normal']
			}).then( windowList => {
				if( windowList.length > 0 ){
					return pplib.internal.move(windowList[windowList.length - 1], tab)
				} else {
					return browser.windows.create({
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
			return browser.tabs.move(tab.id, {
				windowId : w.id,
				index    : -1
			}).then( tabs => {
				browser.windows.update(tabs[0].windowId, {focused: true});
				return browser.tabs.update(tabs[0].id, {active: true});
			})
		}
	}

};