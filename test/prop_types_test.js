/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var PropTypes;

var requiredMessage =
  'Required prop `testProp` was not specified in `testClass`.';

function typeCheckFail(declaration, value, message) {
  var props = {testProp: value};
  var error = declaration(
    props,
    'testProp',
    'testClass',
    'prop'
  );
  expect(error instanceof Error).toBe(true);
  expect(error.message).toBe(message);
}

function typeCheckPass(declaration, value) {
  var props = {testProp: value};
  var error = declaration(
    props,
    'testProp',
    'testClass',
    'prop'
  );
  expect(error).toBe(null);
}

describe('PropTypes', function() {
  beforeEach(function() {
    PropTypes = require('../');
  });

  describe('Primitive Types', function() {
    it("should warn for invalid strings", function() {
      typeCheckFail(
        PropTypes.string,
        [],
        'Invalid prop `testProp` of type `array` supplied to ' +
        '`testClass`, expected `string`.'
      );
      typeCheckFail(
        PropTypes.string,
        false,
        'Invalid prop `testProp` of type `boolean` supplied to ' +
        '`testClass`, expected `string`.'
      );
      typeCheckFail(
        PropTypes.string,
        0,
        'Invalid prop `testProp` of type `number` supplied to ' +
        '`testClass`, expected `string`.'
      );
      typeCheckFail(
        PropTypes.string,
        {},
        'Invalid prop `testProp` of type `object` supplied to ' +
        '`testClass`, expected `string`.'
      );
    });

    it('should fail date and regexp correctly', function() {
      typeCheckFail(
        PropTypes.string,
        new Date(),
        'Invalid prop `testProp` of type `date` supplied to ' +
        '`testClass`, expected `string`.'
      );
      typeCheckFail(
        PropTypes.string,
        /please/,
        'Invalid prop `testProp` of type `regexp` supplied to ' +
        '`testClass`, expected `string`.'
      );
    });

    it("should not warn for valid values", function() {
      typeCheckPass(PropTypes.array, []);
      typeCheckPass(PropTypes.bool, false);
      typeCheckPass(PropTypes.func, function() {});
      typeCheckPass(PropTypes.number, 0);
      typeCheckPass(PropTypes.string, '');
      typeCheckPass(PropTypes.object, {});
      typeCheckPass(PropTypes.object, new Date());
      typeCheckPass(PropTypes.object, /please/);
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(PropTypes.string, null);
      typeCheckPass(PropTypes.string, undefined);
    });

    it("should warn for missing required values", function() {
      typeCheckFail(PropTypes.string.isRequired, null, requiredMessage);
      typeCheckFail(PropTypes.string.isRequired, undefined, requiredMessage);
    });
  });

  describe('Any type', function() {
    it('should should accept any value', function() {
      typeCheckPass(PropTypes.any, 0);
      typeCheckPass(PropTypes.any, 'str');
      typeCheckPass(PropTypes.any, []);
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(PropTypes.any, null);
      typeCheckPass(PropTypes.any, undefined);
    });

    it("should warn for missing required values", function() {
      typeCheckFail(PropTypes.any.isRequired, null, requiredMessage);
      typeCheckFail(PropTypes.any.isRequired, undefined, requiredMessage);
    });
  });

  describe('ArrayOf Type', function() {
    it('should support the arrayOf propTypes', function() {
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), [1, 2, 3]);
      typeCheckPass(PropTypes.arrayOf(PropTypes.string), ['a', 'b', 'c']);
      typeCheckPass(PropTypes.arrayOf(PropTypes.oneOf(['a', 'b'])), ['a', 'b']);
    });

    it('should support arrayOf with complex types', function() {
      typeCheckPass(
        PropTypes.arrayOf(PropTypes.shape({a: PropTypes.number.isRequired})),
        [{a: 1}, {a: 2}]
      );

      function Thing() {}
      typeCheckPass(
        PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
        [new Thing(), new Thing()]
      );
    });

    it('should warn with invalid items in the array', function() {
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        [1, 2, 'b'],
        'Invalid prop `2` of type `string` supplied to `testClass`, ' +
        'expected `number`.'
      );
    });

    it('should warn with invalid complex types', function() {
      function Thing() {}
      var name = Thing.name || '<<anonymous>>';

      typeCheckFail(
        PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
        [new Thing(), 'xyz'],
        'Invalid prop `1` supplied to `testClass`, expected instance of `' +
        name + '`.'
      );
    });

    it('should warn when passed something other than an array', function() {
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        {'0': 'maybe-array', length: 1},
        'Invalid prop `testProp` of type `object` supplied to ' +
        '`testClass`, expected an array.'
      );
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
        '`testClass`, expected an array.'
      );
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
        '`testClass`, expected an array.'
      );
    });

    it('should not warn when passing an empty array', function() {
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), []);
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), null);
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), undefined);
    });

    it("should warn for missing required values", function() {
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        null,
        requiredMessage
      );
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        undefined,
        requiredMessage
      );
    });
  });

  describe('Instance Types', function() {
    it("should warn for invalid instances", function() {
      function Person() {}
      var personName = Person.name || '<<anonymous>>';
      var dateName = Date.name || '<<anonymous>>';
      var regExpName = RegExp.name || '<<anonymous>>';

      typeCheckFail(
        PropTypes.instanceOf(Person),
        false,
        'Invalid prop `testProp` supplied to `testClass`, expected ' +
        'instance of `' + personName + '`.'
      );
      typeCheckFail(
        PropTypes.instanceOf(Person),
        {},
        'Invalid prop `testProp` supplied to `testClass`, expected ' +
        'instance of `' + personName + '`.'
      );
      typeCheckFail(
        PropTypes.instanceOf(Person),
        '',
        'Invalid prop `testProp` supplied to `testClass`, expected ' +
        'instance of `' + personName + '`.'
      );
      typeCheckFail(
        PropTypes.instanceOf(Date),
        {},
        'Invalid prop `testProp` supplied to `testClass`, expected ' +
        'instance of `' + dateName + '`.'
      );
      typeCheckFail(
        PropTypes.instanceOf(RegExp),
        {},
        'Invalid prop `testProp` supplied to `testClass`, expected ' +
        'instance of `' + regExpName + '`.'
      );
    });

    it("should not warn for valid values", function() {
      function Person() {}
      function Engineer() {}
      Engineer.prototype = new Person();

      typeCheckPass(PropTypes.instanceOf(Person), new Person());
      typeCheckPass(PropTypes.instanceOf(Person), new Engineer());

      typeCheckPass(PropTypes.instanceOf(Date), new Date());
      typeCheckPass(PropTypes.instanceOf(RegExp), /please/);
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(PropTypes.instanceOf(String), null);
      typeCheckPass(PropTypes.instanceOf(String), undefined);
    });

    it("should warn for missing required values", function() {
      typeCheckFail(
        PropTypes.instanceOf(String).isRequired, null, requiredMessage
      );
      typeCheckFail(
        PropTypes.instanceOf(String).isRequired, undefined, requiredMessage
      );
    });
  });

  describe('ObjectOf Type', function() {
    it('should support the objectOf propTypes', function() {
      typeCheckPass(PropTypes.objectOf(PropTypes.number), {a: 1, b: 2, c: 3});
      typeCheckPass(
        PropTypes.objectOf(PropTypes.string),
        {a: 'a', b: 'b', c: 'c'}
      );
      typeCheckPass(
        PropTypes.objectOf(PropTypes.oneOf(['a', 'b'])),
        {a: 'a', b: 'b'}
      );
    });

    it('should support objectOf with complex types', function() {
      typeCheckPass(
        PropTypes.objectOf(PropTypes.shape({a: PropTypes.number.isRequired})),
        {a: {a: 1}, b: {a: 2}}
      );

      function Thing() {}
      typeCheckPass(
        PropTypes.objectOf(PropTypes.instanceOf(Thing)),
        {a: new Thing(), b: new Thing()}
      );
    });

    it('should warn with invalid items in the object', function() {
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        {a: 1, b: 2, c: 'b'},
        'Invalid prop `c` of type `string` supplied to `testClass`, ' +
        'expected `number`.'
      );
    });

    it('should warn with invalid complex types', function() {
      function Thing() {}
      var name = Thing.name || '<<anonymous>>';

      typeCheckFail(
        PropTypes.objectOf(PropTypes.instanceOf(Thing)),
        {a: new Thing(), b: 'xyz'},
        'Invalid prop `b` supplied to `testClass`, expected instance of `' +
        name + '`.'
      );
    });

    it('should warn when passed something other than an object', function() {
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        [1, 2],
        'Invalid prop `testProp` of type `array` supplied to ' +
        '`testClass`, expected an object.'
      );
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
        '`testClass`, expected an object.'
      );
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
        '`testClass`, expected an object.'
      );
    });

    it('should not warn when passing an empty object', function() {
      typeCheckPass(PropTypes.objectOf(PropTypes.number), {});
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(PropTypes.objectOf(PropTypes.number), null);
      typeCheckPass(PropTypes.objectOf(PropTypes.number), undefined);
    });

    it("should warn for missing required values", function() {
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number).isRequired,
        null,
        requiredMessage
      );
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number).isRequired,
        undefined,
        requiredMessage
      );
    });
  });

  describe('OneOf Types', function() {
    it("should warn for invalid strings", function() {
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']),
        true,
        'Invalid prop `testProp` of value `true` supplied to ' +
        '`testClass`, expected one of ["red","blue"].'
      );
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']),
        [],
        'Invalid prop `testProp` of value `` supplied to `testClass`, ' +
        'expected one of ["red","blue"].'
      );
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']),
        '',
        'Invalid prop `testProp` of value `` supplied to `testClass`, ' +
        'expected one of ["red","blue"].'
      );
      typeCheckFail(
        PropTypes.oneOf([0, 'false']),
        false,
        'Invalid prop `testProp` of value `false` supplied to ' +
        '`testClass`, expected one of [0,"false"].'
      );
    });

    it("should not warn for valid values", function() {
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), 'red');
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), 'blue');
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), null);
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), undefined);
    });

    it("should warn for missing required values", function() {
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']).isRequired,
        null,
        requiredMessage
      );
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']).isRequired,
        undefined,
        requiredMessage
      );
    });
  });

  describe('Union Types', function() {
    it('should warn if none of the types are valid', function() {
      typeCheckFail(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        [],
        'Invalid prop `testProp` supplied to `testClass`.'
      );

      var checker = PropTypes.oneOfType([
        PropTypes.shape({a: PropTypes.number.isRequired}),
        PropTypes.shape({b: PropTypes.number.isRequired})
      ]);
      typeCheckFail(
        checker,
        {c: 1},
        'Invalid prop `testProp` supplied to `testClass`.'
      );
    });

    it('should not warn if one of the types are valid', function() {
      var checker = PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]);
      typeCheckPass(checker, null);
      typeCheckPass(checker, 'foo');
      typeCheckPass(checker, 123);

      checker = PropTypes.oneOfType([
        PropTypes.shape({a: PropTypes.number.isRequired}),
        PropTypes.shape({b: PropTypes.number.isRequired})
      ]);
      typeCheckPass(checker, {a: 1});
      typeCheckPass(checker, {b: 1});
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]), null
      );
      typeCheckPass(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]), undefined
      );
    });

    it("should warn for missing required values", function() {
      typeCheckFail(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        null,
        requiredMessage
      );
      typeCheckFail(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        undefined,
        requiredMessage
      );
    });
  });

  describe('Shape Types', function() {
    it("should warn for non objects", function() {
      typeCheckFail(
        PropTypes.shape({}),
        'some string',
        'Invalid prop `testProp` of type `string` supplied to ' +
        '`testClass`, expected `object`.'
      );
      typeCheckFail(
        PropTypes.shape({}),
        ['array'],
        'Invalid prop `testProp` of type `array` supplied to ' +
        '`testClass`, expected `object`.'
      );
    });

    it("should not warn for empty values", function() {
      typeCheckPass(PropTypes.shape({}), undefined);
      typeCheckPass(PropTypes.shape({}), null);
      typeCheckPass(PropTypes.shape({}), {});
    });

    it("should not warn for an empty object", function() {
      typeCheckPass(PropTypes.shape({}).isRequired, {});
    });

    it("should not warn for non specified types", function() {
      typeCheckPass(PropTypes.shape({}), {key: 1});
    });

    it("should not warn for valid types", function() {
      typeCheckPass(PropTypes.shape({key: PropTypes.number}), {key: 1});
    });

    it("should warn for required valid types", function() {
      typeCheckFail(
        PropTypes.shape({key: PropTypes.number.isRequired}),
        {},
        'Required prop `key` was not specified in `testClass`.'
      );
    });

    it("should warn for the first required type", function() {
      typeCheckFail(
        PropTypes.shape({
          key: PropTypes.number.isRequired,
          secondKey: PropTypes.number.isRequired
        }),
        {},
        'Required prop `key` was not specified in `testClass`.'
      );
    });

    it("should warn for invalid key types", function() {
      typeCheckFail(PropTypes.shape({key: PropTypes.number}),
        {key: 'abc'},
        'Invalid prop `key` of type `string` supplied to `testClass`, ' +
        'expected `number`.'
      );
    });

    it("should be implicitly optional and not warn without values", function() {
      typeCheckPass(
        PropTypes.shape(PropTypes.shape({key: PropTypes.number})), null
      );
      typeCheckPass(
        PropTypes.shape(PropTypes.shape({key: PropTypes.number})), undefined
      );
    });

    it("should warn for missing required values", function() {
      typeCheckFail(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        null,
        requiredMessage
      );
      typeCheckFail(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        undefined,
        requiredMessage
      );
    });
  });
});
