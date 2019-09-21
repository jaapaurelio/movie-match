import { ROOM_STATES } from './constants'
import Router from 'next/router'

export default function validateRoom(room, requiredState) {
    var username = localStorage.getItem('username')

    if (!username) {
        return false
    }

    if (!room || !room.state) {
        Router.replace('/start')
        return false
    }

    if (room.state === requiredState) {
        return true
    }

    switch (room.state) {
        case ROOM_STATES.WAITING_ROOM:
            Router.replace(`/waiting-room?id=${room.id}`)
            return false

        case ROOM_STATES.CONFIGURING:
            Router.replace(`/configure-room?id=${room.id}`)
            return false

        case ROOM_STATES.MATCHING:
            Router.replace(`/room?id=${room.id}`)
            return false

        case ROOM_STATES.MATCHED:
            Router.replace(`/matches?id=${room.id}`)
            return false

        default:
            Router.replace('/start')
            return false
    }
}
