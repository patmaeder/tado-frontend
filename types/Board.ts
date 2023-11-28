type Board = {
    id: String,
    logo: String,
    title: String,
    description: String,
    appearance: 'LIGHT' | 'DARK',
    accentColor: String,
    tenant: String,
    createdAt: Date,
    upvotes: Number,
    unread: Boolean
}