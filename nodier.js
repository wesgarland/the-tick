/**
 * Make the browser nodier 
 */
module.declare((require, exports, module) => {
  exports.init = function nodier$$init()
  {
    exports.init = function nodier$$node() {};
    
    EventTarget.prototype.on  = EventTarget.prototype.addEventListener;
    EventTarget.prototype.off = EventTarget.prototype.removeEventListener;
  }
});
