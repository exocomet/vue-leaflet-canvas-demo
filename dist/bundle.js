(function (Vue, L) {
  'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  L = L && L.hasOwnProperty('default') ? L['default'] : L;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var { LMap, LTileLayer, LMarker, LPolygon } = Vue2Leaflet;

  // https://stackoverflow.com/a/36481059/417133
  // Standard Normal variate using Box-Muller transform.
  function randn_bm() {
    var u = 0, v = 0;
      while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  var script = {
      components: {
          LMap,
          LTileLayer,
          LMarker
      },
      data() {
          return {
              numRandomMarkers: 100,
              zoom: 8,
              center: {lat: 48.19, lng: 16.3},
              url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
              markers: [],
          }
      },
      beforeCreate: function() {},
      methods: {
          onMapClick: function(event) {
              this.addMarker(event.latlng);
          },
          onMarkerClick: function(index) {
              this.removeMarker(index);
          },
          addMarker: function(obj) {
              let newMarker = {
                  id: null,
                  position: {lat: obj.lat, lng: obj.lng},
                  draggable: false,
                  visible: true,
              };
              this.markers.push(newMarker);
          },
          removeMarker: function(index) {
              this.markers.splice(index, 1);
          },
          deleteMarkers: function() {
              this.markers = [];
          },
          addRandomMarkers: function() {
              for (let i = 0; i < this.numRandomMarkers; i++) {
                  let pos = {
                      lat: 47 + randn_bm(),
                      lng: 16 + randn_bm(),
                  };
                  this.addMarker(pos);
              }
          }
      }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "app-map" } }, [
      _c("div", { attrs: { id: "controls" } }, [
        _c("div", [
          _c("button", { on: { click: _vm.deleteMarkers } }, [
            _vm._v("Delete Markers")
          ])
        ]),
        _vm._v(" "),
        _c("div", [
          _c("button", { on: { click: _vm.addRandomMarkers } }, [
            _vm._v("Add Random Markers")
          ]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.numRandomMarkers,
                expression: "numRandomMarkers"
              }
            ],
            domProps: { value: _vm.numRandomMarkers },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.numRandomMarkers = $event.target.value;
              }
            }
          })
        ])
      ]),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { id: "map" } },
        [
          _c(
            "l-map",
            {
              attrs: { zoom: _vm.zoom, center: _vm.center },
              on: { click: _vm.onMapClick }
            },
            [
              _c("l-tile-layer", {
                attrs: { url: _vm.url, attribution: _vm.attribution }
              }),
              _vm._v(" "),
              _vm._l(_vm.markers, function(marker, index) {
                return _c("l-marker", {
                  key: marker.id,
                  attrs: {
                    visible: marker.visible,
                    draggable: marker.draggable,
                    "lat-lng": marker.position
                  },
                  on: {
                    click: function($event) {
                      return _vm.onMarkerClick(index)
                    }
                  }
                })
              })
            ],
            2
          )
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-b963b55a_0", { source: "\n#app-map[data-v-b963b55a] {\r\n  height: 40%;\r\n  width: 100%;\n}\n#map[data-v-b963b55a] {\r\n  height: 100%;\r\n  /* width: 100%; */\n}\r\n", map: {"version":3,"sources":["C:\\code\\jsplayground\\vue-leaflet-canvas-demo\\src\\App.vue"],"names":[],"mappings":";AA4FA;EACA,WAAA;EACA,WAAA;AACA;AAEA;EACA,YAAA;EACA,iBAAA;AACA","file":"App.vue","sourcesContent":["<template>\r\n  <div id=\"app-map\">\r\n    <div id=\"controls\">\r\n        <div>\r\n          <button @click=\"deleteMarkers\">Delete Markers</button>\r\n        </div>\r\n        <div>\r\n          <button @click=\"addRandomMarkers\">Add Random Markers</button>\r\n          <input v-model=\"numRandomMarkers\">\r\n        </div>\r\n    </div>\r\n    <div id=\"map\">\r\n      <l-map :zoom=\"zoom\" :center=\"center\" @click=\"onMapClick\" >\r\n        <l-tile-layer :url=\"url\" :attribution=\"attribution\"></l-tile-layer>\r\n        <l-marker\r\n            v-for=\"(marker, index) in markers\"\r\n            :key=\"marker.id\"\r\n            :visible=\"marker.visible\"\r\n            :draggable=\"marker.draggable\"\r\n            :lat-lng=\"marker.position\"\r\n            @click=\"onMarkerClick(index)\"\r\n        />\r\n      </l-map>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nvar { LMap, LTileLayer, LMarker, LPolygon } = Vue2Leaflet;\r\n\r\n// https://stackoverflow.com/a/36481059/417133\r\n// Standard Normal variate using Box-Muller transform.\r\nfunction randn_bm() {\r\n  var u = 0, v = 0;\r\n    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)\r\n    while(v === 0) v = Math.random();\r\n    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);\r\n}\r\n\r\nexport default {\r\n    components: {\r\n        LMap,\r\n        LTileLayer,\r\n        LMarker\r\n    },\r\n    data() {\r\n        return {\r\n            numRandomMarkers: 100,\r\n            zoom: 8,\r\n            center: {lat: 48.19, lng: 16.3},\r\n            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',\r\n            attribution: '&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors',\r\n            markers: [],\r\n        }\r\n    },\r\n    beforeCreate: function() {},\r\n    methods: {\r\n        onMapClick: function(event) {\r\n            this.addMarker(event.latlng);\r\n        },\r\n        onMarkerClick: function(index) {\r\n            this.removeMarker(index);\r\n        },\r\n        addMarker: function(obj) {\r\n            let newMarker = {\r\n                id: null,\r\n                position: {lat: obj.lat, lng: obj.lng},\r\n                draggable: false,\r\n                visible: true,\r\n            };\r\n            this.markers.push(newMarker);\r\n        },\r\n        removeMarker: function(index) {\r\n            this.markers.splice(index, 1);\r\n        },\r\n        deleteMarkers: function() {\r\n            this.markers = [];\r\n        },\r\n        addRandomMarkers: function() {\r\n            for (let i = 0; i < this.numRandomMarkers; i++) {\r\n                let pos = {\r\n                    lat: 47 + randn_bm(),\r\n                    lng: 16 + randn_bm(),\r\n                }\r\n                this.addMarker(pos);\r\n            }\r\n        }\r\n    }\r\n};\r\n</script>\r\n\r\n<style scoped>\r\n#app-map {\r\n  height: 40%;\r\n  width: 100%;\r\n}\r\n\r\n#map {\r\n  height: 100%;\r\n  /* width: 100%; */\r\n}\r\n</style>"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-b963b55a";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  var MockLatLng = {
      randn_bm() {
          // mean = 0, variance = 1
          var u = 0, v = 0;
          while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
          while(v === 0) v = Math.random();
          return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      },
      random_coordinates(n, center) {
          let coords = [];
          for (var i = 0; i < n; i += 1) {
              let pos = {
                  lat: center.lat + this.randn_bm(),
                  lng: center.lng + this.randn_bm(),
              };
              coords.push(pos);
          }
          return coords;
      }
  };

  //

  var script$1 = {
      components: {},
      data() {return {}},
      mounted() {
          var canvasRenderer = L.canvas();
          var mymap = L.map(this.$refs['mapElement'], {
              renderer: canvasRenderer,
              // preferCanvas: true,
          });
          let mapCenter = {lat: 48.19, lng: 16.3};
          mymap.setView(mapCenter, 8);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mymap);
          let points = MockLatLng.random_coordinates(1000, mapCenter);
          points.forEach(function (pos, index) {
              L.circleMarker(pos, {
                  renderer: canvasRenderer
              }).addTo(mymap).bindPopup('marker ' + JSON.stringify(pos));
          });
      },
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "app-canvas" } }, [
      _c("div", { ref: "mapElement", attrs: { id: "map-canvas" } })
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-4eea07be_0", { source: "\n#app-canvas[data-v-4eea07be] {\r\n  height: 40%;\r\n  width: 100%;\n}\n#map-canvas[data-v-4eea07be] {\r\n  height: 100%;\n}\r\n", map: {"version":3,"sources":["C:\\code\\jsplayground\\vue-leaflet-canvas-demo\\src\\AppCanvas.vue"],"names":[],"mappings":";AAsCA;EACA,WAAA;EACA,WAAA;AACA;AAEA;EACA,YAAA;AACA","file":"AppCanvas.vue","sourcesContent":["\r\n<template>\r\n  <div id=\"app-canvas\">\r\n    <div id=\"map-canvas\" ref=\"mapElement\"></div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport L from 'leaflet';\r\nimport MockLatLng from 'mock-latlng';\r\n\r\nexport default {\r\n    components: {},\r\n    data() {return {}},\r\n    mounted() {\r\n        var canvasRenderer = L.canvas();\r\n        var mymap = L.map(this.$refs['mapElement'], {\r\n            renderer: canvasRenderer,\r\n            // preferCanvas: true,\r\n        });\r\n        let mapCenter = {lat: 48.19, lng: 16.3};\r\n        mymap.setView(mapCenter, 8);\r\n        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n            maxZoom: 19,\r\n            attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n        }).addTo(mymap);;\r\n\r\n        let points = MockLatLng.random_coordinates(1000, mapCenter);\r\n        points.forEach(function (pos, index) {\r\n            L.circleMarker(pos, {\r\n                renderer: canvasRenderer\r\n            }).addTo(mymap).bindPopup('marker ' + JSON.stringify(pos));\r\n        });\r\n    },\r\n}\r\n</script>\r\n\r\n<style scoped>\r\n#app-canvas {\r\n  height: 40%;\r\n  width: 100%;\r\n}\r\n\r\n#map-canvas {\r\n  height: 100%;\r\n}\r\n</style>"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-4eea07be";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  new Vue({
    el: '#app',
    render: h => h(__vue_component__),
  });

  new Vue({
    el: '#app-canvas',
    render: h => h(__vue_component__$1),
  });

}(Vue, L));
