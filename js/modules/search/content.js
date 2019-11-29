console.log("modules/search/content.js");
import {search} from './manifest.js';
search.content_matches = ["*://www.google.com/search?*", "*://www.bing.com/*", "*://*.yahoo.com/*", "*://search.aol.com/aol/*", "*://www.ask.com/*", "*://*.baidu.com/*", "*://duckduckgo.com/*"];
search.content_mapping = {
	win: 'desktop',
	mac: 'desktop', 
	android: 'mobile',
	cros: 'desktop',
	openbsd: 'desktop',
	ios: 'mobile',
	ipados: 'desktop'
}