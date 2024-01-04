type Suggestion = {
    id: String,
    title: String,
    description: String,
    category: Category,
    user: String,
    userId: String,
    locked: Boolean,
    unread: Boolean,
    upvoteCount: number,
    createdAt: Date,
    updatedAt: Number,
}