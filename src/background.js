
browser.menus.create({
	id       : 'popup-popup-contextMenus-link',
	title    : 'Open in a Popup',
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