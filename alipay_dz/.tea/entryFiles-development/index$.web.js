/**! __APPX-TRACE_START__ */ (function () {
  function init() {
    if (window.AlipayJSBridge) {
      replaceBridgeCall();
      // 注册invokeTraceDebugJsEvent监听
      registerTraceDebugJsCollectEvent();
    } else {
      document.addEventListener(
        'AlipayJSBridgeReady',
        () => {
          replaceBridgeCall();
          // 注册invokeTraceDebugJsEvent监听
          registerTraceDebugJsCollectEvent();
        },
        false,
      );
    }
  }

  function replaceBridgeCall() {
    const traceDebugJsCall = window.AlipayJSBridge.call;
    window.AlipayJSBridge.call = function (method, param, done) {
      if (method === 'onAppPerfEvent') {
        if (param && param.state && param.state === 'pageLoaded') {
          sendTraceDebugJsCollectEvent();
        }
      } else if (method === 'internalAPI' && param.method && param.method === 'onAppPerfEvent') {
        if (param.param && param.param.state && param.param.state === 'pageLoaded') {
          sendTraceDebugJsCollectEvent();
        }
      }
      traceDebugJsCall(method, param, done);
    };
  }

  function sendTraceDebugJsCollectEvent() {
    const event = new CustomEvent('traceDebugCollectEvent');
    document.dispatchEvent(event);
  }

  function registerTraceDebugJsCollectEvent() {
    document.addEventListener('traceDebugCollectEvent', e => {
      // 执行&收集&发送trace
      const base_time =
        (e.data && e.data.appxBaseTime) || window.performance.timing.navigationStart;
      const tms = new Date().getTime() - base_time;
      const page = location.href;
      const dom_info = collect_audit_dom();
      AlipayJSBridge.call('postMethodTrace', {
        data: `${'D' + ',DOM' + ','}${tms},${tms},${encodeURIComponent(
          JSON.stringify({
            fromAppxJsCollect: true,
            page,
            domSize: dom_info.size,
            domWidth: dom_info.width.max,
            domDepth: dom_info.depth.max,
          }),
        ).replace(/%20/g, '+')}`,
      });
      const image_infos = collect_audit_image_usage(tms);
      for (let i = 0; i < image_infos.length; i++) {
        AlipayJSBridge.call('postMethodTrace', {
          data: `${'I' + ',SCALE' + ','}${tms},${tms},${encodeURIComponent(
            JSON.stringify({
              fromAppxJsCollect: true,
              url: image_infos[i].src,
              page,
              clientHeight: image_infos[i].clientHeight,
              clientWidth: image_infos[i].clientWidth,
              naturalHeight: image_infos[i].naturalHeight,
              naturalWidth: image_infos[i].naturalWidth,
              devicePixelRatio: window.devicePixelRatio,
            }),
          ).replace(/%20/g, '+')}`,
        });
        if (image_infos[i].isOffScreen) {
          AlipayJSBridge.call('postMethodTrace', {
            data: `${'I' + ',OFFSCREEN' + ','}${tms},${tms},${encodeURIComponent(
              JSON.stringify({
                fromAppxJsCollect: true,
                url: image_infos[i].src,
                page,
              }),
            ).replace(/%20/g, '+')}`,
          });
        }
      }
    });
  }

  function collect_audit_image_usage(tms) {
    function getElementsInDocument(selector) {
      /** @type {Array<Element>} */
      const results = [];

      /** @param {NodeListOf<Element>} nodes */
      const _findAllElements = nodes => {
        for (let i = 0, el; (el = nodes[i]); ++i) {
          if (!selector || el.matches(selector)) {
            results.push(el);
          }
          // If the element has a shadow root, dig deeper.
          if (el.shadowRoot) {
            _findAllElements(el.shadowRoot.querySelectorAll('*'));
          }
        }
      };
      _findAllElements(document.querySelectorAll('*'));

      return results;
    } /** @param {Element} element */
    function getClientRect(element) {
      const clientRect = element.getBoundingClientRect();
      return {
        // manually copy the properties because ClientRect does not JSONify
        top: clientRect.top,
        bottom: clientRect.bottom,
        left: clientRect.left,
        right: clientRect.right,
      };
    }
    return (function () {
      const page = location.href;
      /** @type {Array<Element>} */
      // @ts-ignore - added by getElementsInDocumentFnString
      const allElements = getElementsInDocument();
      // Chrome normalizes background image style from getComputedStyle to be an absolute AntUrl in quotes.
      // Only match basic background-image: url("http://host/image.jpeg") declarations
      const CSS_URL_REGEX = /^url\("?([^"]+)"?\)$/;
      // Only find images that aren't specifically scaled
      const CSS_SIZE_REGEX = /(auto|contain|cover)/;

      const images = new Array();

      function fetch_image_info(images, allElements, i) {
        const element = allElements[i];
        const style = window.getComputedStyle(element);
        const imageMatch = style.backgroundImage.match(CSS_URL_REGEX);
        const imgsrc = element.currentSrc || (imageMatch && imageMatch[1]);
        let image;
        if (element.localName === 'img') {
          image = {
            // currentSrc used over src to get the url as determined by the browser
            // after taking into account srcset/media/sizes/etc.
            src: imgsrc,
            width: parseInt(style.width),
            height: parseInt(style.height),
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight,
            clientRect: getClientRect(element),
            naturalWidth: element.naturalWidth,
            naturalHeight: element.naturalHeight,
            isCss: false,
            isPicture: !!element.parentElement && element.parentElement.tagName === 'PICTURE',
            usesObjectFit:
              style.getPropertyValue('object-fit') === 'cover' ||
              style.getPropertyValue('object-fit') === 'contain',
            isOffScreen: getClientRect(element).top >= window.innerHeight,
          };
        } else {
          if (
            !style.backgroundImage ||
            !CSS_URL_REGEX.test(style.backgroundImage) ||
            !style.backgroundSize ||
            CSS_SIZE_REGEX.test(style.backgroundSize)
          ) {
            return;
          }
          const img = new Image();
          img.onload = function () {
            if (element.clientWidth > 0 && element.clientHeight > 0) {
              console.log(`img style: ${imgsrc}`);
              AlipayJSBridge.call('postMethodTrace', {
                data: `${'I' + ',SCALE' + ','}${tms},${tms},${encodeURIComponent(
                  JSON.stringify({
                    fromAppxJsCollect: true,
                    url: imgsrc,
                    page,
                    clientHeight: element.clientHeight,
                    clientWidth: element.clientWidth,
                    naturalHeight: img.naturalHeight,
                    naturalWidth: img.naturalWidth,
                    devicePixelRatio: window.devicePixelRatio,
                  }),
                ).replace(/%20/g, '+')}`,
              });
            }
            if (getClientRect(element).top >= window.innerHeight) {
              AlipayJSBridge.call('postMethodTrace', {
                data: `${'I' + ',OFFSCREEN' + ','}${tms},${tms},${encodeURIComponent(
                  JSON.stringify({
                    fromAppxJsCollect: true,
                    url: imgsrc,
                    page,
                  }),
                ).replace(/%20/g, '+')}`,
              });
            }
          };
          img.src = imgsrc;
          return;
        }
        if (image && image.clientWidth > 0 && image.clientHeight > 0) {
          console.log(`img: ${image.src}`);
          console.log(`img: ${image.naturalWidth}`);
          console.log(`img: ${image.naturalHeight}`);
          images.push(image);
        }
      }

      for (let i = 0; i < allElements.length; i++) {
        fetch_image_info(images, allElements, i);
      }
      return images;
    })();
  }

  function collect_audit_dom() {
    function getOuterHTMLSnippet(element) {
      const reOpeningTag = /^.*?>/;
      const match = element.outerHTML.match(reOpeningTag);
      return match && match[0];
    }
    function createSelectorsLabel(element) {
      let name = element.localName || '';
      const idAttr = element.getAttribute && element.getAttribute('id');
      if (idAttr) {
        name += `#${idAttr}`;
      }
      // svg elements return SVGAnimatedString for .className, which is an object.
      // Stringify classList instead.
      if (element.classList) {
        const className = element.classList.toString();
        if (className) {
          name += `.${className.trim().replace(/\s+/g, '.')}`;
        }
      } else if (ShadowRoot.prototype.isPrototypeOf(element)) {
        name += '#shadow-root';
      }

      return name;
    }
    function elementPathInDOM(element) {
      const visited = new Set();
      const path = [createSelectorsLabel(element)];
      let node = element;
      while (node) {
        visited.add(node);

        // Anchor elements have a .host property. Be sure we've found a shadow root
        // host and not an anchor.
        if (ShadowRoot.prototype.isPrototypeOf(node)) {
          const isShadowHost = node.host && node.localName !== 'a';
          node = isShadowHost ? node.host : node.parentElement;
        } else {
          const isShadowHost =
            node.parentNode && node.parentNode.host && node.parentNode.localName !== 'a';
          node = isShadowHost ? node.parentNode.host : node.parentElement;
        }

        if (visited.has(node)) {
          node = null;
        }

        if (node) {
          path.unshift(createSelectorsLabel(node));
        }
      }
      return path;
    }
    return (function getDOMStats(element, deep = true) {
      let deepestNode = null;
      let maxDepth = 0;
      let maxWidth = 0;
      let parentWithMostChildren = null;

      /**
       * @param {Element} element
       * @param {number} depth
       */
      const _calcDOMWidthAndHeight = function (element, depth = 1) {
        if (depth > maxDepth) {
          deepestNode = element;
          maxDepth = depth;
        }
        if (element.children.length > maxWidth) {
          parentWithMostChildren = element;
          maxWidth = element.children.length;
        }

        let child = element.firstElementChild;
        while (child) {
          _calcDOMWidthAndHeight(child, depth + 1);
          // If node has shadow dom, traverse into that tree.
          if (deep && child.shadowRoot) {
            _calcDOMWidthAndHeight(child.shadowRoot, depth + 1);
          }
          child = child.nextElementSibling;
        }

        return { maxDepth, maxWidth };
      };

      const result = _calcDOMWidthAndHeight(element);

      return {
        depth: {
          max: result.maxDepth,
          pathToElement: elementPathInDOM(deepestNode),
          snippet: getOuterHTMLSnippet(deepestNode),
        },
        width: {
          max: result.maxWidth,
          pathToElement: elementPathInDOM(parentWithMostChildren),
          snippet: getOuterHTMLSnippet(parentWithMostChildren),
        },
        size: document.getElementsByTagName('*').length,
      };
    })(document.documentElement);
  }

  init();
})();
 /**! __APPX-TRACE_END__ */
require('@alipay/appx-compiler/lib/sjsEnvInit');
require('./config$');

require('../../pages/index/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/login/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/yk_code/yk_code?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/scan_code/scan_code?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/center/center?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/feedback/feedback?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/staff_index/staff_index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/admin_location/admin_location?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/admin_recond/admin_recond?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/staff_login/staff_login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/staff_recond_detail/staff_recond_detail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/staff_record/staff_record?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/feedback_list/feedback_list?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
