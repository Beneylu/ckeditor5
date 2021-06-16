/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import AnimatedEmojis from 'ckeditor5-animated-emojis/src/emojis';
import Emojis from '@harrisonlucas/ckeditor5-emojis/src/emojis';
import Correction from '@beneylu/ckeditor5-correction/src/correction';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import SimpleBoxPlugin from 'ckeditor5-medialibrary';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	Alignment,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	Strikethrough,
	Underline,
	BlockQuote,
	CKFinder,
	EasyImage,
	FontFamily,
	FontSize,
	FontBackgroundColor,
	FontColor,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	Indent,
	Link,
	List,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	SimpleUploadAdapter,
	SimpleBoxPlugin,
	Emojis,
	AnimatedEmojis,
	Correction
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'Undo',
			'Redo',
			'|',
			'Heading',
			'|',
			'FontFamily',
			'FontSize',
			'FontColor',
			'FontBackgroundColor',
			'|',
			'Bold',
			'Italic',
			'Underline',
			'Strikethrough',
			'Link',
			'|',
			'Alignment',
			'BulletedList',
			'NumberedList',
			'Indent',
			'Outdent',
			'BlockQuote',
			'|',
			'insertTable',
			'Emojis',
			'animatedEmojis',
			'medialibrary',
			'-',
			'correctionNOUN',
			'correctionVERB',
			'correctionHOMOPHONIC',
			'correctionVOCABULARY',
			'correctionPUNCTUATION',
			'correctionNONE'
		],
		shouldNotGroupWhenFull: true
	},
	fontFamily: {
		options: [
			'default',
			'Arial, Helvetica, sans-serif',
			'Averta, Verdana, Helvetica, sans-serif',
			'Source Sans Pro, Helvetica, sans-serif',
			'Times New Roman, Times, serif',
			// fake 1st font name, it'll still be used as label
			'Largeur fixe, Courier New, Courier, monospace'
		],
		// Backward compatibility: accept font families not listed above
		supportAllValues: true
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'fr'
};
