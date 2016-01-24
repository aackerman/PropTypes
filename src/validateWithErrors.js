/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

import invariant from 'invariant';

var validateWithErrors = (propTypes, props, className) => {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        invariant(
          typeof propTypes[propName] === 'function',
          '%s: %s type `%s` is invalid; it must be a function, usually from ' +
          'PropTypes.',
          className,
          'attributes',
          propName
        );

        error = propTypes[propName](props, propName, className, 'prop');
      } catch (ex) {
        error = ex;
      }
      // rethrow the error
      if (error instanceof Error) { throw error; }
    }
  }
};

export default validateWithErrors;
