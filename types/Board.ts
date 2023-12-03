type Board = {
    id: String,
    logo: String,
    title: String,
    description: String,
    appearance: 'LIGHT' | 'DARK',
    accentColor: String,
    tenant: String,
    upvotes: Number,
    unread: Boolean
    createdAt: Date,
    updatedAt: Date,
}