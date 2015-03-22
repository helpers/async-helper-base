/*!
 * async-helper-base <https://github.com/jonschlinkert/async-helper-base>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');

/**
 * Module dependencies
 */

module.exports = function asyncHelperBase(app) {
  if (typeof app !== 'object' || !app.hasOwnProperty('_')) {
    throw new TypeError('async-helper-base: invalid `app` argument.');
  }

  return function (name, opts) {
    if (typeof name !== 'string') {
      throw new TypeError('async-helper-base expects `name` to be a string.');
    }

    return function (key, locals, next) {
      var last = arguments[arguments.length - 1];
      if (typeof locals === 'function') {
        next = locals; locals = {};
      }

      if (typeof next !== 'function') {
        next = last;
      }

      opts = _.extend({}, opts, locals);

      // get the matching (plural) collection name
      var collection = app.collection[name];

      // if a `cwd` is define in a helper, load the templates(s)
      // or glob patterns defined by the helper
      if (opts && opts.cwd) {
        // define the pattern as an array so it's definitely globbed by the loader
        app[collection]([path.join(opts.cwd, key + '{,.md}')]);
      }

      var template = app.lookup(collection, key), dot;

      if (!template && (dot = key.indexOf('.')) !== -1) {
        template = app.lookup(collection, key.slice(0, dot));
      }

      var ctx = _.merge({}, this.context, opts);

      // call the template's render method
      template.render(ctx, function render(err, content) {
        if (err) {
          error(name, err);
          return next(err);
        }
        next(null, content);
      });
    };
  };
};

function error(name, err) {
  var msg = chalk.red('{%= ' + name + ' %} error: %j', err);
  return console.error(msg);
}
