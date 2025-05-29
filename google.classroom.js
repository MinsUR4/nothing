deledao (function() {
  var neutralizeDeledao = function() {
    try {
      var knownGlobals = [
        '__dld_fi', '__dld_iaw', '__dld_bi', '__dld_popupEdu', 'DLDCache', '_languageData',
        'DeledaoAI', 'frontInit', 'r', '__dld_config', '__dld_flags'
      ];

      knownGlobals.forEach(function(name) {
        if (typeof window[name] !== 'undefined') {
          Object.defineProperty(window, name, {
            value: undefined,
            configurable: false,
            writable: false
          });
        }
      });

      // --- BEGIN: Block DLDCache and its storage backends ---
      function blockDLDCache() {
        try {
          // Remove DLDCache and its sub-objects
          ['DLDCache', 'DLDCache.BasicCacheStorage', 'DLDCache.LocalStorageCacheStorage'].forEach(name => {
            let parts = name.split('.');
            if (parts.length === 1) {
              Object.defineProperty(window, parts[0], {
                value: undefined,
                configurable: false,
                writable: false
              });
            } else if (window[parts[0]]) {
              Object.defineProperty(window[parts[0]], parts[1], {
                value: undefined,
                configurable: false,
                writable: false
              });
            }
          });
          // Defensive: block DLDCache constructor and prototype
          window.DLDCache = function() {
            throw new Error('[Anti-DLDCache] Blocked DLDCache constructor');
          };
          window.DLDCache.BasicCacheStorage = function() {
            throw new Error('[Anti-DLDCache] Blocked DLDCache.BasicCacheStorage');
          };
          window.DLDCache.LocalStorageCacheStorage = function() {
            throw new Error('[Anti-DLDCache] Blocked DLDCache.LocalStorageCacheStorage');
          };
          // Block all prototype methods
          ['prototype'].forEach(proto => {
            try {
              if (window.DLDCache && window.DLDCache[proto]) {
                Object.getOwnPropertyNames(window.DLDCache[proto]).forEach(fn => {
                  window.DLDCache[proto][fn] = function() {
                    throw new Error('[Anti-DLDCache] Blocked DLDCache.' + fn);
                  };
                });
              }
            } catch (e) {}
          });
        } catch (e) {}
      }
      // Remove any script tags that look like they might be DLDCache
      function removeDLDCacheScripts() {
        const dldPattern = /dldcache|cache\-storage|dld/i;
        document.querySelectorAll('script[src]').forEach(s => {
          if (dldPattern.test(s.src)) s.remove();
        });
      }
      // MutationObserver to block dynamic script injection
      const dldScriptObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.tagName === 'SCRIPT' && /dldcache|cache\-storage|dld/i.test(n.src || '')) {
              n.remove();
            }
          });
        });
      });
      dldScriptObserver.observe(document.documentElement, { childList: true, subtree: true });
      // Watchdog to keep DLDCache blocked
      setInterval(() => {
        blockDLDCache();
        removeDLDCacheScripts();
      }, 300);
      // Block localStorage keys used by DLDCache
      setInterval(() => {
        Object.keys(localStorage).forEach(k => {
          if (/^cache-storage\./.test(k)) {
            localStorage.removeItem(k);
          }
        });
      }, 1000);
      // Block DLDCache in global property enumeration
      Object.defineProperty(window, 'DLDCache', {
        get() {
          return undefined;
        },
        set() {
          throw new Error('[Anti-DLDCache] Attempt to redefine DLDCache blocked');
        },
        configurable: false
      });
      // Initial block
      blockDLDCache();
      removeDLDCacheScripts();
      // --- END: Block DLDCache and its storage backends ---

      // --- BEGIN: Block psl global and script injection ---
      function blockPSL() {
        try {
          Object.defineProperty(window, 'psl', {
            value: undefined,
            configurable: false,
            writable: false
          });
          window.psl = function() {
            throw new Error('[Anti-PSL] Blocked psl global');
          };
        } catch (e) {}
      }
      function removePSLScripts() {
        const pslPattern = /psl(\.|-|_)?(min)?\.js|psl/i;
        document.querySelectorAll('script[src]').forEach(s => {
          if (pslPattern.test(s.src)) s.remove();
        });
      }
      const pslScriptObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.tagName === 'SCRIPT' && /psl(\.|-|_)?(min)?\.js|psl/i.test(n.src || '')) {
              n.remove();
            }
          });
        });
      });
      pslScriptObserver.observe(document.documentElement, { childList: true, subtree: true });
      setInterval(() => {
        blockPSL();
        removePSLScripts();
      }, 300);
      Object.defineProperty(window, 'psl', {
        get() {
          return undefined;
        },
        set() {
          throw new Error('[Anti-PSL] Attempt to redefine psl blocked');
        },
        configurable: false
      });
      blockPSL();
      removePSLScripts();
      // --- END: Block psl global and script injection ---

      // --- BEGIN: Block TensorFlow.js tensor/tensorArray globals and script injection ---
      function blockTensorGlobals() {
        [
          'tensor', 'Tensor', 'TensorArray', 'tf', 'tfjs', 'TensorFlow', 'TensorBuffer', 'Variable',
          'AdadeltaOptimizer', 'AdagradOptimizer', 'AdamOptimizer', 'AdamaxOptimizer', 'MomentumOptimizer', 'Optimizer', 'RMSPropOptimizer', 'SGDOptimizer'
        ].forEach(name => {
          try {
            Object.defineProperty(window, name, {
              value: undefined,
              configurable: false,
              writable: false
            });
            window[name] = function() {
              throw new Error('[Anti-Tensor] Blocked ' + name + ' global');
            };
          } catch (e) {}
        });
      }
      function removeTensorScripts() {
        const tensorPattern = /tf(\.|-|_)?(min)?\.js|tfjs|tensorflow|tensor(array)?|tensorflow/i;
        document.querySelectorAll('script[src]').forEach(s => {
          if (tensorPattern.test(s.src)) s.remove();
        });
      }
      const tensorScriptObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.tagName === 'SCRIPT' && /tf(\.|-|_)?(min)?\.js|tfjs|tensorflow|tensor(array)?|tensorflow/i.test(n.src || '')) {
              n.remove();
            }
          });
        });
      });
      tensorScriptObserver.observe(document.documentElement, { childList: true, subtree: true });
      setInterval(() => {
        blockTensorGlobals();
        removeTensorScripts();
      }, 300);
      [
        'tensor', 'Tensor', 'TensorArray', 'tf', 'tfjs', 'TensorFlow', 'TensorBuffer', 'Variable',
        'AdadeltaOptimizer', 'AdagradOptimizer', 'AdamOptimizer', 'AdamaxOptimizer', 'MomentumOptimizer', 'Optimizer', 'RMSPropOptimizer', 'SGDOptimizer'
      ].forEach(name => {
        Object.defineProperty(window, name, {
          get() {
            return undefined;
          },
          set() {
            throw new Error('[Anti-Tensor] Attempt to redefine ' + name + ' blocked');
          },
          configurable: false
        });
      });
      blockTensorGlobals();
      removeTensorScripts();
      // --- END: Block TensorFlow.js tensor/tensorArray globals and script injection ---

      var pattern = /deledao|core\.min\.js|bInit\.js|fInit\.js|vendor\.js|backlibs\.js|popupEdu/i;
      document.querySelectorAll('script[src]').forEach(function(s) {
        if (pattern.test(s.src)) {
          s.remove();
        }
      });

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.tagName === 'SCRIPT' && pattern.test(n.src || '')) {
              n.remove();
            }
          });
        });
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      Object.keys(localStorage).forEach(function(k) {
        if (/^cache-storage\./.test(k)) {
          localStorage.removeItem(k);
        }
      });

      if (typeof importScripts === 'function') {
        self.importScripts = function() {
          console.log('[Anti-Deledao] importScripts intercepted and blocked:', arguments);
        };
      }

      if (typeof r !== 'undefined' && typeof r.F === 'function') {
        r.F = function(key) {
          console.log('[Anti-Deledao] attempt to run r.F("' + key + '") blocked.');
          return function() {};
        };
      }

      // 1. Block KJUR and its sub-namespaces
      Object.defineProperty(window, 'KJUR', {
        value: undefined,
        configurable: false,
        writable: false
      });

      // 2. Block jsrsasign library loading
      const jsrsasignPattern = /jsrsasign(\.min)?\.js/i;
      document.querySelectorAll('script[src]').forEach(function(s) {
        if (jsrsasignPattern.test(s.src)) {
          s.remove();
        }
      });

      // 3. MutationObserver for dynamic script insertion
      const jsrsasignObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.tagName === 'SCRIPT' && jsrsasignPattern.test(n.src || '')) {
              n.remove();
            }
          });
        });
      });
      jsrsasignObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      // 4. Defensive override for KJUR if it gets redefined
      setInterval(() => {
        if (typeof window.KJUR !== 'undefined') {
          try {
            window.KJUR = undefined;
          } catch (e) {}
          Object.defineProperty(window, 'KJUR', {
            value: undefined,
            configurable: false,
            writable: false
          });
        }
      }, 500);

      // 5. (Optional) Block YAHOO.lang.extend if not needed elsewhere
      if (typeof window.YAHOO !== 'undefined' && window.YAHOO.lang && window.YAHOO.lang.extend) {
        window.YAHOO.lang.extend = function() {};
      }

      const blockKJURClass = (className) => {
        try {
          if (window.KJUR && window.KJUR.asn1 && window.KJUR.asn1.x509 && window.KJUR.asn1.x509[className]) {
            window.KJUR.asn1.x509[className] = function() {
              throw new Error('[Anti-Deledao] Blocked KJUR.asn1.x509.' + className);
            };
          }
        } catch (e) {}
      };

      [
        'BasicConstraints', 'CRLDistributionPoints', 'CertificatePolicies', 'PolicyInformation',
        'PolicyQualifierInfo', 'UserNotice', 'NoticeReference', 'DisplayText', 'ExtKeyUsage',
        'AuthorityKeyIdentifier', 'SubjectKeyIdentifier', 'AuthorityInfoAccess', 'SubjectAltName',
        'IssuerAltName', 'CRL', 'TBSCertList', 'CRLEntry'
      ].forEach(blockKJURClass);

      // --- BEGIN: Extra Deledao Countermeasures ---
      // 1. Hide/remove Deledao UI overlays and injected elements
      const deledaoIds = [
        "trackArea", "protectPrivacy", "statusBar", "myModal", "entSupCmd", "cmdStatus", "cmdResp",
        "prodArea", "extDisabled", "cust", "user", "group", "rule", "ip", "video", "uuiddiv",
        "refreshPolicyButton", "supportCmdButton", "sensitivity", "logoutGoogleButton", "homeUserLogout",
        "brmode", "homeMode", "custName", "ruleName", "userName", "version", "devArea", "uuid",
        "serverPath", "serverConsolePath", "debugButton", "showLogsButton", "serverPathButton", "logout", "clearLS"
      ];
      setInterval(() => {
        deledaoIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "none";
        });
      }, 500);
      // Remove overlays as soon as they are added
      const deledaoOverlayObserver = new MutationObserver(() => {
        deledaoIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "none";
        });
      });
      deledaoOverlayObserver.observe(document.documentElement, { childList: true, subtree: true });

      // 2. Block/Override Deledao's global functions and objects
      [
        'Z', 'Va', 'Q', 'K', 'dk', 'er', 'hr', 'kr', 'sr', 'Br', 'Cr', 'po', 'oo', 'Ua', 'Ta', 'Ra', 'Mn', 'Cn', 'so', 'sp', 'Pp', 'jp', 'kp', 'Gq', 'Jq', 'Dq', 'Nq', 'dr', 'Kq', 'Bo', 'Xq', 'Wq', 'Vq', 'Yq', 'Xo', 'Qo', 'cr', 'ne', 'U', 'pb', 'nb', 'tc', 'Uc', 'Tc', 'Jn', 'Wa', 't', 'y', 'A', 'C', 'F', 'H', 'va', 'wa', 'ca', 'Oc', 'Nc', 'Pc', 'Mc', 'J', 'Zq', 'Yq', 'Zc', 'Rc', 'Qf', 'Qe', 'Qd', 'Qb', 'Qh', 'Qw', 'Qz', 'Qm', 'Qn', 'Qk', 'Qj', 'Qp', 'Qv', 'Qx', 'Qy', 'Qsb', 'Qza', 'Qsa', 'Qce', 'QJg', 'QKm', 'Qwo', 'QFa', 'Qkf', 'Qrl', 'Qzm', 'Qei', 'Qfeatures', 'Qplatform', 'Qwa', 'Qsb', 'Qza', 'Qsa', 'Qce', 'QJg', 'QKm', 'Qwo', 'QFa', 'Qkf', 'Qrl', 'Qzm', 'Qei', 'Qfeatures', 'Qplatform', 'Qwa'
      ].forEach(name => {
        try {
          Object.defineProperty(window, name, {
            value: undefined,
            configurable: false,
            writable: false
          });
        } catch (e) {}
      });
      // Defensive override for Z
      window.Z = function() {
        console.log('[Anti-Deledao] Blocked Z() call', arguments);
      };

      // 3. Block Deledao's event listeners and mutation observers
      const origAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (typeof listener === 'function' && (
          listener.toString().includes('We Protect Your Privacy') ||
          listener.toString().includes('debugTool') ||
          listener.toString().includes('Deledao')
        )) {
          return;
        }
        return origAddEventListener.call(this, type, listener, options);
      };
      const origMutationObserver = window.MutationObserver;
      window.MutationObserver = function(callback) {
        if (callback && callback.toString().includes('Deledao')) {
          return { observe: function() {}, disconnect: function() {} };
        }
        return new origMutationObserver(callback);
      };

      // 4. Block WebSocket and message passing
      window.WebSocket = function() {
        throw new Error('[Anti-Deledao] WebSocket blocked');
      };
      const origPostMessage = window.postMessage;
      window.postMessage = function() {
        if (arguments[0] && typeof arguments[0] === 'object' && arguments[0].recipient === 'deledao') {
          console.log('[Anti-Deledao] Blocked postMessage to deledao');
          return;
        }
        return origPostMessage.apply(this, arguments);
      };

      // 5. Block Deledao's cookie/ad/tracking overlays
      // Remove overlays by class as well (if any)
      const deledaoClasses = [
        'deledao-privacy-banner', 'deledao-ad-overlay', 'deledao-cookie-banner', 'deledao-modal', 'deledao-popup'
      ];
      setInterval(() => {
        deledaoClasses.forEach(cls => {
          document.querySelectorAll('.' + cls).forEach(el => {
            el.style.display = 'none';
          });
        });
      }, 500);
      // --- END: Extra Deledao Countermeasures ---

      // --- BEGIN: Block Deledao DVA, DAB, Chat, Classroom, Game Monitoring, and Notification Features ---
      // Block constructors and prototypes for all dynamic analysis, chat, classroom, and game monitoring
      [
        'yq', 'tq', 'Wp', 'hq', 'jp', 'lp', 'Dq', 'Gq', 'Jq', 'Kq', 'Nq', 'Oq', 'Uq', 'Vq', 'Wq', 'Xq', 'Yq', 'Zq', 'cr', 'dr', 'er'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Block any global function named lp (anti-bullying analysis)
      window.lp = function() {
        throw new Error('[Anti-Deledao] Blocked lp (anti-bullying analysis)');
      };
      // Block overlays and notifications created by these features
      setInterval(() => {
        // Remove notification overlays
        const notif = document.getElementById('dld-notification');
        if (notif) notif.remove();
        // Remove classroom/chat overlays
        ['chats', 'className', 'member', 'classdate', 'send', 'cancel', 'sendform', 'raiseHandButton', 'sendMsgButton', 'supportCmdArea', 'responseMessage', 'unblockreq'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        // Remove annotation overlays
        document.querySelectorAll('canvas,div').forEach(el => {
          if (el.innerText && el.innerText.includes('is annotating')) {
            el.style.display = 'none';
          }
        });
      }, 500);
      // --- END: Block Deledao DVA, DAB, Chat, Classroom, Game Monitoring, and Notification Features ---

      // --- BEGIN: Block Deledao Image/Video Debug and Analysis Features ---
      [
        'tp', 'Np', 'Op', 'Gp', 'Lp', 'Mp', 'Pp', 'Rp', 'Up', 'Qp', 'Sp', '$p', 'Zp', 'Tp', 'iq', 'fq', 'Vp', 'Yp', 'dq', 'gq', 'bq'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Remove debug panes and overlays
      setInterval(() => {
        // Remove debug notification overlays
        const debugPaneIds = [
          'dld-notification', 'dld-debug-pane', 'dld-image-debug', 'dld-video-debug', 'dld-debug-text', 'dld-bad-frames-area'
        ];
        debugPaneIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.remove();
        });
        // Remove any divs or canvases with debug-like content
        document.querySelectorAll('div,canvas').forEach(el => {
          if (el.innerText && (
            el.innerText.includes('Debug text') ||
            el.innerText.includes('Bad frames:') ||
            el.innerText.includes('show image importance')
          )) {
            el.style.display = 'none';
          }
        });
      }, 500);
      // --- END: Block Deledao Image/Video Debug and Analysis Features ---

      // --- BEGIN: Block Deledao Search, Filter, YouTube, and Text Analysis Features ---
      [
        'to', 'uo', 'vo', 'xo', 'zo', 'Ao', 'wo', 'yo', 'Bo', 'Do', 'Fo', 'Go', 'Co', 'Eo', 'Ho', 'Jo', 'Ko', 'Lo', 'Mo', 'No', 'Oo', 'Po', 'Ro', 'Wo', 'Uo', 'To', 'Vo', 'So', 'Xo', 'Yo', 'fp', 'ap', 'bp', 'gp', 'cp', 'dp', '$o', 'mp', 'ud', 'op', 'pp', 'np', 'En', 'ip', 'hp', 'rp', 'jg', 'qp', 'Zo', 'sp', 'Jp', 'Ap', 'vp', 'Kp', 'Fp', 'Dp'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Remove search/filter/text analysis overlays and debug panes
      setInterval(() => {
        // Remove debug notification overlays and search/filter panes
        const debugPaneIds = [
          'dld-notification', 'dld-debug-pane', 'dld-image-debug', 'dld-video-debug', 'dld-debug-text', 'dld-bad-frames-area', 'dld-search-pane', 'dld-filter-pane', 'dld-text-analysis-pane', 'dld-youtube-pane'
        ];
        debugPaneIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.remove();
        });
        // Remove any divs or overlays with debug/search/filter/text analysis content
        document.querySelectorAll('div,canvas,iframe').forEach(el => {
          if (el.innerText && (
            el.innerText.includes('Debug text') ||
            el.innerText.includes('Bad frames:') ||
            el.innerText.includes('show image importance') ||
            el.innerText.includes('Document loading') ||
            el.innerText.includes('TA disabled') ||
            el.innerText.includes('Get text') ||
            el.innerText.includes('Analyze')
          )) {
            el.style.display = 'none';
          }
        });
      }, 500);
      // --- END: Block Deledao Search, Filter, YouTube, and Text Analysis Features ---

      // --- BEGIN: Block Deledao Monitoring, Screen Sharing, Auth, and Content Monitoring Features ---
      [
        'hn', 'jn', 'kn', 'ln', 'dl', 'pn', 'on', 'mn', 'nn', 'qn', 'Cn', 'In', 'Kn', 'Gn', 'Hn', 'Nn', 'On', 'Vn', 'eo', 'fo', 'go', 'io', 'ko', 'mo', 'no', 'so', 'qo', 'ro'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Remove overlays and UI elements for login, unblock, screen share, etc.
      setInterval(() => {
        const extraOverlayIds = [
          'unblockform', 'unblockformctl', 'custSignInButton', 'comboazure', 'combogsuite', 'combocancel', 'nouser', 'signinform', 'passblock', 'signin', 'selectName', 'username', 'password', 'forgotpass', 'errorMsg', 'errorMsg2', 'errorMsg3', 'errorMsg4', 'status', 'msg', 'dld-screenshare-pane', 'dld-auth-pane', 'dld-unblock-pane', 'dld-login-pane'
        ];
        extraOverlayIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      }, 500);
      // Block chrome.tabs.captureVisibleTab and getUserMedia
      if (window.chrome && window.chrome.tabs) {
        window.chrome.tabs.captureVisibleTab = function() {
          throw new Error('[Anti-Deledao] Blocked captureVisibleTab');
        };
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = function() {
          throw new Error('[Anti-Deledao] Blocked getUserMedia');
        };
      }
      // Reinforce blocking of Z, Ta, Ua, and message passing
      window.Z = function() { console.log('[Anti-Deledao] Blocked Z() call', arguments); };
      window.Ta = window.Ua = { addListener: function() {}, sendMessage: function() {} };
      // --- END: Block Deledao Monitoring, Screen Sharing, Auth, and Content Monitoring Features ---

      // --- BEGIN: Block Deledao Teacher/Classroom, Tab Lockdown, and Screen Sharing Features ---
      [
        'Ul', 'Ql', 'Dm', 'Em', 'Wm', 'Ym', 'fn', 'gn', 'bn', '$m', 'cl', 'dm', 'Vm', 'cn', 'Xm', 'Jm', 'dn', 'Im', 'Fm', 'Lm', 'an', 'en', 'Um', 'Km', 'Rm', 'Tm', 'Qm', 'Pm', 'Sm', 'Mm', 'Nm', 'Gm', 'em', 'vm'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Remove overlays and notification UI elements for lockdown, annotation, teacher/classroom actions
      setInterval(() => {
        const teacherOverlayIds = [
          'teacherLockdownBanner', 'teacherNotification', 'teacherAnnotationOverlay', 'teacherClassroomOverlay', 'teacherTabLimitBanner', 'teacherScreenShareOverlay', 'teacherStatus', 'teacherMessage', 'teacherUnblock', 'teacherTabs', 'teacherControl', 'teacherView', 'teacherAdmin', 'teacherPopup', 'teacherModal', 'teacherRtcStats', 'teacherConnection', 'teacherClassDisconnected', 'teacherClassConnected', 'teacherClassName', 'teacherClassMode', 'teacherClassLb', 'teacherClassR', 'teacherClassEvent', 'teacherClassError', 'teacherClassInfo', 'teacherClassWarning', 'teacherClassSuccess', 'teacherClassFail', 'teacherClassBlocked', 'teacherClassUnblocked', 'teacherClassTab', 'teacherClassTabLimit', 'teacherClassTabClosed', 'teacherClassTabRestored', 'teacherClassTabCreated', 'teacherClassTabRemoved', 'teacherClassTabUpdated', 'teacherClassTabReplaced', 'teacherClassTabActivated', 'teacherClassTabDeactivated', 'teacherClassTabLocked', 'teacherClassTabUnlocked', 'teacherClassTabLockdown', 'teacherClassTabUnlock', 'teacherClassTabLock', 'teacherClassTabUnlock', 'teacherClassTabLockdownBanner', 'teacherClassTabUnlockBanner', 'teacherClassTabLockdownOverlay', 'teacherClassTabUnlockOverlay', 'teacherClassTabLockdownModal', 'teacherClassTabUnlockModal', 'teacherClassTabLockdownPopup', 'teacherClassTabUnlockPopup', 'teacherClassTabLockdownNotification', 'teacherClassTabUnlockNotification', 'teacherClassTabLockdownStatus', 'teacherClassTabUnlockStatus', 'teacherClassTabLockdownMessage', 'teacherClassTabUnlockMessage', 'teacherClassTabLockdownInfo', 'teacherClassTabUnlockInfo', 'teacherClassTabLockdownWarning', 'teacherClassTabUnlockWarning', 'teacherClassTabLockdownSuccess', 'teacherClassTabUnlockSuccess', 'teacherClassTabLockdownFail', 'teacherClassTabUnlockFail', 'teacherClassTabLockdownBlocked', 'teacherClassTabUnlockBlocked', 'teacherClassTabLockdownUnblocked', 'teacherClassTabUnlockUnblocked'
        ];
        teacherOverlayIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      }, 500);
      // Override Chrome extension tab/window/notification APIs
      if (window.chrome && window.chrome.tabs) {
        ['query', 'sendMessage', 'remove', 'update', 'create'].forEach(fn => {
          window.chrome.tabs[fn] = function() {
            throw new Error('[Anti-Deledao] Blocked chrome.tabs.' + fn);
          };
        });
      }
      if (window.chrome && window.chrome.windows) {
        ['update', 'create'].forEach(fn => {
          window.chrome.windows[fn] = function() {
            throw new Error('[Anti-Deledao] Blocked chrome.windows.' + fn);
          };
        });
      }
      if (window.chrome && window.chrome.notifications) {
        window.chrome.notifications.create = function() {
          throw new Error('[Anti-Deledao] Blocked chrome.notifications.create');
        };
      }
      // --- END: Block Deledao Teacher/Classroom, Tab Lockdown, and Screen Sharing Features ---

      // --- BEGIN: Block Deledao Backend, Extension, and Classroom Management Features ---
      [
        'bl', 'll', 'al', 'hl', 'il', 'fl', 'gl', 'kl', 'Al', 'Cl', 'Dl', 'El', 'Fl', 'Gl', 'Jl', 'Ml', 'Nl', 'Ol', 'Pl', 'Sl', 'Wl', 'el', 'hm', 'Vl', 'Zl', 'am', 'bm', 'sm', 'S', 'Yb', 'Nb', 'Db', 'Mb', 'Zb', 'ak', 'ek', 'uk', 'Mk', 'Zk', 'Qc', 'Yc', 'Fb', 'Ib'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Remove overlays and notification UI elements for extension, chat, unblock, bandwidth, etc.
      setInterval(() => {
        const backendOverlayIds = [
          'extensionBanner', 'extensionNotification', 'extensionChat', 'extensionUnblock', 'extensionBandwidth', 'extensionStats', 'extensionConsole', 'extensionPopup', 'extensionModal', 'extensionStorage', 'extensionWebRequest', 'extensionCookies', 'extensionTabs', 'extensionWindows', 'extensionPolicy', 'extensionClassroom', 'extensionRTC', 'extensionObf', 'extensionProxy', 'extensionChannel', 'extensionHistory', 'extensionDebug', 'extensionError', 'extensionWarning', 'extensionInfo', 'extensionSuccess', 'extensionFail', 'extensionBlocked', 'extensionUnblocked', 'extensionTab', 'extensionTabLimit', 'extensionTabClosed', 'extensionTabRestored', 'extensionTabCreated', 'extensionTabRemoved', 'extensionTabUpdated', 'extensionTabReplaced', 'extensionTabActivated', 'extensionTabDeactivated', 'extensionTabLocked', 'extensionTabUnlocked', 'extensionTabLockdown', 'extensionTabUnlock', 'extensionTabLock', 'extensionTabUnlock', 'extensionTabLockdownBanner', 'extensionTabUnlockBanner', 'extensionTabLockdownOverlay', 'extensionTabUnlockOverlay', 'extensionTabLockdownModal', 'extensionTabUnlockModal', 'extensionTabLockdownPopup', 'extensionTabUnlockPopup', 'extensionTabLockdownNotification', 'extensionTabUnlockNotification', 'extensionTabLockdownStatus', 'extensionTabUnlockStatus', 'extensionTabLockdownMessage', 'extensionTabUnlockMessage', 'extensionTabLockdownInfo', 'extensionTabUnlockInfo', 'extensionTabLockdownWarning', 'extensionTabUnlockWarning', 'extensionTabLockdownSuccess', 'extensionTabUnlockSuccess', 'extensionTabLockdownFail', 'extensionTabUnlockFail', 'extensionTabLockdownBlocked', 'extensionTabUnlockBlocked', 'extensionTabLockdownUnblocked', 'extensionTabUnlockUnblocked'
        ];
        backendOverlayIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      }, 500);
      // Override Chrome extension APIs for webRequest, cookies, storage, and other extension features
      if (window.chrome && window.chrome.webRequest) {
        ['onBeforeRequest', 'onBeforeSendHeaders', 'onHeadersReceived', 'onBeforeRedirect', 'addListener', 'removeListener'].forEach(fn => {
          if (window.chrome.webRequest[fn]) {
            window.chrome.webRequest[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked chrome.webRequest.' + fn);
            };
          }
        });
      }
      if (window.chrome && window.chrome.cookies) {
        ['get', 'getAll', 'set', 'remove', 'onChanged', 'addListener', 'removeListener'].forEach(fn => {
          if (window.chrome.cookies[fn]) {
            window.chrome.cookies[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked chrome.cookies.' + fn);
            };
          }
        });
      }
      if (window.chrome && window.chrome.storage) {
        ['local', 'sync', 'managed'].forEach(area => {
          if (window.chrome.storage[area]) {
            ['get', 'set', 'remove', 'clear'].forEach(fn => {
              if (window.chrome.storage[area][fn]) {
                window.chrome.storage[area][fn] = function() {
                  throw new Error('[Anti-Deledao] Blocked chrome.storage.' + area + '.' + fn);
                };
              }
            });
          }
        });
      }
      // --- END: Block Deledao Backend, Extension, and Classroom Management Features ---

      // --- BEGIN: Block Deledao Proxy, Backend, Storage, and Messaging Features ---
      [
        'ck', 'bk', 'ek', 'gk', 'ik', 'qk', 'uk', 'rk', 'Mk', 'Pk', 'Ok', 'Fk', 'zk', 'sk', 'wk', 'vk', 'hk', 'xk', 'yk', 'Bk', 'Ak', 'Nk', 'Tk', 'Rk'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Remove overlays and notification UI elements for proxy, backend, storage, messaging, etc.
      setInterval(() => {
        const proxyOverlayIds = [
          'proxyBanner', 'proxyNotification', 'proxyChat', 'proxyUnblock', 'proxyBandwidth', 'proxyStats', 'proxyConsole', 'proxyPopup', 'proxyModal', 'proxyStorage', 'proxyWebRequest', 'proxyCookies', 'proxyTabs', 'proxyWindows', 'proxyPolicy', 'proxyClassroom', 'proxyRTC', 'proxyObf', 'proxyProxy', 'proxyChannel', 'proxyHistory', 'proxyDebug', 'proxyError', 'proxyWarning', 'proxyInfo', 'proxySuccess', 'proxyFail', 'proxyBlocked', 'proxyUnblocked', 'proxyTab', 'proxyTabLimit', 'proxyTabClosed', 'proxyTabRestored', 'proxyTabCreated', 'proxyTabRemoved', 'proxyTabUpdated', 'proxyTabReplaced', 'proxyTabActivated', 'proxyTabDeactivated', 'proxyTabLocked', 'proxyTabUnlocked', 'proxyTabLockdown', 'proxyTabUnlock', 'proxyTabLock', 'proxyTabUnlock', 'proxyTabLockdownBanner', 'proxyTabUnlockBanner', 'proxyTabLockdownOverlay', 'proxyTabUnlockOverlay', 'proxyTabLockdownModal', 'proxyTabUnlockModal', 'proxyTabLockdownPopup', 'proxyTabUnlockPopup', 'proxyTabLockdownNotification', 'proxyTabUnlockNotification', 'proxyTabLockdownStatus', 'proxyTabUnlockStatus', 'proxyTabLockdownMessage', 'proxyTabUnlockMessage', 'proxyTabLockdownInfo', 'proxyTabUnlockInfo', 'proxyTabLockdownWarning', 'proxyTabUnlockWarning', 'proxyTabLockdownSuccess', 'proxyTabUnlockSuccess', 'proxyTabLockdownFail', 'proxyTabUnlockFail', 'proxyTabLockdownBlocked', 'proxyTabUnlockBlocked', 'proxyTabLockdownUnblocked', 'proxyTabUnlockUnblocked'
        ];
        proxyOverlayIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      }, 500);
      // Override Chrome extension APIs for storage, cookies, webRequest, and messaging
      if (window.chrome && window.chrome.runtime) {
        ['sendMessage', 'onMessage', 'addListener', 'removeListener', 'requestUpdateCheck', 'reload', 'getManifest'].forEach(fn => {
          if (window.chrome.runtime[fn]) {
            window.chrome.runtime[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked chrome.runtime.' + fn);
            };
          }
        });
      }
      // --- END: Block Deledao Proxy, Backend, Storage, and Messaging Features ---

      console.log('[Anti-Deledao] Full neutralization complete including popup education script.');

      // --- BEGIN: Deledao Watchdog ---
      const deledaoWatchdogPatterns = [
        /dld/i, /deledao/i, /classroom/i, /monitor/i, /auth/i, /spy/i, /block/i, /filter/i, /policy/i, /cloud/i, /proxy/i, /tab/i, /lock/i, /screen/i, /share/i, /rtc/i, /notify/i, /debug/i, /bully/i, /video/i, /image/i, /chat/i, /game/i, /teacher/i, /student/i, /parent/i, /admin/i, /extension/i, /backend/i, /storage/i, /cookie/i, /ad/i, /track/i, /x509/i, /kjur/i, /jsrsasign/i
      ];
      const deledaoWatchdog = () => {
        // 1. Scan for suspicious globals
        Object.getOwnPropertyNames(window).forEach(name => {
          if (typeof window[name] === 'function' || typeof window[name] === 'object') {
            if (deledaoWatchdogPatterns.some(pat => pat.test(name))) {
              try {
                Object.defineProperty(window, name, {
                  value: undefined,
                  configurable: false,
                  writable: false
                });
                console.warn('[Anti-Deledao Watchdog] Neutralized global:', name);
              } catch (e) {}
            }
          }
        });
        // 2. Scan for suspicious scripts
        document.querySelectorAll('script[src]').forEach(s => {
          if (deledaoWatchdogPatterns.some(pat => pat.test(s.src))) {
            s.remove();
            console.warn('[Anti-Deledao Watchdog] Removed script:', s.src);
          }
        });
        // 3. Scan for suspicious overlays/divs/iframes
        document.querySelectorAll('div,iframe').forEach(el => {
          if (el.id && deledaoWatchdogPatterns.some(pat => pat.test(el.id))) {
            el.remove();
            console.warn('[Anti-Deledao Watchdog] Removed overlay/div/iframe:', el.id);
          } else if (el.className && deledaoWatchdogPatterns.some(pat => pat.test(el.className))) {
            el.remove();
            console.warn('[Anti-Deledao Watchdog] Removed overlay/div/iframe (class):', el.className);
          } else if (el.innerText && deledaoWatchdogPatterns.some(pat => pat.test(el.innerText))) {
            el.style.display = 'none';
            console.warn('[Anti-Deledao Watchdog] Hid overlay/div/iframe (text):', el.innerText.slice(0, 100));
          }
        });
        // 4. Scan for suspicious iframes by src
        document.querySelectorAll('iframe[src]').forEach(iframe => {
          if (deledaoWatchdogPatterns.some(pat => pat.test(iframe.src))) {
            iframe.remove();
            console.warn('[Anti-Deledao Watchdog] Removed iframe:', iframe.src);
          }
        });
      };
      setInterval(deledaoWatchdog, 300);
      // --- END: Deledao Watchdog ---

      // --- BEGIN: Block additional Deledao functions/classes (manual additions) ---
      [
        'Jf','Kf','Cf','Lf','Mf','Nf','Of','Pf','Qf','Rf','Df','Bf','Sf','Tf','Uf','Vf','Yf','Zf','eg','fg','gg','hg','ig','jg','kg','lg','mg','ng','og','pg','qg','rg','sg','tg','ug','vg','wg','xg','yg','zg','Ag','Bg','Cg','Dg','Eg','Fg','Gg','Hg','Kg','Qg','Sg','Vg','Ug','Wg','Xg','Yg','Zg','ah','bh','ch','dh','eh','fh','gh','hh','ih','jh','kh','lh','mh','nh','oh','ph','qh','rh','sh','th','uh','vh','wh','xh','Dh','Fh','Gh','Hh','Ih','Jh','Kh','Lh','Mh','Nh','Oh','Ph','Qh','Rh','Sh','Th','Uh','Vh','Wh','Xh','Yh','Zh','$h','ai','bi','ci','di','ei','fi','gi','hi','ii','ji','ki','li','mi','ni','oi','pi','qi','ri','si','ti','ui','vi','wi','xi','yi','zi','Ci','Di','Ei','Fi','Gi','Hi','Ii','Ji','Ki','Li','Mi','Ni','Oi','Pi','Qi','Ri','Si','Ti','Ui','Vi','Wi','Xi','Yi','Zi'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // --- END: Block additional Deledao functions/classes (manual additions) ---

      // Add to watchdog global neutralization
      const extraDeledaoNames = [
        'Jf','Kf','Cf','Lf','Mf','Nf','Of','Pf','Qf','Rf','Df','Bf','Sf','Tf','Uf','Vf','Yf','Zf','eg','fg','gg','hg','ig','jg','kg','lg','mg','ng','og','pg','qg','rg','sg','tg','ug','vg','wg','xg','yg','zg','Ag','Bg','Cg','Dg','Eg','Fg','Gg','Hg','Kg','Qg','Sg','Vg','Ug','Wg','Xg','Yg','Zg','ah','bh','ch','dh','eh','fh','gh','hh','ih','jh','kh','lh','mh','nh','oh','ph','qh','rh','sh','th','uh','vh','wh','xh','Dh','Fh','Gh','Hh','Ih','Jh','Kh','Lh','Mh','Nh','Oh','Ph','Qh','Rh','Sh','Th','Uh','Vh','Wh','Xh','Yh','Zh','$h','ai','bi','ci','di','ei','fi','gi','hi','ii','ji','ki','li','mi','ni','oi','pi','qi','ri','si','ti','ui','vi','wi','xi','yi','zi','Ci','Di','Ei','Fi','Gi','Hi','Ii','Ji','Ki','Li','Mi','Ni','Oi','Pi','Qi','Ri','Si','Ti','Ui','Vi','Wi','Xi','Yi','Zi'
      ];
      const oldWatchdog = deledaoWatchdog;
      const newWatchdog = () => {
        oldWatchdog();
        extraDeledaoNames.forEach(name => {
          if (typeof window[name] === 'function' || typeof window[name] === 'object') {
            try {
              Object.defineProperty(window, name, {
                value: undefined,
                configurable: false,
                writable: false
              });
              console.warn('[Anti-Deledao Watchdog] Neutralized extra global:', name);
            } catch (e) {}
          }
        });
      };
      clearInterval(); // Remove previous watchdog interval if any
      setInterval(newWatchdog, 300);

      // --- BEGIN: Block even more Deledao spy features (manual additions) ---
      [
        'nc','pc','qc','rc','sc','tc','uc','xc','yc','zc','Ac','Bc','Cc','Dc','Ec','Fc','Gc','Hc','Ic','Jc','Kc','Lc','Mc','Nc','Oc','Pc','Qc','Rc','Sc','Tc','Uc','Vc','Wc','Xc','Yc','Zc','dd','fd','gd','id','jd','hd','kd','ld','md','nd','od','pd','qd','rd','sd','td','vd','wd','ud','zd','Cd','Dd','Ed','Fd','Gd','Hd','Id','Jd','Kd','Ld','Md','Nd','Od','Pd','Qd','Rd','Sd','Td','Ud','Vd','Wd','Xd','Yd','Zd','$d','oe','qe','re','se','te','pe','ue','ve','we','xe','ye','Ae','Be','Ce','De','Ee','Fe','Ge','He','Ie','Je','Ke','Le','Me','Ne','Oe','Pe','Qe','Sb','Se','Te','Ue','Ve','We','Xe','Ye','Ze','ie','je','ke','le','me','ne','Af','Bf','Cf','Df','Ef','Ff','Gf','Hf','If','Jf','Kf','Lf','Mf','Nf','Of','Pf','Qf','Rf','Sf','Tf','Uf','Vf','Wf','Xf','Yf','Zf','$f','ag','bg','cg','dg','eg','fg','gg','hg','ig','jg','kg','lg','mg','ng','og','pg','qg','rg','sg','tg','ug','vg','wg','xg','yg','zg','Ag','Bg','Cg','Dg','Eg','Fg','Gg','Hg','Kg','Qg','Sg','Vg','Ug','Wg','Xg','Yg','Zg','ah','bh','ch','dh','eh','fh','gh','hh','ih','jh','kh','lh','mh','nh','oh','ph','qh','rh','sh','th','uh','vh','wh','xh','Dh','Fh','Gh','Hh','Ih','Jh','Kh','Lh','Mh','Nh','Oh','Ph','Qh','Rh','Sh','Th','Uh','Vh','Wh','Xh','Yh','Zh','$h','ai','bi','ci','di','ei','fi','gi','hi','ii','ji','ki','li','mi','ni','oi','pi','qi','ri','si','ti','ui','vi','wi','xi','yi','zi','Ci','Di','Ei','Fi','Gi','Hi','Ii','Ji','Ki','Li','Mi','Ni','Oi','Pi','Qi','Ri','Si','Ti','Ui','Vi','Wi','Xi','Yi','Zi'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Add to watchdog global neutralization
      const evenMoreDeledaoNames = [
        'nc','pc','qc','rc','sc','tc','uc','xc','yc','zc','Ac','Bc','Cc','Dc','Ec','Fc','Gc','Hc','Ic','Jc','Kc','Lc','Mc','Nc','Oc','Pc','Qc','Rc','Sc','Tc','Uc','Vc','Wc','Xc','Yc','Zc','dd','fd','gd','id','jd','hd','kd','ld','md','nd','od','pd','qd','rd','sd','td','vd','wd','ud','zd','Cd','Dd','Ed','Fd','Gd','Hd','Id','Jd','Kd','Ld','Md','Nd','Od','Pd','Qd','Rd','Sd','Td','Ud','Vd','Wd','Xd','Yd','Zd','$d','oe','qe','re','se','te','pe','ue','ve','we','xe','ye','Ae','Be','Ce','De','Ee','Fe','Ge','He','Ie','Je','Ke','Le','Me','Ne','Oe','Pe','Qe','Sb','Se','Te','Ue','Ve','We','Xe','Ye','Ze','ie','je','ke','le','me','ne','Af','Bf','Cf','Df','Ef','Ff','Gf','Hf','If','Jf','Kf','Lf','Mf','Nf','Of','Pf','Qf','Rf','Sf','Tf','Uf','Vf','Wf','Xf','Yf','Zf','$f','ag','bg','cg','dg','eg','fg','gg','hg','ig','jg','kg','lg','mg','ng','og','pg','qg','rg','sg','tg','ug','vg','wg','xg','yg','zg','Ag','Bg','Cg','Dg','Eg','Fg','Gg','Hg','Kg','Qg','Sg','Vg','Ug','Wg','Xg','Yg','Zg','ah','bh','ch','dh','eh','fh','gh','hh','ih','jh','kh','lh','mh','nh','oh','ph','qh','rh','sh','th','uh','vh','wh','xh','Dh','Fh','Gh','Hh','Ih','Jh','Kh','Lh','Mh','Nh','Oh','Ph','Qh','Rh','Sh','Th','Uh','Vh','Wh','Xh','Yh','Zh','$h','ai','bi','ci','di','ei','fi','gi','hi','ii','ji','ki','li','mi','ni','oi','pi','qi','ri','si','ti','ui','vi','wi','xi','yi','zi','Ci','Di','Ei','Fi','Gi','Hi','Ii','Ji','Ki','Li','Mi','Ni','Oi','Pi','Qi','Ri','Si','Ti','Ui','Vi','Wi','Xi','Yi','Zi'
      ];
      const oldWatchdog2 = typeof newWatchdog !== 'undefined' ? newWatchdog : (typeof deledaoWatchdog !== 'undefined' ? deledaoWatchdog : () => {});
      const superWatchdog = () => {
        oldWatchdog2();
        evenMoreDeledaoNames.forEach(name => {
          if (typeof window[name] === 'function' || typeof window[name] === 'object') {
            try {
              Object.defineProperty(window, name, {
                value: undefined,
                configurable: false,
                writable: false
              });
              console.warn('[Anti-Deledao Watchdog] Neutralized even more global:', name);
            } catch (e) {}
          }
        });
      };
      setInterval(superWatchdog, 300);
      // --- END: Block even more Deledao spy features (manual additions) ---

      // --- BEGIN: Block core.min.js utility, obfuscator, and polyfill functions/classes (manual additions) ---
      [
        'ba','t','ca','da','ea','fa','ia','ja','ka','oa','pa','qa','ra','x','sa','ta','ua','y','A','C','F','H','va','wa','ya','Aa','Ba','Ca','Fa','Ga','J','Ha','Ia','Ja','Ka','Ma','Na','Oa','Pa','Qa','Ra','Ta','S','U','Xa','Ya','Za','$a','ab','bb','cb','eb','fb','gb','hb','ib','jb','kb','lb','mb','nb','ob','pb','qb','rb','sb','tb','ub','vb','wb','xb','yb','zb','Ab','Bb','Cb','Db','Eb','Fb','Gb','Hb','Ib','Jb','Kb','Lb','Mb','Nb','Ob','Pb','Qb','Rb','Ub','Vb','Wb','Xb','Yb','Zb','$b','ac','bc','cc','dc','ec','fc','gc','hc','ic','jc','kc','lc','mc'
      ].forEach(name => {
        try {
          window[name] = function() {
            throw new Error('[Anti-Deledao] Blocked ' + name + ' constructor/function');
          };
          if (window[name].prototype) {
            Object.getOwnPropertyNames(window[name].prototype).forEach(fn => {
              window[name].prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ' + name + '.' + fn);
              };
            });
          }
        } catch (e) {}
      });
      // Add to watchdog global neutralization
      const coreMinNames = [
        'ba','t','ca','da','ea','fa','ia','ja','ka','oa','pa','qa','ra','x','sa','ta','ua','y','A','C','F','H','va','wa','ya','Aa','Ba','Ca','Fa','Ga','J','Ha','Ia','Ja','Ka','Ma','Na','Oa','Pa','Qa','Ra','Ta','S','U','Xa','Ya','Za','$a','ab','bb','cb','eb','fb','gb','hb','ib','jb','kb','lb','mb','nb','ob','pb','qb','rb','sb','tb','ub','vb','wb','xb','yb','zb','Ab','Bb','Cb','Db','Eb','Fb','Gb','Hb','Ib','Jb','Kb','Lb','Mb','Nb','Ob','Pb','Qb','Rb','Ub','Vb','Wb','Xb','Yb','Zb','$b','ac','bc','cc','dc','ec','fc','gc','hc','ic','jc','kc','lc','mc'
      ];
      const oldSuperWatchdog = typeof superWatchdog !== 'undefined' ? superWatchdog : (typeof newWatchdog !== 'undefined' ? newWatchdog : (typeof deledaoWatchdog !== 'undefined' ? deledaoWatchdog : () => {}));
      const ultraWatchdog = () => {
        oldSuperWatchdog();
        coreMinNames.forEach(name => {
          if (typeof window[name] === 'function' || typeof window[name] === 'object') {
            try {
              Object.defineProperty(window, name, {
                value: undefined,
                configurable: false,
                writable: false
              });
              console.warn('[Anti-Deledao Watchdog] Neutralized core.min.js global:', name);
            } catch (e) {}
          }
        });
      };
      setInterval(ultraWatchdog, 300);
      // --- END: Block core.min.js utility, obfuscator, and polyfill functions/classes (manual additions) ---

      // --- BEGIN: Block Deledao cryptographic libraries and methods ---
      const cryptoGlobals = [
        'KJUR', 'jsrsasign', 'ASN1HEX', 'KEYUTIL', 'X509', 'RSAKey',
        'KJUR_jws', 'KJUR_crypto', 'KJUR_asn1', 'KJUR_asn1_x509',
        'KJUR_asn1_ASN1Util', 'KJUR_crypto_Util', 'KJUR_crypto_Signature',
        'KJUR_crypto_Mac', 'KJUR_crypto_ECDSA', 'KJUR_jws_JWS', 'KJUR_jws_IntDate'
      ];
      cryptoGlobals.forEach(name => {
        try {
          Object.defineProperty(window, name, {
            value: undefined,
            configurable: false,
            writable: false
          });
        } catch (e) {}
      });
      // Defensive override for KJUR and sub-namespaces
      if (typeof window.KJUR !== 'undefined') {
        [
          'jws', 'crypto', 'asn1', 'asn1.x509', 'asn1.ASN1Util',
          'crypto.Util', 'crypto.Signature', 'crypto.Mac', 'crypto.ECDSA'
        ].forEach(sub => {
          try {
            window.KJUR[sub] = undefined;
          } catch (e) {}
        });
      }
      // Block/override RSAKey and X509 prototypes
      if (typeof window.RSAKey !== 'undefined') {
        try {
          Object.getOwnPropertyNames(window.RSAKey.prototype).forEach(fn => {
            window.RSAKey.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked RSAKey.' + fn);
            };
          });
        } catch (e) {}
      }
      if (typeof window.X509 !== 'undefined') {
        try {
          Object.getOwnPropertyNames(window.X509.prototype).forEach(fn => {
            window.X509.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked X509.' + fn);
            };
          });
        } catch (e) {}
      }
      // Block JWS/JWT verification methods
      try {
        if (window.KJUR && window.KJUR.jws && window.KJUR.jws.JWS) {
          window.KJUR.jws.JWS.verify = function() { return false; };
          window.KJUR.jws.JWS.verifyJWT = function() { return false; };
        }
      } catch (e) {}
      // Watchdog for dynamic crypto object injection
      const cryptoWatchdogNames = [
        'KJUR', 'jsrsasign', 'ASN1HEX', 'KEYUTIL', 'X509', 'RSAKey'
      ];
      setInterval(() => {
        cryptoWatchdogNames.forEach(name => {
          if (typeof window[name] !== 'undefined') {
            try {
              Object.defineProperty(window, name, {
                value: undefined,
                configurable: false,
                writable: false
              });
              console.warn('[Anti-Deledao Watchdog] Neutralized crypto global:', name);
            } catch (e) {}
          }
        });
        // Defensive override for JWS/JWT verify
        try {
          if (window.KJUR && window.KJUR.jws && window.KJUR.jws.JWS) {
            window.KJUR.jws.JWS.verify = function() { return false; };
            window.KJUR.jws.JWS.verifyJWT = function() { return false; };
          }
        } catch (e) {}
      }, 300);
      // --- END: Block Deledao cryptographic libraries and methods ---

      // --- BEGIN: Block KJUR.crypto.Util, MessageDigest, Mac, Signature, Cipher, OID, ECDSA assignments ---
      setInterval(() => {
        try {
          if (window.KJUR && window.KJUR.crypto) {
            [
              'Util', 'MessageDigest', 'Mac', 'Signature', 'Cipher', 'OID', 'ECDSA'
            ].forEach(name => {
              if (window.KJUR.crypto[name]) {
                window.KJUR.crypto[name] = undefined;
              }
            });
          }
        } catch (e) {}
      }, 300);
      // --- END: Block KJUR.crypto.Util, MessageDigest, Mac, Signature, Cipher, OID, ECDSA assignments ---

      // --- BEGIN: Block KJUR.asn1 and submodules (tsp, cades, csr, ocsp, lang) assignments ---
      setInterval(() => {
        try {
          if (window.KJUR) {
            if (window.KJUR.asn1) {
              ['tsp', 'cades', 'csr', 'ocsp', 'lang'].forEach(sub => {
                if (window.KJUR.asn1[sub]) {
                  window.KJUR.asn1[sub] = undefined;
                }
              });
            }
          }
        } catch (e) {}
      }, 300);
      // --- END: Block KJUR.asn1 and submodules (tsp, cades, csr, ocsp, lang) assignments ---

      // --- BEGIN: Block ASN1HEX and its methods assignments ---
      setInterval(() => {
        try {
          if (window.ASN1HEX) {
            window.ASN1HEX = undefined;
          }
        } catch (e) {}
      }, 300);
      // --- END: Block ASN1HEX and its methods assignments ---

      setInterval(() => {
        try {
          if (window.ECFieldElementFp && window.ECFieldElementFp.prototype) {
            ['getByteLength'].forEach(fn => {
              window.ECFieldElementFp.prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ECFieldElementFp.' + fn);
              };
            });
          }
          if (window.ECPointFp && window.ECPointFp.prototype) {
            [
              'getEncoded', 'add2D', 'twice2D', 'multiply2D', 'isOnCurve', 'toString', 'validate'
            ].forEach(fn => {
              window.ECPointFp.prototype[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ECPointFp.' + fn);
              };
            });
          }
          if (window.ECPointFp) {
            ['decodeFrom', 'decodeFromHex'].forEach(fn => {
              window.ECPointFp[fn] = function() {
                throw new Error('[Anti-Deledao] Blocked ECPointFp.' + fn);
              };
            });
          }
        } catch (e) {}
      }, 300);

      // --- BEGIN: Block CryptoJS, JSBN, and all related cryptographic primitives ---
      setInterval(() => {
        [
          'CryptoJS', 'BigInteger', 'SecureRandom', 'RSAKey', 'ECFieldElementFp', 'ECPointFp', 'ECCurveFp',
          'b64map', 'b64pad', 'Arcfour', 'rng_state', 'rng_pool', 'rng_pptr', 'parseBigInt'
        ].forEach(name => {
          try {
            Object.defineProperty(window, name, {
              value: undefined,
              configurable: false,
              writable: false
            });
          } catch (e) {}
        });
        // Block CryptoJS hash/HMAC helpers
        if (window.CryptoJS) {
          [
            'MD5', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512', 'RIPEMD160',
            'HmacMD5', 'HmacSHA1', 'HmacSHA224', 'HmacSHA256', 'HmacSHA384', 'HmacSHA512', 'HmacRIPEMD160',
            'PBKDF2', 'algo', 'lib', 'enc', 'mode', 'pad', 'format', 'x64'
          ].forEach(fn => {
            window.CryptoJS[fn] = undefined;
          });
        }
        // Block SecureRandom prototype
        if (window.SecureRandom && window.SecureRandom.prototype) {
          Object.getOwnPropertyNames(window.SecureRandom.prototype).forEach(fn => {
            window.SecureRandom.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked SecureRandom.' + fn);
            };
          });
        }
        // Block BigInteger prototype
        if (window.BigInteger && window.BigInteger.prototype) {
          Object.getOwnPropertyNames(window.BigInteger.prototype).forEach(fn => {
            window.BigInteger.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked BigInteger.' + fn);
            };
          });
        }
        // Block RSAKey prototype
        if (window.RSAKey && window.RSAKey.prototype) {
          Object.getOwnPropertyNames(window.RSAKey.prototype).forEach(fn => {
            window.RSAKey.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked RSAKey.' + fn);
            };
          });
        }
        // Block ECFieldElementFp prototype
        if (window.ECFieldElementFp && window.ECFieldElementFp.prototype) {
          Object.getOwnPropertyNames(window.ECFieldElementFp.prototype).forEach(fn => {
            window.ECFieldElementFp.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked ECFieldElementFp.' + fn);
            };
          });
        }
        // Block ECPointFp prototype and static methods
        if (window.ECPointFp && window.ECPointFp.prototype) {
          Object.getOwnPropertyNames(window.ECPointFp.prototype).forEach(fn => {
            window.ECPointFp.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked ECPointFp.' + fn);
            };
          });
        }
        if (window.ECPointFp) {
          ['decodeFrom', 'decodeFromHex'].forEach(fn => {
            window.ECPointFp[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked ECPointFp.' + fn);
            };
          });
        }
        // Block ECCurveFp prototype
        if (window.ECCurveFp && window.ECCurveFp.prototype) {
          Object.getOwnPropertyNames(window.ECCurveFp.prototype).forEach(fn => {
            window.ECCurveFp.prototype[fn] = function() {
              throw new Error('[Anti-Deledao] Blocked ECCurveFp.' + fn);
            };
          });
        }
      }, 300);
      // --- END: Block CryptoJS, JSBN, and all related cryptographic primitives ---

      // --- Block extra spyware scripts by src ---
      const extraPatterns = /tf\.min\.js|jsrsasign|cryptojs|yahoo|stringSimilarity|aes|tripledes|enc-base64/i;
      document.querySelectorAll('script[src]').forEach(function(s) {
        if (extraPatterns.test(s.src)) s.remove();
      });
      const extraScriptObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.tagName === 'SCRIPT' && extraPatterns.test(n.src || '')) n.remove();
          });
        });
      });
      extraScriptObserver.observe(document.documentElement, { childList: true, subtree: true });

      // --- Block extra spyware globals ---
      [
        'CryptoJS', 'YAHOO', 'stringSimilarity', 'compareTwoStrings', 'findBestMatch',
        'AES', 'DES', 'TripleDES', 'enc', 'mode', 'pad', 'format', 'algo', 'Base64'
        // ...add any other suspicious or obfuscated names you see
      ].forEach(name => {
        try {
          Object.defineProperty(window, name, {
            value: undefined,
            configurable: false,
            writable: false
          });
        } catch (e) {}
      });

      // --- Extra spyware watchdog ---
      const spywareWatchdogPatterns = [
        /tf(\.min)?\.js/i, /tfjs/i, /tensorflow/i, /microphone/i, /webcam/i, /csv/i,
        // ...existing patterns
      ];
      setInterval(() => {
        Object.getOwnPropertyNames(window).forEach(name => {
          if (spywareWatchdogPatterns.some(pat => pat.test(name))) {
            try {
              Object.defineProperty(window, name, {
                value: undefined,
                configurable: false,
                writable: false
              });
              console.warn('[Anti-Spyware Watchdog] Neutralized global:', name);
            } catch (e) {}
          }
        });
      }, 300);

      // TensorFlow.js data and IO classes
      [
        'Tb', 'Db', 'Ob', 'Gb', 'jb', 'Wb', 'Lb', 'Bb', 'Pb', 'Fb', 'Mb', 'zb', 'Vb', 'Ub', 'qb', 'Hb',
        // Common TensorFlow.js globals
        'tf', 'tfjs', 'TensorFlow', 'Tensor', 'TensorBuffer', 'Variable', 'AdadeltaOptimizer', 'AdagradOptimizer', 'AdamOptimizer', 'AdamaxOptimizer', 'MomentumOptimizer', 'Optimizer', 'RMSPropOptimizer', 'SGDOptimizer',
        // ...add more as needed
      ].forEach(name => {
        try {
          Object.defineProperty(window, name, {
            value: undefined,
            configurable: false,
            writable: false
          });
        } catch (e) {}
      });

      const tfPatterns = /tf(\.min)?\.js|tfjs|tensorflow|microphone|webcam|csv/i;
      document.querySelectorAll('script[src]').forEach(function(s) {
        if (tfPatterns.test(s.src)) s.remove();
      });
      const tfScriptObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.tagName === 'SCRIPT' && tfPatterns.test(n.src || '')) n.remove();
          });
        });
      });
      tfScriptObserver.observe(document.documentElement, { childList: true, subtree: true });
    } catch (err) {
      console.warn('[Anti-Deledao] Error while neutralizing:', err);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', neutralizeDeledao);
  } else {
    neutralizeDeledao();
  }
})();
