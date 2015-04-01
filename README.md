# async-helper-base [![NPM version](https://badge.fury.io/js/async-helper-base.svg)](http://badge.fury.io/js/async-helper-base)

> Used for creating template.js-compatible async helpers. Works with verb, assemble or any other template.js application.

## Install with [npm](npmjs.org)

```bash
npm i async-helper-base --save
```

## Usage

Easily create async helpers.

**Example**

```js
var Template = require('template');
var template = new Template();
var helper = require('async-helper-base');
```

**Create a custom async helper**

pass the instance of `template` to create the arbitrarily-named `badge` helper.

```js
template.asyncHelper('badge', helper(template)('badge'));
```

**Create a custom template type**

```js
template.create('badge');
```

**Load badge templates**

When we created the `badge` template type, a new `.badge()` method was created for loading templates. Let's use that now:

```js
// one at a time
template.badge('travis', {content: '[![Build Status](http://img.shields.io/travis/<%= name %>.svg)](https://travis-ci.org/<%= name %>)'});

// or a glob
template.badges('foo/*.md');
```

**Render the template**

Last, render the template using the custom `badge` helper created from this lib:

```js
template.render('<%= badge("travis") %>', {name: 'verb'}, function (err, res) {
  if (err) console.log(err);
  //=> '[![Build Status](http://img.shields.io/travis/verb.svg)](https://travis-ci.org/verb)'
  done();
});
```

## Related projects
 * [template](https://github.com/jonschlinkert/template): Render templates from any engine. Make custom template types, use layouts on pages, partials or any custom template type, custom delimiters, helpers, middleware, routes, loaders, and lots more. Powers Assemble v0.6.0, Verb v0.3.0 and your application.
 * [verb](https://github.com/assemble/verb): Verb makes it dead simple to generate markdown documentation, using simple templates, with zero configuration required. A project without documentation is like a project that doesn't exist.
 * [assemble](http://assemble.io): Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh  

## Running tests
Install dev dependencies:

```bash
npm i -d && npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/async-helper-base/issues)

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on March 31, 2015._
