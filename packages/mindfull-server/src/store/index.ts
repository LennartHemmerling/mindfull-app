import type { Username } from 'mindfull-types'

type Store = {
    users: {
        [username: Username]: {
            name: Username
            hash?: string
            salt?: string
        }
    }
}

const store: Store = {
    users: {}
}
