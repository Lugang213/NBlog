const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const serve = require('koa-static')
const mongoose = require('mongoose')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const marked = require('marked')
const router = require('./routes')
const CONFIG = require('./config/config')
const flash = require('./middlewares/flash')


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})
const app = module.exports = new Koa()
mongoose.connect(CONFIG.mongodb)

app.use(serve(
  path.join(__dirname, 'public')
))
app.use(views(path.join(__dirname,'views'), {
  map: {html: 'nunjucks'}
}))
app.keys = ['somethings']
app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))

app.use(bodyParser())
app.use(flash())
app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  ctx.state.marked = marked
  await next()
})
router(app)

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
