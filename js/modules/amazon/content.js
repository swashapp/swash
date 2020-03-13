import {amazon} from './manifest.js';
amazon.content_matches = ["*://*.amazon.com/*", "*://*.amazon.de/*","*://*.amazon.nl/*"]
amazon.content_mapping = {
	win: 'desktop',
	mac: 'desktop', 
	android: 'mobile',
	cros: 'desktop',
	openbsd: 'desktop',
	ios: 'mobile',
	ipados: 'desktop'
}