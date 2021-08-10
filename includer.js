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
    for (let i=0; i < iframeIdx.length; i++)
    {
      let entry = iframeIdx[i];

      if (entry && (ev.source === entry.iframe.contentWindow))
      {
 	doit(ev.data, entry.docEl);

	iframeIdx.splice(i--, 1);
	document.body.includerPending = iframeIdx.length;
	if (iframeIdx.length === 0)
	  document.dispatchEvent(new Event('includerFinished'));
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
    document.body.includerPending = iframeIdx.length;
  }
});
