export const sortElements = (elements) => ({
    by: (field, sort = 'asc') => {
        return elements.sort(function (a, b) {
            if (sort === 'asc') {
                return (a[field] > b[field] ? 1 : (a[field] < b[field] ? -1 : 0))
            } else if (sort === 'desc') {
                return (a[field] > b[field] ? -1 : (a[field] < b[field] ? 1 : 0))
            }

            return 0
        })
    }
})