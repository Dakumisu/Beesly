import * as dat from "dat.gui"; // https://github.com/dataarts/dat.gui#readme

class Settings {
   constructor() {
      this.gui = new dat.GUI()
      this.settings = {
         data: .5,
      }
      this.gui.add(this.settings, "data", 0, 1, 0.01)
   }
}

export default Settings