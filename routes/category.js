const CategoryModel = require('../models/category')

module.exports = {
  // 新建分类
  async create (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create_category', {
        title: '新建分类'
      })
      return
    }
    await CategoryModel.create(ctx.request.body)
    ctx.redirect('/category')
  },
  // 展示分类
  async list (ctx, next) {
    const categories = await CategoryModel.find({})
    await ctx.render('category', {
      title: '分类管理',
      categories
    })
  },

  // 删除分类
  async destory (ctx, next) {
    await CategoryModel.findByIdAndRemove(ctx.params.id)
    ctx.flash = { success: '删除分类成功' }
    ctx.redirect('/categry')
  }
}
