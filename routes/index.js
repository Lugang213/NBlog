const router = require('koa-router')()

// 验证是否登录
async function isLoginUser (ctx, next) {
  if (!ctx.session.user) {
    ctx.flash = { warning: '未登录，请先登录' }
    return ctx.redirect('/signin')
  }
  await next()
}
// 管理权限控制
async function isAdmin (ctx, next) {
  console.log(ctx.session)
  if (!ctx.session.user) {
    ctx.flash = { warning: '未登录，请先登录' }
    return ctx.redirect('/signin')
  }
  if (!ctx.session.user.isAdmin) {
    ctx.flash = { warning: '没有权限' }
    return ctx.redirect('back')
  }
  await next()
}

module.exports = (app) => {
  router.get('/', require('./home').index)
  // 登录注册
  router.get('/signup', require('./user').signup)
  router.post('/signup', require('./user').signup)
  router.get('/signin', require('./user').signin)
  router.post('/signin', require('./user').signin)
  // 文章 发布 修改 删除 查询
  router.get('/posts', require('./posts').index)
  router.get('/posts/new', isLoginUser, require('./posts').create)
  router.post('/posts/new', isLoginUser, require('./posts').create)
  router.get('/posts/:id', require('./posts').show)
  router.get('/posts/:id/edit', require('./posts').edit)
  router.post('/posts/:id/edit', require('./posts').edit)
  router.get('/posts/:id/delete', require('./posts').destroy)
  // 评论
  router.post('/comments/new', isLoginUser, require('./comments').create)
  router.get('/comments/:id/delete', isLoginUser, require('./comments').destroy)
  // 分类
  router.get('/category', isAdmin, require('./category').list)
  router.get('/category/new', isAdmin, require('./category').create)
  router.post('/category/new', isAdmin, require('./category').create)
  router.get('/category/:id/delete', isAdmin, require('./category').destroy)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
