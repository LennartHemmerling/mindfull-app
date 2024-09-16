import type { Token, Username } from 'mindfull-types'

type Store = {
    [username: Username]: Token[]
}

const tokenStore: Store = {}

const maxTokenCount = 10
function cleanTokens(username: Username) {
    if (!tokenStore[username]) return

    const minDate = 0

    tokenStore[username] = tokenStore[username].reduce((all, token, i) => {
        if (i >= maxTokenCount || token.date > minDate) all.push(token)
        return all
    }, [] as Token[])
}

export function withToken(
    username: Username,
    tokenString: string,
    fn: (err: string | null, success: boolean | null) => void
) {
    cleanTokens(username)

    if (!tokenStore[username]) return fn(null, null)

    const token = tokenStore[username].find(
        ({ token }) => token === tokenString
    )
    if (token) {
        token.date = new Date().getTime()

        return fn(null, true)
    } else {
        return fn(null, null)
    }
}

const tokenLength = 100
const legalCharacters = [
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+-{}()[]?!<>§$%&'.split(
        ''
    )
]
function generateToken() {
    let token = ''
    for (let i = 0; i < tokenLength; i++) {
        token +=
            legalCharacters[Math.floor(Math.random() * legalCharacters.length)]
    }
    return token
}

export function makeToken(username: Username) {
    cleanTokens(username)

    // generate Token
    const token: Token = {
        token: generateToken(),
        date: new Date().getTime()
    }

    // store token
    if (!tokenStore[username]) tokenStore[username] = []

    tokenStore[username].push(token)

    return token.token
}
