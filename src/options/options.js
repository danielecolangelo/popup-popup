document.addEventListener('DOMContentLoaded', e => {
	getOptions().then( options => {
		for (let key in options) {
			document.querySelector('#' + key).value = options[key];
		}
	})
});


document.querySelector('form').addEventListener('submit', e => {
	e.preventDefault();
	browser.storage.local.set({
		'popup-width'  : document.querySelector('#popup-width').value,
		'popup-height' : document.querySelector('#popup-height').value
	})

});