/**
 * jQuery-star-rating.js Version 0.1
 * Custom jQuery plugin to show capture star rating.
 *
 * Usage:
 * ('#element').starRating({starCount: 4}); // pass no object and stars will default to 5.
 * ('#element').starRating('set', 3); // sets the star rating to 3.
 * ('#element').starRating('get'); // gets the rating value as a number. If no value is set, null.
 * ('#element').starRating('reset'); // resets the star rating.
 * ('#element').starRating('disable'); // disables the star rating.
 * ('#element').starRating('enable'); // enables the star rating after it has been disabled.
 * ('#element').starRating('destroy'); // destroys the star rating instance.
 *
 * ------------------------------------------------------------------------
 *
 * Licensed under MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2022 Tony Westaway
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
(function ($) {
  /**
   * Store the plugin name in a variable. Makes it easy to change plugin name.
   * @type {String}
   */
  var pluginName = "starRating";

  /**
   * The plugin constructor
   * @param {DOM Element} element The DOM element where plugin is applied
   * @param {Object} options Options passed to the constructor
   */
  function Plugin(element, options) {
    // Store a reference to the source element
    this.el = element;

    // Store a jQuery reference  to the source element
    this.$el = $(element);

    this.count = null;

    // Set the instance options extending the plugin defaults and
    // the options passed by the user
    this.options = $.extend({}, $.fn[pluginName].defaults, options);

    // Initialize the plugin instance
    this._init();
  }

  /**
   * Set up the Plugin prototype with desired methods.
   */
  Plugin.prototype = {
    /**
     * Initialize the plugin instance.
     *
     * When bind listeners remember to name tag it with your plugin's name.
     * Elements can have more than one listener attached to the same event
     * so you need to tag it to unbind the appropriate listener on destroy:
     */
    _init: function () {
      this._build();
    },

    /**
     * The 'destroy' method is where we free the resources used by your plugin:
     * references, unregister listeners, etc.
     */
    destroy: function () {
      // Remove any attached data from the plugin
      this.$el.off("." + pluginName);
      this.$el.removeData();
      this.$el.html("");
    },

    /**
     * Public method to set the star rating.
     * be called with:
     *
     * @example
     * $('#element').jqueryPlugin('setStarRating', 1);
     *
     * @param  {[number]} count The raiting count to be set.
     * @return {[void]} returns void.
     */
    set: function (count) {
      this._setStarCount(count);
    },

    /**
     * Public method to reset the star rating.
     * be called with:
     *
     * @example
     * $('#element').jqueryPlugin('reset');
     *
     * @param  {[number]} count The rating count to be set.
     * @return {[void]} Returns void.
     */
    reset: function () {
      this._resetStarCount();
    },

    /**
     * Public method which acts as a getter method for count value.
     *
     * @example
     * $('#element').jqueryPlugin('get');
     *
     * to get the count value from the plugin instance.
     *
     * @return {[number]} Returns count value.
     */
    get: function () {
      return this.count;
    },

    /**
     * Public method which disables the star rating instance.
     *
     * @example
     * $('#element').jqueryPlugin('disable');
     *
     * @return {[void]} Returns void.
     */
    disable: function () {
      this._disableStarCount();
    },

    /**
     * Public method which enables the star rating instance.
     *
     * @example
     * $('#element').jqueryPlugin('enable');
     *
     * @return {[void]} Returns void.
     */
    enable: function () {
      this._enableStarCount();
    },

    /**
     * Functions starting with underscore are
     * private. Really calls to functions starting with underscore are
     * filtered, for example:
     *
     *  @example
     *  $('#element').jqueryPlugin('_build');  // Will not work
     */

    _build: function () {
      var thiz = this;
      var $wrapper = $('<ul class="star-rating"></ul>');
      var $stars = [];
      for (let i = 0; i < this.options.starCount; i++) {
        var $li = $('<li class="star"><i class="fa fa-star fa-fw"></i></li>');
        this.$el.on("mouseover." + pluginName, "li", function () {
          $(this).prevAll().add(this).addClass("hover");
        });
        this.$el.on("mouseout." + pluginName, "li", function () {
          $(this).prevAll().add(this).removeClass("hover");
          $(this).nextAll().add(this).removeClass("hover");
        });
        this.$el.on("click." + pluginName, "li", function () {
          $(this).prevAll().add(this).addClass("selected");
          $(this).nextAll().removeClass("selected");
          thiz.count = parseInt($wrapper.find("li").index($(this)) + 1, 10);
        });
        $stars.push($li);
      }
      $wrapper.append($stars);
      this.$el.append($wrapper);
    },

    _setStarCount: function (count) {
      var $lastStar = this.$el.find("li:nth-of-type(" + count + ")");
      $lastStar.prevAll().add($lastStar).addClass("selected");
      $lastStar.nextAll().removeClass("selected");
      this.count = count;
    },

    _resetStarCount: function () {
      this.$el.find("li").removeClass("selected");
      this.count = null;
    },

    _disableStarCount: function () {
      this.$el.find("ul").addClass("disable");
    },

    _enableStarCount: function () {
      this.$el.find("ul").removeClass("disable");
    },
  };

  /**
   * This is where we register our plugin within jQuery plugins.
   * It is a plugin wrapper around the constructor and prevents against multiple
   * plugin instantiation, (storing a plugin reference within the element's data)
   * and avoid any function starting with an underscore to be called (emulating
   * private functions).
   *
   */
  $.fn[pluginName] = function (options) {
    var args = arguments;

    if (options === undefined || typeof options === "object") {
      // Creates a new plugin instance, for each selected element, and
      // stores a reference within the element's data
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
      // Call a public plugin method (not starting with an underscore) for each
      // selected element.
      if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
        // If the user does not pass any arguments and the method is allowed to
        // work as a getter then break the chainability, so we can return a value
        // instead the element reference.
        var instance = $.data(this[0], "plugin_" + pluginName);
        return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
      } else {
        // Invoke the specified method on each selected element
        return this.each(function () {
          var instance = $.data(this, "plugin_" + pluginName);
          if (instance instanceof Plugin && typeof instance[options] === "function") {
            instance[options].apply(instance, Array.prototype.slice.call(args, 1));
          }
        });
      }
    }
  };

  /**
   * Names of the plugin methods that can act as a getter method.
   * @type {Array}
   */
  $.fn[pluginName].getters = ["get"];

  /**
   * Default options
   */
  $.fn[pluginName].defaults = {
    starCount: 5,
  };
})(jQuery);
