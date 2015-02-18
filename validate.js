import invariant from 'invariant';
import warning from './warning';

var loggedTypeFailures = {};

var validate = (propTypes, props, className) => {
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
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;
        warning(false, 'Failed propType: ' + error.message);
      }
    }
  }
};

export default validate;
