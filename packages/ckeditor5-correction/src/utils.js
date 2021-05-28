export function createUUID() {
	let dt = new Date().getTime();

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, c => {
		const r = ( dt + Math.random() * 16 ) % 16 | 0;
		dt = Math.floor( dt / 16 );

		return ( c === 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
	} );
}

export function findDescendant( modelElement, predicate ) {
	if ( predicate( modelElement ) ) {
		return modelElement;
	}
	if ( modelElement.getChildren ) {
		for ( const child of modelElement.getChildren() ) {
			const found = findDescendant( child, predicate );
			if ( found ) {
				return found;
			}
		}
	}
}
