function IP( input ) {
  var input       = this.input      = input;
  var address     = this.address    = input.split( '/' )[ 0 ];
  var type        = this.type       = this.Class( address );
  var long        = this.long       = this.Long( address );
  var cidr        = this.cidr       = parseInt( input.split( '/' )[ 1 ] );
  var mask        = this.mask       = this.Mask( cidr )
  var increment   = this.increment  = Math.pow( 2, ( type - cidr ) )
  var range       = this.range      = this.Range( long, cidr )
  var broadcast   = this.broadcast  = range[ 1 ];
  var network     = this.network    =  range[ 0 ] + '/' + cidr;
  var hostRange   = this.hostRange  = this.HostRange( range );
  var firstHost   = this.firstHost  = hostRange[ 0 ];
  var lastHost    = this.lastHost   = hostRange[ 1 ];
  var wildCard    = this.wildcard   = this.WildCard( mask )
  /* TO DO
  this.nextNetwork = false
  this.isSummarized = false
  this.isClassful = false
  */
};

IP.prototype.Class = function( ip ) {
  var OI    = ip.split( '.' )[ 0 ],
         expr = (OI >>> 0).toString(2).substring( 0, 4 );
  if( expr[ 0 ] == '0' ) { return 8; }
  else if( expr.slice(0, 2) == '10' ) { return 16; }
  else if( expr.slice(0, 3) == '110' ) { return 24 }
  return;
};

IP.prototype.Long = function( ip ) {
  return ip.split( '.' ).reduce( function( ipInt, octet ) {
    return ( ipInt << 8 ) + parseInt( octet, 10 )
  }, 0) >>> 0;
}

IP.prototype.DD = function( long ) {
  return ( ( long>>> 24 )         + '.' +
                  ( long>> 16 & 255 ) + '.' +
                  ( long>> 8 & 255 )   + '.' +
                  ( long & 255) );
};

IP.prototype.Mask = function( cidr ) {
  var mask = ( '1'.repeat( cidr ) +
                         '0'.repeat( 32 ) ).slice( 0, 32 ).split( /(.{8})/ ) ;
  return mask.filter( x=>x).map( element => parseInt( element, 2 ) ).join('.')
};

IP.prototype.Range = function( long, cidr ) {
  var start   =  long & ( -1 << ( 32 - cidr ) );
  return [ this.DD( start ),
                 this.DD( start + Math.pow( 2, ( 32 - cidr ) ) - 1 ) ];
}

IP.prototype.HostRange = function( arrRange ) {
  var first = arrRange[ 0 ].split( '.' ),
         last  = arrRange[ 1 ].split( '.' );
  first[ 3 ] = parseInt( first[ 3 ] ) + 1;
  last[ 3 ] = parseInt( last[ 3 ] )  - 1;
  return [ first.join( '.' ), last.join( '.' )]
}

IP.prototype.CIDR_Range = function( range, bits ) {
  if (!bits) { bits = 32; }
	//var [range, bits = 32] = cidr.split('/');
	//var mask = ~(2 ** (32 - bits) - 1);
	var mask1 = ~(Math.pow(2 ^ (32 - bits)) - 1);
	var mask2 = (Math.pow(2 ^ (32 - bits)) - 1);
	return [long2ip(ip2long(range) & mask1), long2ip(ip2long(range) | mask2)];
} // calculateCidrRange

IP.prototype.WildCard= function( mask ) {
    var result = [ ],
           mask = mask.split( '.' )
    for( octet in mask ) {
      mask[ octet ] = Math.abs( 255  - parseInt( mask[ octet ] ) )
    }
    return mask.join( '.' )
}

function parseInput( ) {
  /* TO DO */
  var Form = document.forms[0],
         input = document.getElementById( "input" ).value,
         parse = new IP( input );

  console.dir( parse )

  Form.IPAddress.value = parse.address;
  Form.Class.value =  parse.type;
  Form.CIDR.value = parse.cidr;
  Form.Mask.value = parse.mask;
  Form.Wildcard.value = parse.wildcard;
  Form.Range.value = parse.range.join( ' - ' );
  Form.NetworkID.value = parse.network
  Form.FirstHost.value = parse.firstHost
  Form.LastHost.value = parse.lastHost
  Form.Broadcast.value = parse.broadcast
}
