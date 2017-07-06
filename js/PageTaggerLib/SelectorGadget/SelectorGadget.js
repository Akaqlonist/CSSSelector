function importJS(src, look_for, onload) {
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', src);
  if (onload) wait_for_script_load(look_for, onload);
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}

function importCSS(href, look_for, onload) {
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', href);
  if (onload) wait_for_script_load(look_for, onload);
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}

function wait_for_script_load(look_for, callback) {
  var interval = setInterval(function() {
    if (typeof look_for != 'undefined') {
      clearInterval(interval);
      callback();
    }
  }, 50);
}

(function(){

  importCSS(cssUrl);
  importJS(jqueryUrl, 'jQuery', function() { // Load everything else when it is done.
    jQuery.noConflict();
    importJS(diffUrl, 'diff_match_patch', function() {
      importJS(domUrl, 'DomPredictionHelper', function() {
        importJS(interfaceUrl);
      });
    });
  });
})();