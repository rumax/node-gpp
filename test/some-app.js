#define ERR(x) console.log(x)
#define LOG(X) console.error(X)
#define foo 4 * 1024

var notifications = require('./tools/notifications.js');

#ifdef DEBUG
LOG('Some development code placed here');
#endif
ERR('Some error');

alert(foo);

