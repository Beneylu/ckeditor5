# ckeditor5-emojis
Emoji selector using a modified version of the ckeditor5 specialCharacters plugin

## Enable the emojis plugin 

Since this is a third-party plugin, it is not enabled by default in CKEditor 5 and has to be added to it manually. For more information check the official documentation about [creating custom builds](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/development/custom-builds.html).

To install it, run:

```
npm install --save @harrisonlucas/ckeditor5-emojis
```

## Emoji set
The emojis found in data/originalemojis.json are from the ckeditor 4 version of the emojis plugin. The parser.js file was used to pull that large file into separate .json files based on grouping. This allows the separated files to be fed into the modified specialCharacters plugin without many changes.
More can easily be added or removed.

## Setup
You can update the icon by changing face.svg to be whatever emoji icon you prefer.

```js
import Emojis from '@harrisonlucas/ckeditor5-emoji/src/emoji';

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [
            Essentials,
            Paragraph, Heading, Bold, Italic, List, Emojis
        ],
        toolbar: [ 'heading', 'undo', 'redo', 'bold', 'italic', 'emojis' ]
    } )
    .then( editor => {
        window.editor = editor;
    } )
    .catch( err => {
        console.error( err.stack );
    } );
```
