/**
 * @module correction/correction
 */

// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import Plugin from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';

import CorrectionEditing from './correctionediting';
import CorrectionUI from './correctionui';

import '../theme/correction.css';

/**
 * @extends module:core/plugin~Plugin
 */
export default class Correction extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ CorrectionEditing, CorrectionUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Correction';
	}
}
