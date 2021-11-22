class Device {
   constructor() {
      this.checkDevice()
   }

   checkDevice() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
         console.log('Mobile')
      } else {
         console.log('Desktop')
      }
   }
}

const out = new Device()
export default out