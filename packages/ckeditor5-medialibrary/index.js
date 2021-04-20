import Plugin from '../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-widget/src/utils';
import Widget from '../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-widget/src/widget';
import Command from '../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/command';
import ButtonView from '../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class SimpleBox extends Plugin {

	static get requires() {
		return [ SimpleBoxEditing, SimpleBoxUI ];
	}
}

class SimpleBoxUI extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add('medialibrary', locale => {
			const view = new ButtonView(locale);

			view.set({
				label: 'mediathèque',
				class: 'medialibrary-icon',
				tooltip: true
			});

			// Callback executed once the icon is clicked
			view.on('execute', () => {
				// fire a JS event
				editor.fire('open-medialibrary');
			});

			return view;
		});
	}
}

class SimpleBoxEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		console.log( 'SimpleBoxEditing#init() got called' );

		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertSimpleBox', new InsertSimpleBoxCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'simpleBox', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block'
		} );

		schema.register( 'simpleBoxTitle', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'simpleBox',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			allowContentOf: '$block'
		} );

		schema.register( 'simpleBoxDescription', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'simpleBox',

			// Allow content which is allowed in the root (e.g. paragraphs).
			allowContentOf: '$root'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'simpleBoxDescription' ) && childDefinition.name == 'simpleBox' ) {
				return false;
			}
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// <simpleBox> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'simpleBox',
			view: {
				name: 'section',
				classes: 'simple-box'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'simpleBox',
			view: {
				name: 'section',
				classes: 'simple-box'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'simpleBox',
			view: ( modelElement, { writer: viewWriter } ) => {
				const section = viewWriter.createContainerElement( 'section', { class: 'simple-box' } );

				return toWidget( section, viewWriter, { label: 'simple box widget' } );
			}
		} );

		// <simpleBoxTitle> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'simpleBoxTitle',
			view: {
				name: 'h1',
				classes: 'simple-box-title'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'simpleBoxTitle',
			view: {
				name: 'h1',
				classes: 'simple-box-title'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'simpleBoxTitle',
			view: ( modelElement, { writer: viewWriter } ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const h1 = viewWriter.createEditableElement( 'h1', { class: 'simple-box-title' } );

				return toWidgetEditable( h1, viewWriter );
			}
		} );

		// <simpleBoxDescription> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'simpleBoxDescription',
			view: {
				name: 'div',
				classes: 'simple-box-description'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'simpleBoxDescription',
			view: {
				name: 'div',
				classes: 'simple-box-description'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'simpleBoxDescription',
			view: ( modelElement, { writer: viewWriter } ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const div = viewWriter.createEditableElement( 'div', { class: 'simple-box-description' } );

				return toWidgetEditable( div, viewWriter );
			}
		} );
	}
}

class InsertSimpleBoxCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			// Insert <simpleBox>*</simpleBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			this.editor.model.insertContent( createSimpleBox( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'simpleBox' );

		this.isEnabled = allowedIn !== null;
	}
}

function createSimpleBox( writer ) {
	const simpleBox = writer.createElement( 'simpleBox' );
	const simpleBoxTitle = writer.createElement( 'simpleBoxTitle' );
	const simpleBoxDescription = writer.createElement( 'simpleBoxDescription' );

	writer.append( simpleBoxTitle, simpleBox );
	writer.append( simpleBoxDescription, simpleBox );

	// There must be at least one paragraph for the description to be editable.
	// See https://github.com/ckeditor/ckeditor5/issues/1464.
	writer.appendElement( 'paragraph', simpleBoxDescription );

	return simpleBox;
}
