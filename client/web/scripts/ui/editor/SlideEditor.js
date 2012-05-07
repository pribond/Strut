/*
@author Matt Crinklaw-Vogt
*/
define(["vendor/backbone", "./Templates", "./SlidePreviewPanel", "./OperatingTable", "common/EventEmitter", "css!./res/css/SlideEditor", "./button_bar/ButtonBarView", "ui/widgets/PictureGrabber"], function(Backbone, Templates, SlidePreviewPanel, OperatingTable, EventEmitter, empty, ButtonBarView, PictureGrabber) {
  return Backbone.View.extend({
    className: "slideEditor",
    initialize: function() {
      var _this = this;
      this.name = "Slide Editor";
      $(window).resize(function() {
        return _this.resized();
      });
      this.operatingTable = new OperatingTable();
      this.slidePreviewPanel = new SlidePreviewPanel({
        model: this.model
      });
      return this.model.on("change:activeSlide", this.activeSlideChanged, this);
    },
    show: function() {
      return this.$el.removeClass("disp-none");
    },
    hide: function() {
      return this.$el.addClass("disp-none");
    },
    activeSlideChanged: function(model, newSlide) {
      return this.operatingTable.setModel(newSlide);
    },
    render: function() {
      var $items, $mainContent, pictureGrabber;
      this.$el.html(Templates.SlideEditor(this.model));
      this.$el.find(".dropdown-toggle").dropdown();
      $items = this.$el.find("a[title]");
      $items.tooltip({
        placement: 'bottom',
        delay: {
          show: 1000,
          hide: 100
        }
      }).click(function() {
        return $items.tooltip('hide');
      });
      $mainContent = this.$el.find(".mainContent");
      this.$slidePreviewPanel = this.slidePreviewPanel.render();
      this.$operatingTable = this.operatingTable.render();
      $mainContent.append(this.$slidePreviewPanel);
      $mainContent.append(this.$operatingTable);
      this.resized();
      if (this._buttonBar != null) this._buttonBar.dispose();
      pictureGrabber = new PictureGrabber();
      this.$el.append(pictureGrabber.render());
      this._buttonBar = new ButtonBarView({
        el: this.$el.find(".buttonBar"),
        deck: this.model,
        pictureGrabber: pictureGrabber
      });
      this._buttonBar.render();
      return this.$el;
    },
    resized: function() {
      if (this.$slidePreviewPanel) {
        this.$slidePreviewPanel.css("height", window.innerHeight - 80);
        this.$operatingTable.css("height", window.innerHeight - 80);
        return this.$operatingTable.css("width", window.innerWidth - 150);
      }
    }
  });
});
