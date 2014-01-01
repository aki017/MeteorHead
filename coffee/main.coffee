class MeteorHead
  FPS = 60
  constructor: (canvasID)->
    try
      document.createElement("canvas").getContext("2d")
    catch e
      console.loge
    @canvas = document.getElementById(canvasID)
    @stage = new createjs.Stage(@canvas)
    @width = window.innerWidth
    @height = window.innerHeight
    @stage.canvas.width = @width
    @stage.canvas.height = @height
    @stage.snapToPixelEnabled = true
    @container = new createjs.Container()
    @stage.addChild(@container)
    @sound = new Sound()
    createjs.Touch.enable(@stage)
    createjs.Ticker.setFPS(FPS)
    @init()

    window.addEventListener "resize", ()=>
      @width = window.innerWidth
      @height = window.innerHeight
      @stage.canvas.width = @width
      @stage.canvas.height = @height

  canvas: null
  stage: null
  container: null
  intervalID: null
  touch: {}
  sound: null

  init: ()->
    @start()
    @frame = 0
    @pool = []
    for i in [0..25]
      @pool[i] = new createjs.Shape()
      @pool[i].graphics.beginFill("#00FFFF").drawCircle(0, 0, 50)
      @pool[i].alpha = 0
      @pool[i].cache(-50,-50,100,100)
      @pool[i].snapToPixelEnabled = true
    @label = new createjs.Text("20FPS", '20px serif', "#FFFFFF");
    @stage.addChild(@label)
    createjs.Ticker.addEventListener "tick", (e)=>
      @frame++
      @label.text = ""+~~(createjs.Ticker.getMeasuredFPS()+0.5)+"FPS"
      @spawn() if @frame%5==0
      @changeSound()
      if (!e.paused)
        @stage.update()
      return

  start: ()->
    @stage.addEventListener "stagemousedown", (e)=>
      @sound.play()
      @down(e)
      @changeSound()
      @stage.addEventListener "stagemousemove", (e)=>
        @down(e)
    @stage.addEventListener "stagemouseup", (e)=>
      @touch[e.pointerID].enable = false
      @stage.removeAllEventListeners("stagemousemove")

  down: (e)->
    @touch[e.pointerID] = {
      x: e.stageX,
      y: e.stageY,
      enable: true
    }

  spawn: (diff)->
    for k,v of @touch
      if v.enable
        @addMarker(v.x, v.y)
        type = ~~(v.y / @height * 4)
        vol = v.y / @height * 4 - type
        @sound.add(k, type, v.x / @width * 1000, vol)
      else
        @sound.remove(k)
        delete @touch[k]
  changeSound: (diff)->
    for k,v of @touch
      if v.enable
        type = ~~(v.y / @height * 4)
        vol = v.y / @height * 4 - type
        @sound.add(k, type, v.x / @width * 1000, vol)
      else
        @sound.remove(k)
        delete @touch[k]

  addMarker: (x, y)->
    s = @getPool()
    s.x = ~~x
    s.y = ~~y
    s.angle = 0.5
    s.alpha = 1
    s.scaleX = 1
    s.scaleY = 1
    s.addEventListener "tick", ()=>
      s.scaleX += s.angle
      s.scaleY += s.angle
      s.alpha -= 0.05
      if (s.alpha < 0.1)
        s.alpha = 0
        s.removeAllEventListeners("tick")
        @stage.removeChild(s)
    @stage.addChild(s)

  getPool: ()->
    for i in @pool when i.alpha==0
      return i

window.addEventListener "load", (e)=>
  window.removeEventListener("load", arguments.callee, false)
  cache = window.applicationCache
  cache.addEventListener "updateready", ()->
      if confirm 'アプリケーションの新しいバージョンが利用可能です。更新しますか？'
        cache.swapCache()
        location.reload()
  main = new MeteorHead("canvas")
, false

document.ontouchmove = (event)->
  event.preventDefault()
