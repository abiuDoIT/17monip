# 17monip
find country of special ip by 17monip database local.

I restruct the ipdata ,integrate same country ip during.

so this module only support country code info, it is more faster.

if you want to update the ip database, update the file '17monipdb.dat' and then excute change.js.
# how to use
```
npm install 17monip
```

```
const findIp = require('17monip');
let country_code = findIp('5.121.2.3');

//IR
console.log(country_code);
```

# how about efficiency
you can excute index.test.js

on my mac,find 1000,000 ip only nedd <200ms


