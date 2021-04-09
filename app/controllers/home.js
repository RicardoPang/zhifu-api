const path = require('path')

class HomeController {
  index(ctx) {
    ctx.body = "这是网址主页";
  }
  upload(ctx) {
    console.log('🍌', ctx.request.files);
    const file = ctx.request.files.file;
    const basename = path.basename(file.path)
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` };
  }
}

module.exports = new HomeController();
