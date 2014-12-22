var mach = require('../index');

mach.call = require('../utils/callApp');
var createProxy = mach.createProxy = require('../utils/createProxy');

var Location = require('../Location');
var mergeProperties = require('../utils/mergeProperties');

[ 'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'POST',
  'PUT',
  'TRACE'
].forEach(function (method) {
  var methodName = method.toLowerCase();

  mach[methodName] = function (app, options, modifier) {
    if (typeof app !== 'function') {
      modifier = options;

      if (typeof app === 'string') { // get(url, modifier)
        options = { url: app };
      } else if (app instanceof Location) { // get(location, modifier)
        options = { location: app };
      } else { // get(options, modifier)
        options = mergeProperties({}, app);
      }

      if (options.url || options.location) {
        app = createProxy(options.url || options.location);
      } else {
        throw new Error('mach.' + methodName + ' needs an app');
      }
    } else if (typeof options === 'string') { // get(app, url, modifier)
      options = { url: options };
    } else if (options instanceof Location) { // get(app, location, modifier)
      options = { location: options };
    } else if (typeof options !== 'object') { // get(app, modifier)
      modifier = options;
      options = {};
    } else { // get(app, options, modifier)
      options = mergeProperties({}, options);
    }

    options.method = method;

    return mach.call(app, options, modifier);
  };
});

module.exports = mach;
