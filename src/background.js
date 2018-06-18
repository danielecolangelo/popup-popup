
browser.menus.create({
	id       : 'popup-popup-contextMenus-link',
	title    : 'Open in a Popup',
	icons    : {
		'16' : 'icons/fi-arrows-out.svg'
	},
	contexts : ['link'],
	onclick  : (info,tab) => {
		browser.windows.create({
			url    : info.linkUrl,
			type   : 'popup',
			height : 360,
			width  : 640
		});
	},
});

browser.menus.create({
	id       : 'popup-popup-contextMenus-tab',
	title    : 'Move in a Popup',
	icons    : {
		'16' : 'icons/fi-arrows-out.svg'
	},
	contexts : ['tab'],
	onclick  : (info,tab) => {
		browser.windows.create({
			type   : 'popup',
			tabId  : tab.id,
			height : 360,
			width  : 640
		});
	},
});