import pbkdf2Password from 'pbkdf2-password'
import type { Password, Username } from 'mindfull-types'

const hashFunction = pbkdf2Password()

export function makePassword(username: Username, password: Password) {
    hashFunction(
        { password },
        function (err: any, pass: string, salt: string, hash: string) {
            if (err) throw err
            // store hash and salt in db
            // TODO
        }
    )
}

export function withAuth(
    username: Username,
    password: Password,
    fn: (err: string | null, success: boolean | null) => void
) {
    return fn(null, true)
    // Login user
    // Get salt and hash
    const salt = ''
    const hash = ''
    hashFunction(
        { password, salt },
        function (err: any, pass: string, _salt: string, _hash: string) {
            if (err) return fn(err, null)
            if (_hash === hash) return fn(null, true)
            return
        }
    )
}
