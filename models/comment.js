const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  // 评论对于文章ID
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  // 评论者
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  // 被评论者
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // 评语
  content: {
    type: String,
    required: true
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    }
  }
})

module.exports = mongoose.model('Comment', CommentSchema)
