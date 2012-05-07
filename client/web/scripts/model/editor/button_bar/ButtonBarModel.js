/*
@author Tantaman
*/
define(["vendor/backbone"], function(Backbone) {
  var fontMethods, fontSettings, longSetting, setting, toggleable, _i, _len;
  fontSettings = ["size", "family", "color", "style", "weight", "decoration"];
  toggleable = function(setting) {
    return fontSettings.indexOf(setting) > 2;
  };
  fontMethods = {};
  for (_i = 0, _len = fontSettings.length; _i < _len; _i++) {
    setting = fontSettings[_i];
    longSetting = "font" + setting.substr(0, 1).toUpperCase() + setting.substr(1);
    fontMethods[longSetting] = (function() {
      var _longSetting, _setting;
      _longSetting = longSetting;
      _setting = setting;
      return function(value) {
        var currentValue;
        if (this._activeIsTextbox()) {
          console.log("Setting: " + _longSetting + " " + _setting + " " + value);
          currentValue = this.get(_longSetting);
          if (currentValue === value && toggleable(_setting)) value = "";
          if (_setting === "size") value |= 0;
          this.set(_longSetting, value);
          return this.activeComponent.set(_setting, value);
        }
      };
    })();
  }
  return Backbone.Model.extend({
    initialize: function() {
      this.fetch({
        keyTrail: ["editor", "slideEditor", "buttonBar"]
      });
      return _.extend(this, fontMethods);
    },
    fontConfig: function() {
      return {
        size: this.get("fontSize"),
        family: this.get("fontFamily"),
        color: this.get("fontColor"),
        style: this.get("fontStyle"),
        weight: this.get("fontWeight"),
        decoration: this.get("fontDecoration"),
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 - 80,
        z: 0
      };
    },
    imgConfig: function(src) {
      return {
        src: src,
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 - 80,
        z: 0
      };
    },
    _activeIsTextbox: function() {
      return this.activeComponent && this.activeComponent.constructor.name === "TextBox";
    },
    _pullFontSettings: function() {
      var setting, _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = fontSettings.length; _j < _len2; _j++) {
        setting = fontSettings[_j];
        _results.push(this.set("font" + setting.substr(0, 1).toUpperCase() + setting.substr(1), this.activeComponent.get(setting)));
      }
      return _results;
    },
    colorSelected: function(hex) {
      this.set("fontColor", hex);
      if (this._activeIsTextbox()) return this.activeComponent.set("color", hex);
    },
    activeComponentChanged: function(component) {
      this.activeComponent = component;
      if (this._activeIsTextbox()) return this._pullFontSettings();
    },
    constructor: function ButtonBarModel() {
			Backbone.Model.prototype.constructor.apply(this, arguments);
		}
  });
});
