module.declare((require, exports, module) => {
  var iframeIdx = [];

  function $(s) {
    return document.querySelector(s);
  }

  window.addEventListener('message', function(ev) {
    for (let entry of iframeIdx)
    {
      if (ev.source === entry.iframe.contentWindow)
      {
	exports.SubcontractorManager.receiveMessage.apply(entry.instance, JSON.parse(ev.data));
        break;
      }
    }
  });

  exports.SubcontractorManager = function SubcontractorManager(jobDetails, slices)
  {
    var iframe = document.createElement('iframe');
    
    iframe.setAttribute('src', './subcontractor.html');
    iframe.className = 'subcontractor';
    iframeIdx.push({iframe, instance: this});
    $('#operate').appendChild(iframe);

    this.jobDetails = jobDetails;
    this.slices = slices;
  }

  /** 
   * "ready for work"
   * "ready for slice" 
   * "here come results" 
   */
  exports.SubcontractorManager.receiveMessage = function SubcontractorManage$$receiveMessage(message, element)
  {
    console.log('MESSAGE', message);
    debugger;
    switch(message.type)
    {
      case 'ready':
      break;
    }
  }

});
