import { KeepAwake } from '@capacitor-community/keep-awake'

export const keepAwake = async () => {
    if(await isSupported() && !await isKeptAwake())
        await KeepAwake.keepAwake()
}

export const allowSleep = async () => {
    if(await isSupported() && await isKeptAwake())
        await KeepAwake.allowSleep()
}

const isSupported = async () => {
    const result = await KeepAwake.isSupported()
    return result.isSupported
}

const isKeptAwake = async () => {
    const result = await KeepAwake.isKeptAwake()
    return result.isKeptAwake
}