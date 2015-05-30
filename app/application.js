const Marty = require('marty');
//let context = require.context("./", true, /(actions|queries|sources|stores)/);

class Application extends Marty.Application {
  constructor(options){
    super(options);

    // context.keys().forEach((key) =>  {
    //   if (!/\.jsx?/.test(key)) {
    //     let id = key.replace('./', '').replace(/\//g, '.');
    //     this.register(id, context(key));
    //   }
    // });


     this.register(require('./stores'));
     this.register(require('./actions'));
     this.register(require('./queries'));
     this.register(require('./sources'));
  }
}

module.exports = Application;
