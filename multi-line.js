/*!
 * some description ......
 */
// CommonJS, AMD or Browser globals
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD Register as an anonymous module
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    var pluginName = 'multiLine',
        defaults = {
            separator: ',',
            width: 200,
            addText: '添加',
            delText: '删除',
            dataValues: 'data-values'
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(this.element);
        this.doc = $(document);
        this.win = $(window);
        this.settings = $.extend({}, defaults, options);

        /*
         * process and add data-attrs to settings as well for ease of use.
         */

        if (typeof(this.$element.data("multiLine")) === "object") {
            $.extend(this.settings, this.$element.data("multiLine"));
        }

        this._defaults = defaults;
        this._name = pluginName;

        this.html = '';
        this.values = [];

        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            var obj = this,
                $e = this.$element,
                $doc = this.doc,
                dataValues = this.settings.dataValues,
                separator = this.settings.separator;

            if ($e.attr(dataValues) != undefined && $e.attr(dataValues).length > 0) {
                this.values = $e.attr(dataValues).split(separator);
            }

            // 创建标签、设置样式、添加监听事件、添加到dom
            obj._createTag();
            obj._appendToDom();
            obj._addStyle();
            obj._addEvent();

        },

        addOne: function() {
            var liTag = $('<li class="line-li">'),
                inputTag = $('<input type="text" class="lines" value="" />'),
                btnTag = $('<button type="button" class="btn btn-warning minus">'),
                spanTag = $('<span class="glyphicon glyphicon-minus"></span><span>删除</span>');

            //'<li><input type="text" class="lines" value="" /><button type="button" class="minus"><span class="glyphicon glyphicon-minus"></span><span>删除</span></button></li>';

            liTag.append(inputTag);
            liTag.append(btnTag.append(spanTag));
            $('#multi-line').append(liTag);


            // 设置样式
            liTag.css({
                margin: '5px 0px'
            });
            inputTag.css({
                width: this.settings.width,
                padding: '6px 12px'
            });

            // 添加事件
            var self = this;
            // 删除一行
            btnTag.on('click', function() {
                self.delOne($(this));

                self._updateDataValues();
            });

            // input框 blur 时，更新 dataValues 值
            inputTag.on('blur', function(e) {

                self._updateDataValues();

            });

        },

        delOne: function(obj) {
            obj.parent('li').remove();
        },

        delAll: function() {},
        destory: function() {},

        _createTag: function() {

            this.html = '<ul class="multi-line" id="multi-line">';
            this.html += '<li><input type="text" class="lines no-border"  /><button type="button" class="btn btn-success plus"><span class="glyphicon glyphicon-plus"></span><span>添加</span></button></li>';

            if (this.values.length > 0) {

                for (var i=0; i < this.values.length; i++) {
                    this.html += '<li class="line-li"><input type="text" class="lines" value="' + this.values[i] + '" /><button type="button" class="btn btn-warning minus"><span class="glyphicon glyphicon-minus"></span><span>删除</span></button></li>';
                }

            }

            this.html += '</ul>';
        },

        _appendToDom: function() {
            this.$element.html(this.html);
        },

        _addStyle: function() {
            $('#multi-line').css({
                width: this.settings.width * 1.5,
                padding: 10
            });

            $('#multi-line .line-li').css({
                margin: '5px 0px'
            });

            $('#multi-line .lines').css({
                width: this.settings.width,
                padding: '6px 12px'
            });

            $('#multi-line .lines.no-border').css({
                border: 0
            });

        },

        _addEvent: function() {
            var self = this;

            // 添加一行
            $('#multi-line .plus').on('click', function(e) {
                self.addOne();
            });

            // 删除一行
            $('#multi-line .minus').on('click', function(e) {

                self.delOne($(this));

                self._updateDataValues();
            });

            // input框 blur 时，更新 dataValues 值
            $('#multi-line li input').on('blur', function(e) {

                self._updateDataValues();

            });

        },

        _updateDataValues: function() {

            // 遍历所有 li input，更新 dataValues 值
            var values = [];
            $.each($('#multi-line li input'), function(i, obj) {
                var v = $(obj).val();
                if (v) {
                    values.push(v);
                }
            });

            this.$element.attr(this.settings.dataValues, values.join(this.settings.separator));
        }
    });


    $[pluginName] = $.fn[pluginName] = function(options) {
        if (options === undefined || typeof options === 'object') {
            if (!(this instanceof $)) {
                $.extend(defaults, options);
            }
        }
        return new Plugin(this, options);
    };

}));