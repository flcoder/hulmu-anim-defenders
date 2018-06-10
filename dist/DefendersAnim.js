import * as flcu from './flc-utils.js'
import Animation from './Animation.js'

const TOTAL_IMAGES = 6
const SIZE = 1080
const SCALE_75 = { x: 0.75, y: 0.75 }
const TOTAL_FRAMES = Math.floor( 12 * 60 )
const FPS = 60

const CONFIG_DEFAULTS = {
  fps: FPS,
  totalFrames: TOTAL_FRAMES,
  containerId: null,
  autoStart: true,
  size: SIZE
}

export default {
  create( config ) {
    return mkAnim( flcu.mkConfig( CONFIG_DEFAULTS, config ) )
  }
}

function mkAnim( config ) {

  const anim = new Animation( config.totalFrames )
  const stage = anim.stage = new Konva.Stage({
    container:  config.containerId,
    width:      config.size,
    height:     config.size
  })
  const dim = anim.dim = Object.create( null )
  const container = stage.container()
  const images = anim.images = Object.create( null )
  const state = anim.state = Object.create( null )
  const lBackground = new Konva.Layer
  const gBackground = new Konva.Group
  const lMain = new Konva.Layer
  const gMain = new Konva.Group

  Object.assign( state, config)
  state.images = Object.create( null )
  state.images.total = TOTAL_IMAGES
  state.images.loaded = 0

  lBackground.add( gBackground )
  lMain.add( gMain )
  stage.add( lBackground )
  stage.add( lMain )

  anim.config = config

  mkBackground()
  mkSun()

  ;['clouds', 'bldg1', 'bldg1dmg', 'brains', 'flak', 'shots'].map( loadImage )

  return anim

  function resize() {

    const cheight = container.offsetHeight
    const cwidth = container.offsetWidth
    const min = Math.min( container.offsetWidth, container.offsetHeight )
    const scale = min / SIZE

    dim.width = cwidth
    dim.height = cheight
    dim.scale = scale
    dim.right = dim.width / scale * 0.5
    dim.left = -dim.right
    dim.top = dim.height / scale * 0.5
    dim.bottom = -dim.top

    stage.width( cwidth )
    stage.height( cheight )

    gMain.x( cwidth * 0.5 )
    gMain.y( cheight * 0.5 )
    gMain.scale({x: scale, y: scale })

    gBackground.scale({ x: cwidth / SIZE, y: cheight / SIZE })

    images.clouds.resize( dim )
    images.bldg1.resize( dim )
    images.bldg1dmg.resize( dim )
    images.flash.scale( { x: cwidth / scale, y: cheight / scale } )
    images.flash.offset( { x: SIZE * 0.5, y: SIZE * 0.5 } )
    stage.draw()
    lBackground.cache()
    //for( let i in images ) images[ i ].cache()

  }

  function loadImage( name, index, arr, ext ) {
    ext = ext || 'png'
    Konva.Image.fromURL( 'img/' + name + '.' + ext, function( image ){
      images[ name ] = image
      if( ++state.images.loaded === state.images.total ) init()
    })
  }

  function init() {

    let i = images.clouds

    initClouds( i )
    gMain.add( i )

    i = images.bldg1
    initBldg1( i )
    gMain.add( i )

    i = images.bldg1dmg
    initBldg1Dmg( i )
    gMain.add( i )

    i = images.flak
    initBrains( i )
    gMain.add( i )

    i = images.brains
    initBrains( i )
    gMain.add( i )

    i = images.shots
    initBrains( i )
    gMain.add( i )

    mkFlash()

    initSharedAnimations()
    addEventListener( 'resize', resize )
    start()

  }

  function start() {
    if( state.isPlaying ) return
    resize()
    state.isPlaying = true
    requestAnimationFrame( processFrame )
  }

  function processFrame() {
    anim.tick()
    stage.draw()
    if( state.isPlaying ) requestAnimationFrame( processFrame )
  }

  function mkSun() {
    const sun = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 350,
      fill: '#fffb48'
    })
    sun.cache()
    gMain.add( sun )
  }

  function mkFlash() {
    images.flash = new Konva.Rect({
      fill: 'white',
      width: SIZE,
      height: SIZE
    })
    gMain.add( images.flash )
  }

  function mkBackground() {

    const opt = {
      width: SIZE,
      height: SIZE,
      fill: '#9d5ed7'
    }

    gBackground.add( new Konva.Rect( opt ) )

    opt.fill = '#081920'
    opt.height = SIZE * 0.08
    gBackground.add( new Konva.Rect( opt ) )
    opt.height = SIZE * 0.04

    opt.y = SIZE * 0.09
    gBackground.add( new Konva.Rect( opt ) )

    opt.y += SIZE * 0.05
    gBackground.add( new Konva.Rect( opt ) )

    opt.y = SIZE - SIZE * 0.18
    gBackground.add( new Konva.Rect( opt ) )

    opt.y = SIZE - SIZE * 0.13
    gBackground.add( new Konva.Rect( opt ) )

    opt.y = SIZE - SIZE * 0.08
    opt.height = SIZE * 0.08
    gBackground.add( new Konva.Rect( opt ) )

  }

  function initClouds( n ) {
    n.scale( SCALE_75 )
    n.offsetY( n.height() * 0.5 )
    n.scaledWidth = n.width() * n.scaleX()
    n.resize = function( dim ) {
      this.start = dim.left - this.scaledWidth
      this.span = dim.right - this.start
    }

  }

  function initBldg1( n ) {
    n.scale( SCALE_75 )
    n.offsetX( n.width() * 0.5 )
    n.offsetY( n.height() * 0.35 )
    n.scaledWidth = n.width() * n.scaleX() * 0.5
    n.resize = function( dim ) {
      this.span = dim.right + this.scaledWidth
      this.start = dim.left - this.scaledWidth
    }
  }

  function initBldg1Dmg( n ) {
    n.scale( SCALE_75 )
    n.offsetX( n.width() * 0.5 )
    n.offsetY( n.height() * 0.35 )
    n.scaledWidth = n.width() * n.scaleX() * 0.5
    n.resize = function( dim ) {
      this.span = dim.right + this.scaledWidth
      console.log( this.span )
    }
  }

  function initBrains( n ) {
    n.offsetX( n.width() * 0.5 )
    n.offsetY( n.height() * 0.40 )
  }

  function initSharedAnimations() {

    const b1n = images.bldg1
    const b1d = images.bldg1dmg
    const bra = images.brains
    const sho = images.shots
    const clo = images.clouds
    const fla = images.flak
    const fls = images.flash

    let bs = 5

    anim.addSpan( 0.0, 1.0, function( perc ) {
      fla.opacity( 0 )
      clo.x( clo.span * perc + clo.start )
      bra.scale( { x: bs, y: bs } )
      sho.scale( { x: bs, y: bs } )
    })

    anim.addSpan( 0.0, 0.3, function( perc ) {
      fls.opacity( 0 )
      b1n.opacity( 1 )
      b1n.x( 0 )
      b1d.opacity( 0 )
      sho.opacity( 0 )
    })

    anim.addSpan( 0.05, 0.3, function( perc ) {
      sho.opacity( 0 )
      bra.opacity( 1 )
      perc = 1 - perc
      bs = 0.6 + Math.pow( perc, 3 ) * 5
    })

    anim.addSpan( 0.3, 0.65, function( perc ) {
      bs = 0.6 + perc * 0.05
    })

    anim.addSpan( 0.65, 0.9, function( perc ) {
      fls.opacity( Math.pow( 1 - perc, 2 ) )
    })

    anim.addSpan( 0.5, 0.65, function( perc ) {
      if( perc < 0.4 ) {
        perc = perc / 0.4
      } else if( perc < 0.5 ) {
        perc = ( perc - 0.4 ) / 0.1
      } else {
        if( perc > 0.6 ) {
          fls.opacity( Math.pow( ( perc - 0.6 ) / 0.4 , 3 ) )
        }
        perc = 1
      }
      bra.opacity( 1 - perc )
      sho.opacity( perc )
    })

    anim.addSpan( 0.7, 0.90, function( perc ) {
      fla.opacity( perc < 0.75 ? 1 : 1 - ( perc - 0.75 ) / 0.25 )
      let s = 0.5 + perc
      fla.scale( { x: s, y: s } )
    })

    anim.addSpan( 0.65, 0.8, function( perc ) {
      bra.opacity( 1 )
      sho.opacity( 0 )
      bs = 0.7 + perc * 5
    })

    anim.addSpan( 0.65, 0.8, function( perc ) {
      b1d.x( perc * b1d.span )
    })

    anim.addSpan( 0.65, 0.8, function( perc ) {
      b1n.opacity( 0 )
      b1d.opacity( 1 )
      b1d.x( 0 )
    })

    anim.addSpan( 0.8, 0.95, function( perc ) {
      b1d.x( perc * b1d.span )
    })

    anim.addSpan( 0.65, 0.95, function( perc ) {
      b1d.opacity( 1 )
      bs = 0.7 + Math.pow( perc, 2 ) * 5
      perc = Math.pow( perc, 2 )
      bra.opacity( perc < 0.5 ? (0.5 - perc) : 0 )
    })

    anim.addSpan( 0.95, 1.0, function( perc ) {
      b1n.opacity( 1 )
      b1n.x( b1n.start + b1n.span * perc )
    })

  }

}
