import {browsing} from './functions/browsing.js';
import {content} from './functions/content.js';
import {apiCall} from './functions/apiCall.js';
import {context} from './functions/context.js';
import {task} from './functions/task.js';

var functions = [
	browsing,
	content,
	apiCall,
	context,
	task
]
export {functions};