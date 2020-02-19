import withDatabase from './withDatabase'
import withCookie from './withCookie'
import withUser from './withUser'

const middleware = handler => withCookie(withUser(withDatabase(handler)))

export default middleware
