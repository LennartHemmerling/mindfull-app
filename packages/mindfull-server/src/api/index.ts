import type { Express } from 'express'

import { makeToken, withToken } from '../auth/token'
import { withAuth } from '../auth/user'

export default function (app: Express) {
    app.post('/login', function (req, res, next) {
        if (!req.body) return res.sendStatus(400)
        withAuth(req.body.username, req.body.password, function (err, success) {
            if (err) return next(err)
            if (success) {
                res.json({ token: makeToken(req.body.username), success })
            } else {
                res.sendStatus(401)
            }
        })
    })

    app.post('/token', function (req, res, next) {
        if (!req.body) return res.sendStatus(400)
        withToken(req.body.username, req.body.token, function (err, success) {
            if (err) return next(err)
            if (success) {
                res.json({ success })
            } else {
                res.sendStatus(401)
            }
        })
    })
}
