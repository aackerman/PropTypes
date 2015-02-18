function nullFunction() {
  return null;
}

var ANONYMOUS = '<<anonymous>>';

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, descriptiveName, location) {
    descriptiveName = descriptiveName || ANONYMOUS;
    if (props[propName] == null) {
      var locationName = location;
      if (isRequired) {
        return new Error(
          `Required ${locationName} \`${propName}\` was not specified in ` +
          `\`${descriptiveName}\`.`
        );
      }
      return null;
    } else {
      return validate(props, propName, descriptiveName, location);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, descriptiveName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = location;
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new Error(
        `Invalid ${locationName} \`${propName}\` of type \`${preciseType}\` ` +
        `supplied to \`${descriptiveName}\`, expected \`${expectedType}\`.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(nullFunction);
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, descriptiveName, location) {
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = location;
      var propType = getPropType(propValue);
      return new Error(
        `Invalid ${locationName} \`${propName}\` of type ` +
        `\`${propType}\` supplied to \`${descriptiveName}\`, expected an array.`
      );
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, descriptiveName, location);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, descriptiveName, location) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = location;
      var expectedClassName = expectedClass.name || ANONYMOUS;
      return new Error(
        `Invalid ${locationName} \`${propName}\` supplied to ` +
        `\`${descriptiveName}\`, expected instance of \`${expectedClassName}\`.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  function validate(props, propName, descriptiveName, location) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (propValue === expectedValues[i]) {
        return null;
      }
    }

    var locationName = location;
    var valuesString = JSON.stringify(expectedValues);
    return new Error(
      `Invalid ${locationName} \`${propName}\` of value \`${propValue}\` ` +
      `supplied to \`${descriptiveName}\`, expected one of ${valuesString}.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, descriptiveName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = location;
      return new Error(
        `Invalid ${locationName} \`${propName}\` of type ` +
        `\`${propType}\` supplied to \`${descriptiveName}\`, expected an object.`
      );
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, descriptiveName, location);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  function validate(props, propName, descriptiveName, location) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, descriptiveName, location) == null) {
        return null;
      }
    }

    var locationName = location;
    return new Error(
      `Invalid ${locationName} \`${propName}\` supplied to ` +
      `\`${descriptiveName}\`.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, descriptiveName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = location;
      return new Error(
        `Invalid ${locationName} \`${propName}\` of type \`${propType}\` ` +
        `supplied to \`${descriptiveName}\`, expected \`object\`.`
      );
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, descriptiveName, location);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

export default {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  instanceOf: createInstanceTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};
