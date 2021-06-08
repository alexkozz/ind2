import Resources from './resources.js';

var resources = new Resources();
resources.importFiles(['a', 'b'], (value) => console.log(value));