# alexov
[![NPM Version](http://img.shields.io/npm/v/srvcttn.svg?style=flat-square)](https://badge.fury.io/js/srvcttn)

Transhumanism from desktop to your brain.

#### Installation

```bash
npm install alexov
```

#### Usage
```js
// Initialize with default seed
let srvcttn = new Srvcttn('default');

srvcttn
  .login('user', 'password')
  .then((state) => {
    srvcttn.job('000000')
      .addTag('awful')
      .then(() => {
        srvcttn.kill();
      })
  });
```
