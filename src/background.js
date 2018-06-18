
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