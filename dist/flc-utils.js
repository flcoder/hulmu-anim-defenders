const E_BAD_CONFIG = 'config parameter should be an object'

export function mkConfig( defaults, user ) {
  const config = Object.assign( Object.create( null ), defaults )
  user = user || Object.create( null )
  if( 'object' !== typeof user ) throw new Error( E_BAD_CONFIG )
  Object.assign( config, user )
  return config
}
