module.declare((require, exports, module) => {
  function $(s) {
    return document.querySelector(s);
  }

  exports.log = function output$$log()
  {
    var outs = [];

    for (let arg of arguments)
    {
      if (typeof arg === 'object' && arg.inspect)
	outs.push(arg.inspect());
      else if (typeof arg === 'object')
	outs.push(JSON.stringify(arg));
      else
	outs.push(arg + '');
    }

    if (outs.length)
      $('#output > TEXTAREA').value += outs.join(' ') + '\n';      
      //      $('#output > TEXTAREA').textContent += outs.join(' ') + '\n';
  }

});
