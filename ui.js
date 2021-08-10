module.declare(['./nodier'], (require, exports, module) => {

  exports.init = function ui$$init()
  {
    require('./nodier').init();

    document.body.setAttribute('loaded', 'true');
    window.addEventListener('hashchange', exports.hashChangeHandler);

    if (window.location.hash)
      exports.hashChangeHandler();

    return new Promise((resolve) => {
      document.on('includerFinished', resolve);
    });
  }

  exports.hashChangeHandler = function ui$$hashChangeHandler()
  {
    document.body.setAttribute('content', window.location.hash.slice(1));
  }
});
