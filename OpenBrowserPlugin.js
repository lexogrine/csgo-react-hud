const open = require('open');

module.exports = class OpenBrowser {
  constructor(options) {
    if (typeof options === 'string') {
      this.options = Object.assign(
        {
          hasOpen: false
        },
        {
          url: options
        }
      );
    } else {
      this.options = Object.assign(
        {
          port: 8080,
          host: 'localhost',
          protocol: 'http:',
          hasOpen: false
        },
        options
      );
    }
  }

  apply(compiler) {
    const options = this.options;
    let url;
    let hasOpen = options.hasOpen;
    if (options.protocol && !options.protocol.endsWith(':')) options.protocol += ':';
    if (options.url) url = options.url;
    else url = `${options.protocol}//${options.host}:${options.port}`;
    if (compiler.hooks) {
      compiler.hooks.afterEmit.tap('openBrowser', () => {
        if (!hasOpen) open(url);
        hasOpen = true;
        this.options.hasOpen = true;
      });
    } else {
      compiler.plugin('after-emit', (c, cb) => {
        if (!hasOpen) open(url);
        hasOpen = true;
        this.options.hasOpen = true;
        return cb();
      });
    }
  }
};
