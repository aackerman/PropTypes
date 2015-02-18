var loggedTypeFailures = {};

var warning = (condition, format, ...args) => {
  if (format === undefined) {
    throw new Error(
      '`warning(condition, format, ...args)` requires a warning ' +
      'message argument'
    );
  }

  if (format.length < 10 || /^[s\W]*$/.test(format)) {
    throw new Error(
      'The warning format should be able to uniquely identify this ' +
      'warning. Please, use a more descriptive format than: ' + format
    );
  }

  if (format.indexOf('Failed Composite propType: ') === 0) {
    return; // Ignore CompositeComponent proptype check.
  }

  if (!condition) {
    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
    console.warn(message);
    try {
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch(x) {}
  }
};

export default warning;
