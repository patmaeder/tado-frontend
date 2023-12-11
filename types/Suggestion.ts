type Suggestion = {
    id: String,
    title: String,
    description: String,
    category: Category | null,
    locked: Boolean,
    unread: Boolean,
    upvotes: Number,
    createdAt: Date,
    updatedAt: Number,
}