//wait 10 seconds then reload page every 7-15 seconds
 function hitDatPage() {
   window.location.reload(true);
 }
setTimeout(function(){
  (function loop() {
    var rand = Math.round(Math.random() * (15000 - 7000)) + 7000;
    setTimeout(function() {
            hitDatPage()
            loop()
            console.log('hey')
    }, rand)
  }())
}, 1000)

console.log('hi')
