class Apollo {
  constructor () {
    //Start Apollo
    this.insertAdDiv()
    this.insertAds()
  }

  rand (min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
  }

  isTouchDevice () {
    return 'ontouchstart' in window
  }

  showAd() {
    return this.rand(0,5)
  }

  request (url, callback) {
    try {
  		const x = new (window.XMLHttpRequest || window.ActiveXObject)('MSXML2.XMLHTTP.3.0')
  		x.open('GET', url, 1)
  		x.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      x.setRequestHeader('Content-type', 'application/json')

  		x.onreadystatechange = function () {
  			x.readyState > 3 && callback && callback(x.responseText, x)
  		}

  		x.send()
  	} catch (e) {
  		window.console && console.log(e)
  	}
  }

  insertAdDiv () {
    this.ads = document.createElement('div')

    this.ads.style.width = `100%`
    this.ads.style.height = `250px`
    this.ads.style.top = `0`
    this.ads.style.position = `absolute`
    this.ads.id = 'ads'
    this.ads.style.opacity = '0.2'
    this.ads.style.zIndex = '300000'

    document.body.insertAdjacentElement('beforeend', this.ads)

  }

  insertAds () {

    let adsHTML = [
      `<script src="//ap.lijit.com/www/delivery/fp?z=530751"></script> `
    ]
    document.getElementById("ads").innerHTML = adsHTML[1]

  }
}

if (typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
) {
  window.Apollo = new Apollo()
  function nodeScriptReplace(node) {
          if ( nodeScriptIs(node) === true ) {
                  node.parentNode.replaceChild( nodeScriptClone(node) , node );
          }
          else {
                  var i        = 0;
                  var children = node.childNodes;
                  while ( i < children.length ) {
                          nodeScriptReplace( children[i++] );
                  }
          }

          return node;
  }
  function nodeScriptIs(node) {
          return node.tagName === 'SCRIPT';
  }
  function nodeScriptClone(node){
          var script  = document.createElement("script");
          script.text = node.innerHTML;
          for( var i = node.attributes.length-1; i >= 0; i-- ) {
                  script.setAttribute( node.attributes[i].name, node.attributes[i].value );
          }
          return script;
  }

  nodeScriptReplace(document.getElementsByTagName("body")[0]);
}
