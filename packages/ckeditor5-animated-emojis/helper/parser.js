/**
 * Script to parse original emoji data set from cke4 into appropriate groups
 */

'use strict';

const fs = require( 'fs' );
const rawdata = fs.readFileSync( '../data/originalemojis.json' );
const emojis = JSON.parse( rawdata );

const groups = [];

emojis.forEach( emoji => {
	const group = emoji.group;

	if ( typeof groups[ group ] === 'undefined' ) {
		groups[ group ] = [];
	}

	groups[ group ].push( {
		title: emoji.id,
		character: emoji.symbol
	} );
} );

for ( const [ groupName, groupEmojis ] of Object.entries( groups ) ) {
	fs.writeFileSync( `../data/${ groupName }.json`, JSON.stringify( groupEmojis, null, 2 ) );
}
