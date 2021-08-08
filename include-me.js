const doc = document.currentScript.parentNode.parentNode;
document.currentScript.remove();
const content = doc.getElementsByTagName('body')[0].innerHTML;
window.parent.postMessage(content, '*');
