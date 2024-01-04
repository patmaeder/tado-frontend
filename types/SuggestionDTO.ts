type SuggestionDTO = {
    id?: String,
    title?: String,
    description?: String,
    user?: String,
    category?: CategoryDTO,
    board?: BoardDTO,
    unread?: Boolean,
    locked?: Boolean,
}