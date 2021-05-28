/**
 * @module correction/correctionediting
 */

// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import Plugin from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';
// eslint-disable-next-line ckeditor5-rules/no-relative-imports
import AttributeCommand from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-basic-styles/src/attributecommand';

import { findDescendant } from './utils';

const CORRECTION = 'correction';

/**
 * @extends module:core/plugin~Plugin
 */
export default class CorrectionEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'CorrectionEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.model.schema.extend( '$text', {
			allowAttributes: [ CORRECTION ]
		} );
		editor.model.schema.setAttributeProperties( CORRECTION, {
			isFormatting: true,
			copyOnEnter: true
		} );

		editor.conversion.for( 'downcast' ).attributeToElement( {
			model: CORRECTION,
			view: ( attributeValue, { writer } ) => {
				if ( !attributeValue ) {
					return;
				}
				const [ type, guid ] = attributeValue.split( ':' );

				return writer.createAttributeElement( 'span', {
					'data-bns-annotation': type,
					'data-bns-annotation-guid': guid
				} );
			}
		} );

		editor.conversion.for( 'upcast' ).attributeToAttribute( {
			model: {
				key: CORRECTION,
				value: viewElement => [
					viewElement.getAttribute( 'data-bns-annotation' ),
					viewElement.getAttribute( 'data-bns-annotation-guid' )
				].join( ':' )
			},
			view: {
				name: 'span',
				attributes: {
					'data-bns-annotation': /.*/,
					'data-bns-annotation-guid': /.*/
				}
			}
		} );

		editor.commands.add( CORRECTION, new AttributeCommand( editor, CORRECTION ) );

		editor.on( 'annotation:remove', ( evt, data ) => {
			const model = editor.model;
			const doc = model.document;

			// Find annotations with the given ID. They can be multiple, since the
			// editor splits inline text in multiple elements if there are multiple
			// attributes (for example bold/italic).
			let target = null;
			// eslint-disable-next-line no-cond-assign
			while ( target = findDescendant( doc.getRoot(), elem => {
				const annotation = elem.getAttribute( CORRECTION );
				if ( annotation ) {
					// eslint-disable-next-line no-unused-vars
					const [ type, guid ] = annotation.split( ':' );
					return guid === data.guid;
				}
				return false;
			} ) ) {
				model.change( writer => {
					writer.removeAttribute( CORRECTION, target );
				} );
			}
		} );
	}
}
