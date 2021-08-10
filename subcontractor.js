/** main module for subcontractor iframes */
module.declare(['./nodier'], (require, exports, module) => {
  
  window.parent.postMessage('ready', '*');
  
  
};
