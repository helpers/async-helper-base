/*!
 * async-helper-base <https://github.com/jonschlinkert/async-helper-base>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var Template = require('template');
var helper = require('./');
var template;

describe('helper', function () {
  beforeEach(function (done) {
    template = new Template();
    var orig = process.cwd();

    before(function () {
      process.chdir(__dirname + '/fixtures');
    });

    after(function () {
      process.chdir(orig);
    });

    template.engine('*', require('engine-lodash'));
    done();
  });

  describe('errors', function () {
    it('should throw an error when `app` is bad:', function () {
      (function () {
        helper();
      }).should.throw('async-helper-base: invalid `app` argument.');
    });

    it('should throw an error when `name` is missing:', function () {
      (function () {
        helper(template)();
      }).should.throw('async-helper-base expects `name` to be a string.');
    });
  });

  describe('helpers', function () {
    it('should create an async helper:', function (done) {
      template.create('badge');
      template.badge('travis', {content: '[![Build Status](http://img.shields.io/travis/<%= name %>.svg)](https://travis-ci.org/<%= name %>)'})
      template.asyncHelper('badge', helper(template)('badge'));
      template.render('<%= badge("travis") %>', {name: 'verb'}, function (err, res) {
        if (err) console.log(err);
        res.should.equal('[![Build Status](http://img.shields.io/travis/verb.svg)](https://travis-ci.org/verb)');
        done();
      });
    });
  });
});
