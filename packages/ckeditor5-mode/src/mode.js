/**
 * @module mode/mode
 */

// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import Plugin from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';

import ModeUI from './modeui';

import '../theme/mode.css';

/**
 * @extends module:core/plugin~Plugin
 */
export default class Mode extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ModeUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Mode';
	}
}
