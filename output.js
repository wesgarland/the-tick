module.declare((require, exports, module) => {
  exports.maxLines = 10000;
  exports.lines    = [];

  exports.log = function output$$log()
  {
    const textarea = document.querySelector('#output > TEXTAREA');
    var outs = [];

    for (let arg of arguments)
    {
      if (typeof arg === 'object' && arg !== null && arg.inspect)
        outs.push(arg.inspect());
      else if (typeof arg === 'object')
        outs.push(JSON.stringify(arg));
      else
        outs.push(arg + '');
    }

    if (!outs.length)
      return;

    exports.lines.push(outs.join(' '));
    if (exports.lines.length > exports.maxLines)
      exports.lines.splice(0, 1);
    
    textarea.value = exports.lines.join('\n');
    textarea.scrollTop = textarea.scrollHeight;
  }

  exports.debug = exports.notice = exports.warn = exports.log;
});
