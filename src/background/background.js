/**
 * Contextual menu to create popup from a link
 */
browser.menus.create({
	id       : 'popup-popup-contextMenus-link',
	title    : 'Open in a Popup',
	contexts : ['link'],
	onclick  : (info,tab) => {
		getOptions().then( options => {
			browser.windows.create({
				url    : info.linkUrl,
				type   : 'popup',
				height : parseInt(options['popup-height']),
				width  : parseInt(options['popup-width'])
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
	onclick  : moveToPopup,
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
					lastActiveWindowID = windowID;
					removePromise.then(createMoveInAPopup)
					break;
				case 'popup':
					removePromise.then(createMoveBack)
					break;
			}
		});
	}
});