module.declare(['./nodier'], (require, exports, module) => {

  exports.init = function ui$$init()
  {
    require('./nodier').init();

    document.body.setAttribute('loaded', 'true');
    window.addEventListener('hashchange', exports.hashChangeHandler);

    if (window.location.hash)
      exports.hashChangeHandler();

    /** Resolve the promise once document and include tags loaded */
    return new Promise((resolve) => {
      var onloadFired = document.readyState === 'complete';
      var includerFinishedFired = document.body.includerPending === 0;

      function maybeResolve()
      {
        if (onloadFired && includerFinishedFired)
          resolve();
      }
       
      document.on('includerFinished', () => { includerFinishedFired = true; maybeResolve() });
      window.on('load', () => { onloadFired = true; maybeResolve() });

      maybeResolve();
    });
  }

  exports.hashChangeHandler = function ui$$hashChangeHandler()
  {
    document.body.setAttribute('content', window.location.hash.slice(1));
  }
});
