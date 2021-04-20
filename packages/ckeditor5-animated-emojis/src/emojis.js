import Plugin from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-core/src/plugin';
import Typing from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-typing/src/typing';
import { createDropdown } from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-ui/src/dropdown/utils';
import CKEditorError from '../../ckeditor5-build-classic/node_modules/@ckeditor/ckeditor5-utils/src/ckeditorerror';
import SpecialCharactersNavigationView from './ui/specialcharactersnavigationview';
import CharacterGridView from './ui/charactergridview';
import CharacterInfoView from './ui/characterinfoview';

import emojiIcon from '../theme/icons/face.svg';
import '../theme/specialcharacters.css';
import activities from '../data/activities.json';
import food from '../data/food.json';
import nature from '../data/nature.json';
import objects from '../data/objects.json';
import people from '../data/people.json';
import travel from '../data/travel.json';

const ALL_SPECIAL_CHARACTERS_GROUP = 'All';
export default class Emojis extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ Typing ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'AnimatedEmojis';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		/**
		 * Registered emoji characters. A pair of a emoji name and its symbol.
		 *
		 * @private
		 * @member {Map.<String, String>} #_characters
		 */
		this._characters = new Map();

		/**
		 * Registered groups. Each group contains a collection with symbol names.
		 *
		 * @private
		 * @member {Map.<String, Set.<String>>} #_groups
		 */
		this._groups = new Map();
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		const options = this.editor.config.get( 'animatedEmojis' );

		if ( !options ) {
			return;
		}

		if ( !options.baseURI ) {

			logWarning( 'animated-emojis-missing-baseURI' );

			return;
		}

		const t = editor.t;

		const inputCommand = editor.commands.get( 'input' );

		// Add the `emojis` dropdown button to feature components.
		editor.ui.componentFactory.add( 'animatedEmojis', locale => {
			const dropdownView = createDropdown( locale );
			let dropdownPanelContent;

			dropdownView.buttonView.set( {
				label: t( 'Emojis' ),
				icon: emojiIcon,
				tooltip: true
			} );

			dropdownView.bind( 'isEnabled' ).to( inputCommand );

			// Insert an emoji when a tile is clicked.
			dropdownView.on( 'execute', ( evt, data ) => {
				console.log(data.character);
				editor.model.change( writer => {

					const imageElement = writer.createElement( 'image', {src : options.baseURI + data.name.replaceAll(':', '')+'.gif', class : 'ckeditor-emoji'} );

					const insertAtSelection = this.findOptimalInsertionPosition( editor.model.document.selection, editor.model );

					console.log(insertAtSelection);
					editor.model.insertContent( imageElement, insertAtSelection );

					// Inserting an image might've failed due to schema regulations.
					// if ( imageElement.parent ) {
					// 	writer.setSelection( imageElement, 'on' );
					// }
				} );
					editor.editing.view.focus();
			} );

			dropdownView.on( 'change:isOpen', () => {
				if ( !dropdownPanelContent ) {
					dropdownPanelContent = this._createDropdownPanelContent( locale, dropdownView );

					dropdownView.panelView.children.add( dropdownPanelContent.navigationView );
					dropdownView.panelView.children.add( dropdownPanelContent.gridView );
					dropdownView.panelView.children.add( dropdownPanelContent.infoView );
				}

				dropdownPanelContent.infoView.set( {
					character: null,
					name: null
				} );
			} );

			return dropdownView;
		} );

		try {
			this.addItems( 'People', people );
			this.addItems( 'Activities', activities );
			this.addItems( 'Food', food );
			this.addItems( 'Nature', nature );
			this.addItems( 'Objects', objects );
			this.addItems( 'Travel', travel );
		} catch ( error ) {
			throw new CKEditorError(
				'emojis-json-parse: Ran into issues trying to parse json file of available emojis.'
			);
		}
	}

	findOptimalInsertionPosition( selection, model ) {
		const selectedElement = selection.getSelectedElement();
		if ( selectedElement ) {
			const typeAroundFakeCaretPosition = getTypeAroundFakeCaretPosition( selection );

			// If the WidgetTypeAround "fake caret" is displayed, use its position for the insertion
			// to provide the most predictable UX (https://github.com/ckeditor/ckeditor5/issues/7438).
			if ( typeAroundFakeCaretPosition ) {
				return model.createPositionAt( selectedElement, typeAroundFakeCaretPosition );
			}

			if ( model.schema.isBlock( selectedElement ) ) {
				return model.createPositionAfter( selectedElement );
			}
		}

		const firstBlock = selection.getSelectedBlocks().next().value;

		if ( firstBlock ) {
			// If inserting into an empty block – return position in that block. It will get
			// replaced with the image by insertContent(). #42.
			if ( firstBlock.isEmpty ) {
				return model.createPositionAt( firstBlock, 0 );
			}

			const positionAfter = model.createPositionAfter( firstBlock );

			// If selection is at the end of the block - return position after the block.
			if ( selection.focus.isTouching( positionAfter ) ) {
				return positionAfter;
			}

			// Otherwise return position before the block.
			return model.createPositionBefore( firstBlock );
		}

		return selection.focus;
	}

	/**
	 * Adds a collection of special characters to the specified group. The title of a special character must be unique.
	 *
	 * **Note:** The "All" category name is reserved by the plugin and cannot be used as a new name for a special
	 * characters category.
	 *
	 * @param {String} groupName
	 * @param {Array.<module:special-characters/specialcharacters~SpecialCharacterDefinition>} items
	 */
	addItems( groupName, items ) {
		if ( groupName === ALL_SPECIAL_CHARACTERS_GROUP ) {
			/**
			 * The name "All" for a special category group cannot be used because it is a special category that displays all
			 * available special characters.
			 *
			 * @error emojis-invalid-group-name
			 */
			throw new CKEditorError(
				`emojis-invalid-group-name: The name "${ ALL_SPECIAL_CHARACTERS_GROUP }" is reserved and cannot be used.`
			);
		}

		const group = this._getGroup( groupName );

		for ( const item of items ) {
			group.add( item.title );
			this._characters.set( item.title, item.character, item.link );
		}
	}

	/**
	 * Returns an iterator of special characters groups.
	 *
	 * @returns {Iterable.<String>}
	 */
	getGroups() {
		return this._groups.keys();
	}

	/**
	 * Returns a collection of special characters symbol names (titles).
	 *
	 * @param {String} groupName
	 * @returns {Set.<String>|undefined}
	 */
	getCharactersForGroup( groupName ) {
		if ( groupName === ALL_SPECIAL_CHARACTERS_GROUP ) {
			return new Set( this._characters.keys() );
		}

		return this._groups.get( groupName );
	}

	/**
	 * Returns the symbol of a special character for the specified name. If the special character could not be found, `undefined`
	 * is returned.
	 *
	 * @param {String} title The title of a special character.
	 * @returns {String|undefined}
	 */
	getCharacter( title ) {
		return this._characters.get( title );
	}


	/**
	 * Returns a group of special characters. If the group with the specified name does not exist, it will be created.
	 *
	 * @private
	 * @param {String} groupName The name of the group to create.
	 */
	_getGroup( groupName ) {
		if ( !this._groups.has( groupName ) ) {
			this._groups.set( groupName, new Set() );
		}

		return this._groups.get( groupName );
	}

	/**
	 * Updates the symbol grid depending on the currently selected character group.
	 *
	 * @private
	 * @param {String} currentGroupName
	 * @param {module:special-characters/ui/charactergridview~CharacterGridView} gridView
	 */
	_updateGrid( currentGroupName, gridView ) {
		// Updating the grid starts with removing all tiles belonging to the old group.
		gridView.tiles.clear();

		const characterTitles = this.getCharactersForGroup( currentGroupName );

		for ( const title of characterTitles ) {
			const character = this.getCharacter( title );

			gridView.tiles.add( gridView.createTile( character, title ) );
		}
	}

	/**
	 * Initializes the dropdown, used for lazy loading.
	 *
	 * @private
	 * @param {module:utils/locale~Locale} locale
	 * @param {module:ui/dropdown/dropdownview~DropdownView} dropdownView
	 * @returns {Object} Returns an object with `navigationView`, `gridView` and `infoView` properties, containing UI parts.
	 */
	_createDropdownPanelContent( locale, dropdownView ) {
		const emojiGroups = [ ...this.getGroups() ];

		// Add a special group that shows all available emojis
		emojiGroups.unshift( ALL_SPECIAL_CHARACTERS_GROUP );

		const navigationView = new SpecialCharactersNavigationView( locale, emojiGroups );
		const gridView = new CharacterGridView( locale );
		const infoView = new CharacterInfoView( locale );

		gridView.delegate( 'execute' ).to( dropdownView );

		gridView.on( 'tileHover', ( evt, data ) => {
			infoView.set( data );
		} );

		// Update the grid of special characters when a user changed the character group.
		navigationView.on( 'execute', () => {
			this._updateGrid( navigationView.currentGroupName, gridView );
		} );

		// Set the initial content of the special characters grid.
		this._updateGrid( navigationView.currentGroupName, gridView );

		return { navigationView, gridView, infoView };
	}
}
