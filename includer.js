'use strict';

document.addEventListener('DOMContentLoaded', function includer() {
  const iframeIdx = [];

  function doit(html, element)
  {
    if (element.getAttribute('replace') === 'true')
      element.outerHTML = html;
    else
      element.innerHTML = html;
  }
  
  window.addEventListener('message', function(ev) {
    for (let entry of iframeIdx)
    {
      if (ev.source === entry.iframe.contentWindow)
      {
 	doit(ev.data, entry.docEl);
	break;
      }
    }
  });      

  for (let docEl of document.getElementsByTagName('include'))
  {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', docEl.getAttribute('src'));
    iframe.className = 'includer';
    iframeIdx.push({docEl, iframe});
    document.body.appendChild(iframe);
  }
});
