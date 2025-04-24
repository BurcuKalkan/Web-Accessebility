console.log("Marker script injected");
let currentMarkers = undefined;
let selectedMarker = undefined;

window.addEventListener("message", (message) => {
  console.log(message);
  switch (message.data.type) {
    case "addMarker":
      addMarker(message.data.selector, message.data.msgtype, message.data.id);
      currentMarkers = `.element-marker-${message.data.msgtype}`;
      break;
    case "removeMarkers":
      removeMarkers();
      currentMarkers=undefined;
      break;
    case "selectMarker":
        selectMarker(message.data.selector, message.data.msgtype, message.data.id);
        break;
    default:
      break;
  }
});



function selectMarker(selector, type, id) {
    selectedMarker && (selectedMarker.style = "");
    const element = document.querySelector("#element-marker-"+id);
    if (element) {
        console.log("Element found:", element);
        selectedMarker = element;
        element.style = `
          
          animation: pulse 2s infinite;
          transform-origin: center center;
        `;
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(2);
            }
            100% {
              transform: scale(1);
            }
          }
        `;
        document.head.appendChild(style);
       window.parent.postMessage({id,type:"selectback",bg:element.bg,fg:element.fg}, "*");
       element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.log("Element not found for selector:", selector);
    }
  }

function addMarker(selector, type, id) {
  console.log("Attempting to add marker for selector:", selector);
  const element = document.querySelector(selector);
  if (element) {
    console.log("Element found:", element);
    const marker = document.createElement("img");
    marker.addEventListener("click", (e) => {
        window.parent.postMessage({id,type}, "*");
        e.preventDefault();
    });
    marker.id = `element-marker-${id}`;
    marker.src = `http://localhost:4002/${type}.ico`;
    marker.className = `element-marker-${type}`;
    marker.bg = getEffectiveBackgroundColorHex(element);
    marker.fg = getTextColorHex(element);
    element.style.position = "relative";
    element.parentElement.appendChild(marker);
    // element.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    console.log("Element not found for selector:", selector);
  }
}

function removeMarkers() {
    document.querySelectorAll(currentMarkers).forEach((el) => el.remove());
}


function rgbaToHex(rgba) {
  const result = rgba.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
  if (!result) return null;

  const r = parseInt(result[1]).toString(16).padStart(2, '0');
  const g = parseInt(result[2]).toString(16).padStart(2, '0');
  const b = parseInt(result[3]).toString(16).padStart(2, '0');
  const a = result[4] !== undefined ? parseFloat(result[4]) : 1;

  return {
    hex: `#${r}${g}${b}`,
    alpha: a
  };
}

function getEffectiveBackgroundColorHex (element){
  while (element && element !== document.documentElement) {
    const bg = getComputedStyle(element).backgroundColor;
    if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return rgbaToHex(bg);
    }
    element = element.parentElement;
  }
  return rgbaToHex(getComputedStyle(document.documentElement).backgroundColor);
}

function getTextColorHex (element) {
  const color = getComputedStyle(element).color;
  return rgbaToHex(color);
}

/*function inj() {
  console.log("Injecting request override script...");

  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = typeof input === "string" ? input : input.url;
    let proxyUrl = "/proxy?url=" + encodeURIComponent(url);
    // console.log("Redirecting fetch:", url, "→", proxyUrl);
    return originalFetch(proxyUrl, init);
  };

  // Override XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    let xhr = new originalXHR();
    let open = xhr.open;
    xhr.open = function (method, url, async, user, password) {
      let proxyUrl = "/proxy?url=" + encodeURIComponent(url);
      //  console.log("Redirecting XHR:", url, "→", proxyUrl);
      open.call(xhr, method, proxyUrl, async, user, password);
    };
    return xhr;
  };

  // Rewrite all <script>, <link>, and <img> elements to go through proxy
  function rewriteResourceUrls() {
    document
      .querySelectorAll("script[src], link[href], img[src]")
      .forEach((el) => {
        let attr = el.tagName === "LINK" ? "href" : "src";
        let url = el.getAttribute(attr);
        if (
          url &&
          !url.startsWith("data:") &&
          !url.startsWith("blob:") &&
          !url.startsWith("/proxy")
        ) {
          let proxyUrl = "/proxy?url=" + encodeURIComponent(url);
          //     console.log("Rewriting resource:", url, "→", proxyUrl);
          el.setAttribute(attr, proxyUrl);
        }
      });
  }

  // Run rewriting after DOM loads
  // document.addEventListener("DOMContentLoaded", rewriteResourceUrls);
  //  setTimeout(rewriteResourceUrls, 1000); // Re-run after 1s for late-loaded resources
}

inj();
*/
