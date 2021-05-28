/**
 * @module correction/correctionui
 */

// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import Plugin from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';
// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import ButtonView from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-ui/src/button/buttonview';

import { ANNOTATION_TYPES } from './annotation-types';
import { createUUID } from './utils';

const CORRECTION = 'correction';

/**
 * @extends module:core/plugin~Plugin
 */
export default class CorrectionUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		ANNOTATION_TYPES.forEach( annotation => {
			editor.ui.componentFactory.add( CORRECTION + annotation.type, locale => {
				const command = editor.commands.get( CORRECTION );
				const view = new ButtonView( locale );

				view.set( {
					label: t( annotation.label ),
					withText: true,
					isToggleable: true,
					class: 'bns-annotation-btn bns-annotation-btn-' + annotation.type
				} );

				view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

				// Execute command.
				this.listenTo( view, 'execute', () => {
					onExecute( annotation );
				} );

				return view;
			} );
		} );

		function onExecute( annotation ) {
			const selection = editor.model.document.selection;

			// Add annotation
			if ( !selection.isCollapsed ) {
				let label = '';
				for ( const text of selection.getFirstRange().getItems() ) {
					label += text.data;
				}
				const data = {
					guid: createUUID(),
					type: annotation.type,
					label
				};
				const commandOptions = {
					// Pass data as a string
					forceValue: `${ data.type }:${ data.guid }`
				};

				editor.execute( CORRECTION, commandOptions );
				editor.editing.view.focus();

				// Fire a JS event
				editor.fire( 'annotation:add', data );
			}
		}
	}
}
