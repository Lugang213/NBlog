const bcrypt = require('bcryptjs')
const UserModel = require('../models/user')

module.exports = {
  // 注册
  async signup (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('signup', {
        title: '用户注册'
      })
      return
    }
    const salt = await bcrypt.genSalt(10)
    let {
      name,
      email,
      password,
      repassword
    } = ctx.request.body
    password = await bcrypt.hash(password, salt)
    const user = {
      name,
      email,
      password
    }
    const result = await UserModel.create(user)
    ctx.body = result
  },

  // 登录
  async signin (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('signin', {
        title: '用户登录'
      })
      return
    }
    const {name, password} = ctx.request.body
    const user = await UserModel.findOne({name})
    if (user && await bcrypt.compare(password, user.password)) {
      ctx.session.user = {
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
        email: user.email
      }
      ctx.redirect('/')
    } else {
      ctx.body = '用户名或密码错误'
    }

  },

  // 登出
  signout (ctx, next) {
    ctx.session = null
    ctx.flash = {warning: '退出登录'}
    ctx.redirect('/')
  }
}
