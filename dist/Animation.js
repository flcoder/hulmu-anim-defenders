export default class Animation {

  constructor( totalFrames ) {
    this.currentFrame = 0
    this.totalFrames = totalFrames
    this.spans = []
  }

  tick() {
    this.processFrame( this.currentFrame )
    if( ++this.currentFrame > this.totalFrames ) this.currentFrame = 0
  }

  processFrame( frame ) {
    const perc = frame / this.totalFrames
    const spans = this.spans
    let i, s, len = spans.length
    for( i = 0; i < len; ++i ) {
      s = spans[ i ]
      if( s.start <= perc && s.stop >= perc ) {
        s.callback( ( perc - s.start ) / s.duration )
      }
    }
  }

  addSpan( start, stop, callback ) {
    const span = Object.create( null )
    span.start = start
    span.stop = stop
    span.duration = stop - start
    span.callback = callback
    this.spans.push( span )
    return span
  }

}
