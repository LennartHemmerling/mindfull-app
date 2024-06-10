// The item
export type MindfullItem = {
    id: number,
    // Items have names
    name: string
    // And text
    content: string
    // And tags for filtering
    tags: MindfullTag[],
    // And multiple instances of objects
    fields: MindfullField[]
}

// Tags are for filtering, they are identified by their properties
export type MindfullTag = {
    // Who created a tag (or undefined for local)
    origin?: {
        server: string
        user: string
    }
    // What is it called
    name: string
}

// Most objects are fields, so they can be mutated into each other
export type MindfullField = {
    id: number,
    // They have a name
    name: string
    // And a value (0/1 bool, --0++ count, timestamp, etc)
    value: number
    // And a type
    type: string
    // And a date (year-month-day)
    date: string
    // And a time (hour-minute)
    time: string
}