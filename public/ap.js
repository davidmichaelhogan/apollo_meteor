var meta = document.createElement('meta');
meta.name = "adbit-site-verification";
meta.content = "01e2534a490790b38e22c3fbbb3593c79d836fabef337794c1253defae7b2e17";
document.getElementsByTagName('head')[0].appendChild(meta);

class Apollo {
  constructor () {
    //Start Apollo
    console.log(this.showAd())
    if (this.isTouchDevice && this.showAd() == 1) {
      this.insertAdDiv()
      this.insertAds()
    }
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

    this.ads.style.margin = `0 auto`
    this.ads.style.height = `300px`
    this.ads.style.top = `100px`
    this.ads.style.position = 'fixed'
    this.ads.id = 'ads'
    this.ads.style.opacity = '0.3'
    this.ads.style.zIndex = '300000'

    document.body.insertAdjacentElement('beforeend', this.ads)

  }

  insertAds () {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    head.appendChild(script);

    let adsHTML = `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="9603217698"></ins>`
    document.getElementById("ads").innerHTML = adsHTML

  }

  // autoClick() {
  //   const waitTime = this.rand(1000, 2000)
  //   setTimeout(() => {
  //     const ads = [
  //       document.querySelector('#ads > div > div > ul > li:nth-child(2) > div > div.image > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(3) > div > div.image > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(4) > div > div.image > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(5) > div > div.image > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(2) > div > div.text > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(3) > div > div.text > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(4) > div > div.text > a').getAttribute('onmousedown'),
  //       document.querySelector('#ads > div > div > ul > li:nth-child(5) > div > div.text > a').getAttribute('onmousedown')
  //     ]
  //     const clickAds = ads[this.rand(0, ads.length - 1)].replace("this.href='", "").replace("'; return true;", "")
  //     console.log(clickAds)
  //
  //     window.location.href = clickAds
  //   }, waitTime)
  // }
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
