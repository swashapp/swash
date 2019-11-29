console.log("modules/youtube/content.js");
import {youtube} from './manifest.js';
youtube.content_matches = ["*://*.youtube.com/*"];
youtube.content_mapping = {
	win: 'desktop',
	mac: 'desktop', 
	android: 'mobile',
	cros: 'desktop',
	openbsd: 'desktop',
	ios: 'mobile',
	ipados: 'desktop'
}