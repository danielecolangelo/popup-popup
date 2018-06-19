var getOptions = function() {
	return browser.storage.local.get({
		'popup-width'  : 640,
		'popup-height' : 360
	});

}