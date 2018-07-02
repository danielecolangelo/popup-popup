/**
 * Contextual menu to create popup from a link
 */
browser.menus.create({
	id       : 'popup-popup-contextMenus-link',
	title    : 'Open in a Popup',
	contexts : ['link'],
	onclick  : (info,tab) => {
		pplib.options.default().then( options => {
			browser.windows.create({
				url    : info.linkUrl,
				type   : 'popup',
				height : options['height'],
				width  : options['width'],
			});
		} )
	},
});

/**
 * Contextual menu to move a tab into a popup
 */
browser.menus.create({
	id       : 'popup-popup-contextMenus-tab',
	title    : 'Move in a Popup',
	contexts : ['tab'],
	onclick  : pplib.action.toPopup,
});

/**
 * Contextual menu to move a page into a popup
 * and a popup back into a normal window
 */
browser.windows.onFocusChanged.addListener((windowID) => {
	if( windowID && windowID > 0 ){
		browser.windows.get(windowID).then((w) => {
			let removePromise = browser.menus.remove('popup-popup-contextMenus-page');
			switch (w.type) {
				case 'normal':
					pplib.vars.lastActiveWindowID = windowID;
					removePromise.then(pplib.menu.toPopup)
					break;
				case 'popup':
					removePromise.then(pplib.menu.toWindow)
					break;
			}
		});
	}
});