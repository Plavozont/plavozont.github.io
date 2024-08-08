// Built with IMPACT - impactjs.org

(function (window) {
    "use strict";
    Number.prototype.map = function (istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((this - istart) / (istop - istart));
    };
    Number.prototype.limit = function (min, max) {
        return Math.min(max, Math.max(min, this));
    };
    Number.prototype.round = function (precision) {
        precision = Math.pow(10, precision || 0);
        return Math.round(this * precision) / precision;
    };
    Number.prototype.floor = function () {
        return Math.floor(this);
    };
    Number.prototype.ceil = function () {
        return Math.ceil(this);
    };
    Number.prototype.toInt = function () {
        return (this | 0);
    };
    Number.prototype.toRad = function () {
        return (this / 180) * Math.PI;
    };
    Number.prototype.toDeg = function () {
        return (this * 180) / Math.PI;
    };
    Array.prototype.erase = function (item) {
        for (var i = this.length; i--;) {
            if (this[i] === item) {
                this.splice(i, 1);
            }
        }
        return this;
    };
    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    };
    Function.prototype.bind = Function.prototype.bind || function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array
                    .prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
    window.ig = {
        game: null,
        debug: null,
        version: '1.23',
        global: window,
        modules: {},
        resources: [],
        ready: false,
        baked: false,
        nocache: '',
        ua: {},
        prefix: (window.ImpactPrefix || ''),
        lib: 'lib/',
        _current: null,
        _loadQueue: [],
        _waitForOnload: 0,
        $: function (selector) {
            return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document
                .getElementsByTagName(selector);
        },
        $new: function (name) {
            return document.createElement(name);
        },
        copy: function (object) {
            if (!object || typeof (object) != 'object' || object instanceof HTMLElement ||
                object instanceof ig.Class) {
                return object;
            } else if (object instanceof Array) {
                var c = [];
                for (var i = 0, l = object.length; i < l; i++) {
                    c[i] = ig.copy(object[i]);
                }
                return c;
            } else {
                var c = {};
                for (var i in object) {
                    c[i] = ig.copy(object[i]);
                }
                return c;
            }
        },
        merge: function (original, extended) {
            for (var key in extended) {
                var ext = extended[key];
                if (typeof (ext) != 'object' || ext instanceof HTMLElement || ext instanceof ig.Class ||
                    ext === null) {
                    original[key] = ext;
                } else {
                    if (!original[key] || typeof (original[key]) != 'object') {
                        original[key] = (ext instanceof Array) ? [] : {};
                    }
                    ig.merge(original[key], ext);
                }
            }
            return original;
        },
        ksort: function (obj) {
            if (!obj || typeof (obj) != 'object') {
                return [];
            }
            var keys = [],
                values = [];
            for (var i in obj) {
                keys.push(i);
            }
            keys.sort();
            for (var i = 0; i < keys.length; i++) {
                values.push(obj[keys[i]]);
            }
            return values;
        },
        setVendorAttribute: function (el, attr, val) {
            var uc = attr.charAt(0).toUpperCase() + attr.substr(1);
            el[attr] = el['ms' + uc] = el['moz' + uc] = el['webkit' + uc] = el['o' + uc] = val;
        },
        getVendorAttribute: function (el, attr) {
            var uc = attr.charAt(0).toUpperCase() + attr.substr(1);
            return el[attr] || el['ms' + uc] || el['moz' + uc] || el['webkit' + uc] || el['o' + uc];
        },
        normalizeVendorAttribute: function (el, attr) {
            var prefixedVal = ig.getVendorAttribute(el, attr);
            if (!el[attr] && prefixedVal) {
                el[attr] = prefixedVal;
            }
        },
        getImagePixels: function (image, x, y, width, height) {
            var canvas = ig.$new('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ig.System.SCALE.CRISP(canvas, ctx);
            var ratio = ig.getVendorAttribute(ctx, 'backingStorePixelRatio') || 1;
            ig.normalizeVendorAttribute(ctx, 'getImageDataHD');
            var realWidth = image.width / ratio,
                realHeight = image.height / ratio;
            canvas.width = Math.ceil(realWidth);
            canvas.height = Math.ceil(realHeight);
            ctx.drawImage(image, 0, 0, realWidth, realHeight);
            return (ratio === 1) ? ctx.getImageData(x, y, width, height) : ctx.getImageDataHD(x, y, width,
                height);
        },
        module: function (name) {
            if (ig._current) {
                throw ("Module '" + ig._current.name + "' defines nothing");
            }
            if (ig.modules[name] && ig.modules[name].body) {
                throw ("Module '" + name + "' is already defined");
            }
            ig._current = {
                name: name,
                requires: [],
                loaded: false,
                body: null
            };
            ig.modules[name] = ig._current;
            ig._loadQueue.push(ig._current);
            return ig;
        },
        requires: function () {
            ig._current.requires = Array.prototype.slice.call(arguments);
            return ig;
        },
        defines: function (body) {
            ig._current.body = body;
            ig._current = null;
            ig._initDOMReady();
        },
        addResource: function (resource) {
            ig.resources.push(resource);
        },
        setNocache: function (set) {
            ig.nocache = set ? '?' + Date.now() : '';
        },
        log: function () {},
        assert: function (condition, msg) {},
        show: function (name, number) {},
        mark: function (msg, color) {},
        _loadScript: function (name, requiredFrom) {
            ig.modules[name] = {
                name: name,
                requires: [],
                loaded: false,
                body: null
            };
            ig._waitForOnload++;
            var path = ig.prefix + ig.lib + name.replace(/\./g, '/') + '.js' + ig.nocache;
            var script = ig.$new('script');
            script.type = 'text/javascript';
            script.src = path;
            script.onload = function () {
                ig._waitForOnload--;
                ig._execModules();
            };
            script.onerror = function () {
                throw ('Failed to load module ' + name + ' at ' + path + ' ' + 'required from ' +
                    requiredFrom);
            };
            ig.$('head')[0].appendChild(script);
        },
        _execModules: function () {
            var modulesLoaded = false;
            for (var i = 0; i < ig._loadQueue.length; i++) {
                var m = ig._loadQueue[i];
                var dependenciesLoaded = true;
                for (var j = 0; j < m.requires.length; j++) {
                    var name = m.requires[j];
                    if (!ig.modules[name]) {
                        dependenciesLoaded = false;
                        ig._loadScript(name, m.name);
                    } else if (!ig.modules[name].loaded) {
                        dependenciesLoaded = false;
                    }
                }
                if (dependenciesLoaded && m.body) {
                    ig._loadQueue.splice(i, 1);
                    m.loaded = true;
                    m.body();
                    modulesLoaded = true;
                    i--;
                }
            }
            if (modulesLoaded) {
                ig._execModules();
            } else if (!ig.baked && ig._waitForOnload == 0 && ig._loadQueue.length != 0) {
                var unresolved = [];
                for (var i = 0; i < ig._loadQueue.length; i++) {
                    var unloaded = [];
                    var requires = ig._loadQueue[i].requires;
                    for (var j = 0; j < requires.length; j++) {
                        var m = ig.modules[requires[j]];
                        if (!m || !m.loaded) {
                            unloaded.push(requires[j]);
                        }
                    }
                    unresolved.push(ig._loadQueue[i].name + ' (requires: ' + unloaded.join(', ') + ')');
                }
                throw ("Unresolved (or circular?) dependencies. " +
                    "Most likely there's a name/path mismatch for one of the listed modules " +
                    "or a previous syntax error prevents a module from loading:\n" +
                    unresolved.join('\n'));
            }
        },
        _DOMReady: function () {
            if (!ig.modules['dom.ready'].loaded) {
                if (!document.body) {
                    return setTimeout(ig._DOMReady, 13);
                }
                ig.modules['dom.ready'].loaded = true;
                ig._waitForOnload--;
                ig._execModules();
            }
            return 0;
        },
        _boot: function () {
            if (document.location.href.match(/\?nocache/)) {
                ig.setNocache(true);
            }
            ig.ua.pixelRatio = window.devicePixelRatio || 1;
            ig.ua.viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            ig.ua.screen = {
                width: window.screen.availWidth * ig.ua.pixelRatio,
                height: window.screen.availHeight * ig.ua.pixelRatio
            };
            ig.ua.iPhone = /iPhone/i.test(navigator.userAgent);
            ig.ua.iPhone4 = (ig.ua.iPhone && ig.ua.pixelRatio == 2);
            ig.ua.iPad = /iPad/i.test(navigator.userAgent);
            ig.ua.android = /android/i.test(navigator.userAgent);
            ig.ua.winPhone = /Windows Phone/i.test(navigator.userAgent);
            ig.ua.iOS = ig.ua.iPhone || ig.ua.iPad;
            ig.ua.mobile = ig.ua.iOS || ig.ua.android || ig.ua.winPhone || /mobile/i.test(navigator
                .userAgent);
            ig.ua.touchDevice = (('ontouchstart' in window) || (window.navigator.msMaxTouchPoints));
        },
        _initDOMReady: function () {
            if (ig.modules['dom.ready']) {
                ig._execModules();
                return;
            }
            ig._boot();
            ig.modules['dom.ready'] = {
                requires: [],
                loaded: false,
                body: null
            };
            ig._waitForOnload++;
            if (document.readyState === 'complete') {
                ig._DOMReady();
            } else {
                document.addEventListener('DOMContentLoaded', ig._DOMReady, false);
                window.addEventListener('load', ig._DOMReady, false);
            }
        }
    };
    ig.normalizeVendorAttribute(window, 'requestAnimationFrame');
    if (window.requestAnimationFrame) {
        var next = 1,
            anims = {};
        window.ig.setAnimation = function (callback, element) {
            var current = next++;
            anims[current] = true;
            var animate = function () {
                if (!anims[current]) {
                    return;
                }
                window.requestAnimationFrame(animate, element);
                callback();
            };
            window.requestAnimationFrame(animate, element);
            return current;
        };
        window.ig.clearAnimation = function (id) {
            delete anims[id];
        };
    } else {
        window.ig.setAnimation = function (callback, element) {
            return window.setInterval(callback, 1000 / 60);
        };
        window.ig.clearAnimation = function (id) {
            window.clearInterval(id);
        };
    }
    var initializing = false,
        fnTest = /xyz/.test(function () {
            xyz;
        }) ? /\bparent\b/ : /.*/;
    var lastClassId = 0;
    window.ig.Class = function () {};
    var inject = function (prop) {
        var proto = this.prototype;
        var parent = {};
        for (var name in prop) {
            if (typeof (prop[name]) == "function" && typeof (proto[name]) == "function" && fnTest.test(prop[
                    name])) {
                parent[name] = proto[name];
                proto[name] = (function (name, fn) {
                    return function () {
                        var tmp = this.parent;
                        this.parent = parent[name];
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                proto[name] = prop[name];
            }
        }
    };
    window.ig.Class.extend = function (prop) {
        var parent = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            if (typeof (prop[name]) == "function" && typeof (parent[name]) == "function" && fnTest.test(prop[
                    name])) {
                prototype[name] = (function (name, fn) {
                    return function () {
                        var tmp = this.parent;
                        this.parent = parent[name];
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                prototype[name] = prop[name];
            }
        }

        function Class() {
            if (!initializing) {
                if (this.staticInstantiate) {
                    var obj = this.staticInstantiate.apply(this, arguments);
                    if (obj) {
                        return obj;
                    }
                }
                for (var p in this) {
                    if (typeof (this[p]) == 'object') {
                        this[p] = ig.copy(this[p]);
                    }
                }
                if (this.init) {
                    this.init.apply(this, arguments);
                }
            }
            return this;
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = window.ig.Class.extend;
        Class.inject = inject;
        Class.classId = prototype.classId = ++lastClassId;
        return Class;
    };
    if (window.ImpactMixin) {
        ig.merge(ig, window.ImpactMixin);
    }
})(window);

// lib/impact/image.js
ig.baked = true;
ig.module('impact.image').defines(function () {
    "use strict";
    ig.Image = ig.Class.extend({
        data: null,
        width: 0,
        height: 0,
        loaded: false,
        failed: false,
        loadCallback: null,
        path: '',
        staticInstantiate: function (path) {
            return ig.Image.cache[path] || null;
        },
        init: function (path) {
            this.path = path;
            this.load();
        },
        load: function (loadCallback) {
            if (this.loaded) {
                if (loadCallback) {
                    loadCallback(this.path, true);
                }
                return;
            } else if (!this.loaded && ig.ready) {
                this.loadCallback = loadCallback || null;
                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.onerror = this.onerror.bind(this);
                this.data.src = ig.prefix + this.path + ig.nocache;
            } else {
                ig.addResource(this);
            }
            ig.Image.cache[this.path] = this;
        },
        reload: function () {
            this.loaded = false;
            this.data = new Image();
            this.data.onload = this.onload.bind(this);
            this.data.src = this.path + '?' + Date.now();
        },
        onload: function (event) {
            this.width = this.data.width;
            this.height = this.data.height;
            this.loaded = true;
            if (ig.system.scale != 1) {
                this.resize(ig.system.scale);
            }
            if (this.loadCallback) {
                this.loadCallback(this.path, true);
            }
        },
        onerror: function (event) {
            this.failed = true;
            if (this.loadCallback) {
                this.loadCallback(this.path, false);
            }
        },
        resize: function (scale) {
            var origPixels = ig.getImagePixels(this.data, 0, 0, this.width, this.height);
            var widthScaled = this.width * scale;
            var heightScaled = this.height * scale;
            var scaled = ig.$new('canvas');
            scaled.width = widthScaled;
            scaled.height = heightScaled;
            var scaledCtx = scaled.getContext('2d');
            var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);
            for (var y = 0; y < heightScaled; y++) {
                for (var x = 0; x < widthScaled; x++) {
                    var index = (Math.floor(y / scale) * this.width + Math.floor(x / scale)) * 4;
                    var indexScaled = (y * widthScaled + x) * 4;
                    scaledPixels.data[indexScaled] = origPixels.data[index];
                    scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
                    scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
                    scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
                }
            }
            scaledCtx.putImageData(scaledPixels, 0, 0);
            this.data = scaled;
        },
        draw: function (targetX, targetY, sourceX, sourceY, width, height) {
            if (!this.loaded) {
                return;
            }
            var scale = ig.system.scale;
            sourceX = sourceX ? sourceX * scale : 0;
            sourceY = sourceY ? sourceY * scale : 0;
            width = (width ? width : this.width) * scale;
            height = (height ? height : this.height) * scale;
            ig.system.context.drawImage(this.data, sourceX, sourceY, width, height, ig.system
                .getDrawPos(targetX), ig.system.getDrawPos(targetY), width, height);
            ig.Image.drawCount++;
        },
        drawTile: function (targetX, targetY, tile, tileWidth, tileHeight, flipX, flipY) {
            tileHeight = tileHeight ? tileHeight : tileWidth;
            if (!this.loaded || tileWidth > this.width || tileHeight > this.height) {
                return;
            }
            var scale = ig.system.scale;
            var tileWidthScaled = Math.floor(tileWidth * scale);
            var tileHeightScaled = Math.floor(tileHeight * scale);
            var scaleX = flipX ? -1 : 1;
            var scaleY = flipY ? -1 : 1;
            if (flipX || flipY) {
                ig.system.context.save();
                ig.system.context.scale(scaleX, scaleY);
            }
            ig.system.context.drawImage(this.data, (Math.floor(tile * tileWidth) % this.width) *
                scale, (Math.floor(tile * tileWidth / this.width) * tileHeight) * scale,
                tileWidthScaled, tileHeightScaled, ig.system.getDrawPos(targetX) * scaleX - (
                    flipX ? tileWidthScaled : 0), ig.system.getDrawPos(targetY) * scaleY - (
                    flipY ? tileHeightScaled : 0), tileWidthScaled, tileHeightScaled);
            if (flipX || flipY) {
                ig.system.context.restore();
            }
            ig.Image.drawCount++;
        }
    });
    ig.Image.drawCount = 0;
    ig.Image.cache = {};
    ig.Image.reloadCache = function () {
        for (var path in ig.Image.cache) {
            ig.Image.cache[path].reload();
        }
    };
});

// lib/impact/font.js
ig.baked = true;
ig.module('impact.font').requires('impact.image').defines(function () {
    "use strict";
    ig.Font = ig.Image.extend({
        widthMap: [],
        indices: [],
        firstChar: 32,
        alpha: 1,
        letterSpacing: 1,
        lineSpacing: 0,
        onload: function (ev) {
            this._loadMetrics(this.data);
            this.parent(ev);
        },
        widthForString: function (text) {
            if (text.indexOf('\n') !== -1) {
                var lines = text.split('\n');
                var width = 0;
                for (var i = 0; i < lines.length; i++) {
                    width = Math.max(width, this._widthForLine(lines[i]));
                }
                return width;
            } else {
                return this._widthForLine(text);
            }
        },
        _widthForLine: function (text) {
            var width = 0;
            for (var i = 0; i < text.length; i++) {
                var c = this.fix_letter_index(text.charCodeAt(i));
                width += this.widthMap[c - this.firstChar] + this.letterSpacing;
            }
            return width;
        },
        fix_letter_index: function (c) {
            if (c == 1072) { c = 95 + 32}//а
            if (c == 1073) { c = 96 + 32}//б
            if (c == 1074) { c = 97 + 32}//в
            if (c == 1075) { c = 98 + 32}//г
            if (c == 1076) { c = 99 + 32}//д
            if (c == 1077) { c = 100 + 32}//е
            if (c == 1105) { c = 101 + 32}//ё
            if (c == 1078) { c = 102 + 32}//ж
            if (c == 1079) { c = 103 + 32}//з
            if (c == 1080) { c = 104 + 32}//и
            if (c == 1081) { c = 105 + 32}//й
            if (c == 1082) { c = 106 + 32}//к
            if (c == 1083) { c = 107 + 32}//л
            if (c == 1084) { c = 108 + 32}//м
            if (c == 1085) { c = 109 + 32}//н
            if (c == 1086) { c = 110 + 32}//о
            if (c == 1087) { c = 111 + 32}//п
            if (c == 1088) { c = 112 + 32}//р
            if (c == 1089) { c = 113 + 32}//с
            if (c == 1090) { c = 114 + 32}//т
            if (c == 1091) { c = 115 + 32}//у
            if (c == 1092) { c = 116 + 32}//ф
            if (c == 1093) { c = 117 + 32}//х
            if (c == 1094) { c = 118 + 32}//ц
            if (c == 1095) { c = 119 + 32}//ч
            if (c == 1096) { c = 120 + 32}//ш
            if (c == 1097) { c = 121 + 32}//щ
            if (c == 1098) { c = 122 + 32}//ъ
            if (c == 1099) { c = 123 + 32}//ы
            if (c == 1100) { c = 124 + 32}//ь
            if (c == 1101) { c = 125 + 32}//э
            if (c == 1102) { c = 126 + 32}//ю
            if (c == 1103) { c = 127 + 32}//я
            return c;
        },
        heightForString: function (text) {
            return text.split('\n').length * (this.height + this.lineSpacing);
        },
        draw: function (text, x, y, align) {
            if (typeof (text) != 'string') {
                text = text.toString();
            }
            if (text.indexOf('\n') !== -1) {
                var lines = text.split('\n');
                var lineHeight = this.height + this.lineSpacing;
                for (var i = 0; i < lines.length; i++) {
                    this.draw(lines[i], x, y + i * lineHeight, align);
                }
                return;
            }
            if (align == ig.Font.ALIGN.RIGHT || align == ig.Font.ALIGN.CENTER) {
                var width = this._widthForLine(text);
                x -= align == ig.Font.ALIGN.CENTER ? width / 2 : width;
            }
            if (this.alpha !== 1) {
                ig.system.context.globalAlpha = this.alpha;
            }
            for (var i = 0; i < text.length; i++) {
                var c = this.fix_letter_index(text.charCodeAt(i));


                //debugger
                x += this._drawChar(c - this.firstChar, x, y, text, text.charCodeAt(i));
            }
            if (this.alpha !== 1) {
                ig.system.context.globalAlpha = 1;
            }
            ig.Image.drawCount += text.length;
        },
        _drawChar: function (c, targetX, targetY, text, charCodeAti) {
            if (!this.loaded || c < 0 || c >= this.indices.length) {
                return 0;
            }
            //if (c>=95) {debugger}
            var scale = ig.system.scale;
            var charX = this.indices[c] * scale;
            var charY = 0;
            var charWidth = this.widthMap[c] * scale;
            var charHeight = (this.height - 2) * scale;
            ig.system.context.drawImage(this.data, charX, charY, charWidth, charHeight, ig.system
                .getDrawPos(targetX), ig.system.getDrawPos(targetY), charWidth, charHeight);
            return this.widthMap[c] + this.letterSpacing;
        },
        _loadMetrics: function (image) {
            this.height = image.height - 1;
            this.widthMap = [];
            this.indices = [];
            var px = ig.getImagePixels(image, 0, image.height - 1, image.width, 1);
            var currentChar = 0;
            var currentWidth = 0;
            for (var x = 0; x < image.width; x++) {
                var index = x * 4 + 3;
                
                if (px.data[index] > 127) {
                    currentWidth++;
                } else if (px.data[index] < 128 && currentWidth) {
                    //debugger
                    this.widthMap.push(currentWidth);
                    this.indices.push(x - currentWidth);
                    currentChar++;
                    currentWidth = 0;
                }
            }
            this.widthMap.push(currentWidth);
            this.indices.push(x - currentWidth);
        }
    });
    ig.Font.ALIGN = {
        LEFT: 0,
        RIGHT: 1,
        CENTER: 2
    };
});

// lib/impact/sound.js
ig.baked = true;
ig.module('impact.sound').defines(function () {
    "use strict";
    ig.SoundManager = ig.Class.extend({
        clips: {},
        volume: 1,
        format: null,
        init: function () {
            if (!ig.Sound.enabled || !window.Audio) {
                ig.Sound.enabled = false;
                return;
            }
            var probe = new Audio();
            for (var i = 0; i < ig.Sound.use.length; i++) {
                var format = ig.Sound.use[i];
                if (probe.canPlayType(format.mime)) {
                    this.format = format;
                    break;
                }
            }
            if (!this.format) {
                ig.Sound.enabled = false;
            }
            if (ig.Sound.enabled && ig.Sound.useWebAudio) {
                this.audioContext = new AudioContext();
            }
        },
        load: function (path, multiChannel, loadCallback) {
            if (multiChannel && ig.Sound.useWebAudio) {
                return this.loadWebAudio(path, multiChannel, loadCallback);
            } else {
                return this.loadHTML5Audio(path, multiChannel, loadCallback);
            }
        },
        loadWebAudio: function (path, multiChannel, loadCallback) {
            var realPath = ig.prefix + path.replace(/[^\.]+$/, this.format.ext) + ig.nocache;
            if (this.clips[path]) {
                return this.clips[path];
            }
            var audioSource = new ig.Sound.WebAudioSource()
            this.clips[path] = audioSource;
            var request = new XMLHttpRequest();
            request.open('GET', realPath, true);
            request.responseType = 'arraybuffer';
            var that = this;
            request.onload = function (ev) {
                that.audioContext.decodeAudioData(request.response, function (buffer) {
                    audioSource.buffer = buffer;
                    loadCallback(path, true, ev);
                }, function (ev) {
                    loadCallback(path, false, ev);
                });
            };
            request.onerror = function (ev) {
                loadCallback(path, false, ev);
            };
            request.send();
            return audioSource;
        },
        loadHTML5Audio: function (path, multiChannel, loadCallback) {
            var realPath = ig.prefix + path.replace(/[^\.]+$/, this.format.ext) + ig.nocache;
            if (this.clips[path]) {
                if (this.clips[path] instanceof ig.Sound.WebAudioSource) {
                    return this.clips[path];
                }
                if (multiChannel && this.clips[path].length < ig.Sound.channels) {
                    for (var i = this.clips[path].length; i < ig.Sound.channels; i++) {
                        var a = new Audio(realPath);
                        a.load();
                        this.clips[path].push(a);
                    }
                }
                return this.clips[path][0];
            }
            var clip = new Audio(realPath);
            if (loadCallback) {
                clip.addEventListener('canplaythrough', function cb(ev) {
                    clip.removeEventListener('canplaythrough', cb, false);
                    loadCallback(path, true, ev);
                }, false);
                clip.addEventListener('error', function (ev) {
                    loadCallback(path, false, ev);
                }, false);
            }
            clip.preload = 'auto';
            clip.load();
            this.clips[path] = [clip];
            if (multiChannel) {
                for (var i = 1; i < ig.Sound.channels; i++) {
                    var a = new Audio(realPath);
                    a.load();
                    this.clips[path].push(a);
                }
            }
            return clip;
        },
        get: function (path) {
            var channels = this.clips[path];
            if (channels && channels instanceof ig.Sound.WebAudioSource) {
                return channels;
            }
            for (var i = 0, clip; clip = channels[i++];) {
                if (clip.paused || clip.ended) {
                    if (clip.ended) {
                        clip.currentTime = 0;
                    }
                    return clip;
                }
            }
            channels[0].pause();
            channels[0].currentTime = 0;
            return channels[0];
        }
    });
    ig.Music = ig.Class.extend({
        tracks: [],
        namedTracks: {},
        currentTrack: null,
        currentIndex: 0,
        random: false,
        _volume: 1,
        _loop: false,
        _fadeInterval: 0,
        _fadeTimer: null,
        _endedCallbackBound: null,
        init: function () {
            this._endedCallbackBound = this._endedCallback.bind(this);
            Object.defineProperty(this, "volume", {
                get: this.getVolume.bind(this),
                set: this.setVolume.bind(this)
            });
            Object.defineProperty(this, "loop", {
                get: this.getLooping.bind(this),
                set: this.setLooping.bind(this)
            });
        },
        add: function (music, name) {
            if (!ig.Sound.enabled) {
                return;
            }
            var path = music instanceof ig.Sound ? music.path : music;
            var track = ig.soundManager.load(path, false);
            if (track instanceof ig.Sound.WebAudioSource) {
                ig.system.stopRunLoop();
                throw ("Sound '" + path + "' loaded as Multichannel but used for Music. " +
                    "Set the multiChannel param to false when loading, e.g.: new ig.Sound(path, false)"
                    );
            }
            track.loop = this._loop;
            track.volume = this._volume;
            track.addEventListener('ended', this._endedCallbackBound, false);
            this.tracks.push(track);
            if (name) {
                this.namedTracks[name] = track;
            }
            if (!this.currentTrack) {
                this.currentTrack = track;
            }
        },
        next: function () {
            if (!this.tracks.length) {
                return;
            }
            this.stop();
            this.currentIndex = this.random ? Math.floor(Math.random() * this.tracks.length) : (this
                .currentIndex + 1) % this.tracks.length;
            this.currentTrack = this.tracks[this.currentIndex];
            this.play();
        },
        pause: function () {
            if (!this.currentTrack) {
                return;
            }
            this.currentTrack.pause();
        },
        stop: function () {
            if (!this.currentTrack) {
                return;
            }
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        },
        play: function (name) {
            if (name && this.namedTracks[name]) {
                var newTrack = this.namedTracks[name];
                if (newTrack != this.currentTrack) {
                    this.stop();
                    this.currentTrack = newTrack;
                }
            } else if (!this.currentTrack) {
                return;
            }
            this.currentTrack.play();
        },
        getLooping: function () {
            return this._loop;
        },
        setLooping: function (l) {
            this._loop = l;
            for (var i in this.tracks) {
                this.tracks[i].loop = l;
            }
        },
        getVolume: function () {
            return this._volume;
        },
        setVolume: function (v) {
            this._volume = v.limit(0, 1);
            for (var i in this.tracks) {
                this.tracks[i].volume = this._volume;
            }
        },
        fadeOut: function (time) {
            if (!this.currentTrack) {
                return;
            }
            clearInterval(this._fadeInterval);
            this.fadeTimer = new ig.Timer(time);
            this._fadeInterval = setInterval(this._fadeStep.bind(this), 50);
        },
        _fadeStep: function () {
            var v = this.fadeTimer.delta().map(-this.fadeTimer.target, 0, 1, 0).limit(0, 1) * this
                ._volume;
            if (v <= 0.01) {
                this.stop();
                this.currentTrack.volume = this._volume;
                clearInterval(this._fadeInterval);
            } else {
                this.currentTrack.volume = v;
            }
        },
        _endedCallback: function () {
            if (this._loop) {
                this.play();
            } else {
                this.next();
            }
        }
    });
    ig.Sound = ig.Class.extend({
        path: '',
        volume: 1,
        currentClip: null,
        multiChannel: true,
        _loop: false,
        init: function (path, multiChannel) {
            this.path = path;
            this.multiChannel = (multiChannel !== false);
            Object.defineProperty(this, "loop", {
                get: this.getLooping.bind(this),
                set: this.setLooping.bind(this)
            });
            this.load();
        },
        getLooping: function () {
            return this._loop;
        },
        setLooping: function (loop) {
            this._loop = loop;
            if (this.currentClip) {
                this.currentClip.loop = loop;
            }
        },
        load: function (loadCallback) {
            if (!ig.Sound.enabled) {
                if (loadCallback) {
                    loadCallback(this.path, true);
                }
                return;
            }
            if (ig.ready) {
                ig.soundManager.load(this.path, this.multiChannel, loadCallback);
            } else {
                ig.addResource(this);
            }
        },
        play: function () {
            if (!ig.Sound.enabled) {
                return;
            }
            this.currentClip = ig.soundManager.get(this.path);
            this.currentClip.loop = this._loop;
            this.currentClip.volume = ig.soundManager.volume * this.volume;
            this.currentClip.play();
        },
        stop: function () {
            if (this.currentClip) {
                this.currentClip.pause();
                this.currentClip.currentTime = 0;
            }
        }
    });
    ig.Sound.WebAudioSource = ig.Class.extend({
        sources: [],
        gain: null,
        buffer: null,
        _loop: false,
        init: function () {
            this.gain = ig.soundManager.audioContext.createGain();
            this.gain.connect(ig.soundManager.audioContext.destination);
            Object.defineProperty(this, "loop", {
                get: this.getLooping.bind(this),
                set: this.setLooping.bind(this)
            });
            Object.defineProperty(this, "volume", {
                get: this.getVolume.bind(this),
                set: this.setVolume.bind(this)
            });
        },
        play: function () {
            if (!this.buffer) {
                return;
            }
            var source = ig.soundManager.audioContext.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.gain);
            source.loop = this._loop;
            var that = this;
            this.sources.push(source);
            source.onended = function () {
                that.sources.erase(source);
            }
            source.start(0);
        },
        pause: function () {
            for (var i = 0; i < this.sources.length; i++) {
                try {
                    this.sources[i].stop();
                } catch (err) {}
            }
        },
        getLooping: function () {
            return this._loop;
        },
        setLooping: function (loop) {
            this._loop = loop;
            for (var i = 0; i < this.sources.length; i++) {
                this.sources[i].loop = loop;
            }
        },
        getVolume: function () {
            return this.gain.gain.value;
        },
        setVolume: function (volume) {
            this.gain.gain.value = volume;
        }
    });
    ig.Sound.FORMAT = {
        MP3: {
            ext: 'mp3',
            mime: 'audio/mpeg'
        },
        M4A: {
            ext: 'm4a',
            mime: 'audio/mp4; codecs=mp4a.40.2'
        },
        OGG: {
            ext: 'ogg',
            mime: 'audio/ogg; codecs=vorbis'
        },
        WEBM: {
            ext: 'webm',
            mime: 'audio/webm; codecs=vorbis'
        },
        CAF: {
            ext: 'caf',
            mime: 'audio/x-caf'
        }
    };
    ig.Sound.use = [ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3];
    ig.Sound.channels = 4;
    ig.Sound.enabled = true;
    ig.normalizeVendorAttribute(window, 'AudioContext');
    ig.Sound.useWebAudio = !!window.AudioContext;
});

// lib/impact/loader.js
ig.baked = true;
ig.module('impact.loader').requires('impact.image', 'impact.font', 'impact.sound').defines(function () {
    "use strict";
    ig.Loader = ig.Class.extend({
        resources: [],
        gameClass: null,
        status: 0,
        done: false,
        _unloaded: [],
        _drawStatus: 0,
        _intervalId: 0,
        _loadCallbackBound: null,
        init: function (gameClass, resources) {
            this.gameClass = gameClass;
            this.resources = resources;
            this._loadCallbackBound = this._loadCallback.bind(this);
            for (var i = 0; i < this.resources.length; i++) {
                this._unloaded.push(this.resources[i].path);
            }
        },
        load: function () {
            ig.system.clear('#000');
            if (!this.resources.length) {
                this.end();
                return;
            }
            for (var i = 0; i < this.resources.length; i++) {
                this.loadResource(this.resources[i]);
            }
            this._intervalId = setInterval(this.draw.bind(this), 16);
        },
        loadResource: function (res) {
            res.load(this._loadCallbackBound);
        },
        end: function () {
            if (this.done) {
                return;
            }
            this.done = true;
            clearInterval(this._intervalId);
            ig.system.setGame(this.gameClass);
        },
        draw: function () {
            this._drawStatus += (this.status - this._drawStatus) / 5;
            var s = ig.system.scale;
            var w = ig.system.width * 0.6;
            var h = ig.system.height * 0.1;
            var x = ig.system.width * 0.5 - w / 2;
            var y = ig.system.height * 0.5 - h / 2;
            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect(0, 0, 480, 320);
            ig.system.context.fillStyle = '#fff';
            ig.system.context.fillRect(x * s, y * s, w * s, h * s);
            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect(x * s + s, y * s + s, w * s - s - s, h * s - s - s);
            ig.system.context.fillStyle = '#fff';
            ig.system.context.fillRect(x * s, y * s, w * s * this._drawStatus, h * s);
        },
        _loadCallback: function (path, status) {
            if (status) {
                this._unloaded.erase(path);
            } else {
                throw ('Failed to load resource: ' + path);
            }
            this.status = 1 - (this._unloaded.length / this.resources.length);
            if (this._unloaded.length == 0) {
                setTimeout(this.end.bind(this), 250);
            }
        }
    });
});

// lib/impact/timer.js
ig.baked = true;
ig.module('impact.timer').defines(function () {
    "use strict";
    ig.Timer = ig.Class.extend({
        target: 0,
        base: 0,
        last: 0,
        pausedAt: 0,
        init: function (seconds) {
            this.base = ig.Timer.time;
            this.last = ig.Timer.time;
            this.target = seconds || 0;
        },
        set: function (seconds) {
            this.target = seconds || 0;
            this.base = ig.Timer.time;
            this.pausedAt = 0;
        },
        reset: function () {
            this.base = ig.Timer.time;
            this.pausedAt = 0;
        },
        tick: function () {
            var delta = ig.Timer.time - this.last;
            this.last = ig.Timer.time;
            return (this.pausedAt ? 0 : delta);
        },
        delta: function () {
            return (this.pausedAt || ig.Timer.time) - this.base - this.target;
        },
        pause: function () {
            if (!this.pausedAt) {
                this.pausedAt = ig.Timer.time;
            }
        },
        unpause: function () {
            if (this.pausedAt) {
                this.base += ig.Timer.time - this.pausedAt;
                this.pausedAt = 0;
            }
        }
    });
    ig.Timer._last = 0;
    ig.Timer.time = Number.MIN_VALUE;
    ig.Timer.timeScale = 1;
    ig.Timer.maxStep = 0.05;
    ig.Timer.step = function () {
        var current = Date.now();
        var delta = (current - ig.Timer._last) / 1000;
        ig.Timer.time += Math.min(delta, ig.Timer.maxStep) * ig.Timer.timeScale;
        ig.Timer._last = current;
    };
});

// lib/impact/system.js
ig.baked = true;
ig.module('impact.system').requires('impact.timer', 'impact.image').defines(function () {
    "use strict";
    ig.System = ig.Class.extend({
        fps: 30,
        width: 320,
        height: 240,
        realWidth: 320,
        realHeight: 240,
        scale: 1,
        tick: 0,
        animationId: 0,
        newGameClass: null,
        running: false,
        delegate: null,
        clock: null,
        canvas: null,
        context: null,
        init: function (canvasId, fps, width, height, scale) {
            this.fps = fps;
            this.clock = new ig.Timer();
            this.canvas = ig.$(canvasId);
            this.resize(width, height, scale);
            this.context = this.canvas.getContext('2d');
            this.getDrawPos = ig.System.drawMode;
            if (this.scale != 1) {
                ig.System.scaleMode = ig.System.SCALE.CRISP;
            }
            ig.System.scaleMode(this.canvas, this.context);
        },
        resize: function (width, height, scale) {
            this.width = width;
            this.height = height;
            this.scale = scale || this.scale;
            this.realWidth = this.width * this.scale;
            this.realHeight = this.height * this.scale;
            this.canvas.width = this.realWidth;
            this.canvas.height = this.realHeight;
        },
        setGame: function (gameClass) {
            if (this.running) {
                this.newGameClass = gameClass;
            } else {
                this.setGameNow(gameClass);
            }
        },
        setGameNow: function (gameClass) {
            ig.game = new(gameClass)();
            ig.system.setDelegate(ig.game);
        },
        setDelegate: function (object) {
            if (typeof (object.run) == 'function') {
                this.delegate = object;
                this.startRunLoop();
            } else {
                throw ('System.setDelegate: No run() function in object');
            }
        },
        stopRunLoop: function () {
            ig.clearAnimation(this.animationId);
            this.running = false;
        },
        startRunLoop: function () {
            this.stopRunLoop();
            this.animationId = ig.setAnimation(this.run.bind(this), this.canvas);
            this.running = true;
        },
        clear: function (color) {
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.realWidth, this.realHeight);
        },
        run: function () {
            ig.Timer.step();
            this.tick = this.clock.tick();
            this.delegate.run();
            ig.input.clearPressed();
            if (this.newGameClass) {
                this.setGameNow(this.newGameClass);
                this.newGameClass = null;
            }
        },
        getDrawPos: null
    });
    ig.System.DRAW = {
        AUTHENTIC: function (p) {
            return Math.round(p) * this.scale;
        },
        SMOOTH: function (p) {
            return Math.round(p * this.scale);
        },
        SUBPIXEL: function (p) {
            return p * this.scale;
        }
    };
    ig.System.drawMode = ig.System.DRAW.SMOOTH;
    ig.System.SCALE = {
        CRISP: function (canvas, context) {
            ig.setVendorAttribute(context, 'imageSmoothingEnabled', false);
            canvas.style.imageRendering = '-moz-crisp-edges';
            canvas.style.imageRendering = '-o-crisp-edges';
            canvas.style.imageRendering = '-webkit-optimize-contrast';
            canvas.style.imageRendering = 'crisp-edges';
            canvas.style.msInterpolationMode = 'nearest-neighbor';
        },
        SMOOTH: function (canvas, context) {
            ig.setVendorAttribute(context, 'imageSmoothingEnabled', true);
            canvas.style.imageRendering = '';
            canvas.style.msInterpolationMode = '';
        }
    };
    ig.System.scaleMode = ig.System.SCALE.SMOOTH;
});

// lib/impact/input.js
ig.baked = true;
ig.module('impact.input').defines(function () {
    "use strict";
    ig.KEY = {
        'MOUSE1': -1,
        'MOUSE2': -3,
        'MWHEEL_UP': -4,
        'MWHEEL_DOWN': -5,
        'BACKSPACE': 8,
        'TAB': 9,
        'ENTER': 13,
        'PAUSE': 19,
        'CAPS': 20,
        'ESC': 27,
        'SPACE': 32,
        'PAGE_UP': 33,
        'PAGE_DOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT_ARROW': 37,
        'UP_ARROW': 38,
        'RIGHT_ARROW': 39,
        'DOWN_ARROW': 40,
        'INSERT': 45,
        'DELETE': 46,
        '_0': 48,
        '_1': 49,
        '_2': 50,
        '_3': 51,
        '_4': 52,
        '_5': 53,
        '_6': 54,
        '_7': 55,
        '_8': 56,
        '_9': 57,
        'A': 65,
        'B': 66,
        'C': 67,
        'D': 68,
        'E': 69,
        'F': 70,
        'G': 71,
        'H': 72,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'M': 77,
        'N': 78,
        'O': 79,
        'P': 80,
        'Q': 81,
        'R': 82,
        'S': 83,
        'T': 84,
        'U': 85,
        'V': 86,
        'W': 87,
        'X': 88,
        'Y': 89,
        'Z': 90,
        'NUMPAD_0': 96,
        'NUMPAD_1': 97,
        'NUMPAD_2': 98,
        'NUMPAD_3': 99,
        'NUMPAD_4': 100,
        'NUMPAD_5': 101,
        'NUMPAD_6': 102,
        'NUMPAD_7': 103,
        'NUMPAD_8': 104,
        'NUMPAD_9': 105,
        'MULTIPLY': 106,
        'ADD': 107,
        'SUBSTRACT': 109,
        'DECIMAL': 110,
        'DIVIDE': 111,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,
        'SHIFT': 16,
        'CTRL': 17,
        'ALT': 18,
        'PLUS': 187,
        'COMMA': 188,
        'MINUS': 189,
        'PERIOD': 190
    };
    ig.Input = ig.Class.extend({
        bindings: {},
        actions: {},
        presses: {},
        locks: {},
        delayedKeyup: {},
        isUsingMouse: false,
        isUsingKeyboard: false,
        isUsingAccelerometer: false,
        mouse: {
            x: 0,
            y: 0
        },
        accel: {
            x: 0,
            y: 0,
            z: 0
        },
        initMouse: function () {
            if (this.isUsingMouse) {
                return;
            }
            this.isUsingMouse = true;
            var mouseWheelBound = this.mousewheel.bind(this);
            ig.system.canvas.addEventListener('mousewheel', mouseWheelBound, false);
            ig.system.canvas.addEventListener('DOMMouseScroll', mouseWheelBound, false);
            ig.system.canvas.addEventListener('contextmenu', this.contextmenu.bind(this), false);
            ig.system.canvas.addEventListener('mousedown', this.keydown.bind(this), false);
            ig.system.canvas.addEventListener('mouseup', this.keyup.bind(this), false);
            ig.system.canvas.addEventListener('mousemove', this.mousemove.bind(this), false);
            if (ig.ua.touchDevice) {
                ig.system.canvas.addEventListener('touchstart', this.keydown.bind(this), false);
                ig.system.canvas.addEventListener('touchend', this.keyup.bind(this), false);
                ig.system.canvas.addEventListener('touchmove', this.mousemove.bind(this), false);
                ig.system.canvas.addEventListener('MSPointerDown', this.keydown.bind(this), false);
                ig.system.canvas.addEventListener('MSPointerUp', this.keyup.bind(this), false);
                ig.system.canvas.addEventListener('MSPointerMove', this.mousemove.bind(this),
                false);
                ig.system.canvas.style.msTouchAction = 'none';
            }
        },
        initKeyboard: function () {
            if (this.isUsingKeyboard) {
                return;
            }
            this.isUsingKeyboard = true;
            window.addEventListener('keydown', this.keydown.bind(this), false);
            window.addEventListener('keyup', this.keyup.bind(this), false);
        },
        initAccelerometer: function () {
            if (this.isUsingAccelerometer) {
                return;
            }
            window.addEventListener('devicemotion', this.devicemotion.bind(this), false);
        },
        mousewheel: function (event) {
            var delta = event.wheelDelta ? event.wheelDelta : (event.detail * -1);
            var code = delta > 0 ? ig.KEY.MWHEEL_UP : ig.KEY.MWHEEL_DOWN;
            var action = this.bindings[code];
            if (action) {
                this.actions[action] = true;
                this.presses[action] = true;
                this.delayedKeyup[action] = true;
                event.stopPropagation();
                event.preventDefault();
            }
        },
        mousemove: function (event) {
            var internalWidth = parseInt(ig.system.canvas.offsetWidth) || ig.system.realWidth;
            var scale = ig.system.scale * (internalWidth / ig.system.realWidth);
            var pos = {
                left: 0,
                top: 0
            };
            if (ig.system.canvas.getBoundingClientRect) {
                pos = ig.system.canvas.getBoundingClientRect();
            }
            var ev = event.touches ? event.touches[0] : event;
            this.mouse.x = (ev.clientX - pos.left) / scale;
            this.mouse.y = (ev.clientY - pos.top) / scale;
        },
        contextmenu: function (event) {
            if (this.bindings[ig.KEY.MOUSE2]) {
                event.stopPropagation();
                event.preventDefault();
            }
        },
        keydown: function (event) {
            var tag = event.target.tagName;
            if (tag == 'INPUT' || tag == 'TEXTAREA') {
                return;
            }
            var code = event.type == 'keydown' ? event.keyCode : (event.button == 2 ? ig.KEY
                .MOUSE2 : ig.KEY.MOUSE1);
            if (event.type == 'touchstart' || event.type == 'mousedown') {
                this.mousemove(event);
            }
            var action = this.bindings[code];
            if (action) {
                this.actions[action] = true;
                if (!this.locks[action]) {
                    this.presses[action] = true;
                    this.locks[action] = true;
                }
                event.stopPropagation();
                event.preventDefault();
            }
        },
        keyup: function (event) {
            var tag = event.target.tagName;
            if (tag == 'INPUT' || tag == 'TEXTAREA') {
                return;
            }
            var code = event.type == 'keyup' ? event.keyCode : (event.button == 2 ? ig.KEY.MOUSE2 :
                ig.KEY.MOUSE1);
            var action = this.bindings[code];
            if (action) {
                this.delayedKeyup[action] = true;
                event.stopPropagation();
                event.preventDefault();
            }
        },
        devicemotion: function (event) {
            this.accel = event.accelerationIncludingGravity;
        },
        bind: function (key, action) {
            if (key < 0) {
                this.initMouse();
            } else if (key > 0) {
                this.initKeyboard();
            }
            this.bindings[key] = action;
        },
        bindTouch: function (selector, action) {
            var element = ig.$(selector);
            var that = this;
            element.addEventListener('touchstart', function (ev) {
                that.touchStart(ev, action);
            }, false);
            element.addEventListener('touchend', function (ev) {
                that.touchEnd(ev, action);
            }, false);
            element.addEventListener('MSPointerDown', function (ev) {
                that.touchStart(ev, action);
            }, false);
            element.addEventListener('MSPointerUp', function (ev) {
                that.touchEnd(ev, action);
            }, false);
        },
        unbind: function (key) {
            var action = this.bindings[key];
            this.delayedKeyup[action] = true;
            this.bindings[key] = null;
        },
        unbindAll: function () {
            this.bindings = {};
            this.actions = {};
            this.presses = {};
            this.locks = {};
            this.delayedKeyup = {};
        },
        state: function (action) {
            return this.actions[action];
        },
        pressed: function (action) {
            return this.presses[action];
        },
        released: function (action) {
            return !!this.delayedKeyup[action];
        },
        clearPressed: function () {
            for (var action in this.delayedKeyup) {
                this.actions[action] = false;
                this.locks[action] = false;
            }
            this.delayedKeyup = {};
            this.presses = {};
        },
        touchStart: function (event, action) {
            this.actions[action] = true;
            this.presses[action] = true;
            event.stopPropagation();
            event.preventDefault();
            return false;
        },
        touchEnd: function (event, action) {
            this.delayedKeyup[action] = true;
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    });
});

// lib/impact/impact.js
ig.baked = true;
ig.module('impact.impact').requires('dom.ready', 'impact.loader', 'impact.system', 'impact.input', 'impact.sound')
    .defines(function () {
        "use strict";
        ig.main = function (canvasId, gameClass, fps, width, height, scale, loaderClass) {
            ig.system = new ig.System(canvasId, fps, width, height, scale || 1);
            ig.input = new ig.Input();
            ig.soundManager = new ig.SoundManager();
            ig.music = new ig.Music();
            ig.ready = true;
            var loader = new(loaderClass || ig.Loader)(gameClass, ig.resources);
            loader.load();
        };
    });

// lib/impact/animation.js
ig.baked = true;
ig.module('impact.animation').requires('impact.timer', 'impact.image').defines(function () {
    "use strict";
    ig.AnimationSheet = ig.Class.extend({
        width: 8,
        height: 8,
        image: null,
        init: function (path, width, height) {
            this.width = width;
            this.height = height;
            this.image = new ig.Image(path);
        }
    });
    ig.Animation = ig.Class.extend({
        sheet: null,
        timer: null,
        sequence: [],
        flip: {
            x: false,
            y: false
        },
        pivot: {
            x: 0,
            y: 0
        },
        frame: 0,
        tile: 0,
        loopCount: 0,
        alpha: 1,
        angle: 0,
        init: function (sheet, frameTime, sequence, stop) {
            this.sheet = sheet;
            this.pivot = {
                x: sheet.width / 2,
                y: sheet.height / 2
            };
            this.timer = new ig.Timer();
            this.frameTime = frameTime;
            this.sequence = sequence;
            this.stop = !!stop;
            this.tile = this.sequence[0];
        },
        rewind: function () {
            this.timer.set();
            this.loopCount = 0;
            this.frame = 0;
            this.tile = this.sequence[0];
            return this;
        },
        gotoFrame: function (f) {
            this.timer.set(this.frameTime * -f - 0.0001);
            this.update();
        },
        gotoRandomFrame: function () {
            this.gotoFrame(Math.floor(Math.random() * this.sequence.length))
        },
        update: function () {
            var frameTotal = Math.floor(this.timer.delta() / this.frameTime);
            this.loopCount = Math.floor(frameTotal / this.sequence.length);
            if (this.stop && this.loopCount > 0) {
                this.frame = this.sequence.length - 1;
            } else {
                this.frame = frameTotal % this.sequence.length;
            }
            this.tile = this.sequence[this.frame];
        },
        draw: function (targetX, targetY) {
            var bbsize = Math.max(this.sheet.width, this.sheet.height);
            if (targetX > ig.system.width || targetY > ig.system.height || targetX + bbsize < 0 ||
                targetY + bbsize < 0) {
                return;
            }
            if (this.alpha != 1) {
                ig.system.context.globalAlpha = this.alpha;
            }
            if (this.angle == 0) {
                this.sheet.image.drawTile(targetX, targetY, this.tile, this.sheet.width, this.sheet
                    .height, this.flip.x, this.flip.y);
            } else {
                ig.system.context.save();
                ig.system.context.translate(ig.system.getDrawPos(targetX + this.pivot.x), ig.system
                    .getDrawPos(targetY + this.pivot.y));
                ig.system.context.rotate(this.angle);
                this.sheet.image.drawTile(-this.pivot.x, -this.pivot.y, this.tile, this.sheet.width,
                    this.sheet.height, this.flip.x, this.flip.y);
                ig.system.context.restore();
            }
            if (this.alpha != 1) {
                ig.system.context.globalAlpha = 1;
            }
        }
    });
});

// lib/impact/entity.js
ig.baked = true;
ig.module('impact.entity').requires('impact.animation', 'impact.impact').defines(function () {
    "use strict";
    ig.Entity = ig.Class.extend({
        id: 0,
        settings: {},
        size: {
            x: 16,
            y: 16
        },
        offset: {
            x: 0,
            y: 0
        },
        pos: {
            x: 0,
            y: 0
        },
        last: {
            x: 0,
            y: 0
        },
        vel: {
            x: 0,
            y: 0
        },
        accel: {
            x: 0,
            y: 0
        },
        friction: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 100,
            y: 100
        },
        zIndex: 0,
        gravityFactor: 1,
        standing: false,
        bounciness: 0,
        minBounceVelocity: 40,
        anims: {},
        animSheet: null,
        currentAnim: null,
        health: 10,
        type: 0,
        checkAgainst: 0,
        collides: 0,
        _killed: false,
        slopeStanding: {
            min: (44).toRad(),
            max: (136).toRad()
        },
        init: function (x, y, settings) {
            this.id = ++ig.Entity._lastId;
            this.pos.x = this.last.x = x;
            this.pos.y = this.last.y = y;
            ig.merge(this, settings);
        },
        reset: function (x, y, settings) {
            var proto = this.constructor.prototype;
            this.pos.x = x;
            this.pos.y = y;
            this.last.x = x;
            this.last.y = y;
            this.vel.x = proto.vel.x;
            this.vel.y = proto.vel.y;
            this.accel.x = proto.accel.x;
            this.accel.y = proto.accel.y;
            this.health = proto.health;
            this._killed = proto._killed;
            this.standing = proto.standing;
            this.type = proto.type;
            this.checkAgainst = proto.checkAgainst;
            this.collides = proto.collides;
            ig.merge(this, settings);
        },
        addAnim: function (name, frameTime, sequence, stop) {
            if (!this.animSheet) {
                throw ('No animSheet to add the animation ' + name + ' to.');
            }
            var a = new ig.Animation(this.animSheet, frameTime, sequence, stop);
            this.anims[name] = a;
            if (!this.currentAnim) {
                this.currentAnim = a;
            }
            return a;
        },
        update: function () {
            this.last.x = this.pos.x;
            this.last.y = this.pos.y;
            this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
            this.vel.x = this.getNewVelocity(this.vel.x, this.accel.x, this.friction.x, this.maxVel
                .x);
            this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel
                .y);
            var mx = this.vel.x * ig.system.tick;
            var my = this.vel.y * ig.system.tick;
            var res = ig.game.collisionMap.trace(this.pos.x, this.pos.y, mx, my, this.size.x, this
                .size.y);
            this.handleMovementTrace(res);
            if (this.currentAnim) {
                this.currentAnim.update();
            }
        },
        getNewVelocity: function (vel, accel, friction, max) {
            if (accel) {
                return (vel + accel * ig.system.tick).limit(-max, max);
            } else if (friction) {
                var delta = friction * ig.system.tick;
                if (vel - delta > 0) {
                    return vel - delta;
                } else if (vel + delta < 0) {
                    return vel + delta;
                } else {
                    return 0;
                }
            }
            return vel.limit(-max, max);
        },
        handleMovementTrace: function (res) {
            this.standing = false;
            if (res.collision.y) {
                if (this.bounciness > 0 && Math.abs(this.vel.y) > this.minBounceVelocity) {
                    this.vel.y *= -this.bounciness;
                } else {
                    if (this.vel.y > 0) {
                        this.standing = true;
                    }
                    this.vel.y = 0;
                }
            }
            if (res.collision.x) {
                if (this.bounciness > 0 && Math.abs(this.vel.x) > this.minBounceVelocity) {
                    this.vel.x *= -this.bounciness;
                } else {
                    this.vel.x = 0;
                }
            }
            if (res.collision.slope) {
                var s = res.collision.slope;
                if (this.bounciness > 0) {
                    var proj = this.vel.x * s.nx + this.vel.y * s.ny;
                    this.vel.x = (this.vel.x - s.nx * proj * 2) * this.bounciness;
                    this.vel.y = (this.vel.y - s.ny * proj * 2) * this.bounciness;
                } else {
                    var lengthSquared = s.x * s.x + s.y * s.y;
                    var dot = (this.vel.x * s.x + this.vel.y * s.y) / lengthSquared;
                    this.vel.x = s.x * dot;
                    this.vel.y = s.y * dot;
                    var angle = Math.atan2(s.x, s.y);
                    if (angle > this.slopeStanding.min && angle < this.slopeStanding.max) {
                        this.standing = true;
                    }
                }
            }
            this.pos = res.pos;
        },
        draw: function () {
            if (this.currentAnim) {
                this.currentAnim.draw(this.pos.x - this.offset.x - ig.game._rscreen.x, this.pos.y -
                    this.offset.y - ig.game._rscreen.y);
            }
        },
        kill: function () {
            ig.game.removeEntity(this);
        },
        receiveDamage: function (amount, from) {
            this.health -= amount;
            if (this.health <= 0) {
                this.kill();
            }
        },
        touches: function (other) {
            return !(this.pos.x >= other.pos.x + other.size.x || this.pos.x + this.size.x <= other
                .pos.x || this.pos.y >= other.pos.y + other.size.y || this.pos.y + this.size
                .y <= other.pos.y);
        },
        distanceTo: function (other) {
            var xd = (this.pos.x + this.size.x / 2) - (other.pos.x + other.size.x / 2);
            var yd = (this.pos.y + this.size.y / 2) - (other.pos.y + other.size.y / 2);
            return Math.sqrt(xd * xd + yd * yd);
        },
        angleTo: function (other) {
            return Math.atan2((other.pos.y + other.size.y / 2) - (this.pos.y + this.size.y / 2), (
                other.pos.x + other.size.x / 2) - (this.pos.x + this.size.x / 2));
        },
        check: function (other) {},
        collideWith: function (other, axis) {},
        ready: function () {},
        erase: function () {}
    });
    ig.Entity._lastId = 0;
    ig.Entity.COLLIDES = {
        NEVER: 0,
        LITE: 1,
        PASSIVE: 2,
        ACTIVE: 4,
        FIXED: 8
    };
    ig.Entity.TYPE = {
        NONE: 0,
        A: 1,
        B: 2,
        BOTH: 3
    };
    ig.Entity.checkPair = function (a, b) {
        if (a.checkAgainst & b.type) {
            a.check(b);
        }
        if (b.checkAgainst & a.type) {
            b.check(a);
        }
        if (a.collides && b.collides && a.collides + b.collides > ig.Entity.COLLIDES.ACTIVE) {
            ig.Entity.solveCollision(a, b);
        }
    };
    ig.Entity.solveCollision = function (a, b) {
        var weak = null;
        if (a.collides == ig.Entity.COLLIDES.LITE || b.collides == ig.Entity.COLLIDES.FIXED) {
            weak = a;
        } else if (b.collides == ig.Entity.COLLIDES.LITE || a.collides == ig.Entity.COLLIDES.FIXED) {
            weak = b;
        }
        if (a.last.x + a.size.x > b.last.x && a.last.x < b.last.x + b.size.x) {
            if (a.last.y < b.last.y) {
                ig.Entity.seperateOnYAxis(a, b, weak);
            } else {
                ig.Entity.seperateOnYAxis(b, a, weak);
            }
            a.collideWith(b, 'y');
            b.collideWith(a, 'y');
        } else if (a.last.y + a.size.y > b.last.y && a.last.y < b.last.y + b.size.y) {
            if (a.last.x < b.last.x) {
                ig.Entity.seperateOnXAxis(a, b, weak);
            } else {
                ig.Entity.seperateOnXAxis(b, a, weak);
            }
            a.collideWith(b, 'x');
            b.collideWith(a, 'x');
        }
    };
    ig.Entity.seperateOnXAxis = function (left, right, weak) {
        var nudge = (left.pos.x + left.size.x - right.pos.x);
        if (weak) {
            var strong = left === weak ? right : left;
            weak.vel.x = -weak.vel.x * weak.bounciness + strong.vel.x;
            var resWeak = ig.game.collisionMap.trace(weak.pos.x, weak.pos.y, weak == left ? -nudge : nudge,
                0, weak.size.x, weak.size.y);
            weak.pos.x = resWeak.pos.x;
        } else {
            var v2 = (left.vel.x - right.vel.x) / 2;
            left.vel.x = -v2;
            right.vel.x = v2;
            var resLeft = ig.game.collisionMap.trace(left.pos.x, left.pos.y, -nudge / 2, 0, left.size.x,
                left.size.y);
            left.pos.x = Math.floor(resLeft.pos.x);
            var resRight = ig.game.collisionMap.trace(right.pos.x, right.pos.y, nudge / 2, 0, right.size.x,
                right.size.y);
            right.pos.x = Math.ceil(resRight.pos.x);
        }
    };
    ig.Entity.seperateOnYAxis = function (top, bottom, weak) {
        var nudge = (top.pos.y + top.size.y - bottom.pos.y);
        if (weak) {
            var strong = top === weak ? bottom : top;
            weak.vel.y = -weak.vel.y * weak.bounciness + strong.vel.y;
            var nudgeX = 0;
            if (weak == top && Math.abs(weak.vel.y - strong.vel.y) < weak.minBounceVelocity) {
                weak.standing = true;
                nudgeX = strong.vel.x * ig.system.tick;
            }
            var resWeak = ig.game.collisionMap.trace(weak.pos.x, weak.pos.y, nudgeX, weak == top ? -nudge :
                nudge, weak.size.x, weak.size.y);
            weak.pos.y = resWeak.pos.y;
            weak.pos.x = resWeak.pos.x;
        } else if (ig.game.gravity && (bottom.standing || top.vel.y > 0)) {
            var resTop = ig.game.collisionMap.trace(top.pos.x, top.pos.y, 0, -(top.pos.y + top.size.y -
                bottom.pos.y), top.size.x, top.size.y);
            top.pos.y = resTop.pos.y;
            if (top.bounciness > 0 && top.vel.y > top.minBounceVelocity) {
                top.vel.y *= -top.bounciness;
            } else {
                top.standing = true;
                top.vel.y = 0;
            }
        } else {
            var v2 = (top.vel.y - bottom.vel.y) / 2;
            top.vel.y = -v2;
            bottom.vel.y = v2;
            var nudgeX = bottom.vel.x * ig.system.tick;
            var resTop = ig.game.collisionMap.trace(top.pos.x, top.pos.y, nudgeX, -nudge / 2, top.size.x,
                top.size.y);
            top.pos.y = resTop.pos.y;
            var resBottom = ig.game.collisionMap.trace(bottom.pos.x, bottom.pos.y, 0, nudge / 2, bottom.size
                .x, bottom.size.y);
            bottom.pos.y = resBottom.pos.y;
        }
    };
});

// lib/impact/map.js
ig.baked = true;
ig.module('impact.map').defines(function () {
    "use strict";
    ig.Map = ig.Class.extend({
        tilesize: 8,
        width: 1,
        height: 1,
        data: [
            []
        ],
        name: null,
        init: function (tilesize, data) {
            this.tilesize = tilesize;
            this.data = data;
            this.height = data.length;
            this.width = data[0].length;
            this.pxWidth = this.width * this.tilesize;
            this.pxHeight = this.height * this.tilesize;
        },
        getTile: function (x, y) {
            var tx = Math.floor(x / this.tilesize);
            var ty = Math.floor(y / this.tilesize);
            if ((tx >= 0 && tx < this.width) && (ty >= 0 && ty < this.height)) {
                return this.data[ty][tx];
            } else {
                return 0;
            }
        },
        setTile: function (x, y, tile) {
            var tx = Math.floor(x / this.tilesize);
            var ty = Math.floor(y / this.tilesize);
            if ((tx >= 0 && tx < this.width) && (ty >= 0 && ty < this.height)) {
                this.data[ty][tx] = tile;
            }
        }
    });
});

// lib/impact/collision-map.js
ig.baked = true;
ig.module('impact.collision-map').requires('impact.map').defines(function () {
    "use strict";
    ig.CollisionMap = ig.Map.extend({
        lastSlope: 1,
        tiledef: null,
        init: function (tilesize, data, tiledef) {
            this.parent(tilesize, data);
            this.tiledef = tiledef || ig.CollisionMap.defaultTileDef;
            for (var t in this.tiledef) {
                if (t | 0 > this.lastSlope) {
                    this.lastSlope = t | 0;
                }
            }
        },
        trace: function (x, y, vx, vy, objectWidth, objectHeight) {
            var res = {
                collision: {
                    x: false,
                    y: false,
                    slope: false
                },
                pos: {
                    x: x,
                    y: y
                },
                tile: {
                    x: 0,
                    y: 0
                }
            };
            var steps = Math.ceil(Math.max(Math.abs(vx), Math.abs(vy)) / this.tilesize);
            if (steps > 1) {
                var sx = vx / steps;
                var sy = vy / steps;
                for (var i = 0; i < steps && (sx || sy); i++) {
                    this._traceStep(res, x, y, sx, sy, objectWidth, objectHeight, vx, vy, i);
                    x = res.pos.x;
                    y = res.pos.y;
                    if (res.collision.x) {
                        sx = 0;
                        vx = 0;
                    }
                    if (res.collision.y) {
                        sy = 0;
                        vy = 0;
                    }
                    if (res.collision.slope) {
                        break;
                    }
                }
            } else {
                this._traceStep(res, x, y, vx, vy, objectWidth, objectHeight, vx, vy, 0);
            }
            return res;
        },
        _traceStep: function (res, x, y, vx, vy, width, height, rvx, rvy, step) {
            res.pos.x += vx;
            res.pos.y += vy;
            var t = 0;
            if (vx) {
                var pxOffsetX = (vx > 0 ? width : 0);
                var tileOffsetX = (vx < 0 ? this.tilesize : 0);
                var firstTileY = Math.max(Math.floor(y / this.tilesize), 0);
                var lastTileY = Math.min(Math.ceil((y + height) / this.tilesize), this.height);
                var tileX = Math.floor((res.pos.x + pxOffsetX) / this.tilesize);
                var prevTileX = Math.floor((x + pxOffsetX) / this.tilesize);
                if (step > 0 || tileX == prevTileX || prevTileX < 0 || prevTileX >= this.width) {
                    prevTileX = -1;
                }
                if (tileX >= 0 && tileX < this.width) {
                    for (var tileY = firstTileY; tileY < lastTileY; tileY++) {
                        if (prevTileX != -1) {
                            t = this.data[tileY][prevTileX];
                            if (t > 1 && t <= this.lastSlope && this._checkTileDef(res, t, x, y,
                                    rvx, rvy, width, height, prevTileX, tileY)) {
                                break;
                            }
                        }
                        t = this.data[tileY][tileX];
                        if (t == 1 || t > this.lastSlope || (t > 1 && this._checkTileDef(res, t, x,
                                y, rvx, rvy, width, height, tileX, tileY))) {
                            if (t > 1 && t <= this.lastSlope && res.collision.slope) {
                                break;
                            }
                            res.collision.x = true;
                            res.tile.x = t;
                            x = res.pos.x = tileX * this.tilesize - pxOffsetX + tileOffsetX;
                            rvx = 0;
                            break;
                        }
                    }
                }
            }
            if (vy) {
                var pxOffsetY = (vy > 0 ? height : 0);
                var tileOffsetY = (vy < 0 ? this.tilesize : 0);
                var firstTileX = Math.max(Math.floor(res.pos.x / this.tilesize), 0);
                var lastTileX = Math.min(Math.ceil((res.pos.x + width) / this.tilesize), this
                .width);
                var tileY = Math.floor((res.pos.y + pxOffsetY) / this.tilesize);
                var prevTileY = Math.floor((y + pxOffsetY) / this.tilesize);
                if (step > 0 || tileY == prevTileY || prevTileY < 0 || prevTileY >= this.height) {
                    prevTileY = -1;
                }
                if (tileY >= 0 && tileY < this.height) {
                    for (var tileX = firstTileX; tileX < lastTileX; tileX++) {
                        if (prevTileY != -1) {
                            t = this.data[prevTileY][tileX];
                            if (t > 1 && t <= this.lastSlope && this._checkTileDef(res, t, x, y,
                                    rvx, rvy, width, height, tileX, prevTileY)) {
                                break;
                            }
                        }
                        t = this.data[tileY][tileX];
                        if (t == 1 || t > this.lastSlope || (t > 1 && this._checkTileDef(res, t, x,
                                y, rvx, rvy, width, height, tileX, tileY))) {
                            if (t > 1 && t <= this.lastSlope && res.collision.slope) {
                                break;
                            }
                            res.collision.y = true;
                            res.tile.y = t;
                            res.pos.y = tileY * this.tilesize - pxOffsetY + tileOffsetY;
                            break;
                        }
                    }
                }
            }
        },
        _checkTileDef: function (res, t, x, y, vx, vy, width, height, tileX, tileY) {
            var def = this.tiledef[t];
            if (!def) {
                return false;
            }
            var lx = (tileX + def[0]) * this.tilesize,
                ly = (tileY + def[1]) * this.tilesize,
                lvx = (def[2] - def[0]) * this.tilesize,
                lvy = (def[3] - def[1]) * this.tilesize,
                solid = def[4];
            var tx = x + vx + (lvy < 0 ? width : 0) - lx,
                ty = y + vy + (lvx > 0 ? height : 0) - ly;
            if (lvx * ty - lvy * tx > 0) {
                if (vx * -lvy + vy * lvx < 0) {
                    return solid;
                }
                var length = Math.sqrt(lvx * lvx + lvy * lvy);
                var nx = lvy / length,
                    ny = -lvx / length;
                var proj = tx * nx + ty * ny;
                var px = nx * proj,
                    py = ny * proj;
                if (px * px + py * py >= vx * vx + vy * vy) {
                    return solid || (lvx * (ty - vy) - lvy * (tx - vx) < 0.5);
                }
                res.pos.x = x + vx - px;
                res.pos.y = y + vy - py;
                res.collision.slope = {
                    x: lvx,
                    y: lvy,
                    nx: nx,
                    ny: ny
                };
                return true;
            }
            return false;
        }
    });
    var H = 1 / 2,
        N = 1 / 3,
        M = 2 / 3,
        SOLID = true,
        NON_SOLID = false;
    ig.CollisionMap.defaultTileDef = {
        5: [0, 1, 1, M, SOLID],
        6: [0, M, 1, N, SOLID],
        7: [0, N, 1, 0, SOLID],
        3: [0, 1, 1, H, SOLID],
        4: [0, H, 1, 0, SOLID],
        2: [0, 1, 1, 0, SOLID],
        10: [H, 1, 1, 0, SOLID],
        21: [0, 1, H, 0, SOLID],
        32: [M, 1, 1, 0, SOLID],
        43: [N, 1, M, 0, SOLID],
        54: [0, 1, N, 0, SOLID],
        27: [0, 0, 1, N, SOLID],
        28: [0, N, 1, M, SOLID],
        29: [0, M, 1, 1, SOLID],
        25: [0, 0, 1, H, SOLID],
        26: [0, H, 1, 1, SOLID],
        24: [0, 0, 1, 1, SOLID],
        11: [0, 0, H, 1, SOLID],
        22: [H, 0, 1, 1, SOLID],
        33: [0, 0, N, 1, SOLID],
        44: [N, 0, M, 1, SOLID],
        55: [M, 0, 1, 1, SOLID],
        16: [1, N, 0, 0, SOLID],
        17: [1, M, 0, N, SOLID],
        18: [1, 1, 0, M, SOLID],
        14: [1, H, 0, 0, SOLID],
        15: [1, 1, 0, H, SOLID],
        13: [1, 1, 0, 0, SOLID],
        8: [H, 1, 0, 0, SOLID],
        19: [1, 1, H, 0, SOLID],
        30: [N, 1, 0, 0, SOLID],
        41: [M, 1, N, 0, SOLID],
        52: [1, 1, M, 0, SOLID],
        38: [1, M, 0, 1, SOLID],
        39: [1, N, 0, M, SOLID],
        40: [1, 0, 0, N, SOLID],
        36: [1, H, 0, 1, SOLID],
        37: [1, 0, 0, H, SOLID],
        35: [1, 0, 0, 1, SOLID],
        9: [1, 0, H, 1, SOLID],
        20: [H, 0, 0, 1, SOLID],
        31: [1, 0, M, 1, SOLID],
        42: [M, 0, N, 1, SOLID],
        53: [N, 0, 0, 1, SOLID],
        12: [0, 0, 1, 0, NON_SOLID],
        23: [1, 1, 0, 1, NON_SOLID],
        34: [1, 0, 1, 1, NON_SOLID],
        45: [0, 1, 0, 0, NON_SOLID]
    };
    ig.CollisionMap.staticNoCollision = {
        trace: function (x, y, vx, vy) {
            return {
                collision: {
                    x: false,
                    y: false,
                    slope: false
                },
                pos: {
                    x: x + vx,
                    y: y + vy
                },
                tile: {
                    x: 0,
                    y: 0
                }
            };
        }
    };
});

// lib/impact/background-map.js
ig.baked = true;
ig.module('impact.background-map').requires('impact.map', 'impact.image').defines(function () {
    "use strict";
    ig.BackgroundMap = ig.Map.extend({
        tiles: null,
        scroll: {
            x: 0,
            y: 0
        },
        distance: 1,
        repeat: false,
        tilesetName: '',
        foreground: false,
        enabled: true,
        preRender: false,
        preRenderedChunks: null,
        chunkSize: 512,
        debugChunks: false,
        anims: {},
        init: function (tilesize, data, tileset) {
            this.parent(tilesize, data);
            this.setTileset(tileset);
        },
        setTileset: function (tileset) {
            this.tilesetName = tileset instanceof ig.Image ? tileset.path : tileset;
            this.tiles = new ig.Image(this.tilesetName);
            this.preRenderedChunks = null;
        },
        setScreenPos: function (x, y) {
            this.scroll.x = x / this.distance;
            this.scroll.y = y / this.distance;
        },
        preRenderMapToChunks: function () {
            var totalWidth = this.width * this.tilesize * ig.system.scale,
                totalHeight = this.height * this.tilesize * ig.system.scale;
            this.chunkSize = Math.min(Math.max(totalWidth, totalHeight), this.chunkSize);
            var chunkCols = Math.ceil(totalWidth / this.chunkSize),
                chunkRows = Math.ceil(totalHeight / this.chunkSize);
            this.preRenderedChunks = [];
            for (var y = 0; y < chunkRows; y++) {
                this.preRenderedChunks[y] = [];
                for (var x = 0; x < chunkCols; x++) {
                    var chunkWidth = (x == chunkCols - 1) ? totalWidth - x * this.chunkSize : this
                        .chunkSize;
                    var chunkHeight = (y == chunkRows - 1) ? totalHeight - y * this.chunkSize : this
                        .chunkSize;
                    this.preRenderedChunks[y][x] = this.preRenderChunk(x, y, chunkWidth,
                        chunkHeight);
                }
            }
        },
        preRenderChunk: function (cx, cy, w, h) {
            var tw = w / this.tilesize / ig.system.scale + 1,
                th = h / this.tilesize / ig.system.scale + 1;
            var nx = (cx * this.chunkSize / ig.system.scale) % this.tilesize,
                ny = (cy * this.chunkSize / ig.system.scale) % this.tilesize;
            var tx = Math.floor(cx * this.chunkSize / this.tilesize / ig.system.scale),
                ty = Math.floor(cy * this.chunkSize / this.tilesize / ig.system.scale);
            var chunk = ig.$new('canvas');
            chunk.width = w;
            chunk.height = h;
            chunk.retinaResolutionEnabled = false;
            var chunkContext = chunk.getContext('2d');
            ig.System.scaleMode(chunk, chunkContext);
            var screenContext = ig.system.context;
            ig.system.context = chunkContext;
            for (var x = 0; x < tw; x++) {
                for (var y = 0; y < th; y++) {
                    if (x + tx < this.width && y + ty < this.height) {
                        var tile = this.data[y + ty][x + tx];
                        if (tile) {
                            this.tiles.drawTile(x * this.tilesize - nx, y * this.tilesize - ny,
                                tile - 1, this.tilesize);
                        }
                    }
                }
            }
            ig.system.context = screenContext;
            return chunk;
        },
        draw: function () {
            if (!this.tiles.loaded || !this.enabled) {
                return;
            }
            if (this.preRender) {
                this.drawPreRendered();
            } else {
                this.drawTiled();
            }
        },
        drawPreRendered: function () {
            if (!this.preRenderedChunks) {
                this.preRenderMapToChunks();
            }
            var dx = ig.system.getDrawPos(this.scroll.x),
                dy = ig.system.getDrawPos(this.scroll.y);
            if (this.repeat) {
                var w = this.width * this.tilesize * ig.system.scale;
                dx = (dx % w + w) % w;
                var h = this.height * this.tilesize * ig.system.scale;
                dy = (dy % h + h) % h;
            }
            var minChunkX = Math.max(Math.floor(dx / this.chunkSize), 0),
                minChunkY = Math.max(Math.floor(dy / this.chunkSize), 0),
                maxChunkX = Math.ceil((dx + ig.system.realWidth) / this.chunkSize),
                maxChunkY = Math.ceil((dy + ig.system.realHeight) / this.chunkSize),
                maxRealChunkX = this.preRenderedChunks[0].length,
                maxRealChunkY = this.preRenderedChunks.length;
            if (!this.repeat) {
                maxChunkX = Math.min(maxChunkX, maxRealChunkX);
                maxChunkY = Math.min(maxChunkY, maxRealChunkY);
            }
            var nudgeY = 0;
            for (var cy = minChunkY; cy < maxChunkY; cy++) {
                var nudgeX = 0;
                for (var cx = minChunkX; cx < maxChunkX; cx++) {
                    var chunk = this.preRenderedChunks[cy % maxRealChunkY][cx % maxRealChunkX];
                    var x = -dx + cx * this.chunkSize - nudgeX;
                    var y = -dy + cy * this.chunkSize - nudgeY;
                    ig.system.context.drawImage(chunk, x, y);
                    ig.Image.drawCount++;
                    if (this.debugChunks) {
                        ig.system.context.strokeStyle = '#f0f';
                        ig.system.context.strokeRect(x, y, this.chunkSize, this.chunkSize);
                    }
                    if (this.repeat && chunk.width < this.chunkSize && x + chunk.width < ig.system
                        .realWidth) {
                        nudgeX += this.chunkSize - chunk.width;
                        maxChunkX++;
                    }
                }
                if (this.repeat && chunk.height < this.chunkSize && y + chunk.height < ig.system
                    .realHeight) {
                    nudgeY += this.chunkSize - chunk.height;
                    maxChunkY++;
                }
            }
        },
        drawTiled: function () {
            var tile = 0,
                anim = null,
                tileOffsetX = (this.scroll.x / this.tilesize).toInt(),
                tileOffsetY = (this.scroll.y / this.tilesize).toInt(),
                pxOffsetX = this.scroll.x % this.tilesize,
                pxOffsetY = this.scroll.y % this.tilesize,
                pxMinX = -pxOffsetX - this.tilesize,
                pxMinY = -pxOffsetY - this.tilesize,
                pxMaxX = ig.system.width + this.tilesize - pxOffsetX,
                pxMaxY = ig.system.height + this.tilesize - pxOffsetY;
            for (var mapY = -1, pxY = pxMinY; pxY < pxMaxY; mapY++, pxY += this.tilesize) {
                var tileY = mapY + tileOffsetY;
                if (tileY >= this.height || tileY < 0) {
                    if (!this.repeat) {
                        continue;
                    }
                    tileY = (tileY % this.height + this.height) % this.height;
                }
                for (var mapX = -1, pxX = pxMinX; pxX < pxMaxX; mapX++, pxX += this.tilesize) {
                    var tileX = mapX + tileOffsetX;
                    if (tileX >= this.width || tileX < 0) {
                        if (!this.repeat) {
                            continue;
                        }
                        tileX = (tileX % this.width + this.width) % this.width;
                    }
                    if ((tile = this.data[tileY][tileX])) {
                        if ((anim = this.anims[tile - 1])) {
                            anim.draw(pxX, pxY);
                        } else {
                            this.tiles.drawTile(pxX, pxY, tile - 1, this.tilesize);
                        }
                    }
                }
            }
        }
    });
});

// lib/impact/game.js
ig.baked = true;
ig.module('impact.game').requires('impact.impact', 'impact.entity', 'impact.collision-map', 'impact.background-map')
    .defines(function () {
        "use strict";
        ig.Game = ig.Class.extend({
            clearColor: '#000000',
            gravity: 0,
            screen: {
                x: 0,
                y: 0
            },
            _rscreen: {
                x: 0,
                y: 0
            },
            entities: [],
            namedEntities: {},
            collisionMap: ig.CollisionMap.staticNoCollision,
            backgroundMaps: [],
            backgroundAnims: {},
            autoSort: false,
            sortBy: null,
            cellSize: 64,
            _deferredKill: [],
            _levelToLoad: null,
            _doSortEntities: false,
            staticInstantiate: function () {
                this.sortBy = this.sortBy || ig.Game.SORT.Z_INDEX;
                ig.game = this;
                return null;
            },
            loadLevel: function (data) {
                this.screen = {
                    x: 0,
                    y: 0
                };
                this.entities = [];
                this.namedEntities = {};
                for (var i = 0; i < data.entities.length; i++) {
                    var ent = data.entities[i];
                    this.spawnEntity(ent.type, ent.x, ent.y, ent.settings);
                }
                this.sortEntities();
                this.collisionMap = ig.CollisionMap.staticNoCollision;
                this.backgroundMaps = [];
                for (var i = 0; i < data.layer.length; i++) {
                    var ld = data.layer[i];
                    if (ld.name == 'collision') {
                        this.collisionMap = new ig.CollisionMap(ld.tilesize, ld.data);
                    } else {
                        var newMap = new ig.BackgroundMap(ld.tilesize, ld.data, ld.tilesetName);
                        newMap.anims = this.backgroundAnims[ld.tilesetName] || {};
                        newMap.repeat = ld.repeat;
                        newMap.distance = ld.distance;
                        newMap.foreground = !!ld.foreground;
                        newMap.preRender = !!ld.preRender;
                        newMap.name = ld.name;
                        this.backgroundMaps.push(newMap);
                    }
                }
                for (var i = 0; i < this.entities.length; i++) {
                    this.entities[i].ready();
                }
            },
            loadLevelDeferred: function (data) {
                this._levelToLoad = data;
            },
            getMapByName: function (name) {
                if (name == 'collision') {
                    return this.collisionMap;
                }
                for (var i = 0; i < this.backgroundMaps.length; i++) {
                    if (this.backgroundMaps[i].name == name) {
                        return this.backgroundMaps[i];
                    }
                }
                return null;
            },
            getEntityByName: function (name) {
                return this.namedEntities[name];
            },
            getEntitiesByType: function (type) {
                var entityClass = typeof (type) === 'string' ? ig.global[type] : type;
                var a = [];
                for (var i = 0; i < this.entities.length; i++) {
                    var ent = this.entities[i];
                    if (ent instanceof entityClass && !ent._killed) {
                        a.push(ent);
                    }
                }
                return a;
            },
            spawnEntity: function (type, x, y, settings) {
                var entityClass = typeof (type) === 'string' ? ig.global[type] : type;
                if (!entityClass) {
                    throw ("Can't spawn entity of type " + type);
                }
                var ent = new(entityClass)(x, y, settings || {});
                this.entities.push(ent);
                if (ent.name) {
                    this.namedEntities[ent.name] = ent;
                }
                return ent;
            },
            sortEntities: function () {
                this.entities.sort(this.sortBy);
            },
            sortEntitiesDeferred: function () {
                this._doSortEntities = true;
            },
            removeEntity: function (ent) {
                if (ent.name) {
                    delete this.namedEntities[ent.name];
                }
                ent._killed = true;
                ent.type = ig.Entity.TYPE.NONE;
                ent.checkAgainst = ig.Entity.TYPE.NONE;
                ent.collides = ig.Entity.COLLIDES.NEVER;
                this._deferredKill.push(ent);
            },
            run: function () {
                this.update();
                this.draw();
            },
            update: function () {
                if (this._levelToLoad) {
                    this.loadLevel(this._levelToLoad);
                    this._levelToLoad = null;
                }
                this.updateEntities();
                this.checkEntities();
                for (var i = 0; i < this._deferredKill.length; i++) {
                    this._deferredKill[i].erase();
                    this.entities.erase(this._deferredKill[i]);
                }
                this._deferredKill = [];
                if (this._doSortEntities || this.autoSort) {
                    this.sortEntities();
                    this._doSortEntities = false;
                }
                for (var tileset in this.backgroundAnims) {
                    var anims = this.backgroundAnims[tileset];
                    for (var a in anims) {
                        anims[a].update();
                    }
                }
            },
            updateEntities: function () {
                for (var i = 0; i < this.entities.length; i++) {
                    var ent = this.entities[i];
                    if (!ent._killed) {
                        ent.update();
                    }
                }
            },
            draw: function () {
                if (this.clearColor) {
                    ig.system.clear(this.clearColor);
                }
                this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
                this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;
                var mapIndex;
                for (mapIndex = 0; mapIndex < this.backgroundMaps.length; mapIndex++) {
                    var map = this.backgroundMaps[mapIndex];
                    if (map.foreground) {
                        break;
                    }
                    map.setScreenPos(this.screen.x, this.screen.y);
                    map.draw();
                }
                this.drawEntities();
                for (mapIndex; mapIndex < this.backgroundMaps.length; mapIndex++) {
                    var map = this.backgroundMaps[mapIndex];
                    map.setScreenPos(this.screen.x, this.screen.y);
                    map.draw();
                }
            },
            drawEntities: function () {
                for (var i = 0; i < this.entities.length; i++) {
                    this.entities[i].draw();
                }
            },
            checkEntities: function () {
                var hash = {};
                for (var e = 0; e < this.entities.length; e++) {
                    var entity = this.entities[e];
                    if (entity.type == ig.Entity.TYPE.NONE && entity.checkAgainst == ig.Entity.TYPE
                        .NONE && entity.collides == ig.Entity.COLLIDES.NEVER) {
                        continue;
                    }
                    var checked = {},
                        xmin = Math.floor(entity.pos.x / this.cellSize),
                        ymin = Math.floor(entity.pos.y / this.cellSize),
                        xmax = Math.floor((entity.pos.x + entity.size.x) / this.cellSize) + 1,
                        ymax = Math.floor((entity.pos.y + entity.size.y) / this.cellSize) + 1;
                    for (var x = xmin; x < xmax; x++) {
                        for (var y = ymin; y < ymax; y++) {
                            if (!hash[x]) {
                                hash[x] = {};
                                hash[x][y] = [entity];
                            } else if (!hash[x][y]) {
                                hash[x][y] = [entity];
                            } else {
                                var cell = hash[x][y];
                                for (var c = 0; c < cell.length; c++) {
                                    if (entity.touches(cell[c]) && !checked[cell[c].id]) {
                                        checked[cell[c].id] = true;
                                        ig.Entity.checkPair(entity, cell[c]);
                                    }
                                }
                                cell.push(entity);
                            }
                        }
                    }
                }
            }
        });
        ig.Game.SORT = {
            Z_INDEX: function (a, b) {
                return a.zIndex - b.zIndex;
            },
            POS_X: function (a, b) {
                return (a.pos.x + a.size.x) - (b.pos.x + b.size.x);
            },
            POS_Y: function (a, b) {
                return (a.pos.y + a.size.y) - (b.pos.y + b.size.y);
            }
        };
    });

// lib/game/menus.js
ig.baked = true;
ig.module('game.menus').requires('impact.font').defines(function () {
    MenuItem = ig.Class.extend({
        getText: function () {
            return 'none'
        },
        left: function () {},
        right: function () {},
        ok: function () {},
        click: function () {
            this.ok();
            ig.system.canvas.style.cursor = 'auto';
        }
    });
    Menu = ig.Class.extend({
        clearColor: null,
        name: null,
        font: new ig.Font('media/fonts/tungsten-18.png'),
        fontSelected: new ig.Font('media/fonts/tungsten-18-orange.png'),
        fontTitle: new ig.Font('media/fonts/tungsten-48.png'),
        current: 0,
        itemClasses: [],
        items: [],
        init: function () {
            this.y = ig.system.height / 4 + 160;
            for (var i = 0; i < this.itemClasses.length; i++) {
                this.items.push(new this.itemClasses[i]());
            }
        },
        update: function () {
            if (ig.input.pressed('up')) {
                this.current--;
            }
            if (ig.input.pressed('down')) {
                this.current++;
            }
            this.current = this.current.limit(0, this.items.length - 1);
            if (ig.input.pressed('left')) {
                this.items[this.current].left();
            }
            if (ig.input.pressed('right')) {
                this.items[this.current].right();
            }
            if (ig.input.pressed('ok')) {
                this.items[this.current].ok();
            }
            var ys = this.y;
            var xs = ig.system.width / 2;
            var hoverItem = null;
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var w = this.font.widthForString(item.getText()) / 2;
                if (ig.input.mouse.x > xs - w && ig.input.mouse.x < xs + w && ig.input.mouse.y >
                    ys && ig.input.mouse.y < ys + 24) {
                    hoverItem = item;
                    this.current = i;
                }
                ys += 30;
            }
            if (hoverItem) {
                ig.system.canvas.style.cursor = 'pointer';
                if (ig.input.pressed('click')) {
                    hoverItem.click();
                }
            } else {
                ig.system.canvas.style.cursor = 'auto';
            }
        },
        draw: function () {
            if (this.clearColor) {
                ig.system.context.fillStyle = this.clearColor;
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
            }
            var xs = ig.system.width / 2;
            var ys = this.y;
            if (this.name) {
                this.fontTitle.draw(this.name, xs, ys - 160, ig.Font.ALIGN.CENTER);
            }
            for (var i = 0; i < this.items.length; i++) {
                var t = this.items[i].getText();
                if (i == this.current) {
                    this.fontSelected.draw(t, xs, ys, ig.Font.ALIGN.CENTER);
                } else {
                    this.font.draw(t, xs, ys, ig.Font.ALIGN.CENTER);
                }
                ys += 30;
            }
        }
    });
    MenuItemSoundVolume = MenuItem.extend({
        getText: function () {
            return 'Sound Volume: < ' + (ig.soundManager.volume * 100).round() + '% >';
        },
        left: function () {
            ig.soundManager.volume = (ig.soundManager.volume - 0.1).limit(0, 1);
        },
        right: function () {
            ig.soundManager.volume = (ig.soundManager.volume + 0.1).limit(0, 1);
        },
        click: function () {
            if (ig.input.mouse.x > 220) {
                this.right();
            } else {
                this.left();
            }
        }
    });
    MenuItemMusicVolume = MenuItem.extend({
        getText: function () {
            return 'Music Volume: < ' + (ig.music.volume * 100).round() + '% >';
        },
        left: function () {
            ig.music.volume = (ig.music.volume - 0.1).limit(0, 1);
        },
        right: function () {
            ig.music.volume = (ig.music.volume + 0.1).limit(0, 1);
        },
        click: function () {
            if (ig.input.mouse.x > 220) {
                this.right();
            } else {
                this.left();
            }
        }
    });
    MenuItemResume = MenuItem.extend({
        getText: function () {
            return 'Resume';
        },
        ok: function () {
            ig.game.toggleMenu();
        }
    });
    PauseMenu = Menu.extend({
        name: 'Menu',
        clearColor: 'rgba(0,0,0,0.9)',
        itemClasses: [MenuItemSoundVolume, MenuItemMusicVolume, MenuItemResume]
    });
    MenuItemNormalMode = MenuItem.extend({
        getText: function () {
            return 'Play Normal Mode';
        },
        ok: function () {
            ig.game.difficulty = 'NORMAL';
            ig.game.setGame();
        }
    });
    MenuItemExpertMode = MenuItem.extend({
        getText: function () {
            return 'Play Expert Mode';
        },
        ok: function () {
            ig.game.difficulty = 'EXPERT';
            ig.game.setGame();
        }
    });
    MenuItemSoundMenu = MenuItem.extend({
        getText: function () {
            return 'Sound Menu/Pause (ESC Key)';
        },
        ok: function () {
            ig.game.toggleMenu();
        }
    });
    TitleMenu = Menu.extend({
        itemClasses: [MenuItemNormalMode, MenuItemExpertMode, MenuItemSoundMenu]
    });
    MenuItemBack = MenuItem.extend({
        getText: function () {
            return 'Back to Title';
        },
        ok: function () {
            ig.game.setTitle();
        }
    });
    GameOverMenu = Menu.extend({
        init: function () {
            this.parent();
            this.y = ig.system.height / 4 + 240;
        },
        itemClasses: [MenuItemBack]
    });
});

// lib/game/words.js
ig.baked = true;
ig.module('game.words').defines(function () {
    WORDS = {
        2: ["не", "на", "он", "но", "мы", "из", "то", "за", "от", "ты", "же", "вы", 
            "бы", "до", "её", "ну", "их", "ли", "ни", "да", "уж", "ум", "ах", "ой", 
            "юг", "ох", "эх", "ус", "эй", "ад", "ил", "яд", "ай", "ух", "ха", "щи", 
            "ёж", "яр", "ор", "чё", "ас", "хм", "фу", "шо", "аз", "хо", "ок", "як"
        ],
        3: ["что", "это", "она", "они", "как", "год", "так", "для", "все", "тот", "его", "или", 
            "ещё", "уже", "сам", "вот", "наш", "мой", "при", "кто", "два", "раз", "где", "там", 
            "под", "без", "тут", "нет", "дом", "чем", "мир", "вид", "три", "ваш", "над", "час", 
            "бог", "имя", "оно", "про", "суд", "век", "сын", "муж", "оба", "ряд", "ход", "лес", 
            "зал", "шаг", "сей", "тип", "пол", "род", "дух", "сон", "ухо", "нос", "сад", "рот", 
            "ибо", "сто", "бой", "зуб", "акт", "дед", "чай", "газ", "мол", "май", "шея", "чей", 
            "том", "лоб", "бок", "дно", "тон", "фон", "шум", "нож", "вон", "лев", "лёд", "рад", 
            "вне", "дым", "зря", "еда", "зло", "вес", "миг", "увы", "мэр", "луч", "дар", "шар", 
            "шеф", "кот", "ага", "иск", "цех", "дон", "вуз", "сок", "хор", "быт", "меч", "пёс", 
            "яма", "пот", "вор", "миф", "ген", "эра", "суп", "мяч", "пар", "бар", "рай", "тур", 
            "раб", "лук", "ток", "угу", "чин", "рог", "тыл", "бык", "меж", "рак", "жир", "щит", 
            "ось", "сэр", "зад", "сыр", "код", "мёд", "бег", "гад", "дуб", "жар", "луг", "шов", 
            "ять", "вал", "шоу", "душ", "гул", "пик", "мат", "шок", "зам", "люк", "бак", "эхо", 
            "бал", "маг", "ура", "бес", "низ", "шут", "рёв", "поп", "таз", "око", "мех", "лик", 
            "лад", "вой", "жук", "лён", "бас", "ком", "пир", "ель", "гол", "бор", "кит", "пан", 
            "лак", "пух", "кол", "рок", "лёт", "чек", "ион", "жид", "кон", "мох", "лом", "боб", 
            "зэк", "мел", "воз", "зов", "иль", "ото", "уют", "чех", "док", "ого", "лай", "зек", 
            "пыл", "ишь", "мыс", "шип", "бум", "ров", "фиг", "бич", "мах", "сук", "мак", "уха", 
            "щас", "пуд", "куб", "хан", "хит", "люд", "ник", "фея", "узы", "ива", "хам", "чан", 
            "йод", "сие", "рис", "пай", "гид", "зав", "пах", "шик", "сан", "икс", "ода", "туз", 
            "иго", "мор", "сев", "сор", "явь", "рой", "шах", "зуд", "лаз", "риф", "тиф", "нюх", 
            "тюк", "ром", "кум", "оса", "рус", "тир", "топ", "вол", "жэк", "сом", "тор", "рык", 
            "лис", "лов"
        ],
        4: ["быть", "этот", "свой", "весь", "один", "если", "дело", "день", "рука", "надо", "идти",
            "лицо", "друг", "глаз", "тоже", "жить", "сила", "дать", "вода", "отец", "нога", "ночь",
            "стол", "жена", "твой", "пока", "свет", "пора", "путь", "душа", "куда", "иной", "мать",
            "язык", "мама", "уйти", "цель", "утро", "роль", "тело", "труд", "мера", "пять", "окно",
            "идея", "чуть", "вещь", "цена", "план", "речь", "срок", "опыт", "хоть", "брат", "пить",
            "игра", "рост", "тема", "либо", "край", "туда", "небо", "поле", "банк", "союз", "врач",
            "факт", "угол", "чтоб", "двор", "вера", "цвет", "море", "круг", "поэт", "пара", "мало",
            "удар", "база", "сюда", "рано", "папа", "петь", "губа", "дома", "дочь", "лето", "тихо",
            "зато", "курс", "река", "лист", "воля", "снег", "едва", "итог", "ясно", "зона", "гора",
            "метр", "боль", "звук", "враг", "этап", "кожа", "знак", "бить", "дядя", "учёт", "хлеб",
            "зима", "сеть", "суть", "клуб", "семь", "этаж", "двое", "вниз", "кино", "явно", "долг",
            "есть", "тень", "храм", "ужас", "март", "дама", "стул", "след", "рыба", "дума", "чудо",
            "мозг", "пост", "июнь", "дача", "вряд", "баба", "вино", "спор", "вкус", "ключ", "слой",
            "июль", "слух", "мимо", "ящик", "царь", "смех", "беда", "блок", "урок", "часы", "крик",
            "мясо", "щека", "обед", "парк", "грех", "мост", "вход", "кадр", "тётя", "штаб", "итак",
            "кофе", "злой", "трое", "сбор", "штат", "куст", "пиво", "риск", "брак", "село", "шанс",
            "очки", "ныне", "вина", "юный", "пыль", "уход", "чего", "танк", "жаль", "цепь", "полк",
            "конь", "гроб", "дата", "темп", "узел", "шкаф", "горе", "матч", "плод", "борт", "мода",
            "луна", "груз", "пуля", "жест", "цикл", "руль", "роза", "указ", "мина", "дитя", "боец",
            "флот", "куча", "мука", "яйцо", "лапа", "пища", "тьма", "соль", "внук", "баня", "гриб",
            "цирк", "пояс", "граф", "кафе", "мышь", "ужин", "волк", "жанр", "нерв", "перо", "офис",
            "толк", "сайт", "изба", "течь", "порт", "юмор", "холм", "печь", "сорт", "лифт", "фото",
            "дыра", "плюс", "себе", "ритм", "воин", "жара", "бюро", "вред", "рота", "поза", "дура",
            "верх", "рана", "флаг", "фаза", "щель", "гнев", "мыть", "плащ", "ярко", "каша", "муха",
            "семя", "диск", "юбка", "ядро", "пляж", "тест", "эфир", "пруд", "крем", "звон", "туча",
            "слон", "вена", "нота", "взор", "стук", "кран", "хрен", "нить", "ранг", "стыд", "приз",
            "духи", "ёлка", "лужа", "плен", "рейс", "заяц", "было", "бред", "рама", "атом", "змея",
            "веко", "уста", "буря", "скот", "орел", "упор", "коса", "дуть", "кора", "марш", "нуль",
            "чаша", "шуба", "мент", "лыжа", "даль", "хаос", "нрав", "хата", "гром", "овца", "заря",
            "очаг", "сено", "литр", "мыло", "ниже", "тяга", "коза", "ниша", "свод", "мрак", "рожа",
            "руда", "шить", "орех", "дева", "пена", "ввод", "икра", "шина", "нары", "тигр", "укол",
            "стая", "гимн", "мощь", "грек", "джип", "окоп", "тост", "вяло", "негр", "стон", "сухо",
            "сало", "ваза", "игла", "тёща", "весы", "живо", "торг", "жечь", "ложа", "бомж", "такт",
            "гусь", "факс", "прах", "араб", "стаж", "алый", "шлем", "балл", "жюри", "нора", "сейф",
            "утка", "лига", "арка", "таки", "блин", "змей", "фара", "туго", "чушь", "медь", "сани",
            "узор", "бокс", "град", "холл", "сбыт", "дуга", "корм", "плач", "роща", "трюк", "выть",
            "зять", "бунт", "джаз", "липа", "муза", "клок", "мощи", "торт", "выше", "фунт", "езда",
            "жать", "меню", "стих", "ноль", "пуск", "титр", "тьфу", "ежик", "соус", "тупо", "крах",
            "шрам", "близ", "обои", "штык", "клей", "лить", "визг", "лихо", "стан", "залп", "ныть",
            "паук", "суша", "трап", "алло", "прут", "шарф", "яхта", "винт", "спад", "грош", "дуэт",
            "пень", "миля", "няня", "пила", "срыв", "борщ", "дань", "крюк", "гель", "сени", "шнур",
            "дико", "жопа", "такой"],
        5: ["такой", "время", "когда", "знать", "стать", "чтобы", "жизнь", "очень", "новый", "можно", "какой", "после", 
            "самый", "потом", "слово", "место", "иметь", "ничто", "тогда", "через", "здесь", "более", "конец", "перед", 
            "между", "пойти", "часть", "город", "также", "никто", "взять", "вдруг", "почти", "земля", "общий", "сразу", 
            "выйти", "много", "право", "дверь", "образ", "закон", "война", "голос", "найти", "книга", "любой", "число", 
            "народ", "ждать", "нужно", "форма", "связь", "кроме", "опять", "белый", "улица", "вечер", "снова", "мысль", 
            "месяц", "школа", "среди", "театр", "рубль", "смысл", "рядом", "назад", "орган", "живой", "рынок", "вести", 
            "семья", "давно", "центр", "ответ", "автор", "стена", "часто", "смочь", "долго", "зачем", "совет", "затем", 
            "глава", "наука", "плечо", "точка", "далее", "около", "брать", "целый", "спать", "может", "палец", "пусть", 
            "войти", "номер", "ехать", "метод", "фильм", "менее", "гость", "кровь", "район", "армия", "класс", "герой", 
            "спина", "сцена", "сесть", "будто", "уметь", "всего", "домой", "скоро", "разве", "объем", "берег", "фирма", 
            "завод", "точно", "снять", "песня", "чужой", "легко", "роман", "стихи", "видно", "повод", "малый", "успех", 
            "выход", "текст", "вовсе", "убить", "пункт", "столь", "линия", "среда", "волос", "никак", "ветер", "огонь", 
            "грудь", "страх", "звать", "сумма", "вновь", "прямо", "сфера", "иначе", "вчера", "плохо", "расти", "мужик", 
            "немец", "некий", "выбор", "масса", "шесть", "нести", "слава", "кухня", "вроде", "левый", "отдел", "товар", 
            "актер", "слеза", "вывод", "норма", "возле", "рамка", "лучше", "ладно", "прием", "тихий", "режим", "целое", 
            "вирус", "поиск", "налог", "доход", "карта", "давай", "божий", "сорок", "акция", "сосед", "фраза", "толпа", 
            "серый", "схема", "волна", "птица", "запах", "яркий", "поезд", "адрес", "лидер", "резко", "умный", "стиль", 
            "весна", "ясный", "милый", "эпоха", "запад", "тайна", "трава", "дойти", "узкий", "лично", "фронт", "музей", 
            "князь", "сутки", "зайти", "судья", "крыша", "нечто", "поток", "честь", "еврей", "сотня", "дождь", "сухой", 
            "синий", "труба", "осень", "пьеса", "черта", "вверх", "молча", "кусок", "учить", "билет", "масло", "экран", 
            "канал", "вагон", "пятый", "дурак", "сезон", "запас", "длина", "крыло", "округ", "доска", "вдоль", "полет", 
            "ранее", "пакет", "важно", "живот", "голый", "смена", "редко", "таков", "порог", "буква", "лодка", "серия", 
            "шутка", "кулак", "южный", "нефть", "цифра", "сапог", "дикий", "жилье", "мешок", "отказ", "замок", "диван", 
            "добро", "покой", "вслед", "кость", "спорт", "особо", "майор", "отдых", "ручка", "мечта", "сюжет", "рубеж", 
            "крест", "взрыв", "почва", "чисто", "заказ", "штука", "сумка", "сойти", "хвост", "песок", "озеро", "строй", 
            "жалко", "дочка", "танец", "сдать", "набор", "горло", "плата", "съезд", "путем", "кошка", "верно", "пятно", 
            "лезть", "ткань", "визит", "каков", "океан", "пауза", "ствол", "тепло", "радио", "зверь", "нация", "банка", 
            "четко", "метро", "везде", "отчёт", "обмен", "тоска", "забор", "мороз", "марка", "грязь", "спрос", "мотор", 
            "везти", "север", "склад", "мотив", "арест", "отряд", "нужда", "собор", "сзади", "внизу", "салон", "капля", 
            "пожар", "холод", "тётка", "якобы", "обида", "рыжий", "вклад", "гонка", "рукав", "туман", "шофер", "врать", 
            "атака", "игрок", "плыть", "тонна", "вождь", "орден", "юноша", "бабка", "вызов", "полка", "ровно", "бровь", 
            "удача", "бытие", "орать", "шапка", "ложка", "белок", "голод", "нигде", "охота", "домик", "замуж", "ветка", 
            "башня", "тариф", "агент", "гений", "сахар", "благо", "жилой", "смесь", "разум", "плита", "брюки", "мышца", 
            "вечно", "явный", "посол", "пачка", "шоссе", "икона", "халат", "идеал", "лента", "бомба", "штамм", "сиять", 
            "ущерб", "архив", "вслух", "мягко", "сырье", "штаны", "поход", "худой", "морда", "проза", "маска", "опера", 
            "шляпа", "бельё", "ведро", "седой", "лампа", "малыш", "одеть", "облик", "слева", "копия", "гнать", "уголь", 
            "устав", "нынче", "судно", "чашка", "элита", "ветвь", "почта", "палка", "актив", "столб", "ангел", "штраф", 
            "отель", "мышка", "ножка", "свеча", "снизу", "блюдо", "грань", "скала", "такси", "зерно", "сосна", "форум", 
            "блеск", "папка", "сбить", "степь", "ковер", "пламя", "треть", "слабо", "певец", "ружьё", "речка", "сырой", 
            "финал", "недра", "девка", "знамя", "исход", "общее", "звено", "грипп", "печка", "шёпот", "пилот", "плоть", 
            "самец", "череп", "бочка", "гараж", "сосуд", "поэма", "склон", "лавка", "бокал", "кисть", "идиот", "койка", 
            "тесно", "якорь", "дрова", "ворот", "опора", "учёба", "топор", "физик", "барон", "барак", "кукла", "жених", 
            "носок", "всюду", "обувь", "намёк", "котёл", "принц", "ловко", "пушка", "бедро", "свыше", "порыв", "сетка", 
            "сарай", "опрос", "прочь", "старт", "шкура", "драка", "проба", "казак", "мусор", "влечь", "моряк", "самка", 
            "туфля", "химия", "мадам", "племя", "тупой", "кубок", "полно", "ягода", "битва", "монах", "грамм", "дырка", 
            "побег", "базар", "драма", "отбор", "рвать", "спирт", "кузов", "ванна", "канон", "рыбак", "ребро", "мамин", 
            "сжечь", "фрукт", "вдова", "грубо", "балет", "весть", "казнь", "навык", "пение", "ручей", "взвод", "спеть", 
            "касса", "щенок", "вздох", "юрист", "шахта", "букет", "тираж", "шпион", "жилец", "тезис", "залог", "струя", 
            "остро", "очерк", "буфет", "жажда", "сдача", "сжать", "смело", "овощи", "пасть", "жарко", "нитка", "разом", 
            "рояль", "пацан", "суета", "козёл", "наряд", "тайга", "петля", "сбоку", "темно", "пласт", "обман", "шарик", 
            "рычаг", "злоба", "песнь", "нежно", "стадо", "вдвое", "глина", "выезд", "закат", "вдали", "висок", "обзор", 
            "завет", "искра", "погон", "взнос", "слуга", "крыса", "культ", "сынок", "былой", "довод", "спуск", "чайка", 
            "гордо", "грунт", "обыск", "заряд", "купол", "отзыв", "позор", "вопль", "катер", "цыган", "алмаз", "лысый", 
            "минус", "обряд", "поляк", "тупик", "тропа", "рельс", "дилер", "ферма", "горка", "пирог", "сталь", "табак", 
            "почка", "тварь", "залив", "испуг", "аллея", "вилка", "петух", "фокус", "показ", "жадно", "овраг", "гроза", 
            "полюс", "русло", "будка", "олень", "рубка", "рыбка", "трусы", "босой", "салат", "банда", "борец", "обрыв", 
            "хохот", "ввиду", "комар", "майка", "парус", "перец", "пират", "стенд", "глупо", "ежели", "мирно", "упрек", 
            "хутор", "биржа", "исток", "налёт", "сытый", "фасад", "истец", "пытка", "турок", "низко", "этика", "виски", 
            "жрать", "влага", "густо", "новое", "сеанс", "мэрия", "палач", "шумно", "клоун", "треск", "башка", "сплав", 
            "ссора", "медик", "насос", "скука", "шкала", "арена", "имидж", "ласка", "титул", "даром", "киоск", "круто", 
            "парта", "повар", "затея", "парад", "пучок", "газон", "пятка", "сшить", "крона", "ожить", "равно", "синяк", 
            "рывок", "умело", "взлет", "пепел", "робко", "седло", "штурм", "проём", "чуять", "бодро", "глухо", "негде", 
            "немой", "влево", "дрожь", "каюта", "кишка", "купец", "сдвиг", "штора", "бремя", "пусто", "тощий", "вовсю", 
            "нищий", "пафос", "кепка", "косой", "миска", "багаж", "конек", "манеж", "месть", "тайно", "чулок", "дрянь", 
            "кумир", "садик", "свист", "тугой", "азарт", "геном", "гудок", "квота", "таять", "лимон", "стопа", "белка", 
            "вялый", "обход", "ролик", "слюна", "щедро", "жутко", "мелко", "оклад", "бегом", "бетон", "камин", "пульт", 
            "гамма", "мерка", "афиша", "вахта", "груда", "лгать", "папин", "родня", "тонко", "донос", "особа", "таить", 
            "шорох", "штамп", "греть", "некто", "бланк", "брюхо", "груша", "магия", "скрип", "сущий", "талия", "тесто", 
            "хмуро", "бабий", "вышка", "ларек", "сквер", "вилла", "лапка", "уютно", "кучка", "лихой", "пчела", "скула", 
            "абзац", "пасха", "франк", "бугор", "напор", "казна", "копьё", "балка", "весло", "зачет", "кубик", "сеять", 
            "червь", "щетка", "досуг", "вихрь", "сверх", "чутье", "венец", "косяк", "нюанс", "шашка", "чудак", "въезд", 
            "вылет", "глубь", "корма", "пульс", "шишка", "акула", "отсек", "приют", "свита", "кража", "лилия", "факел", 
            "шланг", "арбуз", "венок", "диета", "корка", "назло", "дуэль", "канат", "рубин", "баран", "холст", "колея", 
            "мафия", "рация", "будни", "бурый", "износ", "комок", "робот", "грант", "бурно", "глыба", "изгиб", "рифма", 
            "фланг", "эскиз", "бухта", "нутро", "тачка", "финиш", "химик", "чудом", "извне", "битый", "вальс", "сокол", 
            "черёд", "чукча", "броня", "возня", "каска", "мятый", "салют", "баржа", "говно", "дебют", "девиз", "макет", 
            "опека", "подол", "почёт", "толща", "вывоз", "рента", "каток", "лютый", "отрыв", "уклон", "шприц", "веник", 
            "жулик", "кофта", "недуг", "особь", "отбой", "тесть", "богач", "вдаль", "мячик", "навоз", "ощупь", "сироп", 
            "тяжко", "хитро", "видео", "вишня", "донор", "дымок", "капот", "набок", "нагло", "смола", "сыщик", "барин", 
            "выкуп", "заход", "отвод", "сопка", "банан", "житие", "зенит", "лунка", "матка", "поить", "посев", "рыбий", 
            "устье", "канун", "малое", "навес", "парик", "пресс", "аванс", "жилка", "лаять", "ордер", "откос", "сабля", 
            "сизый", "смыть", "ссуда", "уклад", "шторм", "пешка", "русый", "отход", "тракт", "узник", "шасси", "явить", 
            "веять", "дробь", "крупа", "мираж", "полис", "улика", "этнос", "губка", "душно", "метла", "руины", "слать", 
            "талон", "уныло", "лоток", "сауна", "секта", "сенат", "слить", "слышь", "авось", "мачта", "порох", "прядь", 
            "тахта", "шакал", "горох", "завал", "лимит", "раунд", "шрифт", "долой", "дымка", "заезд", "зиять", "паста", 
            "страж", "сукно", "филин", "молот", "озноб", "синод", "топот", "бренд", "гладь", "графа", "загар", "кабак", 
            "почём", "фотка", "хруст", "чехол", "байка", "валун", "взмах", "выпад", "иудей", "леший", "линза", "нажим", 
            "ничья", "обить", "рябой", "уксус", "брань", "брэнд", "бычок", "вожак", "кефир", "кивок", "мойка", "наезд", 
            "носик", "порча", "хорёк", "штрих", "атлас", "бутик", "виток", "лавра", "мятеж", "подле", "смять", "сосок", 
            "трата", "булат", "впору", "гулко", "едкий", "нотка", "созыв", "устой", "ворох", "вычет", "гнуть", "дозор", 
            "мякиш", "рыжик", "фишка", "шейка", "шпага", "драть", "карий", "кудри", "лопух", "наяву", "ничей", "отчим", 
            "разок", "слива", "шорты", "щепка", "яичко", "зреть", "криво", "ловля", "мытьё", "пеший", "полог", "пудра", 
            "смута", "акциз", "батон", "ворон", "врата", "галка", "гнить", "грива", "денёк", "дубль", "кабан", "камыш", 
            "кочка", "крыть", "лакей", "наган", "немка", "пнуть", "пурга", "флора", "чугун", "шалаш", "шаман", "шатёр", 
            "ширма", "шпана", "альфа", "вбить", "вздор", "гайка", "гряда", "комод", "метан", "милая", "осина", "отпор", 
            "пасти", "полый", "резон", "смета", "счёты", "тенор", "топка", "хилый", "шайка", "гусар", "досье", "курок", 
            "мощно", "рожок", "сроду", "выдох", "древо", "жилет", "лицей", "масть", "охват", "питьё", "тыква", "фанат", 
            "чрево", "шибко", "амбар", "детка", "мушка", "ореол", "санки", "титан", "фауна", "часик", "берет", "булка", 
            "варяг", "дурно", "конус", "лазер", "лапша", "мести", "порой", "ржать", "сапер", "танго", "хобби", "шайба", 
            "келья", "сушка", "тиран", "тлеть", "аминь", "бутон", "вкупе", "догма", "запор", "обвал", "окрик", "очный", 
            "свято", "смотр", "сотка", "тошно", "укроп", "флюид", "бойко", "главк", "гольф", "днище", "ересь", "томик", 
            "тумба", "умник", "фужер", "чутко", "браво", "зябко", "иврит", "изъян", "казах", "лютик", "мания", "отрок", 
            "паром", "пинок", "фигня", "хмель", "чужак", "шпиль", "эмаль", "блоха", "влить", "вырез", "глушь", "горец", 
            "житьё", "калий", "краса", "ладья", "мамка", "ножик", "норка", "оксид", "рулон", "сучок", "тонус", "уступ", 
            "эгида", "вожжа", "кучер", "мигом", "накал", "обрез", "пайка", "потоп", "слыть", "торец", "узбек", "шубка", 
            "ярлык", "буран", "волхв", "клерк", "кроха", "литой", "ослик", "отвар", "отлёт", "пашня", "пенёк", "пупок", 
            "слепо", "чешуя", "вынос", "декан", "зажим", "зазор", "засов", "козий", "леска", "ляжка", "мазут", "молва", 
            "мумия", "обруч", "отлив", "плеть", "посох", "рознь", "склеп", "тёзка", "томат", "тулуп", "шпала", "бегло", 
            "буфер", "декор", "колос", "нагой", "полив", "пятак", "рвота", "сброс", "сифон", "сонно", "спазм", "табор", 
            "телец", "тюбик", "хвала", "шитьё", "астра", "бачок", "варка", "ввысь", "зайка", "зелье", "лямка", "отток", 
            "скоба", "ареал", "аудит", "базис", "дамба", "делец", "егерь", "жучок", "завуч", "зубец", "метка", "набег", 
            "ножны", "опись", "ртуть", "чувак", "аршин", "басня", "вещий", "говор", "дебри", "десна", "жердь", "лотос", 
            "обуть", "осада", "отвал", "перст", "сотый", "спица", "столп", "такса", "транс", "убыль", "ангар", "афёра", 
            "вираж", "впрок", "гонец", "индус", "итого", "казус", "кореш", "лиана", "окунь", "охать", "рубец", "сдуть", 
            "седан", "траур", "фасон", "фляга", "чёлка", "чудно", "шлейф", "шмель", "щёчка", "юнкер", "ахать", "бидон", 
            "бойня", "брить", "валик", "дыбом", "ёмкий", "жетон", "загон", "кулик", "плеск", "сашин", "тембр", "турне", 
            "унять", "хобот", "чулан", "шельф", "шквал", "бедно", "бирюк", "каста", "котик", "ликёр", "оазис", "пижон", 
            "пицца", "побои", "скупо", "смерч", "стужа", "умыть", "чаять", "щиток", "бисер", "вояка", "годик", "доить", 
            "жесть", "кадка", "короб", "латыш", "мудро", "оплот", "панно", "песец", "посад", "прима", "рафик", "хиппи", 
            "циник", "чтить", "аркан", "джинн", "дятел", "замер", "зорко", "изыск", "колба", "кредо", "левша", "лесть", 
            "локон", "ломка", "наказ", "покои", "родич", "сдуру", "совок", "тазик", "тапка", "тушка", "хохол", "чинно", 
            "бочок", "внять", "гарем", "гниль", "злить", "изгой", "копна", "ладан", "литьё", "метко", "млеть", "плато", 
            "ранка", "резец", "сопли", "судак", "табло", "талый", "терем", "шажок", "бубен", "гамак", "жабра", "кадет", 
            "кулёк", "кураж", "лисий", "навек", "откат", "падеж", "пушок", "резво", "тягач", "уазик", "фугас", "чурка", 
            "чуток", "астма", "бронь", "бычий", "вьюга", "задор", "кварц", "лесок", "мазок", "марля", "табун", "хлыст", 
            "цепко", "брешь", "давка", "дрозд", "кадык", "кобра", "круиз", "кузен", "кушак", "кювет", "лихва", "маляр", 
            "мнить", "нахал", "пикет", "радар", "рокот", "румын", "рупор", "самбо", "сачок", "трель", "хакер", "книзу", 
            "слизь", "дедов", "колин", "снедь", "фикус", "врозь", "дупло", "куцый", "чернь", "витой", "кольт", "ясень", 
            "бобёр", "дзюдо", "опала"
    ],
    6: ["только", "другой", "первый", "работа", "хотеть", "должен", "сейчас", "каждый", "теперь", "видеть", "вопрос", "потому", 
        "думать", "страна", "случай", "голова", "делать", "просто", "всегда", "понять", "второй", "именно", "сидеть", "прийти", 
        "деньги", "почему", "любить", "стоить", "машина", "однако", "хорошо", "начать", "совсем", "писать", "лучший", "власть", 
        "стоять", "вообще", "тысяча", "больше", "вместе", "решить", "пройти", "статья", "полный", "всякий", "группа", "давать", 
        "старый", "начало", "разный", "нужный", "минута", "многий", "черный", "дорога", "любовь", "взгляд", "играть", "лежать", 
        "нельзя", "момент", "читать", "письмо", "помощь", "бывать", "ходить", "равный", "смерть", "задача", "важный", "значит", 
        "третий", "быстро", "правда", "партия", "иногда", "сердце", "неделя", "данный", "узнать", "газета", "против", "четыре", 
        "основа", "вполне", "данные", "мнение", "забыть", "проект", "ранний", "особый", "плохой", "скорый", "помочь", "служба", 
        "судьба", "правый", "состав", "словно", "искать", "объект", "период", "успеть", "лёгкий", "пример", "десять", "верить", 
        "купить", "воздух", "бывший", "борьба", "кстати", "размер", "доллар", "музыка", "память", "причём", "встать", "дерево", 
        "добрый", "хозяин", "обычно", "далеко", "солнце", "способ", "трудно", "журнал", "оценка", "единый", "низкий", "регион", 
        "чистый", "весьма", "анализ", "бумага", "вместо", "вокруг", "откуда", "модель", "старик", "личный", "ребята", "высший", 
        "прежде", "знание", "тёмный", "защита", "сильно", "бежать", "доктор", "солдат", "оружие", "парень", "зрение", "отдать", 
        "боевой", "завтра", "услуга", "видимо", "бизнес", "долгий", "прямой", "собака", "камень", "выпить", "здание", "вперёд", 
        "пустой", "бюджет", "многое", "победа", "желать", "звезда", "сестра", "карман", "родной", "войско", "офицер", "предел", 
        "выборы", "уехать", "учёный", "судить", "теория", "святой", "точный", "занять", "носить", "частый", "тонкий", "вскоре", 
        "сквозь", "клетка", "расчёт", "мелкий", "упасть", "ошибка", "теплый", "колено", "стекло", "высота", "трубка", "мастер", 
        "мешать", "подход", "ресурс", "улыбка", "артист", "фигура", "список", "решать", "усилие", "остров", "прочий", "житель", 
        "слабый", "одежда", "ездить", "кресло", "летний", "ладонь", "поздно", "цветок", "лесной", "прочее", "январь", "фактор", 
        "август", "охрана", "расход", "редкий", "верный", "родина", "лагерь", "клиент", "беседа", "задний", "слегка", "апрель", 
        "кодекс", "острый", "отсюда", "мягкий", "ночной", "падать", "бедный", "суметь", "вечный", "восемь", "лишний", "нижний", 
        "меньше", "лететь", "многие", "висеть", "костюм", "свежий", "лошадь", "ученик", "высоко", "спасти", "подать", "приказ", 
        "жертва", "восток", "желтый", "спустя", "мощный", "гореть", "польза", "звонок", "оттуда", "деталь", "тишина", "тюрьма", 
        "книжка", "менять", "скажем", "угроза", "должно", "терять", "стакан", "запись", "тяжело", "палата", "ноябрь", "потеря", 
        "нечего", "ввести", "болеть", "тянуть", "колесо", "камера", "громко", "оплата", "курить", "сверху", "эффект", "доклад", 
        "платье", "честно", "помимо", "дышать", "ремонт", "широко", "корень", "видный", "внутри", "резкий", "ракета", "строго", 
        "выпуск", "корпус", "талант", "похоже", "полоса", "мокрый", "дворец", "забота", "выдать", "пьяный", "столик", "насчет", 
        "печать", "гулять", "кольцо", "бегать", "весело", "ворота", "дружба", "устать", "земной", "кредит", "металл", "внести", 
        "молоко", "поэзия", "краска", "глупый", "сигнал", "золото", "крайне", "премия", "король", "отойти", "чтение", "ставка", 
        "больно", "ценный", "статус", "сказка", "версия", "горный", "пенсия", "девять", "никуда", "кризис", "яблоко", "сделка", 
        "строка", "надеть", "погода", "пресса", "жалеть", "немало", "вокзал", "гибель", "лишить", "могила", "пожать", "стенка", 
        "тайный", "логика", "крепко", "термин", "велеть", "прибор", "другое", "оборот", "секрет", "пальто", "нежный", "порода", 
        "оттого", "зимний", "мебель", "мирный", "костер", "ловить", "стадия", "густой", "звание", "убрать", "раздел", "сектор", 
        "учение", "летать", "символ", "близко", "привет", "съёмка", "добыча", "корова", "отпуск", "задать", "родить", "учесть", 
        "отнюдь", "стыдно", "эпизод", "крутой", "съесть", "облако", "отчего", "бандит", "грубый", "шестой", "сунуть", "куртка", 
        "физика", "приход", "твёрдо", "глухой", "колхоз", "вернее", "платок", "локоть", "жалоба", "дважды", "мелочь", "влиять", 
        "умение", "лекция", "подвиг", "лётчик", "одеяло", "вправе", "диалог", "водный", "пиджак", "шутить", "манера", "сперва", 
        "вынуть", "подъём", "тесный", "чёткий", "студия", "двести", "тренер", "модный", "ровный", "коньяк", "срочно", "юность", 
        "замена", "приезд", "аспект", "туалет", "класть", "слышно", "плёнка", "экипаж", "водить", "справа", "ссылка", "убийца", 
        "призыв", "давний", "налить", "вплоть", "натура", "доступ", "подвал", "биться", "отъезд", "тотчас", "космос", "курица", 
        "девица", "кнопка", "фонарь", "вдвоем", "пугать", "словом", "трасса", "скрыть", "градус", "запрос", "кабина", "медаль", 
        "уголок", "разрыв", "угодно", "орудие", "эмоция", "издать", "ценить", "борода", "тащить", "критик", "посуда", "боевик", 
        "обнять", "дурной", "супруг", "крышка", "наряду", "подряд", "лечить", "жалкий", "обойти", "платёж", "кругом", "свести", 
        "смешно", "авария", "счесть", "варить", "охотно", "валюта", "стойка", "листок", "предок", "турнир", "льгота", "сложно", 
        "видать", "выжить", "железо", "заодно", "некуда", "дверца", "огонёк", "ремень", "следом", "балкон", "ломать", "огород", 
        "баланс", "ужасно", "юбилей", "кирпич", "аренда", "бурный", "допрос", "футбол", "удобно", "запрет", "спектр", "турист", 
        "молния", "нежели", "ранить", "подача", "глазок", "кивать", "провод", "уснуть", "кружка", "мудрый", "акцент", "ванная", 
        "мучить", "триста", "жуткий", "смелый", "тяжкий", "жаркий", "заявка", "обычай", "резерв", "диплом", "окошко", "шинель", 
        "ноготь", "залить", "филиал", "жирный", "болото", "лозунг", "патрон", "медный", "отнять", "ширина", "заново", "снаряд", 
        "давить", "зелень", "забить", "пейзаж", "гвоздь", "гордый", "одетый", "проход", "шуметь", "возить", "альбом", "нажать", 
        "снимок", "японец", "беречь", "плотно", "скучно", "хитрый", "ложный", "ругать", "шагать", "ерунда", "свинья", "жидкий", 
        "резать", "родные", "аромат", "мясной", "наружу", "тряпка", "наверх", "отмена", "ползти", "провал", "разряд", "бревно", 
        "климат", "набить", "синтез", "спинка", "делить", "слепой", "график", "обидно", "пешком", "урожай", "чуждый", "барьер", 
        "дарить", "захват", "надзор", "гитара", "махать", "матрос", "развод", "хирург", "бензин", "миссия", "грохот", "выдача", 
        "взятка", "община", "цитата", "чайник", "пророк", "пробка", "сажать", "уютный", "рубаха", "сессия", "убыток", "увезти", 
        "ярость", "прыжок", "тройка", "гнездо", "ирония", "стрела", "выгода", "дизайн", "рецепт", "китаец", "мораль", "палуба", 
        "берёза", "пещера", "спичка", "удачно", "унести", "плакат", "упорно", "поверх", "позади", "добыть", "кружок", "ничуть", 
        "кончик", "царить", "поляна", "шумный", "выбить", "легкое", "травма", "худший", "лопата", "пустяк", "джинсы", "печаль", 
        "толком", "гудеть", "отходы", "печень", "дружно", "пускай", "долина", "кипеть", "огурец", "рыцарь", "стихия", "горечь", 
        "горячо", "ограда", "ведать", "горько", "толчок", "впрямь", "фонтан", "жевать", "жестко", "кривой", "поесть", "ручной", 
        "дожить", "зажечь", "издали", "пышный", "задеть", "налево", "индекс", "кинуть", "маршал", "качать", "телега", "крючок", 
        "внутрь", "деяние", "увести", "зажать", "монета", "сплошь", "станок", "трясти", "злость", "кошмар", "распад", "цвести", 
        "мутный", "ничего", "этакий", "рюкзак", "жилище", "пленум", "чертёж", "эшелон", "пожить", "порция", "секция", "старец", 
        "шерсть", "бывало", "размах", "труппа", "уплата", "фашист", "чайный", "влезть", "отныне", "дракон", "импорт", "панель", 
        "досада", "модуль", "певица", "внучка", "митинг", "сугубо", "трижды", "горшок", "каблук", "осмотр", "паника", "почерк", 
        "рекорд", "запеть", "мундир", "пузырь", "рыбный", "статуя", "бездна", "ветхий", "лунный", "связка", "аналог", "знаток", 
        "творец", "глоток", "гибкий", "гонщик", "проезд", "утрата", "верста", "рыдать", "стража", "кличка", "ткнуть", "формат", 
        "кушать", "рубить", "контур", "маневр", "мрачно", "разрез", "реветь", "теракт", "небось", "аптека", "будить", "валить", 
        "кулиса", "орбита", "свитер", "грусть", "лебедь", "первое", "ритуал", "террор", "лишать", "обречь", "пионер", "путать", 
        "сонный", "увлечь", "братец", "железа", "прорыв", "тормоз", "бодрый", "дерьмо", "ржавый", "сервис", "скамья", "фильтр", 
        "гонять", "мистер", "нервно", "пехота", "плавно", "участь", "анкета", "подчас", "райком", "снести", "сторож", "грузин", 
        "пальма", "притом", "шедевр", "изъять", "прочно", "речной", "рожать", "листва", "совхоз", "сустав", "уборка", "побить", 
        "покров", "разгар", "водоём", "измена", "подбор", "скидка", "струна", "библия", "втроём", "голубь", "запуск", "вымыть", 
        "птичий", "сияние", "чепуха", "гадать", "дачный", "земляк", "крошка", "чердак", "лениво", "розыск", "дорого", "копать", 
        "массив", "питать", "поклон", "совать", "банкир", "нищета", "зрелый", "помеха", "вблизи", "вправо", "дивный", "сериал", 
        "устало", "вектор", "зубной", "кривая", "курорт", "птичка", "гигант", "купюра", "наглый", "силуэт", "фашизм", "ворона", 
        "глагол", "литься", "ноздря", "динамо", "попить", "снятие", "сундук", "тонуть", "отбить", "свалка", "стопка", "стресс", 
        "теннис", "ахнуть", "мамаша", "бульон", "подлый", "чекист", "щедрый", "ведьма", "наутро", "ректор", "робкий", "сирота", 
        "вешать", "клапан", "мостик", "сладко", "клятва", "кролик", "монтаж", "окурок", "разбор", "смутно", "унылый", "брести", 
        "дядька", "отклик", "троица", "казино", "убогий", "хоккей", "впасть", "вырост", "дефект", "кидать", "нанять", "поднос", 
        "рваный", "банкет", "обилие", "плитка", "упрямо", "гектар", "погоня", "устный", "чуткий", "кислый", "лезвие", "пятеро", 
        "романс", "скорбь", "схожий", "топить", "чудный", "доцент", "жадный", "побыть", "приток", "прокат", "хребет", "благой", 
        "сугроб", "сурово", "убитый", "ущелье", "ячейка", "забава", "зонтик", "налицо", "тыкать", "царица", "выступ", "летный", 
        "притча", "пылать", "развал", "боярин", "выброс", "нехотя", "стимул", "хмурый", "значок", "клочок", "копыто", "косить", 
        "пассаж", "перила", "перрон", "реестр", "скелет", "чистка", "потечь", "умница", "широта", "грызть", "осесть", "сборка", 
        "индеец", "ловкий", "подлец", "дружок", "конунг", "опасно", "пухлый", "штучка", "альянс", "злодей", "зрачок", "конвой", 
        "мишень", "мудрец", "радиус", "трепет", "яблоня", "датчик", "душить", "патент", "сулить", "тундра", "шашлык", "являть", 
        "впредь", "зараза", "люстра", "папаша", "парить", "засада", "кабель", "лесхоз", "пивной", "солома", "тополь", "взойти", 
        "гормон", "причал", "резина", "светло", "глотка", "пастух", "геолог", "гнилой", "кромка", "массаж", "неужто", "привод", 
        "рельеф", "рудник", "ступня", "вопить", "двойка", "иголка", "карета", "корона", "липкий", "сочный", "хищник", "второе", 
        "караул", "потный", "прицел", "стричь", "триумф", "алтарь", "колоть", "молить", "пахать", "саммит", "спикер", "абсурд", 
        "враньё", "имение", "конный", "покуда", "помада", "рапорт", "топать", "брызги", "кратко", "раскол", "белеть", "гостья", 
        "грозно", "монстр", "отсчёт", "пазуха", "прутик", "туризм", "дворик", "жарить", "кашель", "низший", "удочка", "улочка", 
        "избить", "калина", "канава", "капать", "каркас", "клумба", "нырять", "ронять", "солист", "травка", "унитаз", "китель", 
        "педаль", "реалия", "сумрак", "тереть", "фермер", "бросок", "вязать", "затвор", "кусать", "свечка", "хрипло", "чеснок", 
        "шипеть", "виться", "легион", "навеки", "отдача", "паркет", "планка", "сатира", "эдакий", "винить", "душный", "коготь", 
        "мыться", "угрюмо", "боязнь", "бритва", "карьер", "лепить", "лирика", "оратор", "сирень", "строфа", "усатый", "шляпка", 
        "богиня", "валять", "грядка", "кверху", "колпак", "мотать", "мрамор", "радуга", "сжатый", "шарить", "шахтёр", "ключик", 
        "комбат", "матрас", "мнимый", "погреб", "техник", "футляр", "череда", "чинить", "кобура", "личико", "мстить", "синева", 
        "цепной", "башмак", "весить", "метель", "обжечь", "сводка", "умелый", "утечка", "буйный", "житься", "калибр", "лыжный", 
        "отбыть", "резной", "рычать", "стирка", "третья", "взамен", "волчий", "дюжина", "жгучий", "катить", "тайком", "щадить", 
        "ватный", "грабёж", "гулкий", "зевать", "кровля", "лизинг", "лысина", "мюзикл", "опушка", "рыхлый", "скачок", "тайник", 
        "шнурок", "биолог", "вольно", "дикарь", "мамонт", "неясно", "никель", "посему", "свекла", "сервер", "собрат", "укрыть", 
        "целина", "вкусно", "выемка", "манить", "мигать", "погром", "разгон", "сопеть", "сухарь", "утопия", "застой", "компот", 
        "малина", "мускул", "тендер", "хищный", "эталон", "ватник", "дизель", "каприз", "коврик", "лапоть", "ливень", "рослый", 
        "тщетно", "уговор", "чучело", "аккорд", "вражда", "мандат", "наивно", "переть", "пряник", "сирена", "скупой", "спешка", 
        "спешно", "брюшко", "витать", "графин", "злобно", "киллер", "обиход", "прилив", "пьянка", "родник", "рыться", "седина", 
        "сортир", "ураган", "беглый", "вакуум", "гасить", "горсть", "зайчик", "катать", "клубок", "кувшин", "курьер", "помыть", 
        "промах", "роддом", "сигара", "смести", "хлопок", "ходьба", "цемент", "бронза", "герцог", "кинжал", "нелепо", "опаска", 
        "свинец", "сливки", "упадок", "адский", "братия", "вверху", "гладко", "зажить", "звонко", "колдун", "кузнец", "монарх", 
        "нюхать", "плазма", "сыпать", "трение", "витязь", "втайне", "губить", "острие", "палить", "слезть", "смирно", "тамбур", 
        "угнать", "флакон", "бойкий", "десант", "карлик", "корыто", "маньяк", "округа", "отвага", "сговор", "скобка", "смазка", 
        "сушить", "бармен", "беглец", "гадкий", "дымить", "залежь", "колода", "мольба", "нянька", "пилить", "плести", "пробел", 
        "пролив", "свиной", "султан", "узелок", "щелчок", "артель", "баллон", "восход", "вылить", "годный", "княжна", "минуть", 
        "пляска", "протез", "разлом", "фургон", "крупно", "льдина", "мечеть", "натиск", "осадок", "фартук", "верхом", "вещать", 
        "внятно", "вонять", "вулкан", "зыбкий", "кануть", "козырь", "копить", "лупить", "магнит", "насыпь", "пастор", "руче`к", 
        "флажок", "шелест", "блузка", "духота", "карниз", "косарь", "ладоши", "мазать", "милорд", "мычать", "наклон", "осадки", 
        "пелена", "управа", "цинизм", "эгоизм", "атаман", "волочь", "детище", "завыть", "кобыла", "охапка", "пароль", "ругань", 
        "смешок", "сорока", "стукач", "фанера", "флейта", "цепкий", "шлюпка", "вязкий", "генсек", "грести", "дождик", "доселе", 
        "еловый", "кладка", "лживый", "мерить", "монгол", "полить", "серьга", "уныние", "хватка", "хижина", "чесать", "эпопея", 
        "бешено", "бутыль", "взвыть", "вконец", "выжать", "диктор", "картон", "метать", "омский", "прямая", "стайка", "умысел", 
        "эпитет", "взятие", "глобус", "гранит", "дефолт", "зарыть", "зигзаг", "лазить", "макияж", "модерн", "нажить", "наугад", 
        "прадед", "пролёт", "рудный", "славно", "трофей", "угодье", "уголёк", "щетина", "арбитр", "бархат", "болван", "девать", 
        "каскад", "катюша", "кореец", "научно", "полено", "резьба", "спелый", "удрать", "упасти", "фреска", "шаблон", "блюдце", 
        "боксёр", "зверёк", "лукаво", "овация", "потеть", "раввин", "радист", "боцман", "бункер", "вырыть", "героин", "гибрид", 
        "гильза", "допуск", "карать", "красть", "наспех", "ночлег", "облить", "парный", "рацион", "свинка", "семеро", "социум", 
        "стишок", "сценка", "трезво", "тускло", "тушить", "братва", "добить", "ёлочка", "жемчуг", "качели", "курган", "надуть", 
        "пробег", "варвар", "галька", "запить", "изящно", "кисель", "кустик", "лавина", "лифчик", "лучшее", "мякоть", "парной", 
        "подрыв", "ракурс", "рябина", "сжатие", "творог", "топчан", "трость", "тряпье", "абажур", "бушлат", "ванный", "веский", 
        "галоша", "гарант", "гневно", "дачник", "дёшево", "жаться", "лайнер", "ломтик", "натрий", "отлить", "рвение", "снежок", 
        "точить", "тягота", "экстаз", "гипноз", "декрет", "дрожжи", "завеса", "искоса", "компас", "консул", "ледник", "медуза", 
        "опилки", "персик", "прибой", "танцор", "бравый", "ехидно", "загодя", "истечь", "калека", "маркиз", "микроб", "наркоз", 
        "оконце", "опасть", "пижама", "подтип", "путник", "фараон", "фарфор", "шейный", "шкурка", "атеист", "бритый", "выкрик", 
        "гравий", "грясти", "детдом", "кактус", "каштан", "куплет", "латынь", "листик", "матрац", "метить", "птенец", "раньше", 
        "робеть", "росток", "скачка", "сударь", "фальшь", "бабуля", "буксир", "вглубь", "дохлый", "каратэ", "клякса", "лизать", 
        "марево", "обойма", "пептид", "поутру", "разлив", "старое", "хлопец", "бардак", "браток", "дебаты", "дымный", "клеймо", 
        "клинок", "лишнее", "нацист", "нейрон", "оптика", "охнуть", "пермяк", "пылкий", "слежка", "сообща", "сорняк", "червяк", 
        "банный", "гавань", "голень", "засечь", "ковбой", "немощь", "отсвет", "сажень", "словцо", "фольга", "шантаж", "шаткий", 
        "батька", "битком", "взбить", "выжечь", "долька", "изречь", "нагрев", "общага", "оправа", "паства", "подвох", "прицеп", 
        "прораб", "уловка", "усеять", "холмик", "штанга", "акация", "ателье", "вахтер", "воочию", "жаргон", "заныть", "заочно", 
        "ломоть", "лоскут", "мантия", "нудный", "олений", "пикник", "подиум", "поныне", "портал", "сварка", "спящий", "томить", 
        "умелец", "этикет", "богато", "вампир", "веяние", "десерт", "дубина", "жребий", "завхоз", "игумен", "ладить", "ладный", 
        "мимика", "объять", "орешек", "пенсне", "помост", "пряжка", "разгул", "рассол", "сполна", "травля", "тропка", "хлопья", 
        "шелуха", "щипать", "ведомо", "драный", "зашить", "крытый", "лектор", "магнат", "мочить", "настил", "отрава", "пощада", 
        "прииск", "уплыть", "утварь", "фантом", "щупать", "дельта", "залечь", "засуха", "зримый", "кассир", "макака", "осанка", 
        "протон", "пучина", "пыльца", "реванш", "резюме", "сервиз", "соната", "стычка", "фляжка", "чихать", "азбука", "амплуа", 
        "ампула", "амулет", "бампер", "банька", "бедняк", "винтик", "высечь", "грабли", "гроздь", "декада", "диабет", "дурить", 
        "жвачка", "живьём", "изжить", "капкан", "кордон", "кортеж", "матерь", "меткий", "мичман", "молоть", "настой", "отмыть", 
        "пищать", "повтор", "призма", "пролог", "расизм", "рыбина", "субтип", "тельце", "термос", "тучный", "фиалка", "хромой", 
        "язычок", "ананас", "барыня", "бублик", "вещица", "вилять", "грудка", "дёготь", "диспут", "догмат", "жратва", "зарево", 
        "комета", "лесник", "лоджия", "маркер", "минный", "неволя", "недруг", "подуть", "полынь", "разбег", "сгнить", "специя", 
        "ювелир", "ястреб", "бабуся", "бурьян", "витраж", "клюква", "копоть", "кузина", "лекарь", "мессия", "мозоль", "наплыв", 
        "отмель", "отпить", "привал", "слоган", "снасть", "цензор", "чудной", "эпилог", "яичный", "бордюр", "всхлип", "всякое", 
        "газель", "домино", "зоркий", "испечь", "калоша", "ковчег", "лобный", "магний", "мачеха", "обшить", "одежка", "отзвук", 
        "папаха", "пороть", "прикол", "припас", "прокол", "пряный", "слиток", "сродни", "стойко", "сюртук", "танкер", "томный", 
        "ушанка", "чаяние", "челнок", "швабра", "эгоист", "юбиляр", "ящичек", "бантик", "буклет", "вымпел", "желток", "иерарх", 
        "кабаре", "клеить", "конфуз", "лагуна", "лентяй", "низина", "обдать", "отсечь", "параша", "пробор", "путный", "пьющий", 
        "разбой", "смычок", "соболь", "урчать", "учуять", "халява", "шмотки", "болтун", "брусок", "вспять", "вышить", "гадина", 
        "галифе", "дверка", "заесть", "йогурт", "опекун", "падший", "пардон", "печной", "печься", "пинать", "плевок", "потеха", 
        "псалом", "сотник", "темень", "тикать", "утаить", "хамить", "чётный", "агония", "блюсти", "братан", "буржуй", "длинно", 
        "дунуть", "зевака", "кожура", "костяк", "ломить", "месиво", "миссис", "мутить", "мясник", "облава", "овечий", "пенять", 
        "пловец", "примус", "проток", "разить", "ржаной", "страус", "триада", "узреть", "фосфор", "худеть", "чахлый", "апатия", 
        "атташе", "бритьё", "брокер", "взмыть", "вскрик", "грибок", "губной", "детина", "доярка", "заслон", "ионный", "кротко", 
        "одышка", "приять", "склока", "таджик", "толчея", "увечье", "улитка", "утроба", "фасоль", "шутник", "щебень", "взаймы", 
        "грация", "грызун", "давеча", "движок", "заживо", "зануда", "зачать", "зодчий", "индиец", "ландыш", "ломкий", "люлька", 
        "маразм", "маузер", "обивка", "пальба", "писарь", "покрой", "пчелка", "разлад", "синица", "сытный", "фабула", "эколог", 
        "аммиак", "атеизм", "водила", "выбыть", "генный", "диакон", "изотоп", "истово", "каньон", "капрал", "карась", "ковать", 
        "лисица", "логово", "лыжник", "мерный", "невроз", "помять", "прогон", "раздор", "разнос", "рулить", "рутина", "тирада", 
        "трешка", "фрегат", "ямочка", "ангина", "аншлаг", "бдение", "змейка", "кафель", "мучать", "мяться", "надрыв", "нажива", 
        "немота", "нотный", "оракул", "оттиск", "пилюля", "подкуп", "седеть", "соевый", "столяр", "сфинкс", "фитиль", "иезуит", 
        "тешить", "глупец", "пудель", "свиток", "чудище", "горняк", "раскат", "эрозия", "ёрзать", "овечка", "ухнуть", "грязно", 
        "ельник", "токарь", "фикция", "лужица", "распря", "сбитый", "заячий", "тюлень"
    ],
    7: ["который", "человек", "сказать", "большой", "сторона", "сделать", "ребёнок", "конечно", "система", "женщина", "русский", "высокий", 
        "хороший", "сегодня", "считать", "главный", "решение", "увидеть", "история", "поэтому", "никогда", "область", "молодой", "принять", 
        "никакой", "процесс", "условие", "помнить", "уровень", "далёкий", "комната", "порядок", "военный", "великий", "простой", "сколько", 
        "бояться", "наконец", "интерес", "правило", "слышать", "мужчина", "готовый", "создать", "чувство", "красный", "слушать", "причина", 
        "товарищ", "слишком", "встреча", "впрочем", "сильный", "крупный", "просить", "открыть", "девушка", "очередь", "близкий", "похожий", 
        "событие", "назвать", "глядеть", "принцип", "дорогой", "попасть", "держать", "местный", "уходить", "подойти", "мальчик", "участие", 
        "девочка", "сначала", "картина", "широкий", "мировой", "тяжёлый", "умереть", "рисунок", "течение", "церковь", "средний", "свобода", 
        "команда", "поднять", "договор", "однажды", "длинный", "природа", "прошлый", "телефон", "позиция", "бросить", "самолёт", "детский", 
        "связать", "процент", "поехать", "входить", "поздний", "впервые", "научный", "степень", "вызвать", "надежда", "сложный", "предмет", 
        "заявить", "вариант", "министр", "граница", "немного", "миллион", "старший", "счастье", "обычный", "кабинет", "кричать", "магазин", 
        "площадь", "возраст", "молчать", "участок", "желание", "кажется", "внешний", "служить", "генерал", "понятие", "ставить", "рабочий", 
        "радость", "продукт", "значить", "недавно", "реформа", "будущее", "рассказ", "хватать", "техника", "больший", "учиться", "деревня", 
        "зелёный", "элемент", "золотой", "ожидать", "любимый", "быстрый", "функция", "капитан", "фамилия", "бутылка", "звонить", "влияние", 
        "учитель", "корабль", "детство", "будущий", "прошлое", "коридор", "болезнь", "попытка", "депутат", "частный", "комитет", "выбрать", 
        "хватить", "обещать", "гораздо", "десяток", "глубина", "студент", "секунда", "плакать", "прежний", "станция", "бабушка", "собрать", 
        "женский", "крайний", "главное", "перейти", "столица", "столько", "энергия", "снимать", "горячий", "закрыть", "весёлый", "субъект", 
        "реакция", "платить", "отличие", "опасный", "красота", "достать", "явление", "наличие", "пожалуй", "больной", "декабрь", "октябрь", 
        "занятие", "зритель", "указать", "светлый", "концерт", "милиция", "переход", "кивнуть", "кровать", "понятно", "аппарат", "обратно", 
        "древний", "отрасль", "продажа", "страшно", "неужели", "вырасти", "богатый", "толстый", "звучать", "верхний", "морской", "строить", 
        "образец", "трудный", "таблица", "сыграть", "коллега", "явиться", "оборона", "подруга", "признак", "странно", "перевод", "следить", 
        "подарок", "конкурс", "дальний", "просьба", "публика", "реклама", "жёсткий", "крепкий", "портрет", "послать", "мечтать", "круглый", 
        "голубой", "мужской", "мёртвый", "зеркало", "поездка", "спешить", "февраль", "впереди", "учебный", "издание", "взяться", "темнота", 
        "вернуть", "продать", "полтора", "пахнуть", "партнёр", "господи", "страсть", "разница", "формула", "капитал", "новость", "эксперт", 
        "автобус", "общение", "описать", "прожить", "оценить", "постель", "честный", "ударить", "инженер", "младший", "заранее", "старуха", 
        "строгий", "вершина", "наверно", "умирать", "давайте", "дешёвый", "твёрдый", "найтись", "включая", "записка", "совесть", "повезти", 
        "глубоко", "грязный", "господь", "потолок", "изучать", "удобный", "контакт", "бросать", "восторг", "подъезд", "автомат", "ощущать", 
        "поселок", "прибыть", "поворот", "поймать", "смешной", "дыхание", "масштаб", "сходить", "хозяйка", "пустить", "терпеть", "вывести", 
        "спасибо", "спорить", "деловой", "москвич", "остаток", "активно", "говорят", "затрата", "единица", "изделие", "кормить", "молитва", 
        "планета", "вынести", "минимум", "опытный", "меньший", "тревога", "уезжать", "приятно", "дрожать", "задание", "ведущий", "бригада", 
        "надпись", "паспорт", "позвать", "адвокат", "розовый", "коробка", "дедушка", "прибыль", "забрать", "ужасный", "пожилой", "таковой", 
        "успешно", "покрыть", "лечение", "громкий", "рубашка", "владеть", "политик", "торчать", "экзамен", "убедить", "нервный", "отлично", 
        "питание", "оркестр", "воевать", "критика", "выявить", "набрать", "нередко", "религия", "текущий", "вестись", "отнести", "ядерный", 
        "карьера", "чемодан", "скандал", "уважать", "хранить", "покупка", "доверие", "избрать", "колонна", "падение", "завести", "ведение", 
        "тарелка", "деятель", "выстрел", "полгода", "отвести", "подпись", "актриса", "прогноз", "заметно", "махнуть", "сложить", "повесть", 
        "свадьба", "подушка", "справка", "довести", "ботинок", "молодец", "авиация", "дневник", "нанести", "прыгать", "вовремя", "сладкий", 
        "полиция", "полчаса", "цветной", "бумажка", "империя", "плотный", "седьмой", "суббота", "дорожка", "историк", "глянуть", "оказать", 
        "замысел", "разбить", "фабрика", "суровый", "бледный", "всерьёз", "училище", "городок", "легенда", "неплохо", "ощутить", "частица", 
        "крыльцо", "научить", "пациент", "тяжесть", "кусочек", "намерен", "стучать", "пускать", "чемпион", "изучить", "копейка", "коротко", 
        "раствор", "анекдот", "царский", "грозить", "награда", "газовый", "сдавать", "маршрут", "сержант", "бродить", "холодно", "дивизия", 
        "удивить", "бассейн", "двойной", "здорово", "медведь", "браться", "тратить", "квартал", "плавать", "спасать", "топливо", "обязать", 
        "вначале", "пустота", "премьер", "трогать", "посреди", "француз", "сиденье", "выплата", "атомный", "мрачный", "обрести", "перерыв", 
        "бытовой", "горький", "спутник", "верёвка", "ступень", "затылок", "невеста", "удачный", "посадка", "царство", "экспорт", "вредный", 
        "книжный", "сменить", "кожаный", "украсть", "целиком", "профиль", "учебник", "ближний", "игрушка", "философ", "олигарх", "строчка", 
        "обидеть", "сборная", "сломать", "ледяной", "прощать", "рухнуть", "кафедра", "напиток", "длиться", "занятый", "пятница", "могучий", 
        "оттенок", "подобно", "пустыня", "сборник", "надолго", "заснуть", "славный", "среднее", "реально", "выпасть", "чистота", "намного", 
        "немалый", "асфальт", "палатка", "плоский", "ветеран", "решётка", "боковой", "батарея", "рейтинг", "тронуть", "базовый", "соседка", 
        "грозный", "завтрак", "отчасти", "заслуга", "контора", "рваться", "трамвай", "шептать", "восьмой", "галстук", "колбаса", "нелепый", 
        "вносить", "осенний", "вложить", "понести", "творить", "убежать", "лишение", "протест", "вводить", "педагог", "прижать", "видение", 
        "семинар", "охотник", "прятать", "краткий", "крутить", "фракция", "дружить", "насилие", "сниться", "спальня", "силовой", "вкусный", 
        "инвалид", "уверять", "финансы", "цепочка", "грустно", "дескать", "вопреки", "трибуна", "красиво", "годовой", "загадка", "заметка", 
        "недолго", "сорвать", "христов", "выехать", "наивный", "владыка", "диаметр", "застать", "конверт", "снежный", "девятый", "десятый", 
        "неудача", "рассвет", "сволочь", "мелодия", "римский", "раненый", "полнота", "рядовой", "индивид", "некогда", "скрытый", "вылезти", 
        "пароход", "снизить", "машинка", "придать", "супруга", "уложить", "иллюзия", "накрыть", "обожать", "союзник", "вольный", "влажный", 
        "вручить", "гладкий", "колодец", "прочный", "реплика", "словарь", "изнутри", "простор", "близкие", "вспышка", "ласково", "нестись", 
        "пособие", "сводить", "жалость", "тетрадь", "кислота", "мыслить", "дефицит", "галерея", "держава", "зависть", "угадать", "тротуар", 
        "четверо", "стрелка", "усталый", "неловко", "трактор", "головка", "зрелище", "изредка", "открыто", "скучный", "выгнать", "заорать", 
        "комедия", "болтать", "полевой", "должник", "настать", "сбежать", "вежливо", "клиника", "собачий", "частота", "извлечь", "материя", 
        "целевой", "желудок", "апостол", "бульвар", "драться", "четверг", "капуста", "осудить", "пулемёт", "шагнуть", "недаром", "окраина", 
        "бабочка", "дневной", "изящный", "наверху", "вырвать", "палочка", "поцелуй", "светить", "сумерки", "догнать", "лауреат", "феномен", 
        "героиня", "сгореть", "чеченец", "милость", "потомок", "уволить", "осколок", "приступ", "тактика", "таскать", "мчаться", "предать", 
        "психика", "хлопать", "здешний", "убирать", "отвезти", "полдень", "срочный", "отстать", "толщина", "уличный", "конфета", "освоить", 
        "корзина", "повсюду", "полотно", "скучать", "уверить", "вторник", "епископ", "полоска", "пропуск", "гладить", "колония", "витрина", 
        "госпожа", "неясный", "снаружи", "шахматы", "батюшка", "бешеный", "диагноз", "женатый", "занести", "роковой", "сойтись", "уцелеть", 
        "садовый", "трещина", "нарочно", "обедать", "уловить", "умолять", "витамин", "сердито", "агрегат", "калитка", "окраска", "татарин", 
        "толкать", "вакцина", "скрипка", "трезвый", "направо", "улететь", "входной", "колючий", "навести", "примета", "пыльный", "классик", 
        "править", "пробить", "ступать", "пёстрый", "пищевой", "снижать", "возврат", "импульс", "объятие", "должный", "находка", "плевать", 
        "стадион", "особняк", "слышный", "смутный", "стоянка", "финский", "десятка", "усадьба", "величие", "греметь", "плюнуть", "стройка", 
        "убегать", "челюсть", "шепнуть", "аукцион", "полночь", "чистить", "интрига", "квадрат", "людской", "угодить", "ясность", "грамота", 
        "доброта", "здравый", "коляска", "порошок", "рвануть", "хрупкий", "дернуть", "жаждать", "заехать", "сюрприз", "хвалить", "беженец", 
        "подобие", "пятьсот", "сжимать", "видимый", "обложка", "ресница", "звенеть", "кассета", "походка", "вправду", "монолог", "пятерка", 
        "усилить", "матушка", "поручик", "занавес", "концерн", "портить", "вывезти", "колокол", "барабан", "песенка", "граната", "заговор", 
        "неважно", "писание", "сдаться", "слыхать", "солёный", "догадка", "напасть", "роскошь", "новинка", "помидор", "эстрада", "аппетит", 
        "отметка", "скакать", "уронить", "фуражка", "валенок", "лопнуть", "сбегать", "сегмент", "скромно", "смущать", "безумие", "залезть", 
        "поплыть", "ранение", "санкция", "серебро", "уделять", "внушать", "закуска", "очистка", "сходный", "терраса", "холдинг", "злиться", 
        "призрак", "схватка", "ударный", "дремать", "зарасти", "одеться", "дирижер", "загнать", "новичок", "обочина", "плясать", "бережно"
    ],
    8: ["говорить", "смотреть", "работать", "спросить", "понимать", "получить", "являться", "остаться", "проблема", "казаться", "например", "компания", 
        "развитие", "ответить", "средство", "написать", "основной", "качество", "действие", "подумать", "общество", "подобный", "особенно", "ситуация", 
        "начинать", "называть", "квартира", "внимание", "прийтись", "разговор", "показать", "огромный", "заметить", "пытаться", "движение", "материал", 
        "приехать", "отвечать", "культура", "документ", "институт", "директор", "провести", "наверное", "привести", "оставить", "создание", "значение", 
        "выходить", "начаться", "характер", "получать", "политика", "довольно", "красивый", "двадцать", "короткий", "страшный", "наиболее", "писатель", 
        "возможно", "услышать", "родитель", "странный", "половина", "положить", "касаться", "господин", "отметить", "реальный", "операция", "название", 
        "сознание", "участник", "несмотря", "сообщить", "известно", "вызывать", "художник", "принести", "состоять", "глубокий", "комплекс", "помогать", 
        "открытый", "знакомый", "нынешний", "контроль", "народный", "потерять", "судебный", "источник", "немецкий", "передать", "практика", "западный", 
        "комиссия", "работник", "холодный", "смеяться", "родиться", "личность", "добавить", "медленно", "зависеть", "праздник", "читатель", "занимать", 
        "спокойно", "командир", "собрание", "примерно", "тридцать", "здоровье", "обладать", "скорость", "духовный", "режиссёр", "ощущение", "наоборот", 
        "поверить", "простить", "механизм", "передача", "объявить", "рождение", "железный", "означать", "больница", "существо", "свойство", "животное", 
        "страница", "устроить", "растение", "традиция", "сведение", "сентябрь", "согласно", "редакция", "северный", "известие", "выставка", "находить", 
        "признать", "обратить", "очевидно", "середина", "узнавать", "массовый", "сомнение", "здоровый", "активный", "лестница", "привезти", "полагать", 
        "ценность", "организм", "случайно", "открытие", "изменить", "замечать", "ресторан", "километр", "вероятно", "садиться", "крикнуть", "готовить", 
        "выделить", "чиновник", "зарплата", "включать", "полезный", "собирать", "изучение", "делаться", "покупать", "домашний", "приятный", "понятный", 
        "правовой", "конфликт", "площадка", "захотеть", "академия", "бороться", "отдавать", "семейный", "включить", "добиться", "принятие", "вещество", 
        "навсегда", "вставать", "исходить", "прочесть", "кандидат", "давление", "соседний", "меняться", "водитель", "снижение", "забывать", "выбирать", 
        "убийство", "доказать", "проверка", "сельский", "обучение", "ожидание", "памятник", "владелец", "трудовой", "торговля", "молодёжь", "сущность", 
        "истинный", "стрелять", "обойтись", "серьёзно", "записать", "основное", "подарить", "описание", "схватить", "пропасть", "редактор", "извинить", 
        "опустить", "страдать", "заходить", "побежать", "пистолет", "денежный", "величина", "торговый", "выразить", "помощник", "прокурор", "обратный", 
        "обращать", "сигарета", "конечный", "отмечать", "школьный", "передний", "каменный", "напротив", "параметр", "внезапно", "попадать", "приятель", 
        "мощность", "японский", "вступить", "указание", "вытащить", "победить", "посадить", "препарат", "заняться", "выиграть", "введение", "защищать", 
        "основать", "согласие", "закрытый", "отличный", "сообщать", "сценарий", "жениться", "поразить", "решиться", "уважение", "взрослый", "поступок", 
        "контракт", "скрывать", "академик", "кампания", "скромный", "подавать", "покинуть", "пережить", "перемена", "протокол", "привычка", "заменить", 
        "пассажир", "привлечь", "стандарт", "надёжный", "критерий", "законный", "карандаш", "прислать", "разведка", "решаться", "трагедия", "спасение", 
        "задавать", "заложить", "заметный", "молчание", "девчонка", "выяснить", "общаться", "одинокий", "поставка", "выдавать", "интервью", "миллиард", 
        "рыночный", "персонаж", "различие", "кладбище", "отдыхать", "побывать", "гарантия", "недавний", "интернет", "исчезать", "отражать", "вступать", 
        "единство", "надоесть", "оператор", "мышление", "раскрыть", "целовать", "тянуться", "всеобщий", "радостно", "методика", "душевный", "музыкант", 
        "вскочить", "выражать", "глупость", "картошка", "переулок", "заказчик", "ложиться", "проявить", "нагрузка", "хранение", "защитить", "спрятать", 
        "вертолёт", "приговор", "вечерний", "вынудить", "пояснить", "волнение", "отчаяние", "столетие", "молиться", "точность", "свидание", "отдельно", 
        "гордость", "динамика", "жестокий", "рисовать", "подробно", "аэропорт", "рукопись", "исходный", "замереть", "продавец", "успешный", "карточка", 
        "поначалу", "испытать", "столовая", "окончить", "акционер", "картинка", "ключевой", "поправка", "нарушить", "взаимный", "прикрыть", "развитой", 
        "строение", "делиться", "немножко", "подвести", "призвать", "посылать", "утратить", "искренне", "сплошной", "разумный", "постоять", "четверть", 
        "посидеть", "слабость", "фантазия", "любитель", "заболеть", "горизонт", "доверять", "небесный", "покачать", "нефтяной", "голодный", "охранник", 
        "присесть", "невольно", "окружить", "видеться", "инвестор", "польский", "заказать", "наркотик", "отменить", "избежать", "отставка", "потрясти", 
        "доложить", "отказать", "повесить", "посетить", "окружать", "успевать", "головной", "жидкость", "типичный", "утренний", "помешать", "свободно", 
        "старушка", "сравнить", "чудесный", "уверенно", "обмануть", "портфель", "почётный", "воинский", "заявлять", "персонал", "повысить", "поручить", 
        "послание", "выгодный", "развести", "засыпать", "премьера", "пожалеть", "грузовик", "грустный", "неплохой", "перечень", "валяться", "охватить", 
        "фрагмент", "доходить", "проспект", "вытянуть", "даваться", "свернуть", "осветить", "изложить", "лицензия", "полюбить", "прогулка", "нарушать", 
        "старость", "стрельба", "накануне", "прервать", "районный", "крепость", "полететь", "психолог", "выделять", "недалеко", "кинуться", "скамейка", 
        "дорожный", "менеджер", "отобрать", "хохотать", "контекст", "познание", "скрыться", "выносить", "перебить", "скважина", "аргумент", "прогресс", 
        "соперник", "зачастую", "оформить", "миновать", "патриарх", "покидать", "блестеть", "медицина", "похороны", "солидный", "оболочка", "уступать", 
        "школьник", "комбинат", "малейший", "обсудить", "оторвать", "весенний", "набирать", "отрезать", "почитать", "пожелать", "посещать", "потянуть", 
        "походить", "возрасти", "закурить", "носитель", "алгоритм", "сбросить", "близость", "уточнить", "отложить", "инфекция", "живопись", "запереть", 
        "наметить", "годиться", "одобрить", "осознать", "покрытие", "усесться", "старшина", "эволюция", "выводить", "задумать", "охранять", "пермский", 
        "гастроли", "ежегодно", "освоение", "присущий", "стальной", "печатать", "поражать", "безумный", "сверкать", "обещание", "поделать", "гостиная", 
        "ночевать", "обширный", "отыскать", "частично", "ласковый", "советник", "дурацкий", "мудрость", "попросту", "антитело", "младенец", "украсить", 
        "вставить", "защитник", "решающий", "нежность", "проехать", "смертный", "удержать", "условный", "вылететь", "жилищный", "повышать", "прохожий", 
        "вечность", "кататься", "хлопнуть", "батальон", "покойный", "коренной", "напрасно", "усиление", "отходить", "минувший", "мысленно", "ракетный", 
        "сходство", "упустить", "дежурный", "ненужный", "опоздать", "угрожать", "надевать", "почтовый", "забавный", "интерьер", "королева", "кредитор", 
        "обвинять", "ругаться", "убеждать", "изменять", "государь", "наносить", "терпение", "товарный", "бумажный", "избегать", "кадровый", "стройный", 
        "забирать", "значимый", "ансамбль", "комиссар", "лампочка", "простота", "склонный", "сочинять", "гармония", "светский", "вздыхать", "легкость", 
        "молекула", "отрицать", "таблетка", "валютный", "кислород", "прихожая", "служащий", "тихонько", "уступить", "коллегия", "выходной", "негромко", 
        "наружный", "официант", "погодить", "вирусный", "арабский", "верность", "защитный", "наладить", "оказание", "суждение", "звёздный", "накопить", 
        "важность", "вытекать", "очистить", "внесение", "мужество", "наказать", "обнимать", "принятый", "мелькать", "аэродром", "винтовка", "метаться", 
        "творение", "толкнуть", "вырезать", "гипотеза", "заложник", "инстинкт", "максимум", "радовать", "животный", "конгресс", "новейший", "перчатка", 
        "пуговица", "диапазон", "очнуться", "выезжать", "сочинить", "возиться", "прелесть", "владение", "поспешно", "подружка", "редкость", "бригадир", 
        "дипломат", "печатный", "трястись", "открытка", "прощение", "симпатия", "газетный", "любовник", "лишиться", "печально", "доставка", "неправда", 
        "повлиять", "прощание", "съездить", "турецкий", "бедность", "казённый", "молочный", "мотоцикл", "поменять", "учащийся", "властный", "опускать", 
        "повестка", "думаться", "простыня", "служение", "аналитик", "неверный", "пройтись", "прыгнуть", "укрепить", "купаться", "клясться", "питаться", 
        "напрямую", "обходить", "одиночка", "пожарный", "профсоюз", "воротник", "киевский", "классика", "натянуть", "неудобно", "обвинить", "отличать", 
        "выложить", "издавать", "издалека", "комплект", "породить", "солнышко", "завалить", "заверить", "невинный", "наследие", "обезьяна", "сражение", 
        "старичок", "водиться", "оглядеть", "папироса", "выписать", "классный", "тверской", "украшать", "заводить", "плавание", "лагерный", "опасение", 
        "прилавок", "стукнуть", "вытереть", "насквозь", "расстрел", "воровать", "интервал", "помереть", "упаковка", "инфляция", "отчаянно", "запасной", 
        "издержки", "отразить", "парадный", "поединок", "желающий", "наложить", "парадокс", "улучшить", "временно", "дизайнер", "добывать", "дрогнуть", 
        "микрофон", "поистине", "чересчур", "грузовой", "заменять", "небрежно", "овладеть", "бетонный", "выдумать", "напугать", "нарезать", "обстоять", 
        "ответный", "удобство", "иерархия", "напиться", "нелёгкий", "оплатить", "оппонент", "пирамида", "поведать", "покойник", "запросто", "кастрюля", 
        "щелкнуть", "мерседес", "ответчик", "столовый", "верхушка", "заданный", "кристалл", "тепловой", "застрять", "относить", "прозвище", "теряться", 
        "вплотную", "вытирать", "зенитный", "линейный", "твердить", "тропинка", "биология", "катиться", "красавец", "поднести", "причёска", "рецензия", 
        "хоронить", "экономия", "вылезать", "интуиция", "мучиться", "огненный", "отделить", "ревность", "шелковый", "выкинуть", "заповедь", "излишний", 
        "каникулы", "удивлять", "отводить", "павильон", "спустить", "табличка", "взлететь", "грядущий", "наводить", "немногий", "отделять", "пошутить", 
        "задержка", "носиться", "всячески", "губерния", "погибать", "приёмная", "разбитый", "совпасть", "аналогия", "кухонный", "наливать", "смелость", 
        "античный", "гимназия", "оборвать", "сдвинуть", "увлечься", "промысел", "позабыть", "уставать", "цифровой", "полярный", "осуждать", "партизан", 
        "публично", "удельный", "хмыкнуть", "шведский", "завязать", "качаться", "приемный", "раковина", "выбежать", "замирать", "истерика", "лишённый", 
        "намекать", "общность", "погубить", "скрипеть", "взорвать", "отбирать", "поискать", "соратник", "унижение", "устареть", "давность", "заветный", 
        "перепись", "подавить", "раздумье", "склонить", "удаление", "затянуть", "издатель", "комсомол", "нехорошо", "обретать", "погасить", "погулять", 
        "податься", "угольный", "освещать", "памятный", "пересечь", "эмигрант", "бедствие", "вложение", "выяснять", "доводить", "любезный", "наизусть", 
        "оптимизм", "агрессия", "возвести", "миграция", "остынуть", "погибший", "шикарный", "буркнуть", "забегать", "норовить", "песчаный", "послушно", 
        "зловещий", "местечко", "наземный", "просмотр", "противно", "вежливый", "исповедь", "нарядный", "отравить", "произвол", "вынимать", "дежурить", 
        "неполный", "скатерть", "фотограф", "записной", "рискнуть", "торговец", "закрытие", "засунуть", "краснеть", "снабдить", "ядовитый", "выпадать", 
        "доверить", "европеец", "заведомо", "заливать", "избавить", "лечиться", "тонкость", "туманный", "братский", "наделить", "покаяние", "достойно", 
        "ландшафт", "лечебный", "поделить", "поиграть", "привычно", "верующий", "мостовая", "насмешка", "ослабить", "прибытие", "тумбочка", "демократ", 
        "корточки", "косточка", "механика", "оригинал", "продюсер", "разборка", "телесный", "швырнуть", "желанный", "наркоман", "пожимать", "похитить", 
        "световой", "чудовище", "иракский", "метафора"
    ],
    9: ["последний", "несколько", "отношение", "оказаться", "маленький", "некоторый", "результат", "советский", "настоящий", "вернуться", "президент", "следовать", 
        "следующий", "появиться", "состояние", "программа", "известный", "положение", "поставить", "федерация", "приходить", "вспомнить", "поскольку", "принимать", 
        "различный", "произойти", "искусство", "структура", "гражданин", "начальник", "небольшой", "позволять", "требовать", "изменение", "возможный", "отдельный", 
        "население", "случиться", "проходить", "серьёзный", "стараться", "проводить", "спектакль", "объяснить", "нравиться", "позволить", "основание", "экономика", 
        "способный", "свободный", "выглядеть", "попросить", "выступать", "возникать", "надеяться", "подняться", "сотрудник", "позвонить", "продукция", "очередной", 
        "хозяйство", "полностью", "постоянно", "городской", "составить", "подходить", "считаться", "построить", "создавать", "встретить", "множество", "связанный", 
        "уверенный", "профессор", "улыбаться", "поддержка", "направить", "заявление", "сравнение", "выражение", "перестать", "ближайший", "революция", "остальной", 
        "поведение", "исчезнуть", "сожаление", "стоимость", "придумать", "приводить", "журналист", "нарушение", "заседание", "интересно", "поколение", "наблюдать", 
        "противник", "погибнуть", "правильно", "благодаря", "собраться", "выполнять", "заставить", "объяснять", "помещение", "выполнить", "отделение", "вздохнуть", 
        "закончить", "четвертый", "имущество", "настолько", "абсолютно", "двигаться", "повышение", "содержать", "полковник", "приезжать", "понимание", "держаться", 
        "поступить", "открывать", "посвятить", "должность", "налоговый", "удивиться", "спокойный", "совершить", "установка", "появление", "получение", "кончиться", 
        "сложиться", "оставлять", "уголовный", "повторить", "повторять", "назначить", "протянуть", "сохранить", "насколько", "встречать", "секретарь", "сообщение", 
        "буквально", "виноватый", "допустить", "прочитать", "взглянуть", "подписать", "телевизор", "поступать", "концепция", "лейтенант", "пятьдесят", "осторожно", 
        "природный", "отправить", "категория", "гостиница", "опасность", "коллектив", "следствие", "прекрасно", "выступить", "наступить", "двигатель", "перевести", 
        "разрешить", "испытание", "проверить", "выдержать", "учитывать", "напомнить", "партийный", "закричать", "приносить", "восточный", "процедура", "обращение", 
        "признание", "выпустить", "компьютер", "открыться", "согласный", "научиться", "приняться", "воздушный", "областной", "броситься", "профессия", "окончание", 
        "приказать", "китайский", "отпустить", "транспорт", "привычный", "поднимать", "навстречу", "достойный", "подождать", "атмосфера", "продавать", "запретить", 
        "мальчишка", "свидетель", "случаться", "удивление", "солнечный", "жизненный", "заключить", "мгновение", "случайный", "наверняка", "тенденция", "обязанный", 
        "удаваться", "монастырь", "указывать", "коммунист", "философия", "выпускать", "довольный", "указанный", "обсуждать", "сочинение", "обработка", "чемпионат", 
        "временной", "еврейский", "заглянуть", "верховный", "ведомство", "добраться", "нуждаться", "остальное", "запомнить", "агентство", "старинный", "послушать", 
        "раздаться", "фестиваль", "оказывать", "превышать", "утвердить", "применять", "трудность", "убедиться", "очевидный", "наказание", "остальные", "исключить", 
        "особенный", "церковный", "поражение", "соединить", "важнейший", "исполнять", "повернуть", "бюджетный", "совершать", "наступать", "тщательно", "компонент", 
        "потенциал", "ненависть", "совещание", "увеличить", "молодость", "упомянуть", "проверять", "подлинный", "сложность", "мгновенно", "пластинка", "выскочить", 
        "необычный", "танцевать", "дождаться", "рекламный", "стратегия", "захватить", "описывать", "разделить", "служебный", "подлежать", "чеченский", "достаться", 
        "страховой", "сохранять", "остановка", "печальный", "поглядеть", "сделаться", "страдание", "священник", "высказать", "заведение", "лекарство", "обвинение", 
        "моральный", "намерение", "исполнить", "заплатить", "земельный", "управлять", "идеальный", "сочетание", "столичный", "доступный", "строиться", "богатство", 
        "измерение", "уважаемый", "коллекция", "красавица", "блестящий", "публичный", "авторитет", "придавать", "доставить", "окружение", "замечание", "разойтись", 
        "священный", "перенести", "закрывать", "оценивать", "пробовать", "вчерашний", "выставить", "идеология", "подросток", "правление", "проживать", "дискуссия", 
        "достигать", "допускать", "приличный", "возразить", "подобрать", "репетиция", "отражение", "проявлять", "непонятно", "помолчать", "претензия", "россиянин", 
        "госпиталь", "незаметно", "экземпляр", "невидимый", "опираться", "вселенная", "задержать", "подземный", "отдохнуть", "связывать", "инстанция", "разрушить", 
        "волновать", "развивать", "гордиться", "завершить", "аккуратно", "большевик", "попасться", "выбросить", "обидеться", "террорист", "двинуться", "замолчать", 
        "радостный", "храниться", "аудитория", "вырваться", "факультет", "император", "совпадать", "пообещать", "парламент", "противный", "доставать", "начальный", 
        "опасаться", "сторонник", "ошибиться", "показание", "заполнить", "заплакать", "заслужить", "трудиться", "конкурент", "улучшение", "тогдашний", "возражать", 
        "проиграть", "семейство", "убеждение", "провожать", "рисковать", "громадный", "регулярно", "бизнесмен", "кончаться", "кредитный", "внедрение", "некоторые", 
        "призывать", "выбраться", "совместно", "перевозка", "успокоить", "выделение", "сибирский", "торжество", "делегация", "ступенька", "самарский", "строитель", 
        "прятаться", "проклятый", "волшебный", "подводный", "социализм", "терроризм", "первичный", "разделять", "наполнить", "коснуться", "отчётливо", "греческий", 
        "задумчиво", "несчастье", "всемирный", "усталость", "ежедневно", "местность", "нападение", "биография", "добавлять", "выслушать", "роскошный", "авторский", 
        "торговать", "интонация", "общежитие", "рождаться", "нормально", "разобрать", "коммунизм", "президиум", "неведомый", "бормотать", "переехать", "расширить", 
        "платформа", "сниматься", "бросаться", "разбудить", "килограмм", "медленный", "сократить", "ошибаться", "прощаться", "исключать", "приложить", "отечество", 
        "светиться", "спортсмен", "евангелие", "искренний", "отпускать", "поправить", "семьдесят", "поручение", "сыворотка", "послужить", "секретный", "поместить", 
        "запустить", "колебание", "оправдать", "применить", "закрепить", "одинаково", "прилететь", "слушатель", "внешность", "выдвинуть", "пребывать", "мобильный", 
        "невысокий", "поставщик", "пенсионер", "провинция", "бесплатно", "оппозиция", "торопливо", "посещение", "постройка", "отверстие", "армейский", "застынуть", 
        "обижаться", "велосипед", "внезапный", "инспектор", "коррупция", "привязать", "возбудить", "подавлять", "поклонник", "потратить", "сорваться", "актёрский", 
        "приоритет", "вспыхнуть", "наследник", "ленинский", "встречный", "выявление", "отчаянный", "испортить", "разрешать", "мелькнуть", "сантиметр", "соблюдать", 
        "создатель", "непростой", "сводиться", "сердиться", "осмотреть", "репутация", "татарский", "двадцатый", "прошедший", "уравнение", "крохотный", "включение", 
        "спаситель", "отнестись", "разведчик", "свалиться", "дистанция", "испанский", "неизбежно", "пропадать", "тревожный", "увлечение", "магнитный", "парижский", 
        "слышаться", "новенький", "специфика", "подробный", "удивлённо", "подъехать", "покончить", "полотенце", "настроить", "объявлять", "прибавить", "испуганно", 
        "конкретно", "передовой", "сердечный", "забросить", "церемония", "одеваться", "плоскость", "плотность", "выработка", "наградить", "проволока", "лошадиный", 
        "украшение", "физически", "видимость", "дружеский", "завернуть", "отступать", "выпускник", "декорация", "излучение", "твориться", "литератор", "потерпеть", 
        "кинотеатр", "разорвать", "влюбиться", "воспитать", "выстроить", "мороженое", "отставать", "посчитать", "локальный", "политбюро", "постучать", "резиновый", 
        "ссылаться", "заработок", "именовать", "исправить", "проникать", "разбирать", "упоминать", "крутиться", "отбросить", "отступить", "уговорить", "запрещать", 
        "иркутский", "повредить", "прижаться", "сказаться", "нисколько", "поспешить", "проделать", "сдаваться", "шахматный", "потрясать", "выключить", "нарастать", 
        "порождать", "крошечный", "переписка", "подбирать", "санаторий", "довестись", "неизменно", "привозить", "оснастить", "завоевать", "импортный", "индийский", 
        "нехороший", "олимпиада", "погладить", "разводить", "различать", "системный", "энтузиазм", "протекать", "репертуар", "ставиться", "фундамент", "заполнять", 
        "изумление", "насекомое", "освещение", "предельно", "прибегать", "прочность", "разбойник", "эмиграция", "обитатель", "вмешаться", "девяносто", "занятость", 
        "очутиться", "экономист", "переворот", "причинить", "ежегодный", "недоверие", "подводить", "соединять", "упираться", "вероятный", "древесина", "питерский", 
        "святитель", "горожанин", "кружиться", "прописать", "рождество", "ухаживать", "формально", "латинский", "ожидаться", "пожелание", "равенство", "сознавать", 
        "побеждать", "заготовка", "конвенция", "медсестра", "погрузить", "связаться", "неудачный", "ничтожный", "фирменный", "вторичный", "монополия", "оборонный", 
        "резолюция", "снижаться", "сходиться", "уменьшить", "блаженный", "вцепиться", "заключать", "племянник", "повиснуть", "сказочный", "экскурсия", "ворваться", 
        "забраться", "занавеска", "принцесса", "разложить", "скользить", "изобрести", "незадолго", "ненадолго", "оранжевый", "помниться", "бухгалтер", "возложить", 
        "континент", "покрывать", "сокровище", "сработать", "пустынный", "терпеливо", "привыкать", "разрушать", "сражаться", "бронзовый", "вертеться", "всяческий", 
        "заводской", "контейнер", "презирать", "прибежать", "снизиться", "дежурство", "кирпичный", "кустарник", "проводник", "тоненький", "календарь", "командный", 
        "сотворить", "цепляться", "атаковать", "грамотный", "тревожить", "упереться", "взыскание", "диктовать", "пересмотр", "подчинить", "прижимать", "удаляться", 
        "виднеться", "инспекция", "итальянец", "побережье", "пробежать", "смутиться", "восстание", "вырастать", "космонавт", "табуретка", "презрение", "присвоить", 
        "ребятишки", "тридцатый", "бутерброд", "интеллект", "погаснуть", "человечек", "оскорбить", "замкнутый", "назначать", "житейский", "закрыться", "массивный", 
        "проповедь", "слушаться", "болтаться", "неприятно", "предстать", "смешанный", "удалиться", "география", "локомотив", "облигация", "смириться", "уральский", 
        "глубинный", "отцовский", "преданный", "выглянуть", "наставник", "превысить", "просидеть", "сливаться", "банальный", "продумать", "розничный", "вырастить", 
        "господний", "донестись", "набраться", "подбежать", "любопытно", "понемногу", "скульптор", "армянский", "драматург", "фальшивый", "калужский", "косметика", 
        "мраморный", "разбиться", "устранить", "вращаться", "групповой", "отпечаток", "повторный", "посредник", "проектный", "словесный", "заражение", "изложение", 
        "математик", "накормить", "осознание", "ощущаться", "числиться", "благодать", "врезаться", "немолодой", "пробиться", "юбилейный", "боеприпас", "болельщик", 
        "внутренне", "исламский", "смениться", "адаптация", "прапорщик", "счастливо", "аварийный", "блондинка", "выживание", "выхватить", "галактика", "комендант", 
        "разыскать", "колхозный", "навестить", "облегчить", "охотничий", "подвижный", "поселение", "дальность", "избранный", "картофель", "неудобный", "развалина", 
        "клеточный", "одобрение", "помчаться", "правитель", "регламент", "суммарный", "выдвигать", "застройка", "затихнуть", "индустрия", "наложение", "озаботить", 
        "раздавить", "святейший", "древность", "значиться", "логистика", "похвалить", "проезжать", "пролететь", "стереотип", "классовый", "наплевать", "расширять", 
        "покушение", "скользкий", "иммунитет", "отопление", "предатель", "укреплять", "бешенство", "коробочка", "наилучший", "суетиться", "депрессия", "звездочка", 
        "мыслитель", "наполнять", "очертание", "соседство", "срываться", "усиливать", "эвакуация", "удариться", "бархатный", "исчерпать", "настоящее", "осваивать", 
        "расчётный", "вычислить", "косвенный", "лихорадка", "обхватить", "обыватель", "отвлекать", "попадание", "призвание", "разрезать", "студентка", "тормозить", 
        "уткнуться", "хвататься", "воплотить", "затронуть", "неприязнь", "сближение", "снабжение", "стыдиться", "толковать", "тотальный", "эффектный", "окликнуть", 
        "составной", "спрыгнуть", "ускорение", "бюллетень", "вечеринка", "выдохнуть", "завещание", "заявитель", "инициатор", "опередить", "раздеться", "ссориться", 
        "трактовка", "увидеться", "юношеский", "дополнить", "достояние", "древесный", "кланяться", "отвергать", "револьвер", "сломаться", "частенько", "бородатый", 
        "вторжение", "зажигалка", "казанский", "мотивация", "небывалый", "оживиться", "ревновать", "тосковать", "этический", "вертикаль", "вестибюль", "вооружить", 
        "крайность", "обобщение", "отключить", "прикинуть", "футболист", "завершать", "обыденный", "отвлечься", "пассивный", "поросёнок", "сверстник", "спасаться", 
        "судорожно", "умеренный", "уточнение", "колхозник", "популяция", "прибывать", "прикрытие", "растерять", "азиатский", "дергаться", "наглядный", "напрячься", 
        "присылать", "фронтовой", "экономить", "маркетинг", "нагнуться"
    ],
    10: ["российский", "находиться", "оставаться", "посмотреть", "совершенно", "информация", "московский", "управление", "заниматься", "продолжать", "рассказать", "социальный", 
        "внутренний", "спрашивать", "количество", "достаточно", "предложить", "собираться", "относиться", "территория", "составлять", "установить", "интересный", "специалист", 
        "требование", "автомобиль", "литература", "показывать", "получиться", "необходимо", "прекрасный", "предлагать", "показаться", "содержание", "вспоминать", "называться", 
        "финансовый", "возникнуть", "технология", "отсутствие", "знаменитый", "подготовка", "республика", "получаться", "обнаружить", "нормальный", "определить", "проведение", 
        "применение", "улыбнуться", "появляться", "конкретный", "счастливый", "разработка", "отказаться", "начинаться", "произнести", "показатель", "физический", "обратиться", 
        "невозможно", "английский", "постоянный", "напоминать", "неожиданно", "состояться", "разумеется", "дальнейший", "исполнение", "отличаться", "обращаться", "пригласить", 
        "пожалуйста", "достигнуть", "утверждать", "фотография", "определять", "реализация", "правильный", "постепенно", "обеспечить", "привыкнуть", "собственно", "стремиться", 
        "настроение", "творческий", "измениться", "поговорить", "учреждение", "выполнение", "попытаться", "американец", "заключение", "исключение", "немедленно", "говориться", 
        "испытывать", "обстановка", "соглашение", "деревянный", "специально", "достижение", "назначение", "культурный", "творчество", "инструмент", "реальность", "переговоры", 
        "готовиться", "совместный", "остановить", "приобрести", "увеличение", "устройство", "разрешение", "произвести", "предстоять", "губернатор", "психология", "наблюдение", 
        "проснуться", "недостаток", "спортивный", "заставлять", "воспитание", "начальство", "пятнадцать", "засмеяться", "инициатива", "активность", "радоваться", "библиотека", 
        "обернуться", "заговорить", "устраивать", "соединение", "выясниться", "догадаться", "расстояние", "поддержать", "фактически", "предыдущий", "признаться", "несчастный", 
        "зарубежный", "объяснение", "телефонный", "переходить", "покупатель", "торопиться", "одинаковый", "химический", "милиционер", "переживать", "обсуждение", "окружающий", 
        "напряжение", "неизвестно", "уникальный", "популярный", "задуматься", "постановка", "готовность", "удивляться", "передавать", "инвестиция", "непонятный", "продолжить", 
        "публикация", "решительно", "стремление", "вооружение", "испугаться", "квадратный", "незнакомый", "приглашать", "крупнейший", "сохранение", "знакомство", "неприятный", 
        "признавать", "полномочие", "безусловно", "жаловаться", "прозрачный", "проявление", "ассоциация", "ненавидеть", "двенадцать", "статистика", "уничтожить", "освободить", 
        "прекратить", "непременно", "объединить", "справиться", "сокращение", "заработать", "построение", "абсолютный", "крестьянин", "пропустить", "оглянуться", "письменный", 
        "арестовать", "длительный", "полагаться", "пенсионный", "восприятие", "спуститься", "привлекать", "протяжение", "демократия", "расширение", "руководить", "рассчитать", 
        "банковский", "настаивать", "отозваться", "катастрофа", "сообщество", "посетитель", "собеседник", "композитор", "победитель", "устойчивый", "экспедиция", "независимо", 
        "напечатать", "преступник", "изобразить", "сооружение", "захотеться", "несомненно", "пребывание", "серебряный", "актуальный", "выдающийся", "украинский", "иностранец", 
        "спускаться", "изображать", "мастерская", "положенный", "нарисовать", "повышенный", "беседовать", "гигантский", "превратить", "обусловить", "укрепление", "архитектор", 
        "глобальный", "инструкция", "доказывать", "сообразить", "поцеловать", "наибольший", "подхватить", "советовать", "стеклянный", "переводить", "посольство", "дисциплина", 
        "таможенный", "развернуть", "прозвучать", "рассуждать", "опуститься", "оформление", "преодолеть", "телеграмма", "официально", "выражаться", "стесняться", "выделяться", 
        "приступить", "англичанин", "обозначить", "распахнуть", "шампанское", "устроиться", "сталинский", "объявление", "британский", "любопытный", "вступление", "добиваться", 
        "негативный", "откровенно", "разглядеть", "экспертиза", "соблюдение", "незаконный", "записывать", "избиратель", "шестьдесят", "гениальный", "загадочный", "размышлять", 
        "подозрение", "приложение", "математика", "набережная", "пушкинский", "прошептать", "ликвидация", "поделиться", "потянуться", "заботиться", "неизбежный", "избавиться", 
        "ограничить", "предъявить", "завершение", "композиция", "подходящий", "разрушение", "расстаться", "уставиться", "тренировка", "дожидаться", "корпорация", "референдум", 
        "бесплатный", "размещение", "отмечаться", "подбородок", "облегчение", "удержаться", "пострадать", "неподалеку", "формальный", "коричневый", "митрополит", "совершение", 
        "германский", "мастерство", "сравнивать", "вздрогнуть", "воспринять", "осторожный", "разделение", "упражнение", "недоумение", "безопасный", "возрастать", "вследствие", 
        "подсказать", "бесконечно", "раздражать", "направлять", "заработный", "скрываться", "христианин", "переводчик", "преступный", "похоронить", "просторный", "объединять", 
        "изготовить", "голосовать", "отправлять", "наследство", "пропаганда", "равновесие", "попадаться", "логический", "обходиться", "пропускать", "уменьшение", "чудовищный", 
        "автономный", "переносить", "разместить", "грузинский", "энергетика", "беспокоить", "подоконник", "проникнуть", "доноситься", "завидовать", "охватывать", "образовать", 
        "оторваться", "окружающее", "соображать", "колебаться", "удерживать", "возвращать", "дополнение", "молодёжный", "потихоньку", "шевелиться", "этнический", "воплощение", 
        "доставлять", "накопление", "осознавать", "солдатский", "выразиться", "сдерживать", "надёжность", "расставить", "совпадение", "возглавить", "молчаливый", "любоваться", 
        "выработать", "задыхаться", "стабильный", "дальнейшее", "неизменный", "ориентация", "отражаться", "поработать", "поселиться", "регулярный", "изначально", "позитивный", 
        "славянский", "спрятаться", "величайший", "приподнять", "убежденный", "новогодний", "секретарша", "аппаратура", "кавказский", "престижный", "содействие", "цитировать", 
        "опускаться", "вкладывать", "заведовать", "восхищение", "интеграция", "сочувствие", "спецслужба", "физиономия", "жительство", "офицерский", "прикрывать", "немыслимый", 
        "нервничать", "отчётность", "промолчать", "энергичный", "адекватный", "значимость", "инженерный", "затянуться", "превращать", "скульптура", "эффективно", "отвращение", 
        "покраснеть", "замерзнуть", "капитализм", "процентный", "комбинация", "компромисс", "перебирать", "прохладный", "скончаться", "аккуратный", "возражение", "предельный", 
        "растерянно", "порядочный", "прикладной", "возрастной", "изменяться", "обозначать", "футбольный", "экспозиция", "нетерпение", "обманывать", "участковый", "кооператив", 
        "декларация", "оглядеться", "отклонение", "зрительный", "раскрывать", "смотреться", "увлекаться", "умственный", "величество", "отдаленный", "уничтожать", "экспертный", 
        "насаждение", "жестокость", "возмещение", "выстрелить", "отстаивать", "электричка", "мучительно", "обновление", "оправдание", "отвергнуть", "приоткрыть", "толкование", 
        "наполовину", "настойчиво", "поздравить", "ежедневный", "наткнуться", "проживание", "больничный", "координата", "отработать", "устранение", "мониторинг", "откровение", 
        "помещаться", "проявиться", "схватиться", "опомниться", "расписание", "беременный", "поставлять", "склониться", "обрушиться", "подставить", "припомнить", "обладатель", 
        "поперечный", "постигнуть", "предвидеть", "прихватить", "семнадцать", "буржуазный", "допустимый", "заказывать", "претендент", "трудящийся", "возмущение", "невероятно", 
        "отразиться", "переходный", "пристально", "включаться", "магический", "магнитофон", "однозначно", "отзываться", "неподвижно", "объективно", "оплачивать", "правосудие", 
        "равнодушно", "троллейбус", "взорваться", "завтрашний", "извиняться", "подписание", "проглотить", "упоминание", "выраженный", "первенство", "выигрывать", "инструктор", 
        "нахождение", "отодвинуть", "отраслевой", "покоситься", "присниться", "насёленный", "отрываться", "сочетаться", "артиллерия", "желательно", "предметный", "продавщица", 
        "вообразить", "враждебный", "потрясение", "проследить", "целоваться", "вспыхивать", "конкурсный", "масштабный", "подмигнуть", "подсудимый", "приемлемый", "прорваться", 
        "разбросать", "сильнейший", "выдаваться", "лирический", "оптический", "складывать", "безнадёжно", "живописный", "отказывать", "дошкольный", "менеджмент", "некрасивый", 
        "обосновать", "обвиняемый", "опаздывать", "промежуток", "недовольно", "примечание", "влюбленный", "возвратить", "концертный", "прелестный", "машинально", "непрерывно", 
        "тщательный", "чрезмерный", "бессильный", "лондонский", "невиданный", "содержимое", "увольнение", "приморский", "респондент", "старенький", "фиолетовый", "выбираться", 
        "выставлять", "заклинание", "законность", "санитарный", "укладывать", "вскрикнуть", "изысканный", "незаметный", "необычайно", "осуждённый", "равнодушие", "склонность", 
        "личностный", "основатель", "приблизить", "безобразие", "добираться", "загореться", "загородный", "комсомолец", "лестничный", "перебивать", "экспортный", "издеваться", 
        "поблизости", "повторение", "провокация", "элегантный", "медиальный", "напряжённо", "пионерский", "подскочить", "справочник", "тринадцать", "удлинённый", "извиниться", 
        "воображать", "двоюродный", "неуверенно", "патриотизм", "посмеяться", "развестись", "опрокинуть", "печататься", "притихнуть", "сбрасывать", "сообщаться", "золотистый", 
        "мгновенный", "накопиться", "проститься", "адресовать", "испуганный", "передумать", "подчинение", "приставать", "траектория", "беспорядок", "веселиться", "захлопнуть", 
        "коммерсант", "милосердие", "напоследок", "отделаться", "сухопутный", "юрисдикция", "библейский", "незнакомец", "отстранить", "приступать", "восклицать", "откинуться", 
        "пронестись", "ростовский", "страховщик", "запутаться", "монография", "насмешливо", "привилегия", "резиденция", "высочайший", "египетский", "ископаемое", "комплимент", 
        "надлежащий", "пересекать", "подсчитать", "пожаловать", "сдержанный", "канцелярия", "отдаваться", "перепутать", "покатиться", "призванный", "социология", "автомашина", 
        "всесоюзный", "выговорить", "зеркальный", "обработать", "обреченный", "сертификат", "крепостной", "воскресный", "выращивать", "застрелить", "скользнуть", "третейский", 
        "доброволец", "заведующий", "защищаться", "навалиться", "оборваться", "побледнеть", "поправлять", "процветать", "вытянуться", "остроумный", "официантка", "переделать", 
        "склоняться", "смертельно", "подвергать", "подъезжать", "раскрыться", "учредитель", "выписывать", "захохотать", "магистраль", "странность", "выкрикнуть", "вырываться", 
        "задаваться", "заповедник", "запоминать", "зацепиться", "подбросить", "подпольный", "сослуживец", "стартовать", "безымянный", "блаженство", "врождённый", "высунуться", 
        "газопровод", "дворянский", "деликатный", "оглядывать", "повышаться", "балтийский", "избыточный", "наказывать", "обрадовать", "разъяснить", "расслышать", "усомниться", 
        "задержание", "надобность", "простейший", "распустить", "сэкономить", "теперешний", "ухватиться", "вычисление", "заморозить", "нарушитель", "недвижимый", "осложнение", 
        "переписать", "посыпаться", "прощальный", "смоленский", "вежливость", "пепельница", "порадовать", "прикрепить", "умудриться", "возбуждать", "вселенский", "вскакивать", 
        "джентльмен", "испытуемый", "углубление", "чемоданчик", "быстренько", "включиться", "вытягивать", "объявиться", "расстроить", "контингент", "открытость", "потеряться", 
        "пристроить", "берлинский", "болгарский", "буквальный", "навязывать", "неловкость", "обострение", "отчётливый", "подавление", "подсистема", "прославить", "совместить", 
        "удивлённый", "усмехаться", "хорошенько", "начинающий", "охлаждение", "полуостров", "разгромить", "фантастика", "бесспорный", "болезненно", "гимнастика", "конечность", 
        "кубический", "настольный", "прекращать", "ритуальный", "бюрократия", "доходность", "нереальный", "отчуждение", "переменный", "прибрежный", "приставить", "пробраться", 
        "проскочить", "стрелковый", "типография", "богородица", "визуальный", "добавление", "осмелиться", "пожениться", "пополнение", "приветливо", "причастный", "сбережение", 
        "скромность", "бессмертие", "компактный", "обдумывать", "племянница", "подключить", "превышение", "креститься", "намечаться", "обобщенный", "ослабление", "прилипнуть", 
        "распасться", "светильник", "сковородка", "арендовать", "безобидный", "бесполезно", "игрушечный", "извлечение", "полководец", "потреблять", "равномерно", "реактивный", 
        "сдвинуться", "употребить", "условность", "воспаление", "вполголоса", "задумчивый", "кооперация", "неуловимый", "оттолкнуть", "переменная", "реформатор", "сверкающий", 
        "следование", "совокупный", "бессонница", "выругаться", "завоевание", "завтракать", "заготовить", "коммуналка", "настоятель", "обменяться", "презумпция", "проклинать", 
        "прокричать", "протоиерей", "свершиться", "скоростной", "шоколадный", "господство", "докторский", "духовность", "закусывать", "колокольня", "курировать", "неудобство", 
        "оскорблять", "подыматься", "приведение", "приказание", "примирение", "мироздание", "натягивать", "педагогика", "поклясться", "признанный", "продольный", "состязание", 
        "вакцинация", "доверчивый", "доводиться", "договорить", "заботливый", "заполнение", "лидировать", "неуместный", "однородный", "оживлённый", "осмысление", "персидский", 
        "проблемный", "улавливать", "усмотрение", "выдумывать", "губернский", "забастовка", "переезжать", "переложить", "повалиться", "погружение", "помиловать", "преддверие", 
        "придворный", "разведение", "трансляция", "упрощённый", "беспомощно", "либерализм", "нарушаться", "необъятный", "окончиться", "оспаривать", "отчисление", "поменяться", 
        "пообщаться", "пятилетний", "сложнейший", "телогрейка", "убеждаться", "автобусный", "антигенный", "динамичный", "затягивать", "карикатура", "контактный", "наметиться", 
        "насыщенный", "обогащение", "подземелье", "поразиться", "потерянный", "пресечение", "деформация", "деятельный", "журнальный", "мельчайший", "недоуменно", "ностальгия", 
        "облегчённо", "петровский", "полимерный", "послушание"
    ],
    11: ["возможность", "собственный", "государство", "организация", "предприятие", "происходить", "становиться", "представить", "чувствовать", "современный", "федеральный", "необходимый", 
        "образование", "направление", "большинство", "приходиться", "специальный", "оказываться", "действовать", "практически", "руководство", "гражданский", "согласиться", "предложение", 
        "технический", "обязательно", "определение", "обеспечение", "иностранный", "особенность", "участвовать", "центральный", "впечатление", "встречаться", "европейский", "поверхность", 
        "французский", "естественно", "способность", "заместитель", "попробовать", "официальный", "университет", "понравиться", "зависимость", "юридический", "встретиться", "генеральный", 
        "разработать", "сегодняшний", "медицинский", "обязанность", "выступление", "температура", "перспектива", "расположить", "отправиться", "подниматься", "требоваться", "значительно", 
        "последствие", "потребность", "подтвердить", "мероприятие", "повернуться", "подготовить", "эффективный", "объединение", "воздействие", "внимательно", "невозможный", "родственник", 
        "присутствие", "достоинство", "производить", "музыкальный", "заключаться", "характерный", "неожиданный", "рассмотреть", "проводиться", "следователь", "театральный", "разобраться", 
        "эксперимент", "вооружённый", "религиозный", "последующий", "конференция", "неизвестный", "закончиться", "конструкция", "развиваться", "возвращение", "сомневаться", "усмехнуться", 
        "арбитражный", "изображение", "минимальный", "электронный", "лаборатория", "регистрация", "телевидение", "потребовать", "сохраниться", "космический", "прокуратура", "воскликнуть", 
        "ограничение", "волноваться", "потребитель", "бесконечный", "десятилетие", "независимый", "заболевание", "талантливый", "действующий", "утверждение", "аналогичный", "конституция", 
        "подчеркнуть", "уверенность", "успокоиться", "подробность", "постараться", "реализовать", "чрезвычайно", "наблюдаться", "подозревать", "вынужденный", "создаваться", "продолжение", 
        "путешествие", "проговорить", "существенно", "последовать", "итальянский", "произносить", "одиночество", "открываться", "цивилизация", "приобретать", "исполнитель", "объективный", 
        "содержаться", "воскресенье", "невероятный", "исследовать", "приготовить", "применяться", "пользование", "страхование", "оперативный", "приниматься", "планировать", "соотношение", 
        "благородный", "осуществить", "соображение", "удивительно", "сумасшедший", "численность", "должностной", "архитектура", "любопытство", "нормативный", "философский", "психический", 
        "воображение", "возглавлять", "проявляться", "перестройка", "объясняться", "разбираться", "достаточный", "приглашение", "департамент", "комментарий", "коэффициент", "трагический", 
        "группировка", "вероятность", "благодарить", "направиться", "организатор", "соглашаться", "конкуренция", "критический", "наступление", "понедельник", "комплексный", "посторонний", 
        "отвернуться", "потребление", "структурный", "реагировать", "увеличиться", "столкнуться", "размышление", "современник", "оптимальный", "стандартный", "натуральный", "холодильник", 
        "переставать", "заглядывать", "командовать", "авиационный", "программный", "деревенский", "располагать", "уничтожение", "предстоящий", "недовольный", "переживание", "поздравлять", 
        "рассмеяться", "контрольный", "поступление", "поэтический", "симпатичный", "совершенный", "напряжённый", "рассуждение", "собственник", "праздничный", "обсуждаться", "поглядывать", 
        "возрождение", "заключённый", "послышаться", "голосование", "привлечение", "продаваться", "учительница", "просыпаться", "конструктор", "преподобный", "сохраняться", "либеральный", 
        "прекращение", "одиннадцать", "раздражение", "кремлёвский", "подчиняться", "благодарный", "драгоценный", "препятствие", "максимально", "наслаждение", "решительный", "предпринять", 
        "растеряться", "формировать", "заканчивать", "переработка", "управляющий", "заслуживать", "непрерывный", "изобретение", "мучительный", "употреблять", "компенсация", "откровенный", 
        "израильский", "повторяться", "уговаривать", "диссертация", "олимпийский", "фактический", "приключение", "восемьдесят", "командующий", "посредством", "перечислить", "запомниться", 
        "наклониться", "милицейский", "банкротство", "докладывать", "воспитывать", "поддаваться", "возбуждение", "королевский", "провалиться", "возмутиться", "превращение", "равнодушный", 
        "спокойствие", "исполниться", "многолетний", "поддержание", "пригодиться", "раздаваться", "допускаться", "наблюдатель", "болезненный", "грандиозный", "перевернуть", "октябрьский", 
        "старательно", "традиционно", "увеличивать", "интенсивный", "обнаружение", "завершиться", "неподвижный", "придумывать", "повреждение", "протягивать", "саратовский", "бесполезный", 
        "полицейский", "успокаивать", "предпочесть", "продвижение", "становление", "интеллигент", "преподавать", "радикальный", "развлечение", "задержаться", "знакомиться", "параллельно", 
        "случайность", "выполняться", "минеральный", "акционерный", "выдерживать", "кандидатура", "совершаться", "клинический", "перемещение", "православие", "истребитель", "сознательно", 
        "справляться", "преодоление", "гражданство", "полноценный", "легендарный", "перехватить", "единственно", "примитивный", "составление", "восхищаться", "высказаться", "обслуживать", 
        "поклониться", "смертельный", "вмешиваться", "обоснование", "пограничный", "недоступный", "познакомить", "предъявлять", "расходиться", "тысячелетие", "компетенция", "молоденький", 
        "абстрактный", "агрессивный", "оборудовать", "проработать", "шестнадцать", "алюминиевый", "капитальный", "справедливо", "известность", "материнский", "окрестность", "приближение", 
        "прохождение", "модификация", "подписывать", "белорусский", "попрощаться", "диагностика", "заблуждение", "неправильно", "пластиковый", "упоминаться", "вздрагивать", "оцениваться", 
        "подчинённый", "неторопливо", "просвещение", "публиковать", "достоверный", "разработчик", "сказываться", "героический", "критиковать", "сократиться", "перебраться", "руководящий", 
        "добровольно", "моментально", "ассортимент", "возмущаться", "высказывать", "загрязнение", "невыносимый", "согласовать", "треугольник", "безнадежный", "выбрасывать", "уменьшаться", 
        "виртуальный", "хронический", "поморщиться", "предпосылка", "тактический", "мусульманин", "оправдывать", "определенно", "повториться", "размахивать", "бессмертный", "влиятельный", 
        "мистический", "нахмуриться", "непривычный", "расстегнуть", "рассыпаться", "связываться", "вспомниться", "иллюстрация", "оптимизация", "вытаскивать", "заграничный", "беспомощный", 
        "обозначение", "перекресток", "консультант", "ходатайство", "пресловутый", "расширяться", "освобождать", "пристрастие", "взволновать", "отступление", "погрузиться", "презентация", 
        "гимнастёрка", "оперировать", "различаться", "разрешаться", "фиксировать", "вдохновение", "закрываться", "убедительно", "развалиться", "поликлиника", "осматривать", "трубопровод", 
        "откладывать", "приветствие", "захватывать", "приводиться", "родственный", "уменьшиться", "координация", "несомненный", "партнерство", "подвергнуть", "преданность", "проигрывать", 
        "целостность", "взаимосвязь", "выслушивать", "здороваться", "праздновать", "приговорить", "указываться", "методология", "преобладать", "хрустальный", "отмахнуться", "разногласие", 
        "беспощадный", "сценический", "учитываться", "исполняться", "меньшинство", "оскорбление", "пробираться", "размещаться", "африканский", "многократно", "разъяснение", "усиливаться", 
        "возвышаться", "металлургия", "пробиваться", "алкогольный", "достигаться", "исторически", "нетерпеливо", "нобелевский", "раздеваться", "устремиться", "воскресение", "двухэтажный", 
        "перегородка", "предисловие", "погружаться", "пристальный", "хорошенький", "беззащитный", "недоумевать", "управляемый", "швейцарский", "выглядывать", "темперамент", "безработица", 
        "перечислять", "потерпевший", "раздумывать", "безусловный", "задерживать", "затрагивать", "нейтральный", "предсказать", "приказывать", "сострадание", "депутатский", "качественно", 
        "подружиться", "постепенный", "архиепископ", "воронежский", "немедленный", "отдельность", "серебристый", "голландский", "здоровенный", "надвигаться", "выпрямиться", "графический", 
        "двенадцатый", "доставаться", "обследовать", "оперативник", "переступить", "запрещаться", "искренность", "содружество", "недостойный", "безупречный", "раздраженно", "разыскивать", 
        "белоснежный", "воскреснуть", "заблудиться", "конъюнктура", "причудливый", "рискованный", "воспитатель", "императрица", "именоваться", "настойчивый", "переполнить", "послезавтра", 
        "представать", "соединяться", "вписываться", "выставочный", "действенный", "запечатлеть", "заподозрить", "неприличный", "обаятельный", "серьёзность", "выкрикивать", "выплачивать", 
        "выскакивать", "колокольчик", "негодование", "ненавистный", "корабельный", "необычайный", "великолепно", "гендиректор", "красоваться", "ландшафтный", "однозначный", "питательный", 
        "реставрация", "сворачивать", "сокращаться", "сохранность", "задохнуться", "обыкновение", "описываться", "подтолкнуть", "расписаться", "блокировать", "переодеться", "преподнести", 
        "разразиться", "непонимание", "выпускаться", "духовенство", "непременный", "пограничник", "самодельный", "суверенитет", "ярославский", "допрашивать", "лихорадочно", "пересечение", 
        "позвоночник", "притягивать", "прищуриться", "секретариат", "семнадцатый", "тропический", "изолировать", "исправление", "латеральный", "отвлекаться", "подсознание", "приписывать", 
        "проноситься", "просмотреть", "разбежаться", "соединиться", "споткнуться", "фотоаппарат", "зажмуриться", "накладывать", "соскучиться", "супружеский", "чувственный", "электроника", 
        "австрийский", "замминистра", "катализатор", "насчитывать", "политически", "поправиться", "прикидывать", "разбегаться", "добродетель", "затруднение", "кондиционер", "обзавестись", 
        "прокатиться", "пролетариат", "профсоюзный", "разыгрывать", "выкладывать", "назначаться", "предписание", "разозлиться", "расхождение", "репродукция", "сокровенный", "возвышенный", 
        "затормозить", "прижиматься", "встревожить", "гостиничный", "добродушный", "семидесятый", "скандальный", "супермаркет", "усаживаться", "восторженно", "вышестоящий", "завершаться", 
        "надзиратель", "оправдаться", "подпрыгнуть", "подставлять", "приветливый", "закрепление", "физкультура", "воспитанник", "нелегальный", "подчиниться", "аспирантура", "бездействие", 
        "безразлично", "выращивание", "захоронение", "незаменимый", "неспособный", "прикасаться", "имитировать", "королевство", "насмешливый", "недоверчиво", "первобытный", "престарелый", 
        "треугольный", "активизация", "вирусология", "возобновить", "миниатюрный", "спотыкаться", "бухгалтерия", "всхлипывать", "откликаться", "покровитель", "уведомление", "адвокатский", 
        "безработный", "изначальный", "национализм", "постановить", "пронизывать", "пророчество", "старомодный", "утвердиться", "безжалостно", "безразличие", "выстраивать", "заснеженный", 
        "контрактный", "неслыханный", "отправление", "почтительно", "безобразный", "беспокойный", "незаурядный", "одноимённый", "опровергать", "прибавиться", "процветание", "выстроиться", 
        "закладывать", "манипуляция", "наброситься", "осмотреться", "отбрасывать", "поссориться", "растянуться", "четвереньки", "восхождение", "закружиться", "наклоняться", "наставление", 
        "пересчитать", "подобраться", "подрагивать", "пятидесятый", "размножение", "распадаться", "угадываться", "заслуженный", "застенчивый", "наращивание", "перекрывать", "подмигивать", 
        "пробуждение", "словесность", "управляться", "злополучный", "необратимый", "обжалование", "повсеместно", "предаваться", "разъехаться", "упорядочить", "безошибочно", "всенародный", 
        "драматургия", "напоминание", "недоставать", "перебросить", "подбираться", "подключение", "припоминать", "прожиточный", "прорываться", "реакционный", "гоголевский", "зеленоватый", 
        "мобилизация", "объявляться", "пожизненный", "тринадцатый", "харьковский", "атмосферный", "беспрерывно", "неравенство", "номинальный", "отталкивать", "побаиваться", "покрываться", 
        "прогуляться", "производный", "расторжение", "устремление", "вологодский", "выдвигаться", "дотронуться", "ежемесячный", "иллюминатор", "невозмутимо", "обязываться", "полномочный", 
        "помалкивать", "расставание", "брезентовый", "журналистка", "заулыбаться", "коротенький", "округлённый", "отображение", "постановщик", "разоблачить", "растерянный", "техногенный", 
        "урожайность", "челябинский", "артиллерист", "благодатный", "вдохновлять", "глубочайший", "засуетиться", "иронический", "переселение", "поклоняться", "канализация", "конфискация", 
        "наполниться", "премудрость", "примириться", "пятнадцатый", "растопырить", "согражданин", "дозвониться", "доступность", "иммунизация", "летательный", "молитвенный", "наполняться", 
        "настраивать", "приверженец", "разгораться", "разделиться", "расшириться", "скептически", "укоризненно", "усыновление", "февральский", "законченный", "исключаться", "карабкаться", 
        "напрягаться", "перешагнуть", "послушаться", "потрудиться", "принуждение", "разгореться", "разрушаться", "раскинуться", "расставлять", "расстановка", "соблюдаться", "сопоставить", 
        "срабатывать", "апартаменты", "архимандрит", "бесстрашный", "выздороветь", "монгольский", "награждение", "обеспокоить", "обыкновенно", "отслеживать", "передохнуть", "подлинность", 
        "постукивать", "программист", "совершиться", "бестолковый", "возбудитель", "заострённый", "истолковать", "когнитивный", "насладиться", "националист", "объясниться", "переселенец", 
        "потрясающий", "пригородный", "проделывать", "разлететься", "расхаживать", "ресторанчик", "таинственно", "торговаться", "антикварный", "вертикально", "восхититься", "гарантийный", 
        "декабрьский", "излюбленный", "испортиться", "комендатура", "механически", "мужественно", "насторожить", "нестерпимый", "переводчица", "пересохнуть", "поглаживать", "превосходно", 
        "прерываться", "привязаться", "проверяться", "раскладушка", "спутниковый", "фольклорный", "воздвигнуть", "воспитанный", "гармоничный", "гвардейский", "комментатор", "мечтательно", 
        "проясниться", "разорваться", "рождаемость", "секретность", "тренировать", "аккумулятор", "великолепие", "возлагаться", "выключатель", "красноватый", "кропотливый", "ничтожество", 
        "оформляться", "пересказать", "пёстренький", "подвижность", "прикрикнуть", "причитаться", "проповедник", "противиться", "разрываться", "своеобразие", "сговориться", "тревожиться", 
        "амбициозный", "засветиться", "материально", "передёрнуть", "переступать", "подписаться", "позапрошлый", "привязывать", "приземистый", "продуктовый", "равномерный", "сокрушаться", 
        "текстильный", "уважительно", "бревенчатый", "кардинально", "контрактник", "неуверенный", "нефтепровод", "приволжский", "прилагаться", "разбиваться", "рукопожатие", "бразильский", 
        "валентность", "голубоватый", "заполняться", "избавляться", "империализм", "консерватор", "неимоверный", "непосильный", "отшатнуться", "погрешность", "поместиться", "приобщиться", 
        "производная", "простенький", "расширенный", "ресторанный", "углубляться", "хулиганство", "близлежащий", "вавилонский", "властвовать", "возбуждённо", "детективный", "закрепиться", 
        "карательный", "конфликтный", "обостриться", "подтянуться", "разоружение", "смешиваться", "трансмиссия", "восклицание", "единогласно", "закашляться", "замахнуться", "капитанский", 
        "морщинистый", "неразбериха", "несерьёзный"
    ],
    12: ["деятельность", "производство", "политический", "существовать", "использовать", "рассказывать", "представлять", "единственный", "исследование", "человеческий", "американский", "национальный", 
        "общественный", "руководитель", "определенный", "пространство", "остановиться", "председатель", "соответствие", "безопасность", "одновременно", "исторический", "возвращаться", "пользоваться", 
        "удовольствие", "значительный", "принадлежать", "министерство", "естественный", "формирование", "оборудование", "произведение", "обеспечивать", "региональный", "литературный", "преступление", 
        "воспоминание", "поддерживать", "предполагать", "традиционный", "осуществлять", "удивительный", "продолжаться", "православный", "человечество", "материальный", "обязательный", "организовать", 
        "существенный", "превратиться", "окончательно", "практический", "определяться", "рассмотрение", "коммерческий", "промышленный", "классический", "рассчитывать", "опубликовать", "интересовать", 
        "транспортный", "договориться", "предоставить", "эксплуатация", "отказываться", "распоряжение", "преимущество", "относительно", "впоследствии", "строительный", "предположить", "максимальный", 
        "предпочитать", "предупредить", "воспринимать", "обслуживание", "обыкновенный", "превращаться", "образоваться", "издательство", "обрадоваться", "складываться", "приближаться", "концентрация", 
        "понадобиться", "признаваться", "подтверждать", "восстановить", "христианский", "нравственный", "своеобразный", "существующий", "установление", "божественный", "сопровождать", "противоречие", 
        "освобождение", "качественный", "образовывать", "великолепный", "догадываться", "посоветовать", "разглядывать", "справедливый", "законопроект", "компьютерный", "коллективный", "пользователь", 
        "соревнование", "профессионал", "рекомендация", "приобретение", "подчёркивать", "оригинальный", "таинственный", "неприятность", "оглядываться", "недостаточно", "высказывание", "зарабатывать", 
        "пробормотать", "отправляться", "расположение", "задумываться", "стремительно", "изготовление", "беспокоиться", "модернизация", "коммунальный", "командировка", "командование", "предлагаться", 
        "неоднократно", "неправильный", "совокупность", "свойственный", "механический", "ограниченный", "приватизация", "стабильность", "преследовать", "сталкиваться", "внимательный", "развернуться", 
        "сформировать", "популярность", "предвыборный", "направляться", "приблизиться", "студенческий", "квалификация", "подполковник", "обследование", "происшествие", "сравнительно", "претендовать", 
        "элементарный", "недвижимость", "христианство", "торжественно", "устойчивость", "консультация", "столкновение", "освободиться", "рациональный", "всевозможный", "регулировать", "чрезвычайный", 
        "демонстрация", "наименование", "передаваться", "крестьянский", "криминальный", "аплодисменты", "гуманитарный", "образованный", "разнообразие", "обнаруживать", "разноцветный", "генетический", 
        "эстетический", "предпочтение", "подвергаться", "беспокойство", "расставаться", "совершенство", "сомнительный", "восемнадцать", "планирование", "употребление", "наслаждаться", "вглядываться", 
        "вертикальный", "формулировка", "следственный", "повседневный", "переспросить", "самоубийство", "благополучно", "откликнуться", "согласование", "благополучие", "субъективный", "документация", 
        "обнаружиться", "органический", "преступность", "растительный", "долгосрочный", "замечательно", "поворачивать", "предчувствие", "колоссальный", "коммуникация", "декоративный", "добровольный", 
        "недовольство", "параллельный", "сознательный", "персональный", "послевоенный", "беременность", "возвратиться", "сотрудничать", "родительский", "убедительный", "ограничивать", "составляющая", 
        "подмосковный", "прекратиться", "работодатель", "репетировать", "ограничиться", "неповторимый", "преодолевать", "альтернатива", "писательский", "определиться", "прислушаться", "спохватиться", 
        "исчезновение", "четырнадцать", "ознакомиться", "экзотический", "бесчисленный", "динамический", "законодатель", "вспоминаться", "превосходить", "расслабиться", "укладываться", "трогательный", 
        "прошлогодний", "подсказывать", "пожаловаться", "профилактика", "рассердиться", "кредитование", "основываться", "передвижение", "периодически", "покачиваться", "двусторонний", "энциклопедия", 
        "устраиваться", "восторженный", "намереваться", "конкурентный", "приоритетный", "базироваться", "пассажирский", "приспособить", "теоретически", "красноярский", "операционный", "игнорировать", 
        "режиссёрский", "авторитетный", "эмпирический", "востребовать", "произвольный", "неинтересный", "позаботиться", "богослужение", "методический", "мужественный", "неформальный", "экономически", 
        "спасительный", "товарищество", "лабораторный", "непостижимый", "правильность", "осторожность", "молекулярный", "авиакомпания", "отрицательно", "пересмотреть", "поздравление", "посмеиваться", 
        "притворяться", "распахнуться", "раствориться", "утверждаться", "кинематограф", "обрабатывать", "превосходный", "расстройство", "знаменитость", "издательский", "радиостанция", "безразличный", 
        "вырабатывать", "изобретатель", "прекращаться", "приподняться", "бессмысленно", "перемещаться", "пострадавший", "скомандовать", "внушительный", "солидарность", "необъяснимый", "основательно", 
        "расстроиться", "реабилитация", "одноклассник", "презрительно", "раскрываться", "закономерный", "ненормальный", "номенклатура", "терминология", "долгожданный", "застраховать", "продвигаться", 
        "установиться", "конфигурация", "многообразие", "недопустимый", "богословский", "интеллектуал", "распределить", "стабилизация", "поблескивать", "прикоснуться", "антисемитизм", "осведомиться", 
        "перемениться", "подталкивать", "положительно", "пролетарский", "разместиться", "разочаровать", "фигурировать", "журналистика", "общепринятый", "подверженный", "протестовать", "самосознание", 
        "свердловский", "обмениваться", "неотъемлемый", "революционер", "бдительность", "одиннадцатый", "опровергнуть", "празднование", "редакционный", "возлюбленная", "инфекционный", "обоснованный", 
        "расплатиться", "своевременно", "генеральский", "идентичность", "компетентный", "парализовать", "прислониться", "шестидесятый", "благородство", "изумительный", "стационарный", "вслушиваться", 
        "доверенность", "евангельский", "придерживать", "уполномочить", "благословить", "красноармеец", "наказываться", "перечитывать", "показываться", "сертификация", "тоталитарный", "унизительный", 
        "новгородский", "предъявление", "проблематика", "самочувствие", "ухмыльнуться", "инициировать", "объединиться", "продержаться", "указательный", "актуальность", "длительность", "доминировать", 
        "миграционный", "предсказание", "исповедовать", "пожертвовать", "аплодировать", "владимирский", "израильтянин", "немаловажный", "переливаться", "плодотворный", "подпрыгивать", "разоблачение", 
        "сопоставимый", "тестирование", "унаследовать", "палестинский", "побеседовать", "преподавание", "причастность", "шевельнуться", "безграничный", "позавидовать", "продиктовать", "прозрачность", 
        "искусственно", "незабываемый", "партизанский", "повиноваться", "тематический", "арестовывать", "глобализация", "монастырский", "продуктивный", "прославиться", "спрашиваться", "устремляться", 
        "институтский", "приземлиться", "промелькнуть", "выговаривать", "обозреватель", "полуфабрикат", "полюбоваться", "растворяться", "византийский", "неизбежность", "оккупировать", "пластический", 
        "посматривать", "просвечивать", "уважительный", "консолидация", "настороженно", "переводиться", "спасательный", "безжалостный", "затягиваться", "отрабатывать", "перечисление", "подхватывать", 
        "высовываться", "девятнадцать", "марксистский", "неустойчивый", "раскладывать", "эвакуировать", "астраханский", "нескончаемый", "однообразный", "практиковать", "пристроиться", "промышленник", 
        "родственница", "читательский", "вещественный", "импровизация", "неприемлемый", "обнародовать", "похвастаться", "пренебрегать", "приятельница", "советоваться", "сочувственно", "танцевальный", 
        "экологически", "эксклюзивный", "непримиримый", "нетерпеливый", "нововведение", "предрассудок", "прикладывать", "федеративный"
    ],
    };
});

// lib/game/entities/particle.js
ig.baked = true;
ig.module('game.entities.particle').requires('impact.entity').defines(function () {
    EntityParticle = ig.Entity.extend({
        size: {
            x: 4,
            y: 4
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 160,
            y: 160
        },
        minBounceVelocity: 0,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.LITE,
        lifetime: 5,
        fadetime: 1,
        bounciness: 0.6,
        friction: {
            x: 20,
            y: 0
        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.currentAnim.flip.x = (Math.random() > 0.5);
            this.currentAnim.flip.y = (Math.random() > 0.5);
            this.currentAnim.gotoRandomFrame();
            this.idleTimer = new ig.Timer();
        },
        update: function () {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this
                .lifetime, 1, 0);
            this.parent();
        }
    });
});

// lib/game/entities/enemy.js
ig.baked = true;
ig.module('game.entities.enemy').requires('impact.entity', 'impact.font', 'game.words', 'game.entities.particle')
    .defines(function () {
        EntityEnemy = ig.Entity.extend({
            word: 'none',
            remainingWord: 'none',
            health: 8,
            currentLetter: 0,
            targeted: false,
            font: new ig.Font('media/fonts/deja-vu-12.png'),
            fontActive: new ig.Font('media/fonts/deja-vu-12-orange.png'),
            speed: 10,
            friction: {
                x: 100,
                y: 100
            },
            hitTimer: null,
            dead: false,
            angle: 0,
            wordLength: {
                min: 8,
                max: 8
            },
            soundHit: new ig.Sound('media/sounds/hit.ogg'),
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.health = Math.random().map(0, 1, this.wordLength.min, this.wordLength.max).round();
                this.word = this.getWordWithLength(this.health);
                this.remainingWord = this.word;
                this.hitTimer = new ig.Timer(0);
                this.dieTimer = new ig.Timer(0);
                ig.game.registerTarget(this.word.charAt(0), this);
                this.angle = this.angleTo(ig.game.player);
            },
            getWordWithLength: function (l) {
                var w = 'wtf';
                for (var i = 0; i < 20; i++) {
                    if (l >= 2 && l <= 12) {
                        w = WORDS[l].random();
                    } else {
                        w = String.fromCharCode('a'.charCodeAt(0) + (Math.random() * 26).floor());
                    }


                    if (!ig.game.targets[w.charAt(0)].length) {
                        return w;
                    }
                }
                return w;
            },
            target: function () {
                this.targeted = true;
                ig.game.currentTarget = this;
                ig.game.unregisterTarget(this.word.charAt(0), this);
                ig.game.entities.erase(this);
                ig.game.entities.push(this);
            },
            draw: function () {
                ig.system.context.globalCompositeOperation = 'lighter';
                this.parent();
                ig.system.context.globalCompositeOperation = 'source-over';
            },
            drawLabel: function () {
                if (!this.remainingWord.length) {
                    return;
                }
                
                //if ("абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(this.word.charAt(0)) != -1) {debugger};
                var w = this.font.widthForString(this.word);
                var x = (this.pos.x - 6).limit(w + 2, ig.system.width - 1);
                var y = (this.pos.y + this.size.y - 10).limit(2, ig.system.height - 19);
                var bx = ig.system.getDrawPos(x - w - 2);
                var by = ig.system.getDrawPos(y - 3);
                ig.system.context.fillStyle = 'rgba(0,0,0,0.5)';
                ig.system.context.fillRect(bx, by, w + 3, 19);
                if (this.targeted) {
                    this.fontActive.draw(this.remainingWord, x, y, ig.Font.ALIGN.RIGHT);
                } else {
                    //debugger
                    //if (isNaN(x)) debugger
                    this.font.draw(this.remainingWord, x, y, ig.Font.ALIGN.RIGHT);
                }
            },
            kill: function () {
                ig.game.unregisterTarget(this.word.charAt(0), this);
                if (ig.game.currentTarget == this) {
                    ig.game.currentTarget = null;
                }
                this.parent();
            },
            update: function () {
                if (this.hitTimer.delta() > 0) {
                    this.vel.x = Math.cos(this.angle) * this.speed;
                    this.vel.y = Math.sin(this.angle) * this.speed;
                }
                this.parent();
                if (this.pos.x < -this.animSheet.width || this.pos.x > ig.system.width + 10 || this.pos
                    .y > ig.system.height + 10 || this.pos.y < -this.animSheet.height - 30) {
                    this.kill();
                }
            },
            hit: function () {
                var numParticles = this.health <= 1 ? 10 : 4;
                for (var i = 0; i < numParticles; i++) {
                    ig.game.spawnEntity(EntityExplosionParticle, this.pos.x, this.pos.y);
                }
                this.vel.x = -Math.cos(this.angle) * 20;
                this.vel.y = -Math.sin(this.angle) * 20;
                this.hitTimer.set(0.3);
                this.receiveDamage(1);
                ig.game.lastKillTimer.set(0.3);
                this.soundHit.play();
            },
            isHitBy: function (letter) {
                if (this.remainingWord.charAt(0) == letter) {
                    this.remainingWord = this.remainingWord.substr(1);
                    if (this.remainingWord.length == 0) {
                        ig.game.currentTarget = null;
                        ig.game.unregisterTarget(this.word.charAt(0), this);
                        this.dead = true;
                    }
                    return true;
                } else {
                    return false;
                }
            },
            check: function (other) {
                other.kill();
                this.kill();
            }
        });
        EntityExplosionParticle = EntityParticle.extend({
            lifetime: 0.5,
            fadetime: 0.5,
            vel: {
                x: 60,
                y: 60
            },
            animSheet: new ig.AnimationSheet('media/sprites/explosion.png', 32, 32),
            init: function (x, y, settings) {
                this.addAnim('idle', 5, [0, 1, 2]);
                this.parent(x, y, settings);
            },
            draw: function () {
                ig.system.context.globalCompositeOperation = 'lighter';
                this.parent();
                ig.system.context.globalCompositeOperation = 'source-over';
            },
            update: function () {
                this.currentAnim.angle += 0.1 * ig.system.tick;
                this.parent();
            }
        });
    });

// lib/game/entities/enemy-missle.js
ig.baked = true;
ig.module('game.entities.enemy-missle').requires('game.entities.enemy').defines(function () {
    EntityEnemyMissle = EntityEnemy.extend({
        size: {
            x: 8,
            y: 15
        },
        offset: {
            x: 6,
            y: 7
        },
        animSheet: new ig.AnimationSheet('media/sprites/missle.png', 20, 26),
        health: 4,
        speed: 35,
        targetTimer: null,
        wordLength: {
            min: 2,
            max: 5
        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.angle = settings.angle;
            this.currentAnim.angle = this.angle - Math.PI / 2;
            this.targetTimer = new ig.Timer(1);
        },
        update: function () {
            var d = this.targetTimer.delta();
            if (d > 0 && d < 0.7) {
                var ad = this.angle - this.angleTo(ig.game.player);
                this.angle -= ad * ig.system.tick * 2;
                this.currentAnim.angle = this.angle - Math.PI / 2;
            }
            this.parent();
        }
    });
});

// lib/game/entities/enemy-mine.js
ig.baked = true;
ig.module('game.entities.enemy-mine').requires('game.entities.enemy').defines(function () {
    EntityEnemyMine = EntityEnemy.extend({
        size: {
            x: 12,
            y: 12
        },
        offset: {
            x: 10,
            y: 10
        },
        animSheet: new ig.AnimationSheet('media/sprites/mine.png', 32, 32),
        speed: 30,
        health: 6,
        wordLength: {
            min: 3,
            max: 6
        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },
        update: function () {
            this.angle = this.angleTo(ig.game.player);
            this.parent();
            this.currentAnim.angle += 2 * ig.system.tick;
        }
    });
});

// lib/game/entities/enemy-destroyer.js
ig.baked = true;
ig.module('game.entities.enemy-destroyer').requires('game.entities.enemy').defines(function () {
    EntityEnemyDestroyer = EntityEnemy.extend({
        size: {
            x: 24,
            y: 34
        },
        offset: {
            x: 10,
            y: 8
        },
        animSheet: new ig.AnimationSheet('media/sprites/destroyer.png', 43, 58),
        health: 8,
        speed: 20,
        shootTimer: null,
        wordLength: {
            min: 7,
            max: 10
        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.shootTimer = new ig.Timer(5);
            this.angle = (Math.random().map(0, 1, 67, 90) +
                (this.pos.x > ig.system.width / 2 ? 22.5 : 0)) * Math.PI / 180;
            this.currentAnim.angle = this.angle - Math.PI / 2;
        },
        update: function () {
            this.parent();
            if (this.shootTimer.delta() > 0) {
                this.shootTimer.reset();
                ig.game.spawnEntity(EntityEnemyMissle, this.pos.x + 12, this.pos.y + 22, {
                    angle: this.angle
                });
            }
        }
    });
});

// lib/game/entities/enemy-oppressor.js
ig.baked = true;
ig.module('game.entities.enemy-oppressor').requires('game.entities.enemy').defines(function () {
    EntityEnemyOppressor = EntityEnemy.extend({
        size: {
            x: 36,
            y: 58
        },
        offset: {
            x: 16,
            y: 10
        },
        animSheet: new ig.AnimationSheet('media/sprites/oppressor.png', 68, 88),
        health: 10,
        speed: 15,
        shootTimer: null,
        bullets: 16,
        wordLength: {
            min: 9,
            max: 12
        },
        init: function (x, y, settings) {
            this.parent(x, y - 18, settings);
            this.addAnim('idle', 1, [0]);
            this.shootTimer = new ig.Timer(7);
            this.angle = Math.PI / 2;
        },
        update: function () {
            this.parent();
            if (this.shootTimer.delta() > 0) {
                var inc = 140 / (this.bullets - 1);
                var a = 20;
                var radius = 21;
                for (var i = 0; i < this.bullets; i++) {
                    var angle = a * Math.PI / 180;
                    var x = this.pos.x + 18 + Math.cos(angle) * radius;
                    var y = this.pos.y + 48 + Math.sin(angle) * radius;
                    ig.game.spawnEntity(EntityEnemyBullet, x, y, {
                        angle: angle
                    });
                    a += inc;
                }
                this.shootTimer.reset();
            }
        }
    });
    EntityEnemyBullet = EntityEnemy.extend({
        size: {
            x: 2,
            y: 2
        },
        offset: {
            x: 8,
            y: 11
        },
        animSheet: new ig.AnimationSheet('media/sprites/bullet.png', 20, 24),
        health: 1,
        speed: 50,
        wordLength: {
            min: 1,
            max: 1
        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.angle = settings.angle;
            this.currentAnim.angle = this.angle - Math.PI / 2;
        }
    });
});

// lib/game/entities/player.js
ig.baked = true;
ig.module('game.entities.player').requires('impact.entity', 'game.entities.particle').defines(function () {
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/sprites/ship.png', 24, 24),
        targetAngle: 0,
        size: {
            x: 8,
            y: 8
        },
        offset: {
            x: 8,
            y: 8
        },
        angle: 0,
        targetAngle: 0,
        soundShoot: new ig.Sound('media/sounds/plasma.ogg'),
        soundMiss: new ig.Sound('media/sounds/click.ogg'),
        soundExplode: new ig.Sound('media/sounds/explosion.ogg'),
        type: ig.Entity.TYPE.A,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 60, [0]);
            this.addAnim('shoot', 0.05, [3, 2, 1, 0], true);
            this.addAnim('miss', 0.05, [4, 5, 6], true);
        },
        draw: function () {
            ig.system.context.globalCompositeOperation = 'lighter';
            this.parent();
            ig.system.context.globalCompositeOperation = 'source-over';
        },
        update: function () {
            if (this.currentAnim.loopCount > 0) {
                this.currentAnim = this.anims.idle;
            }
            var ad = this.angle - this.targetAngle;
            if (Math.abs(ad) < 0.02) {
                this.angle = this.targetAngle;
            } else {
                this.angle -= ad * ig.system.tick * 10;
            }
            this.currentAnim.angle = this.angle;
            this.parent();
        },
        kill: function () {
            ig.game.setGameOver();
            this.soundExplode.play();
            for (var i = 0; i < 50; i++) {
                ig.game.spawnEntity(EntityExplosionParticleFast, this.pos.x, this.pos.y);
            }
            this.pos.y = ig.system.height + 300;
            this.parent();
        },
        shoot: function (target) {
            this.currentAnim = this.anims.shoot.rewind();
            var ent = ig.game.spawnEntity(EntityPlasma, this.pos.x + 6, this.pos.y + 4);
            ent.target = target;
            var angle = this.angleTo(target);
            this.targetAngle = angle + Math.PI / 2;
            this.soundShoot.play();
        },
        miss: function () {
            this.currentAnim = this.anims.miss.rewind();
            this.soundMiss.play();
        }
    });
    EntityPlasma = ig.Entity.extend({
        speed: 800,
        maxVel: {
            x: 1000,
            y: 1000
        },
        animSheet: new ig.AnimationSheet('media/sprites/plasma.png', 96, 96),
        size: {
            x: 4,
            y: 4
        },
        offset: {
            x: 46,
            y: 46
        },
        distance: 100000,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },
        draw: function () {
            ig.system.context.globalCompositeOperation = 'lighter';
            this.parent();
            ig.system.context.globalCompositeOperation = 'source-over';
        },
        update: function () {
            if (this.target) {
                var currentDistance = this.distanceTo(this.target);
                if (currentDistance > this.distance || currentDistance < this.target.size.y) {
                    this.target.hit();
                    this.kill();
                    return;
                } else {
                    var angle = this.angleTo(this.target);
                    this.currentAnim.angle = angle + Math.PI / 2;
                    this.vel.x = Math.cos(angle) * this.speed;
                    this.vel.y = Math.sin(angle) * this.speed;
                }
                this.distance = currentDistance;
                this.parent();
            } else {
                this.kill();
            }
        }
    });
    EntityExplosionParticleFast = EntityParticle.extend({
        lifetime: 2,
        fadetime: 2,
        maxVel: {
            x: 1000,
            y: 1000
        },
        vel: {
            x: 100,
            y: 100
        },
        animSheet: new ig.AnimationSheet('media/sprites/explosion.png', 32, 32),
        init: function (x, y, settings) {
            this.addAnim('idle', 5, [0, 1, 2]);
            this.parent(x, y, settings);
        },
        draw: function () {
            ig.system.context.globalCompositeOperation = 'lighter';
            this.parent();
            ig.system.context.globalCompositeOperation = 'source-over';
        },
        update: function () {
            this.currentAnim.angle += 0.1 * ig.system.tick;
            this.parent();
        }
    });
});

// lib/plugins/impact-splash-loader.js
ig.baked = true;
ig.module('plugins.impact-splash-loader').requires('impact.loader').defines(function () {
    ig.ImpactSplashLoader = ig.Loader.extend({
        endTimer: 0,
        fadeToWhiteTime: 200,
        fadeToGameTime: 800,
        end: function () {
            this.parent();
            this.endTime = Date.now();
            ig.system.setDelegate(this);
        },
        run: function () {
            var t = Date.now() - this.endTime;
            var alpha = 1;
            if (t < this.fadeToWhiteTime) {
                this.draw();
                alpha = t.map(0, this.fadeToWhiteTime, 0, 1);
            } else if (t < this.fadeToGameTime) {
                ig.game.run();
                alpha = t.map(this.fadeToWhiteTime, this.fadeToGameTime, 1, 0);
            } else {
                ig.system.setDelegate(ig.game);
                return;
            }
            ig.system.context.fillStyle = 'rgba(255,255,255,' + alpha + ')';
            ig.system.context.fillRect(0, 0, ig.system.realWidth, ig.system.realHeight);
        },
        draw: function () {
            this._drawStatus += (this.status - this._drawStatus) / 5;
            var ctx = ig.system.context;
            var w = ig.system.realWidth;
            var h = ig.system.realHeight;
            var s = w / 340 / 3;
            var c = (w - 340 * s) / 2;
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#888';
            ctx.textAlign = 'right';
            ctx.font = '10px Arial';
            ctx.fillText('http://impactjs.com', w - 10, h - 10);
            ctx.textAlign = 'left';
            ctx.save();
            ctx.translate(c, h / 2.5);
            ctx.scale(s, s);
            ctx.lineWidth = '3';
            ctx.strokeStyle = '#666666';
            ctx.strokeRect(25, 160, 300, 20);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(30, 165, 290 * this._drawStatus, 10);
            this.drawPaths("rgb(255,255,255)", ig.ImpactSplashLoader.PATHS_IMPACT);
            var comet = ig.ImpactSplashLoader.PATHS_COMET;
            comet[5][0] = 3 - Math.random() * this._drawStatus * 7;
            comet[5][1] = 3 - Math.random() * this._drawStatus * 10;
            comet[7][0] = 29.5 - Math.random() * this._drawStatus * 10;
            comet[7][1] = 40.4 - Math.random() * this._drawStatus * 10;
            comet[9][0] = 16.1 - Math.random() * this._drawStatus * 10;
            comet[9][1] = 36.1 - Math.random() * this._drawStatus * 5;
            ctx.translate(-Math.random() * this._drawStatus * 7, -Math.random() * this._drawStatus *
                5);
            this.drawPaths("rgb(243,120,31)", comet);
            ctx.restore();
        },
        drawPaths: function (color, paths) {
            var ctx = ig.system.context;
            ctx.fillStyle = color;
            for (var i = 0; i < paths.length; i += 2) {
                ctx[ig.ImpactSplashLoader.OPS[paths[i]]].apply(ctx, paths[i + 1]);
            }
        }
    });
    ig.ImpactSplashLoader.OPS = {
        bp: 'beginPath',
        cp: 'closePath',
        f: 'fill',
        m: 'moveTo',
        l: 'lineTo',
        bc: 'bezierCurveTo'
    };
    ig.ImpactSplashLoader.PATHS_COMET = ['bp', [], 'm', [85.1, 58.3], 'l', [0.0, 0.0], 'l', [29.5, 40.4], 'l', [
            16.1, 36.1
        ], 'l', [54.6, 91.6], 'bc', [65.2, 106.1, 83.4, 106.7, 93.8, 95.7], 'bc', [103.9, 84.9, 98.6, 67.6,
            85.1, 58.3
        ], 'cp', [], 'm', [76.0, 94.3], 'bc', [68.5, 94.3, 62.5, 88.2, 62.5, 80.8], 'bc', [62.5, 73.3, 68.5,
            67.2, 76.0, 67.2
        ], 'bc', [83.5, 67.2, 89.6, 73.3, 89.6, 80.8], 'bc', [89.6, 88.2, 83.5, 94.3, 76.0, 94.3], 'cp', [],
        'f', []
    ];
    ig.ImpactSplashLoader.PATHS_IMPACT = ['bp', [], 'm', [128.8, 98.7], 'l', [114.3, 98.7], 'l', [114.3, 26.3],
        'l', [128.8, 26.3], 'l', [128.8, 98.7], 'cp', [], 'f', [], 'bp', [], 'm', [159.2, 70.1], 'l', [
            163.6, 26.3
        ], 'l', [184.6, 26.3], 'l', [184.6, 98.7], 'l', [170.3, 98.7], 'l', [170.3, 51.2], 'l', [164.8,
            98.7], 'l', [151.2, 98.7], 'l', [145.7, 50.7], 'l', [145.7, 98.7], 'l', [134.1, 98.7], 'l', [
            134.1, 26.3
        ], 'l', [155.0, 26.3], 'l', [159.2, 70.1], 'cp', [], 'f', [], 'bp', [], 'm', [204.3, 98.7], 'l', [
            189.8, 98.7
        ], 'l', [189.8, 26.3], 'l', [211.0, 26.3], 'bc', [220.0, 26.3, 224.5, 30.7, 224.5, 39.7], 'l', [
            224.5, 60.1
        ], 'bc', [224.5, 69.1, 220.0, 73.6, 211.0, 73.6], 'l', [204.3, 73.6], 'l', [204.3, 98.7], 'cp', [],
        'm', [207.4, 38.7], 'l', [204.3, 38.7], 'l', [204.3, 61.2], 'l', [207.4, 61.2], 'bc', [209.1, 61.2,
            210.0, 60.3, 210.0, 58.6
        ], 'l', [210.0, 41.3], 'bc', [210.0, 39.5, 209.1, 38.7, 207.4, 38.7], 'cp', [], 'f', [], 'bp', [],
        'm', [262.7, 98.7], 'l', [248.3, 98.7], 'l', [247.1, 88.2], 'l', [238.0, 88.2], 'l', [237.0, 98.7],
        'l', [223.8, 98.7], 'l', [233.4, 26.3], 'l', [253.1, 26.3], 'l', [262.7, 98.7], 'cp', [], 'm', [
            239.4, 75.5
        ], 'l', [245.9, 75.5], 'l', [242.6, 43.9], 'l', [239.4, 75.5], 'cp', [], 'f', [], 'bp', [], 'm', [
            300.9, 66.7
        ], 'l', [300.9, 85.9], 'bc', [300.9, 94.9, 296.4, 99.4, 287.4, 99.4], 'l', [278.5, 99.4], 'bc', [
            269.5, 99.4, 265.1, 94.9, 265.1, 85.9
        ], 'l', [265.1, 39.1], 'bc', [265.1, 30.1, 269.5, 25.6, 278.5, 25.6], 'l', [287.2, 25.6], 'bc', [
            296.2, 25.6, 300.7, 30.1, 300.7, 39.1
        ], 'l', [300.7, 56.1], 'l', [286.4, 56.1], 'l', [286.4, 40.7], 'bc', [286.4, 38.9, 285.6, 38.1,
            283.8, 38.1
        ], 'l', [282.1, 38.1], 'bc', [280.4, 38.1, 279.5, 38.9, 279.5, 40.7], 'l', [279.5, 84.3], 'bc', [
            279.5, 86.1, 280.4, 86.9, 282.1, 86.9
        ], 'l', [284.0, 86.9], 'bc', [285.8, 86.9, 286.6, 86.1, 286.6, 84.3], 'l', [286.6, 66.7], 'l', [
            300.9, 66.7
        ], 'cp', [], 'f', [], 'bp', [], 'm', [312.5, 98.7], 'l', [312.5, 39.2], 'l', [303.7, 39.2], 'l', [
            303.7, 26.3
        ], 'l', [335.8, 26.3], 'l', [335.8, 39.2], 'l', [327.0, 39.2], 'l', [327.0, 98.7], 'l', [312.5,
            98.7], 'cp', [], 'f', [],
    ];
});

// lib/game/main.js
ig.baked = true;
ig.module('game.main').requires('impact.game', 'impact.font', 'game.menus', 'game.entities.enemy-missle',
    'game.entities.enemy-mine', 'game.entities.enemy-destroyer', 'game.entities.enemy-oppressor',
    'game.entities.player', 'plugins.impact-splash-loader').defines(function () {
    Number.zeroes = '000000000000';
    Number.prototype.zeroFill = function (d) {
        var s = this.toString();
        return Number.zeroes.substr(0, d - s.length) + s;
    };
    ZType = ig.Game.extend({
        font: new ig.Font('media/fonts/tungsten-18.png'),
        fontScore: new ig.Font('media/fonts/04b03-mono-digits.png'),
        fontTitle: new ig.Font('media/fonts/tungsten-48.png'),
        fontSelected: new ig.Font('media/fonts/tungsten-18-orange.png'),
        spawnTimer: null,
        targets: {},
        currentTarget: null,
        yScroll: 0,
        backdrop: new ig.Image('media/background/backdrop.png'),
        grid: new ig.Image('media/background/grid.png'),
        music: new ig.Sound('media/music/endure.ogg', false),
        menu: null,
        mode: 0,
        score: 0,
        streak: 0,
        hits: 0,
        misses: 0,
        multiplier: 1,
        wave: {},
        gameTime: 0,
        kills: 0,
        difficulty: 'NORMAL',
        init: function () {
            var bgmap = new ig.BackgroundMap(62, [
                [1]
            ], this.grid);
            bgmap.repeat = true;
            this.backgroundMaps.push(bgmap);
            ig.music.add(this.music);
            window.addEventListener('keydown', this.keydown.bind(this), false);
            ig.input.bind(ig.KEY.ENTER, 'ok');
            ig.input.bind(ig.KEY.SPACE, 'ok');
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            ig.input.bind(ig.KEY.BACKSPACE, 'void');
            ig.input.bind(ig.KEY.ESC, 'menu');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            this.setTitle();
            window.focus();
            ig.system.canvas.onclick = function () {
                window.focus();
            };
        },
        reset: function () {
            this.entities = [];
            this.currentTarget = null;
            this.wave = ig.copy(ZType.WAVES[this.difficulty]);
            var first = 'a'.charCodeAt(0),
                last = 'z'.charCodeAt(0);
            for (var i = first; i <= last; i++) {
                this.targets[String.fromCharCode(i)] = [];
            }
            
            this.targets["а"] = [];
            this.targets["б"] = [];
            this.targets["в"] = [];
            this.targets["г"] = [];
            this.targets["д"] = [];
            this.targets["е"] = [];
            this.targets["ё"] = [];
            this.targets["ж"] = [];
            this.targets["з"] = [];
            this.targets["и"] = [];
            this.targets["й"] = [];
            this.targets["к"] = [];
            this.targets["л"] = [];
            this.targets["м"] = [];
            this.targets["н"] = [];
            this.targets["о"] = [];
            this.targets["п"] = [];
            this.targets["р"] = [];
            this.targets["с"] = [];
            this.targets["т"] = [];
            this.targets["у"] = [];
            this.targets["ф"] = [];
            this.targets["х"] = [];
            this.targets["ц"] = [];
            this.targets["ч"] = [];
            this.targets["ш"] = [];
            this.targets["щ"] = [];
            this.targets["ъ"] = [];
            this.targets["ы"] = [];
            this.targets["ь"] = [];
            this.targets["э"] = [];
            this.targets["ю"] = [];
            this.targets["я"] = [];

            this.score = 0;
            this.rs = 0;
            this.streak = 0;
            this.hits = 0;
            this.misses = 0;
            this.kills = 0;
            this.multiplier = 1;
            this.gameTime = 0;
            this.lastKillTimer = new ig.Timer();
            this.spawnTimer = new ig.Timer();
            this.waveEndTimer = null;
        },
        nextWave: function () {
            this.wave.wave++;
            this.wave.spawnWait = (this.wave.spawnWait * 0.97).limit(0.2, 1);
            this.wave.spawn = [];
            var dec = 0;
            for (var t = 0; t < this.wave.types.length; t++) {
                var type = this.wave.types[t];
                type.count -= dec;
                if (this.wave.wave % type.incEvery == 0) {
                    type.count++;
                    dec++;
                }
                for (var s = 0; s < type.count; s++) {
                    this.wave.spawn.push(t);
                }
            }
            this.wave.spawn.sort(function () {
                return Math.random() - 0.5;
            });
        },
        spawnCurrentWave: function () {
            if (!this.wave.spawn.length) {
                if (this.entities.length <= 1 && !this.waveEndTimer) {
                    this.waveEndTimer = new ig.Timer(2);
                } else if (this.waveEndTimer && this.waveEndTimer.delta() > 0) {
                    this.waveEndTimer = null;
                    this.nextWave();
                }
            } else if (this.spawnTimer.delta() > this.wave.spawnWait) {
                this.spawnTimer.reset();
                var type = this.wave.types[this.wave.spawn.pop()].type;
                var x = Math.random().map(0, 1, 10, ig.system.width - 10);
                var y = -30;
                this.spawnEntity(type, x, y, {
                    healthBoost: this.wave.healthBoost
                });
            }
        },
        registerTarget: function (letter, ent) {
            this.targets[letter].push(ent);
        },
        unregisterTarget: function (letter, ent) {
            this.targets[letter].erase(ent);
        },
        keydown: function (event) {
            //if ('х'.indexOf(event.key) != -1) {debugger}
            if (event.target.type == 'text' || event.ctrlKey || event.shiftKey || event.altKey ||
                this.mode != ZType.MODE.GAME || this.menu) {
                return true;
            }
            var c = event.which;
            //188 - Comma(б), 190 - Period(ю) 186 - Semicolon(ж), 222 - Quote(э), 219 - BracketLeft(х), 221 - BracketRight(ъ), 192 - Backquote(ё)
            
            //var us3 = ([186,188,190,192,219,221,222].indexOf(c) != -1)
            
            if (!(     (c > 64 && c < 91) || (c > 96 && c < 123) || (c == 186) || (c == 188) || (c == 190) || (c == 192) || (c = 219) || (c == 221) || (c == 222)  )) {
                return true;
            }
            event.stopPropagation();
            event.preventDefault();
            var letter = event.key.toLowerCase();//String.fromCharCode(c).toLowerCase();
            if (!this.currentTarget) {
                var potentialTargets = this.targets[letter];
                var nearestDistance = -1;
                var nearestTarget = null;
                if (typeof(potentialTargets) == "undefined") { potentialTargets = 0; }
                for (var i = 0; i < potentialTargets.length; i++) {
                    var distance = this.player.distanceTo(potentialTargets[i]);
                    if (distance < nearestDistance || !nearestTarget) {
                        nearestDistance = distance;
                        nearestTarget = potentialTargets[i];
                    }
                }
                if (nearestTarget) {
                    nearestTarget.target();
                } else {
                    this.player.miss();
                    this.multiplier = 1;
                    this.streak = 0;
                    this.misses++;
                }
            }
            if (this.currentTarget) {
                var c = this.currentTarget;
                var hit = this.currentTarget.isHitBy(letter);
                if (hit) {
                    this.player.shoot(c);
                    this.score += this.multiplier;
                    this.hits++;
                    this.streak++;
                    if (ZType.MULTIPLIER_TIERS[this.streak]) {
                        this.multiplier += 1;
                    }
                    if (c.dead) {
                        this.kills++;
                    }
                } else {
                    this.player.miss();
                    this.multiplier = 1;
                    this.streak = 0;
                    this.misses++;
                }
            }
            return false;
        },
        setGame: function () {
            this.reset();
            this.menu = null;
            this.player = this.spawnEntity(EntityPlayer, ig.system.width / 2, ig.system.height -
            50);
            this.mode = ZType.MODE.GAME;
            this.nextWave();
            ig.music.play();
        },
        setGameOver: function () {
            this.mode = ZType.MODE.GAME_OVER;
            this.menu = new GameOverMenu();
        },
        setTitle: function () {
            this.reset();
            this.mode = ZType.MODE.TITLE;
            this.menu = new TitleMenu();
        },
        toggleMenu: function () {
            if (this.mode == ZType.MODE.TITLE) {
                if (this.menu instanceof TitleMenu) {
                    this.menu = new PauseMenu();
                } else {
                    this.menu = new TitleMenu();
                }
            } else {
                if (this.menu) {
                    this.menu = null;
                } else {
                    this.menu = new PauseMenu();
                }
            }
        },
        update: function () {
            if (ig.input.pressed('menu') && !this.menu) {
                this.toggleMenu();
            }
            if (this.menu) {
                this.backgroundMaps[0].scroll.y -= 100 * ig.system.tick;
                this.menu.update();
                if (!(this.menu instanceof GameOverMenu)) {
                    return;
                }
            }
            this.parent();
            if (this.mode == ZType.MODE.GAME) {
                this.spawnCurrentWave();
            } else if (ig.input.pressed('ok')) {
                if (this.mode == ZType.MODE.TITLE) {
                    this.setGame();
                } else {
                    this.setTitle();
                }
            }
            this.yScroll -= 100 * ig.system.tick;
            this.backgroundMaps[0].scroll.y = this.yScroll;
            if (this.entities.length > 1 && this.mode == ZType.MODE.GAME) {
                this.gameTime += ig.system.tick;
            }
            if (this.score - this.rs > 100 || ig.Timer.timeScale != 1) {
                this.score = 0;
            }
            this.rs = this.score;
        },
        draw: function () {
            this.backdrop.draw(0, 0);
            var d = this.lastKillTimer.delta();
            ig.system.context.globalAlpha = d < 0 ? d * -2 + 0.3 : 0.3;
            for (var i = 0; i < this.backgroundMaps.length; i++) {
                this.backgroundMaps[i].draw();
            }
            ig.system.context.globalAlpha = 1;
            for (var i = 0; i < this.entities.length; i++) {
                this.entities[i].draw();
            }
            for (var i = 0; i < this.entities.length; i++) {
                //debugger
                this.entities[i].drawLabel && this.entities[i].drawLabel();
            }
            if (this.mode == ZType.MODE.GAME) {
                this.drawUI();
            } else if (this.mode == ZType.MODE.TITLE) {
                this.drawTitle();
            } else if (this.mode == ZType.MODE.GAME_OVER) {
                this.drawGameOver();
            }
            if (this.menu) {
                this.menu.draw();
            }
        },
        drawUI: function () {
            var s = '(' + this.multiplier + 'x) ' + this.score.zeroFill(6);
            this.fontScore.draw(s, ig.system.width - 4, ig.system.height - 12, ig.Font.ALIGN.RIGHT);
            if (this.waveEndTimer) {
                var d = -this.waveEndTimer.delta();
                var a = d > 1.7 ? d.map(2, 1.7, 0, 1) : d < 1 ? d.map(1, 0, 1, 0) : 1;
                var xs = ig.system.width / 2;
                var ys = ig.system.height / 3 + (d < 1 ? Math.cos(1 - d).map(1, 0, 0, 250) : 0);
                var w = this.wave.wave.zeroFill(3);
                ig.system.context.globalAlpha = a;
                this.fontTitle.draw('Wave ' + w + ' Clear', xs, ys, ig.Font.ALIGN.CENTER);
                ig.system.context.globalAlpha = 1;
            }
        },
        drawTitle: function () {
            var xs = ig.system.width / 2;
            var ys = ig.system.height / 4;
            this.fontTitle.draw('Z-Type', xs, ys, ig.Font.ALIGN.CENTER);
            ig.system.context.globalAlpha = 0.8;
            this.font.draw('Type to Shoot!', xs, ys + 90, ig.Font.ALIGN.CENTER);
            ig.system.context.globalAlpha = 1;
            var xc = 8;
            var yc = ig.system.height - 40;
            ig.system.context.globalAlpha = 0.6;
            this.font.draw('Concept, Graphics & Programming: Dominic Szablewski', xc, yc);
            this.font.draw('Music: Andreas Loesch', xc, yc + 20);
            ig.system.context.globalAlpha = 1;
        },
        drawGameOver: function () {
            var xs = ig.system.width / 2;
            var ys = ig.system.height / 4;
            var acc = this.hits ? this.hits / (this.hits + this.misses) * 100 : 0;
            var wpm = this.kills / (this.gameTime / 60);
            this.fontTitle.draw('Game Over', xs, ys, ig.Font.ALIGN.CENTER);
            this.fontTitle.draw('Final Score: ' + this.score.zeroFill(6), xs, ys + 90, ig.Font.ALIGN
                .CENTER);
            this.font.draw('Accuracy: ' + acc.round(1) + '%', xs, ys + 144, ig.Font.ALIGN.CENTER);
            this.font.draw('Words Per Minute: ' + wpm.round(1), xs, ys + 168, ig.Font.ALIGN.CENTER);
            this.font.draw('Waves cleared: ' + (ig.game.wave.wave - 1), xs, ys + 192, ig.Font.ALIGN.CENTER);
        }
    });
    ZType.MODE = {
        TITLE: 0,
        GAME: 1,
        GAME_OVER: 2
    };
    ZType.MULTIPLIER_TIERS = {
        25: 2,
        50: 3,
        100: 4
    };
    ZType.WAVES = {
        NORMAL: {
            wave: 0,
            spawn: [],
            spawnWait: 1,
            healthBoost: 0,
            types: [{
                type: EntityEnemyOppressor,
                count: 0,
                incEvery: 13
            }, {
                type: EntityEnemyDestroyer,
                count: 0,
                incEvery: 5
            }, {
                type: EntityEnemyMine,
                count: 3,
                incEvery: 2
            }]
        },
        EXPERT: {
            wave: 0,
            spawn: [],
            spawnWait: 0.7,
            healthBoost: 0,
            types: [{
                type: EntityEnemyOppressor,
                count: 1,
                incEvery: 7
            }, {
                type: EntityEnemyDestroyer,
                count: 2,
                incEvery: 3
            }, {
                type: EntityEnemyMine,
                count: 9,
                incEvery: 1
            }]
        }
    };
    ig.System.drawMode = ig.System.DRAW.SMOOTH;
    if (ig.ua.iOS) {
        window.location.href = "https://goo.gl/qSntlx";
        return;
    }
    ig.main('#canvas', ZType, 60, 360, 640, 1, ig.ImpactSplashLoader);
});