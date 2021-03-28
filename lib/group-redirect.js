import { GROUP_STATES } from './constants'
import Router from 'next/router'

export default function validateGroup(group, requiredState) {
    var username = localStorage.getItem('username')

    if (!username) {
        return false
    }

    if (!group || !group.state) {
        Router.replace('/')
        return false
    }

    if (group.state === requiredState) {
        return true
    }

    switch (group.state) {
        case GROUP_STATES.WAITING_GROUP:
            Router.replace(`/waiting-group?id=${group.id}`)
            return false

        case GROUP_STATES.CONFIGURING:
            Router.replace(`/configure-group?id=${group.id}`)
            return false

        case GROUP_STATES.MATCHING:
            Router.replace(`/group?id=${group.id}`)
            return false

        case GROUP_STATES.MATCHED:
            Router.replace(`/matches?id=${group.id}`)
            return false

        default:
            Router.replace('/')
            return false
    }
}
