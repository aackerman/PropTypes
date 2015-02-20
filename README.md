## PropTypes

Extracted from [`React.PropTypes`](http://facebook.github.io/react/docs/reusable-components.html#prop-validation). To use without a dependency on `React`.

Currently measures in a 1.6k minified and gzipped.

### API: `validate`

#### Example

Pass a PropType schema, a props object, and a descriptive name for warnings. In React the descriptive name would be the `displayName` of a component.

```js
import PropTypes from 'PropTypes';

var schema = {
  ham: PropTypes.string.isRequired
};

PropTypes.validate(schema, {ham: 'delicious'}, 'Ham');
```

### API: `PropTypes`

```js
{
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, descriptiveName) {
    if (!/matchme/.test(props[propName])) {
      return new Error('Validation failed!');
    }
  }
}
```

### Caveat

This is not an **exact** drop-in, validations related to React have been stripped out. `PropTypes.element` and `PropTypes.node` are not included.
