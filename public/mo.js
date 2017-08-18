class MO {
  constructor () {
    //GLOBALS
    this.api = 'http://localhost:3000'
    this.site = 'wetalk'
    this.url = window.location.href

    this.header =
      `<nav class="navbar navbar-default">
      <div class="row">
      <div class="col-md-3">
      <div class="fh5co-navbar-brand">
      <a class="fh5co-logo" href="./index.html"><img src="logo.png"></a>
      </div>
      </div>
      <div id="nav" class="col-md-6">
      <ul class="nav text-center">
      <li><a href="./index.html">Home</a></li>
      <li><a href="./about.html">About</a></li>
      <li><a href="./contact.html">Contact</a></li>
      </ul>
      </div>
      <div class="col-md-3">
      <ul class="social">
      <li><i class="icon-twitter"></i></li>
      <li><i class="icon-instagram"></i></li>
      <li><i class="icon-facebook"></i></li>
      </ul>
      </div>
      </div>
      </nav>`

    this.ads = {
      "wetalk" : [
        {
          "code": "<ins class='adbladeads' data-cid='32965-3063715480' data-host='web.adblade.com' data-tag-type='4' data-protocol='https' style='display:none'></ins><script async src='https://web.adblade.com/js/ads/async/show.js' type='text/javascript'></script>",
          "name": "adblade_01"
        },
        {
          "code": "<ins class='adbladeads' data-cid='32965-3063715480' data-host='web.adblade.com' data-tag-type='4' data-protocol='https' style='display:none'></ins><script async src='https://web.adblade.com/js/ads/async/show.js' type='text/javascript'></script>",
          "name": "adblade_02"
        },
        {
          "code": "<script data-cfasync='false' type='text/javascript' src='//p236923.clksite.com/adServe/banners?tid=236923_449547_0'></script>",
          "name": "revhits_01"
        }
      ]
    }

    this.rand = (min,max) => {
      return Math.floor(Math.random()*(max-min+1)+min)
    }

    //actions
    const adName = this.getParam('ad')
    if (adName) {
      this.getClick(adName, this.ads[this.site])
    } else {
      this.insertHeader()
      this.request(`http://localhost:3000/ad?pubname=${this.site}&remnant=true`, (res => {
        console.log(res)
        this.insertApollo(JSON.parse(res))
      }))
      this.insertAds(this.ads[this.site])
      this.request(`${this.api}/remnant/links`, (res => {
        this.insertLinks(JSON.parse(res))
      }))
    }
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

  getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  insertHeader () {
    document.getElementById("header").innerHTML = this.header
  }

  insertApollo (ad) {
    console.log(ad._id)

    const html = `<div class="reset apollo">
      <a href="${this.api}/click?pubname=${this.site}&id=${ad._id}&remnant=true" target="_blank" style="display: block; width: 100%; text-decoration: none;">
      <div style="background-color:rgba(234, 237, 240, 1); color:rgb(224,227,230); border-top-right-radius: 10px; border-top-left-radius: 10px; padding: 5px 10px;">
      <div style="width: 25px; float:left; display:inline-block;">
      <img src="${ad.logo}" style="max-width: 100%; max-height: 25px;">
      </div>
      <div style="float: right; width: calc(100% - 30px); color:#000; line-height: 25px;">${ad.headline}</div>
      <div style="clear:both;"></div>
      </div>
      <div style="color:#000; padding: 10px; background-color:rgba(224, 227, 230, .95); border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; font-size: 15px;">
      ${ad.subline}
      </div>
      </a>
      </div>`

    document.getElementById("apollo").innerHTML = html
  }

  insertAds (ads) {
    let adsHTML = ''
    for (var i = 0; i < ads.length; i++) {
      adsHTML = adsHTML +
      `<div class="col-md-4 animate-box">
      <div class="service">
      ${ads[i].code}
      </div>
      </div>`
    }

    //Set impressions for ads displayed
    ads.map((ad) => {
      this.request('http://localhost:5000/rem/impression?ad=' + ad.name)
    })


    document.getElementById("ads").innerHTML = adsHTML
  }

  getClick(ad, site) {
  console.log('We need a click for ' + ad)

  const bodyArray = Array.from(document.body.children)
  bodyArray.map((child) => {
    child.style.opacity = 0
  })

  this.el = document.createElement('div')

  this.el.style.width = `100%`
  this.el.style.position = 'fixed'
  this.el.style.top = '0'
  this.el.style.zIndex = '3000000'
  this.el.style.boxSizing = 'content-box'
  this.el.style.padding = '0'

  document.body.insertAdjacentElement('beforeend', this.el)

  var adCode = site.filter(function( obj ) {
  return (obj.name == ad)
  })

  this.el.innerHTML = adCode[0].code
  this.el.style.opacity = '0.1'
  }

  insertLinks(res) {
    const art = res.links
    document.getElementById("prev-button").href = `${art[this.rand(0, art.length - 1)]}.html`
    document.getElementById("next-button").href = `${art[this.rand(0, art.length - 1)]}.html`
  }
}

if (typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
) {
  window.MO = new MO()
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
