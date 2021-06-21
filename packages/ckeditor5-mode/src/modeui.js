/**
 * @module mode/modeui
 */

// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import Plugin from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';
// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import ButtonView from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-ui/src/button/buttonview';

import modeIcon from '../theme/icons/mode.svg';

const COOKIE_NAME = 'tinymce_mode';
const MODE_SIMPLE = 'simple';
const MODE_ADVANCED = 'advanced';

/**
 * @extends module:core/plugin~Plugin
 */
export default class ModeUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'Mode', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Changer de mode' ),
				icon: modeIcon,
				tooltip: true,
				withText: true,
				class: 'bns-mode-btn'
			} );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				this.toggleMode();
			} );

			return view;
		} );

		// initial state
		const mode = this.getMode();
		if (mode) {
			this.applyMode( mode );
		} else {
			this.applyMode( MODE_ADVANCED );
		}
	}

	toggleMode() {
		let mode = this.getMode();
		console.log('Toggle Mode from', mode);

		if ( mode === MODE_SIMPLE ) {
			mode = MODE_ADVANCED;
		} else {
			mode = MODE_SIMPLE;
		}

		console.log('Toggle Mode to', mode);
		this.applyMode( mode );
	}

	getMode() {
		return this.getCookie();
	}

	applyMode( mode ) {
		console.log('apply mode', mode);
		document.body.classList.remove( [`editor-${MODE_SIMPLE}`, `editor-${MODE_ADVANCED}`] );
		document.body.classList.add( `editor-${mode}` );
		this.setCookie( mode );
	}

	getCookie() {
		const cookie = document.cookie.split( '; ' ).find( row => row.startsWith( `${COOKIE_NAME}=`) );
		if (cookie) {
			return cookie.split( '=' )[1];
		} else {
			return null;
		}
	}

	setCookie( value ) {
		document.cookie = `${COOKIE_NAME}=${value};path=/`;
	}


}
