// Generated by CoffeeScript 1.6.3
var MeteorHead,
  _this = this;

MeteorHead = (function() {
  var FPS;

  FPS = 60;

  function MeteorHead(canvasID) {
    var e,
      _this = this;
    try {
      document.createElement("canvas").getContext("2d");
    } catch (_error) {
      e = _error;
      console.loge;
    }
    this.canvas = document.getElementById(canvasID);
    this.stage = new createjs.Stage(this.canvas);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.stage.canvas.width = this.width;
    this.stage.canvas.height = this.height;
    this.stage.snapToPixelEnabled = true;
    this.container = new createjs.Container();
    this.stage.addChild(this.container);
    this.sound = new Sound();
    createjs.Touch.enable(this.stage);
    createjs.Ticker.setFPS(FPS);
    this.init();
    window.addEventListener("resize", function() {
      _this.width = window.innerWidth;
      _this.height = window.innerHeight;
      _this.stage.canvas.width = _this.width;
      return _this.stage.canvas.height = _this.height;
    });
  }

  MeteorHead.prototype.canvas = null;

  MeteorHead.prototype.stage = null;

  MeteorHead.prototype.container = null;

  MeteorHead.prototype.intervalID = null;

  MeteorHead.prototype.touch = {};

  MeteorHead.prototype.sound = null;

  MeteorHead.prototype.init = function() {
    var i, _i,
      _this = this;
    this.start();
    this.frame = 0;
    this.pool = [];
    for (i = _i = 0; _i <= 25; i = ++_i) {
      this.pool[i] = new createjs.Shape();
      this.pool[i].graphics.beginFill("#00FFFF").drawCircle(0, 0, 50);
      this.pool[i].alpha = 0;
      this.pool[i].cache(-50, -50, 100, 100);
      this.pool[i].snapToPixelEnabled = true;
    }
    this.label = new createjs.Text("20FPS", '20px serif', "#FFFFFF");
    this.stage.addChild(this.label);
    return createjs.Ticker.addEventListener("tick", function(e) {
      _this.frame++;
      _this.label.text = "" + ~~(createjs.Ticker.getMeasuredFPS() + 0.5) + "FPS";
      if (_this.frame % 5 === 0) {
        _this.spawn();
      }
      _this.changeSound();
      if (!e.paused) {
        _this.stage.update();
      }
    });
  };

  MeteorHead.prototype.start = function() {
    var _this = this;
    this.stage.addEventListener("stagemousedown", function(e) {
      _this.sound.play();
      _this.down(e);
      _this.changeSound();
      return _this.stage.addEventListener("stagemousemove", function(e) {
        return _this.down(e);
      });
    });
    return this.stage.addEventListener("stagemouseup", function(e) {
      _this.touch[e.pointerID].enable = false;
      return _this.stage.removeAllEventListeners("stagemousemove");
    });
  };

  MeteorHead.prototype.down = function(e) {
    return this.touch[e.pointerID] = {
      x: e.stageX,
      y: e.stageY,
      enable: true
    };
  };

  MeteorHead.prototype.spawn = function(diff) {
    var k, type, v, vol, _ref, _results;
    _ref = this.touch;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      if (v.enable) {
        this.addMarker(v.x, v.y);
        type = ~~(v.y / this.height * 4);
        vol = v.y / this.height * 4 - type;
        _results.push(this.sound.add(k, type, v.x / this.width * 1000, vol));
      } else {
        this.sound.remove(k);
        _results.push(delete this.touch[k]);
      }
    }
    return _results;
  };

  MeteorHead.prototype.changeSound = function(diff) {
    var k, type, v, vol, _ref, _results;
    _ref = this.touch;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      if (v.enable) {
        type = ~~(v.y / this.height * 4);
        vol = v.y / this.height * 4 - type;
        _results.push(this.sound.add(k, type, v.x / this.width * 1000, vol));
      } else {
        this.sound.remove(k);
        _results.push(delete this.touch[k]);
      }
    }
    return _results;
  };

  MeteorHead.prototype.addMarker = function(x, y) {
    var s,
      _this = this;
    s = this.getPool();
    s.x = ~~x;
    s.y = ~~y;
    s.angle = 0.5;
    s.alpha = 1;
    s.scaleX = 1;
    s.scaleY = 1;
    s.addEventListener("tick", function() {
      s.scaleX += s.angle;
      s.scaleY += s.angle;
      s.alpha -= 0.05;
      if (s.alpha < 0.1) {
        s.alpha = 0;
        s.removeAllEventListeners("tick");
        return _this.stage.removeChild(s);
      }
    });
    return this.stage.addChild(s);
  };

  MeteorHead.prototype.getPool = function() {
    var i, _i, _len, _ref;
    _ref = this.pool;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i.alpha === 0) {
        return i;
      }
    }
  };

  return MeteorHead;

})();

window.addEventListener("load", function(e) {
  var cache, main;
  window.removeEventListener("load", arguments.callee, false);
  cache = window.applicationCache;
  cache.addEventListener("updateready", function() {
    if (confirm('アプリケーションの新しいバージョンが利用可能です。更新しますか？')) {
      cache.swapCache();
      return location.reload();
    }
  });
  return main = new MeteorHead("canvas");
}, false);

document.ontouchmove = function(event) {
  return event.preventDefault();
};
