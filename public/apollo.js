(function(){var aa="function"==typeof Object.create?Object.create:function(a){var b=function(){};b.prototype=a;return new b},ba;if("function"==typeof Object.setPrototypeOf)ba=Object.setPrototypeOf;else{var ca;a:{var da={a:!0},ea={};try{ea.__proto__=da;ca=ea.a;break a}catch(a){}ca=!1}ba=ca?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}for(var fa=ba,ha=function(a,b){a.prototype=aa(b.prototype);a.prototype.constructor=a;if(fa)fa(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.Ba=b.prototype},ia="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},ja="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,ka=["Number","isNaN"],la=0;la<ka.length-1;la++){var ma=ka[la];ma in ja||(ja[ma]={});ja=ja[ma]}var na=ka[ka.length-1],oa=ja[na],pa=oa?oa:function(a){return"number"===typeof a&&isNaN(a)};pa!=oa&&null!=pa&&ia(ja,na,{configurable:!0,writable:!0,value:pa});var l=this,qa=function(a){return"string"==typeof a},ra=function(a){return"number"==typeof a},sa=function(){},q=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},ta=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ua=function(a,b,c){return a.call.apply(a.bind,arguments)},va=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},wa=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?wa=ua:wa=va;return wa.apply(null,arguments)},xa=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},t=function(a){var b=ya;function c(){}c.prototype=b.prototype;a.Ba=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Ca=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var za=(new Date).getTime();var Aa=document,u=window;var Ba={"120x90":!0,"160x90":!0,"180x90":!0,"200x90":!0,"468x15":!0,"728x15":!0},Ca=function(a,b){if(15==b){if(728<=a)return 728;if(468<=a)return 468}else if(90==b){if(200<=a)return 200;if(180<=a)return 180;if(160<=a)return 160;if(120<=a)return 120}return null};var Da=function(a,b){a=parseInt(a,10);return isNaN(a)?b:a},Ea=/^([\w-]+\.)*([\w-]{2,})(:[0-9]+)?$/,Fa=function(a,b){return a?(a=a.match(Ea))?a[0]:b:b};var Ga=Da("468",0);var Ha=function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},Pa=function(a){if(!Ia.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(Ja,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(Ka,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(La,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(Ma,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(Na,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(Oa,"&#0;"));return a},Ja=/&/g,Ka=/</g,La=/>/g,Ma=/"/g,Na=/'/g,Oa=/\x00/g,Ia=/[\x00&<>"']/,Qa={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\","<":"<"},Ra={"'":"\\'"},Sa=function(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})};var Ta=function(a,b){for(var c=a.length,d=qa(a)?a.split(""):a,e=0;e<c;e++)e in d&&b.call(void 0,d[e],e,a)},Ua=function(a){return Array.prototype.concat.apply([],arguments)};var Va=function(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return c};var Xa=function(){this.j="";this.l=Wa};Xa.prototype.ea=!0;Xa.prototype.O=function(){return this.j};var Ya=function(a){if(a instanceof Xa&&a.constructor===Xa&&a.l===Wa)return a.j;q(a);return"type_error:TrustedResourceUrl"},Wa={};var $a=function(){this.P="";this.sa=Za};$a.prototype.ea=!0;$a.prototype.O=function(){return this.P};var ab=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i,Za={},bb=function(a){var b=new $a;b.P=a;return b};bb("about:blank");var cb;a:{var db=l.navigator;if(db){var eb=db.userAgent;if(eb){cb=eb;break a}}cb=""}var v=function(a){return-1!=cb.indexOf(a)};var gb=function(a){fb();var b=new Xa;b.j=a;return b},fb=sa;var hb=function(a){hb[" "](a);return a};hb[" "]=sa;var w=function(a){try{var b;if(b=!!a&&null!=a.location.href)a:{try{hb(a.foo);b=!0;break a}catch(c){}b=!1}return b}catch(c){return!1}},ib=function(a,b){var c=[l.top],d=[],e=0;b=b||1024;for(var f;f=c[e++];){a&&!w(f)||d.push(f);try{if(f.frames)for(var g=f.frames.length,h=0;h<g&&c.length<b;++h)c.push(f.frames[h])}catch(k){}}return d},jb=function(a,b){var c=a.createElement("script");b=gb(b);c.src=Ya(b);(a=a.getElementsByTagName("script")[0])&&a.parentNode&&a.parentNode.insertBefore(c,a)},z=function(a,b){return b.getComputedStyle?b.getComputedStyle(a,null):a.currentStyle},kb=function(a){try{var b=new Uint32Array(1);a.crypto.getRandomValues(b);return b[0]/65536/65536}catch(c){return Math.random()}},lb=function(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.call(void 0,a[c],c,a)},mb=function(a){var b=a.length;if(0==b)return 0;for(var c=305419896,d=0;d<b;d++)c^=(c<<5)+(c>>2)+a.charCodeAt(d)&4294967295;return 0<c?c:4294967296+c},nb=/^([0-9.]+)px$/,ob=/^(-?[0-9.]{1,30})$/,pb=function(a){return ob.test(a)&&(a=Number(a),!isNaN(a))?a:null},qb=function(a,b){return b?!/^false$/.test(a):/^true$/.test(a)},rb=function(a){return(a=nb.exec(a))?+a[1]:null};var sb=function(){return"r20171025"},tb=qb("false",!1),ub=qb("false",!1),vb=qb("false",!1),wb=vb||!ub;var xb=v("Opera"),yb=-1!=cb.toLowerCase().indexOf("webkit")&&!v("Edge");var zb=function(){var a=sa;return function(){if(a){var b=a;a=null;b()}}};var Ab=function(a,b,c){a.addEventListener?a.addEventListener(b,c,void 0):a.attachEvent&&a.attachEvent("on"+b,c)},Bb=function(a,b,c){a.removeEventListener?a.removeEventListener(b,c,void 0):a.detachEvent&&a.detachEvent("on"+b,c)};var Cb=function(a){a=a||l;var b=a.context;if(!b)try{b=a.parent.context}catch(c){}try{if(b&&"pageViewId"in b&&"canonicalUrl"in b)return b}catch(c){}return null},Db=function(a){a=a||Cb();if(!a)return null;a=a.master;return w(a)?a:null};var Eb=function(a,b){l.google_image_requests||(l.google_image_requests=[]);var c=l.document.createElement("img");if(b){var d=function(a){b(a);Bb(c,"load",d);Bb(c,"error",d)};Ab(c,"load",d);Ab(c,"error",d)}c.src=a;l.google_image_requests.push(c)};var Fb=Object.prototype.hasOwnProperty,Gb=function(a,b){for(var c in a)Fb.call(a,c)&&b.call(void 0,a[c],c,a)},Hb=function(a){return!(!a||!a.call)&&"function"===typeof a},Ib=function(a,b){for(var c=1,d=arguments.length;c<d;++c)a.push(arguments[c])},Jb=function(a,b){if(a.indexOf)return a=a.indexOf(b),0<a||0===a;for(var c=0;c<a.length;c++)if(a[c]===b)return!0;return!1},Kb=function(a){a=Db(Cb(a))||a;a.google_unique_id?++a.google_unique_id:a.google_unique_id=1},Lb=!!window.google_async_iframe_id,Mb=Lb&&window.parent||window,Nb=function(){if(Lb&&!w(Mb)){var a="."+Aa.domain;try{for(;2<a.split(".").length&&!w(Mb);)Aa.domain=a=a.substr(a.indexOf(".")+1),Mb=window.parent}catch(b){}w(Mb)||(Mb=window)}return Mb},Ob=/(^| )adsbygoogle($| )/,Pb=function(a){a=tb&&a.google_top_window||a.top;return w(a)?a:null};var A=function(a,b){a=a.google_ad_modifications;return Jb(a?a.eids||[]:[],b)},B=function(a,b){a=a.google_ad_modifications;return Jb(a?a.loeids||[]:[],b)},Qb=function(a,b,c){if(!a)return null;for(var d=0;d<a.length;++d)if((a[d].ad_slot||b)==b&&(a[d].ad_tag_origin||c)==c)return a[d];return null};var Rb={overlays:1,interstitials:2,vignettes:2,inserts:3,immersives:4,list_view:5,full_page:6};var Sb=function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);255<e&&(b[c++]=e&255,e>>=8);b[c++]=e}return b};var Tb=v("Safari")&&!((v("Chrome")||v("CriOS"))&&!v("Edge")||v("Coast")||v("Opera")||v("Edge")||v("Silk")||v("Android"))&&!(v("iPhone")&&!v("iPod")&&!v("iPad")||v("iPad")||v("iPod"));var Ub=null,Vb=null,Wb=v("Gecko")&&!(-1!=cb.toLowerCase().indexOf("webkit")&&!v("Edge"))&&!(v("Trident")||v("MSIE"))&&!v("Edge")||yb&&!Tb||xb||"function"==typeof l.btoa,Xb=function(a,b){if(!Ub){Ub={};Vb={};for(var c=0;65>c;
