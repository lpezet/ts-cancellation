# MKay Diary

A non-supported implemetation of Cancellation in Typescript.

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][vulnerabilities-image]][vulnerabilities-url]

Example taken from [rbuckton/CancellationToken.md](https://gist.github.com/rbuckton/256c4e929f4a097e2c16):

```typescript
public fetchAsync(url, cancellationToken = CancellationToken.default) {
  return new Promise((resolve, reject) => {
    // throw (reject) if cancellation has already been requested.
    cancellationToken.throwIfCanceled();

    // alternatively:
    //
    //   // if cancellation has been requested, reject the Promise with the reason for cancellation.
    //   if (cancellationToken.canceled) {
    //     reject(cancellationToken.reason);
    //     return; 
    //   }
    //
    // or even:
    //
    //   // register the reject handler of the Promise to receive the cancellation signal. If the source is already
    //   // canceled, this will call the reject handler immediately.
    //   cancellationToken.register(reject); 
    //   if (cancellationToken.canceled) {
    //     return;
    //   }

    var xhr = new XMLHttpRequest();

    // save a callback to abort the xhr when cancellation is requested
    var oncancel = (reason: any) => {
      // abort the request
      xhr.abort();
      
      // reject the promise
      reject(reason);
    }

    // wait for the remote resource
    xhr.onload = event => {
      // async operation completed, stop waiting for cancellation
      registration.unregister();

      // resolve the promise
      resolve(event);
    }

    xhr.onerror = event => {
      // async operation failed, stop waiting for cancellation
      cancellationToken.unregister();

      // reject the promise
      reject(event);
    }
    
    // register the callback to execut when cancellation is requested
    var registration = cancellationToken.register(oncancel);

    // begin the async operation
    xhr.open('GET', url, /*async*/ true);
    xhr.send(null);
  });
}
```

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```bash
npm install @lpezet/ts-cancellation
```

# References

https://github.com/microsoft/referencesource/blob/master/Microsoft.Bcl/System.Threading.Tasks.v1.5/System/Threading/CancellationTokenRegistration.cs

https://gist.github.com/bakerface/492c631c6aa23e915bde9243252b52f4

https://gist.github.com/rbuckton/256c4e929f4a097e2c16

https://github.com/rbuckton/asyncjs/blob/master/lib/cancellation.ts

# License

[MIT](LICENSE)


[npm-image]: https://badge.fury.io/js/%40lpezet%2Fts-cancellation.svg
[npm-url]: https://npmjs.com/package/@lpezet/ts-cancellation
[travis-image]: https://www.travis-ci.com/lpezet/ts-cancellation.svg?branch=master
[travis-url]: https://www.travis-ci.com/github/lpezet/ts-cancellation
[coveralls-image]: https://coveralls.io/repos/github/lpezet/ts-cancellation/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/lpezet/ts-cancellation?branch=master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/hxkr7yml7qhi9jo8?svg=true
[appveyor-url]: https://ci.appveyor.com/project/lpezet/ts-cancellation
[vulnerabilities-image]: https://snyk.io/test/github/lpezet/ts-cancellation/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/lpezet/ts-cancellation

# Publishing

To publish next version of `@lpezet/ts-cancellation`, run the following:

```bash
npm version patch
git push --tags origin master
npm run build-prod
npm publish --access public
```
