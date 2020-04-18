import Pusher from 'pusher-js'

let pusher = null
const PUSHER_APP_CLUSTER=eu
const PUSHER_APP_KEY=a7e17f2236acda40d277

export const pusherConnection = () => {
    if (pusher) {
        return pusher
    }

    pusher = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_APP_CLUSTER,
        encrypted: true,
    })

    return pusher
}
