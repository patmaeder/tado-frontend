type SuggestionDTO = {
    id?: String,
    title?: String,
    description?: String,
    category?: CategoryDTO | null,
    locked?: Boolean,
    unread?: Boolean
}