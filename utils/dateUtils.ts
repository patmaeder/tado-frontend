export const getElapsedTimeSinceCreationDate = (date: Date) => {
    const createdAt = new Date(date);
    const now = new Date();

    const timeDifference = now.getTime() - createdAt.getTime();
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutesAgo < 60) {
        return `Vor ${ minutesAgo } ${ minutesAgo == 1 ? 'Minute' : 'Minuten' }`;
    } else if (hoursAgo < 24) {
        return `Vor ${ hoursAgo } ${ hoursAgo == 1 ? 'Stunde' : 'Stunden' }`;
    } else {
        return `Vor ${ daysAgo } ${ daysAgo == 1 ? 'Tag' : 'Tagen' }`;
    }
}