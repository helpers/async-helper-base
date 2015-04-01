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

module.exports = function asyncHelperBase(name, options) {
  if (typeof name !== 'string') {
    throw new TypeError('async-helper-base expects `name` to be a string.');
  }

  options = options || {};
  return function (key, locals, next) {
    var last = arguments[arguments.length - 1];
    if (typeof locals === 'function') {
      next = locals; locals = {};
    }

    if (typeof next !== 'function') {
      next = last;
    }

    var opts = _.extend({}, this.options.helper && this.options.helper[name], options, locals);
    var app = this.app;
    var map = app.inflections || app.collection;

    // get the matching (plural) collection name
    var collection = map[name];

    // if a `cwd` is defined the actual helper, load the templates(s) from
    // the glob patterns defined by the helper
    if (opts && opts.cwd) {
      if (opts.nodefaults) app.views[collection] = {};

      // define the pattern as an array so it's definitely globbed by the loader
      var glob = path.resolve(opts.cwd, key + (opts.extPattern || '{.md,.hbs}'));
      app[collection](glob);
    }

    var template = app.lookup(collection, key);
    var dot;

    if (!template && (dot = key.indexOf('.')) !== -1) {
      template = app.lookup(collection, key.slice(0, dot));
    }

    var ctx = _.merge({}, this.context, opts);

    // call the template's render method
    template.render(ctx, function render(err, content) {
      if (err) {
        error(name, key, err);
        return next(err);
      }
      next(null, content);
    });
  };
};

function error(name, key, err) {
  var msg = chalk.red('async-helper-base: {%= ' + name + '("' + key + '") %} error: %j', err);
  return console.error(msg);
}
