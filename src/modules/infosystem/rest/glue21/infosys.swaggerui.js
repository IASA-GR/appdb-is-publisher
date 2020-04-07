
document.addEventListener("DOMContentLoaded", function() {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "https://code.jquery.com/jquery-3.4.1.slim.min.js";
  s.setAttribute("integrity", "sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=");
  s.setAttribute("crossorigin", "anonymous");
  s.onload =  initInfosys;
  document.querySelector("body").append(s);
})

function initInfosys() {
  function checkGets() {
    return document.querySelectorAll('.opblock-get');
  }

  function setupFilterInput(path, filterInput) {
    if (!filterInput.parentElement.querySelector('a.help') && INFOSYS.filters[path]) {
      var a = document.createElement('a');

      // Create the text node for anchor element.
      var link = document.createTextNode("available search terms");

      // Append the text node to anchor element.
      a.appendChild(link);

      // Set the title.
      a.title = "Click to view valid search items for the specific filter";
      a.className = 'help';
      a.setAttribute('style', 'padding-left: 5px;text-style: none; text-decoration: none; color: #3636b9;');
      // Set the href property.
      a.href = "/docs/rest/filters/" + INFOSYS.filters[path].replace('#/components/schemas/', '');
      a.target = "_blank";

      filterInput.parentElement.append(a);
    }
  }

  function preload(cb) {
    setTimeout(() => {
      var gets = checkGets();
      if (gets.length > 0) {
        cb(gets)
      } else {
        preload(cb);
      }
    }, 100)
  }

  function checkPathUntil(el, selector, cb) {
    el = el || document;

    setTimeout(() => {
      let val = el.querySelector(selector);
      if (val) {
        cb(val);
      } else {
        if (el.querySelector('noscript')) {
          cb(null);
        } else {
          checkPathUntil(el, selector, cb);
        }
      }
    }, 100);
  }
  function initFilterInputs(el, path) {
    if (!path || !el) {
      return;
    }
    var filterInput = el.querySelector('.opblock-section .parameters-container .table-container .parameters tr[data-param-name="filter"] input');
    if (filterInput) {
      el.querySelector('.btn.try-out__btn').addEventListener("click", function(ev) {
        setTimeout(() => setupFilterInput(path, filterInput), 10);
      })
    }
  }
  function init(getOps) {
    getOps.forEach(function(el) {
      var elpath = el.querySelector('.opblock-summary-path');
      var path = elpath.dataset.path;
      initFilterInputs(el, path);
      $('.opblock-summary').on('click',function(ev) {
        checkPathUntil(el, '.opblock-section .parameters-container .table-container .parameters', (val) => {
          if (!val) {
            return;
          }
          initFilterInputs(el, path);
        })
      })
    });
  }
  setTimeout(() => {
    init(checkGets());
    preload(init);
  }, 1000);
}