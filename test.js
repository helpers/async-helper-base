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
var template = new Template();

describe('helper', function () {
  beforeEach(function (done) {

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
    it('should throw an error when `name` is missing:', function () {
      (function () {
        helper(template);
      }).should.throw('async-helper-base expects `name` to be a string.');
    });
  });

  describe('helpers', function () {
    it('should create an async helper:', function (done) {
      template.create('badge');
      template.badge('travis', {content: '[![Build Status](http://img.shields.io/travis/<%= name %>.svg)](https://travis-ci.org/<%= name %>)'})
      template.asyncHelper('badge', helper('badge'));
      template.render('<%= badge("travis") %>', {name: 'verb'}, function (err, res) {
        if (err) console.log(err);
        res.should.equal('[![Build Status](http://img.shields.io/travis/verb.svg)](https://travis-ci.org/verb)');
        done();
      });
    });

    it('should use globally defined options in the helper:', function (done) {
      template.option('helper', {
        badge: {cwd: 'fixtures'}
      });

      // create a custom template type
      template.create('badge');

      // override the auto-generated `badge` helper with a custom helper
      template.asyncHelper('badge', helper('badge'));

      // call the badge helper
      template.render('<%= badge("aaa") %>', {name: 'verb'}, function (err, res) {
        if (err) console.log(err);
        res.should.equal('Fixtures!!! [![Build Status](http://img.shields.io/travis/verb.svg)](https://travis-ci.org/verb)');
        done();
      });
    });

    it('should take a callback to modify the rendered string:', function (done) {
      template.create('badge');
      template.badge('travis', {content: '[![Build Status](http://img.shields.io/travis/<%= name %>.svg)](https://travis-ci.org/<%= name %>)'});

      template.asyncHelper('badge', helper('badge', function (str, name) {
        return str.split('verb').join(name);
      }));

      template.render('<%= badge("travis", "foo") %>', {name: 'verb'}, function (err, res) {
        if (err) console.log(err);
        res.should.equal('[![Build Status](http://img.shields.io/travis/foo.svg)](https://travis-ci.org/foo)');
        done();
      });
    });
  });
});
