import type { MindfullField, MindfullItem, MindfullTag } from 'mindfull-types'

export function createItem(): MindfullItem {
    return {
        id: new Date().getTime(),
        name: '',
        content: '',
        tags: [],
        fields: []
    }
}

export function addTag(
    item: MindfullItem,
    name: string,
    origin?: { server: string; user: string }
): MindfullTag {
    const tag = {
        name,
        origin
    }

    item.tags.push(tag)

    return tag
}

export function tagsEqual(tag1: MindfullTag, tag2: MindfullTag): boolean {
    if (!tag1.origin || !tag2.origin)
        return tag1.name === tag2.name && tag1.origin === tag2.origin
    else
        return (
            tag1.name === tag2.name &&
            tag1.origin.server === tag2.origin.server &&
            tag1.origin.user === tag2.origin.user
        )
}

export function createField(type: string): MindfullField {
    return {
        id: new Date().getTime(),
        name: '',
        value: 0,
        type,
        date: '',
        time: ''
    }
}

export function getFieldDate(field: MindfullField): Date {
    if (field.date && field.time)
        return new Date(`${field.date}, ${field.time}`)
    else if (field.date) return new Date(field.date)
    else return new Date()
}

export function addCheckItem(item: MindfullItem): MindfullField {
    const field = createField('check')

    item.fields.push(field)

    return field
}

export function addCounter(item: MindfullItem): MindfullField {
    const field = createField('count')

    item.fields.push(field)

    return field
}

export function addDate(item: MindfullItem): MindfullField {
    const field = createField('date')

    item.fields.push(field)

    return field
}
