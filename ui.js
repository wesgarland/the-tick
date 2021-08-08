module.declare(['./nodier'], (require, exports, module) => {

  exports.init = function ui$$init()
  {
    console.log(require('./nodier'));
    require('./nodier').init();

    document.body.setAttribute('loaded', 'true');
    window.addEventListener('hashchange', exports.hashChangeHandler);

    if (window.location.hash)
      exports.hashChangeHandler();
  }

  exports.hashChangeHandler = function ui$$hashChangeHandler()
  {
    document.body.setAttribute('content', window.location.hash.slice(1));
  }
});
