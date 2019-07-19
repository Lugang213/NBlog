const PostModel = require('../models/post')
// const CommentModel = require('../models/comment')

module.exports = {
  // 新建文章
  async create (ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create', {
        title: '新建文章'
      })
      return
    }
    const post = Object.assign(ctx.request.body, {
      author: ctx.session.user._id
    })
    const res = await PostModel.create(post)
    ctx.flash = { success: '文章发表成功' }
    ctx.redirect(`/posts/${res._id}`)
  },
  // 文章详情
  async show (ctx, next) {
    const post = await PostModel.findById(ctx.params.id)
      .populate({ path: 'author', select: 'name' })
    await ctx.render('posts', {
      title: post.title,
      post
      // comments
    })
  },
  // 文章列表
  async index (ctx, next) {
    const posts = await PostModel.find({})
    await ctx.render('index', {
      title: 'Nodejs',
      desc: 'JavaScript',
      posts
    })
  },
  // 编辑文章
  async edit (ctx, next) {
    if (ctx.method === 'GET') {
      const post = await PostModel.findById(ctx.params.id)
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author.toString() !== ctx.session.user._id.toString()) {
        throw new Error('没有权限')
      }
      await ctx.render('edit', {
        title: '更新文章',
        post
      })
      return
    }
    const { title, content } = ctx.request.body
    await PostModel.findByIdAndUpdate(ctx.params.id, {
      title,
      content
    })
    ctx.flash = { success: '文章更新成功' }
    ctx.redirect(`/posts/${ctx.params.id}`)
  },
  // 删除文章
  async destroy (ctx, next) {
    const post = await PostModel.findById(ctx.params.id)
    if (!post) {
      throw new Error('文章不存在')
    }
    console.log(post.author, ctx.session.user._id)
    if (post.author.toString() !== ctx.session.user._id) {
      throw new Error('没有权限')
    }
    await PostModel.findByIdAndRemove(ctx.params.id)
    ctx.flash = { success: '文章删除成功' }
    ctx.redirect('/')
  }
}
