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

    //Start Apollo

    if (this.isTouchDevice()) {
      this.createElement()
      this.request(`${this.api}/ad?publisher=${window.ApolloOptions.publisher}`, (res) => {
        if (res) {
          this.showAd(JSON.parse(res))
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
    document.getElementById("apolloAd").style.top = '-300px'
  }

  showAd (ad) {
    console.log('apollo ad: ' + ad._id)
    const html = `
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

    this.el.innerHTML = html

    setTimeout(() => {
      this.el.style.top = '10px' // -- Ad NOT Disabled
      this.isVisible = true
    }, 6000)

    setTimeout(() => {
        this.el.style.top = '-300px'
        this.isVisible = false
    }, 15000)
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
