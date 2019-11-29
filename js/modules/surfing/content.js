console.log("modules/surfing/content.js");
import {surfing} from './manifest.js';
surfing.content_matches = ["*://*/*"]
surfing.content_mapping = {
	win: 'desktop',
	mac: 'desktop', 
	android: 'desktop',
	cros: 'desktop',
	openbsd: 'desktop',
	ios: 'desktop',
	ipados: 'desktop'
}