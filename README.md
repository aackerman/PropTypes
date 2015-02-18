## propTypes

Extracted from React.PropTypes

### API: `validate`

#### Example

Pass a prop types schema, props, and a descriptive name.

```js
var PropTypes = require('propTypes');
var schema = {
  ham: PropTypes.string.isRequired
};

PropTypes.validate(schema, {ham: 'delicious'}, 'Ham');
```
