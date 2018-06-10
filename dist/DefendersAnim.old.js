const SIZE = 1080

const CONFIG = {
  fps: 60,
  totalFrames: 150
}

export default class DefendersAnim {

  constructor( config ) {

    const self = this
    const stage = this.stage = new Konva.Stage({
      container: config.containerId,
      width: SIZE,
      height: SIZE
    })
    const lBackground = new Konva.Layer
    const lMain = new Konva.Layer
    const gBackground = new Konva.Group
    const gAll = new Konva.Group

    const container = stage.container()
    const images = {
      clouds: new Konva.Image
    }
    const dim = { width: 0, height: 0 }

    const frameInfo = {
      fps: config.fps || CONFIG.fps,
      totalFrames: config.totalFrames || CONFIG.totalFrames,
      currentFrame: 0
    }

    stage.add( lBackground )

    stage.add( lMain )

    lBackground.add( gBackground )

    lMain.add( gAll )

    Konva.Image.fromURL( 'img/clouds.png', function(image){
     image.y( image.height() * -0.4 )
     gAll.add(image)
     images.clouds = image
     stage.draw()
   })

    createBackground()
    createSun()
    addEventListener( 'resize', resize )
    resize()

    this.start = start

    addEventListener( 'load', start )
    function resize() {

      const cheight = container.offsetHeight
      const cwidth = container.offsetWidth
      const min = Math.min( container.offsetWidth, container.offsetHeight )
      const scale = min / SIZE
      const size = SIZE * scale

      images.clouds.swidth = scale * images.clouds.width()

      dim.width = cwidth
      dim.height = cheight
      dim.scale = scale

      stage.width( cwidth )
      stage.height( cheight )
      gAll.x( cwidth * 0.5 )
      gAll.y( cheight * 0.5 )
      gAll.scale({x: scale, y: scale })
      gBackground.scale({ x: cwidth / SIZE, y: cheight / SIZE })
      stage.draw()

    }

    function createBackground() {

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

    function createSun() {
      const circle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 300,
        fill: '#fffb48'
      })
      gAll.add( circle )
    }

    function start() {
      resize()
      requestAnimationFrame( animate )
    }

    function animate() {

      const c = images.clouds
      const dw = dim.width
      const dh = dim.height
      const perc = frameInfo.currentFrame / frameInfo.totalFrames
      const cw = c.width()
      const cspan = dw / dim.scale + cw
      const cx = cspan * -0.5 + perc * cspan - cw * 0.5

      frameInfo.currentFrame++
      if( frameInfo.currentFrame > frameInfo.totalFrames ) {
        frameInfo.currentFrame = 0
      }

      c.x( cx )

      stage.draw()

      console.log( cx  )
      requestAnimationFrame( animate )
    }

  }

}
