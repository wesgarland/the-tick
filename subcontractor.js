/** main module for subcontractor iframes */
module.declare(['./nodier'], (require, exports, module) => {

  var message = { type: 'ready' };

  window.parent.postMessage(JSON.stringify(message), '*');
  
});
