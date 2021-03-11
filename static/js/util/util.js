(function (root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        //nodejs
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        //amd
        define(factory);
    }
    else if (typeof define === 'function' && define.cmd) {
        //cmd
        define(function (require, exports, module) {
            module.exports = factory();
        });
    }
    else {
        root.wone_util = factory();
    }
}(this, function () {
    return {
        get_one_viewport_height: function () {
            return document.documentElement.clientHeight + 'px';
        },
        get_element_computed_property: function (element, property) {
            if (window.getComputedStyle)
                return property ? window.getComputedStyle(element, null)[property] : null;
            return property ? element.currentStyle[property] : null;
        },
        clear_innerhtml: function (element) {
            if (element instanceof Array) {
                for (var _i = 0, element_1 = element; _i < element_1.length; _i++) {
                    var i = element_1[_i];
                    this.clear_innerhtml(element);
                }
            }
            element.innerHTML = '';
        }
    };
}));
