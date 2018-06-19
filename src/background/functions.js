/**
 * Store last active window ID
 */
var lastActiveWindowID;

/**
 * Generate contextual menu to move a page into a popup
 */
var createMoveInAPopup = function(w) {
		browser.menus.create({
			id       : 'popup-popup-contextMenus-page',
			contexts : ['page'],
			title    : 'Move in a Popup',
			onclick  : moveToPopup
		});
}

/**
 * Generate contextual menu to move back a popup into a normal window
 */
var createMoveBack     = function(w) {
		browser.menus.create({
			id       : 'popup-popup-contextMenus-page',
			contexts : ['page'],
			title    : 'Move Popup back',
			onclick  : moveToWindow
		});
}


/**
 * Move to popup
 */
var moveToPopup = function(info,tab){
	browser.windows.create({
		type   : 'popup',
		tabId  : tab.id,
		height : 360,
		width  : 640
	});
}

/**
 * Move Popup Back into a window
 */
var moveToWindow = function(info,tab){

	if (lastActiveWindowID) {
		let w = browser.windows.get(lastActiveWindowID, { windowTypes : ['normal'] });
		w.then( w => {
			move(w)
		}, e => {
			getAnotherWindow();
		})
	} else {
		getAnotherWindow();
	}

	/**
	 * if lastActiveWindow doesn't exist get the last normal window
	 * if there are no normal windows create a new one
	 */
	function getAnotherWindow() {
		browser.windows.getAll({
			windowTypes : ['normal']
		}).then( windowList => {
			if( windowList.length > 0 ){
				console.log(windowList)
				let w = windowList[windowList.length - 1];
				move(w)
			} else {
				browser.windows.create({
					type   : 'normal',
					tabId  : tab.id
				});
			}
		})
	}

	/**
	 * Move the tab in the selected window
	 */
	function move(w) {
		browser.tabs.move(tab.id, {
			windowId : w.id,
			index    : -1
		}).then( tabs => {
			browser.windows.update(tabs[0].windowId, {focused: true});
			browser.tabs.update(tabs[0].id, {active: true});
		})
	}
}