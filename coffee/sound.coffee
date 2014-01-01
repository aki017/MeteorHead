class Sound
  instance = null
  constructor: ()->
    if instance?
      return instance
    instance = @


    @playing = false

  play: ()->
    if @playing
      return
    @playing = true
    if(typeof(webkitAudioContext)!="undefined")
      audioctx = new webkitAudioContext();
    else if(typeof(AudioContext)!="undefined")
      audioctx = new AudioContext();

    @ctx = audioctx
    @osc = {}
    @gain = {}
  add: (k,type,hz,vol)->
    return unless @playing
    for i in [0..1]
      key = k+":"+((type+i)%4)
      if(!@osc[key]?)
        @gain[key] = @ctx.createGainNode()
        @gain[key].connect(@ctx.destination);
        @osc[key] = @ctx.createOscillator();
        @osc[key].connect(@gain[key]);
        @osc[key].noteOn(0)

    for i in [0..1]
      key = k+":"+((type+i)%4)
      @osc[key].frequency.value = hz
      @osc[key].type = (type + i) % 4
      @gain[key].gain.value = if i==0 then 1-vol else vol


  remove: (k)->
    for i in [0..3]
      key = k+":"+i
      unless @osc[key]?
        continue
      @osc[key].noteOff(0)
      delete @osc[key]
      delete @gain[key]
