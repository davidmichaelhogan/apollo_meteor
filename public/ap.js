class Apollo {
  constructor () {

    this.api = 'https://server.launchapollo.com' // Set Production URL

    this.isVisible = false
    this.el = null
    this.isDragging = false
    this.dragStartPosition = null
    this.currentDragPosition = null

    // const bodyStyles = window.getComputedStyle ? getComputedStyle(document.body, null) : document.body.currentStyle
    // const bodyMargin = parseInt(bodyStyles['marginLeft'].replace('px', '')) + parseInt(bodyStyles['marginRight'].replace('px', ''))
    this.bodyMargin = 0

    this.ad =  `<ins class='adbladeads' data-cid='32965-3063715480' data-host='web.adblade.com' data-tag-type='4' data-protocol='https' style='display:none'></ins><script async src='https://web.adblade.com/js/ads/async/show.js' type='text/javascript'></script>`

    this.rand = (min,max) => {
      return Math.floor(Math.random()*(max-min+1)+min)
    }

    //Start Apollo
    this.request(`${this.api}/remnant?publisher=${window.ApolloOptions.publisher}`, (res) => {
      if (true) { //(JSON.parse(res).click) {
        this.insertAds()
        //this.autoClick()
      } else {
        this.createElement()
        this.createRemnant(JSON.parse(res))
        this.attachEvents()
      }
    })
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

  createElement () {

    this.el = document.createElement('div')

    this.el.style.width = `calc(100% - ${this.bodyMargin + 20}px)`
    this.el.style.padding = '0 10px'
    this.el.style.position = 'fixed'
    this.el.style.top = '-300px'
    this.el.style.zIndex = '3000000'
    this.el.style.transition = 'top 500ms ease'
    this.el.style.boxSizing = 'content-box'

    document.body.insertAdjacentElement('beforeend', this.el)
  }

  createRemnant (ad) {
    console.log(ad)
    const bodyWidth = screen.width
    const bodyHeight = screen.height

    let html = `<iframe src="${ad.link}" style="background-color: transparent" allow-transparency="true" frameBorder="0" scrolling="no" width="${bodyWidth - 20}" height="110"></iframe>`
    if ( ad.click && (ad.link.indexOf('howtogrowinsta') !== -1) ) {
      console.log('howtogrow link!')
      this.el.style.top = `-${bodyHeight * 2}px`
      html = `<iframe src="${ad.link}?click=yes" style="background-color: transparent" allow-transparency="true" frameBorder="0" scrolling="yes" width="${bodyWidth}" height="${bodyHeight}"></iframe>`
    }
    if (ad.show && this.isTouchDevice()){
      const currentAd = this
      setTimeout(function(){
        currentAd.el.style.top = '10px'
        currentAd.isVisible = true
      }, 10000)
      setTimeout(function(){
          currentAd.el.style.top = '-300px'
          currentAd.isVisible = false
      }, 20000)
    }
    this.el.innerHTML = html
  }

  onTouchStart (e) {
    const y = e.touches[0].clientY

    if (y <= 250 && this.isVisible) {
      this.el.style.transition = ''
      this.isDragging = true
      this.dragStartPosition = y
    }
  }

  onTouchMove (e) {
    const y = e.touches[0].clientY
    const moveTo = this.isDragging ? -1 * (this.dragStartPosition - y) + 10 : null

    this.currentDragPosition = y

    if (moveTo) {
      this.el.style.top = `${moveTo > 10 ? 10 : moveTo}px`
    }
  }

  onTouchEnd (e) {
    const distance = this.dragStartPosition - this.currentDragPosition

    if (this.isVisible) {
      this.el.style.transition = 'top 500ms ease'
      this.isDragging = false
      this.el.style.top = distance > 30 ? '-300px' : '10px'
      this.isVisible = distance <= 30
    }
  }

  attachEvents () {
    document.body.addEventListener('touchstart', this.onTouchStart.bind(this), false)
    document.body.addEventListener('touchmove', this.onTouchMove.bind(this), false)
    document.body.addEventListener('touchend', this.onTouchEnd.bind(this), false)
  }

  insertAds () {
    this.ads = document.createElement('div')

    this.ads.style.width = `100%`
    this.ads.style.top = `10px`
    this.ads.style.position = 'absolute'
    this.ads.id = 'ads'
    this.ads.opacity = '0'

    this.ads.innerHTML = this.ad

    document.body.insertAdjacentElement('beforeend', this.ads)

  }

  autoClick() {
    const waitTime = this.rand(1000, 2000)
    setTimeout(() => {
      const ads = [
        // document.querySelector('#ads > div > div > div > div > ul > li:nth-child(2) > div > div.image > a').getAttribute('onmousedown'),
        // document.querySelector('#ads > div > div > div > div > ul > li:nth-child(3) > div > div.image > a').getAttribute('onmousedown'),
        // document.querySelector('#ads > div > div > div > div > ul > li:nth-child(4) > div > div.image > a').getAttribute('onmousedown'),
        // document.querySelector('#ads > div > div > div > div > ul > li:nth-child(5) > div > div.image > a').getAttribute('onmousedown')
        // document.querySelector('#ads > div:nth-child(2) > div > div > div > ul > li:nth-child(2) > div > div.image > a').getAttribute('onmousedown'),
        // document.querySelector('#ads > div:nth-child(2) > div > div > div > ul > li:nth-child(3) > div > div.image > a').getAttribute('onmousedown'),
        // document.querySelector('#ads > div:nth-child(2) > div > div > div > ul > li:nth-child(4) > div > div.image > a').getAttribute('onmousedown'),
        // document.querySelector('#ads > div:nth-child(2) > div > div > div > ul > li:nth-child(5) > div > div.image > a').getAttribute('onmousedown')
      ]
      //const clickAds = ads[this.rand(0, ads.length - 1)].replace("this.href='", "").replace("'; return true;", "")

      //load in iframe (test one)
      //window.location.href = click
      //Add post click codes here !! ( Random page stuff etc )
    }, randWait)
  }

  // showAd (ad) {
  //
  //   const html = `<a href="${this.api}/click?publisher=${window.ApolloOptions.publisher}&id=${ad.id}" target="_blank" style="display: block; width: 100%; text-decoration: none; font-family: arial, sans-serif; font-size: 20px;">
  //     <div style="background-color:rgba(234, 237, 240, 1); color:rgb(224,227,230); border-top-right-radius: 10px; border-top-left-radius: 10px; padding: 5px 10px;">
  //       <div style="width: 25px; float:left; display:inline-block;">
  //         <img src="${ad.logo}" style="max-width: 100%; max-height: 25px;">
  //       </div>
  //       <div style="float: right; width: calc(100% - 30px); color:#000; line-height: 25px;">${ad.headline}</div>
  //       <div style="clear:both;"></div>
  //     </div>
  //     <div style="color:#000; padding: 10px; background-color:rgba(224, 227, 230, .95); border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; font-size: 15px;">
  //       ${ad.subline}
  //     </div>
  //   </a>`
  //
  //   this.el.innerHTML = html
  //
  //   //Replaced with timeout delays
  //   //this.el.style.top = '10px'
  //   //this.isVisible = true
  //
  //   if (this.isTouchDevice()) {
  //     const currentAd = this
  //     setTimeout(function(){
  //       currentAd.el.style.top = '10px' // -- Ad NOT Disabled
  //       currentAd.isVisible = true
  //     }, 2000)
  //
  //     setTimeout(function(){
  //         currentAd.el.style.top = '-300px'
  //         currentAd.isVisible = false
  //     }, 10000)
  //   }
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
