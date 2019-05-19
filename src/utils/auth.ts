/*
  Authentication flow heavily inspired by:
  - https://www.gatsbyjs.org/blog/2019-03-21-add-auth0-to-gatsby-livestream
  - https://github.com/gatsbyjs/store.gatsbyjs.org/blob/master/src/utils/auth.js
*/
import auth0js, { Auth0Callback, WebAuth } from "auth0-js"

export const isBrowser = typeof window !== "undefined"

interface Tokens {
  accessToken?: string
  idToken?: string
  expiresAt?: number
}

interface Profile {
  email?: string
  name?: string
}

// Only instantiate Auth0 if we’re in the browser.
const auth0: WebAuth = isBrowser
  ? new auth0js.WebAuth({
      domain: process.env.AUTH0_DOMAIN as string,
      clientID: process.env.AUTH0_CLIENT_ID as string,
      redirectUri: process.env.AUTH0_CALLBACK,
      responseType: "token id_token",
      scope: "openid profile email",
    })
  : ({} as any)

let tokens: Tokens = {}
let profile: Profile = {}

/**
 * Get the user profile.
 */
export const getProfile = () => profile

/**
 * Whether we have an authenticated token in the browser memory.
 */
export const isAuthenticated = () => {
  return !!tokens.idToken
}

/**
 * Whether we should treat the user as logged in
 * and attempt to authenticate them.
 */
const isLoggedIn: () => boolean = () =>
  localStorage.getItem("isLoggedIn") === "true"

/**
 * An authentication callback that loads user info from Auth0
 * and executes a custom callback on completion.
 * @param callback
 */
const setSession: (cb?: () => void) => Auth0Callback<any> = (
  callback = () => {}
) => (err, authResult) => {
  if (!isBrowser) {
    return
  }
  if (err) {
    if (err.error === "login_required") {
      login()
    } else {
      console.error(JSON.stringify(err))
      logout()
    }
  } else if (authResult && authResult.accessToken && authResult.idToken) {
    auth0.client.userInfo(authResult.accessToken, (error, userProfile) => {
      if (error) {
        throw err
      }
      const { expiresIn, accessToken, idToken } = authResult
      let expiresAt = expiresIn * 1000 + new Date().getTime()

      tokens = { expiresAt, accessToken, idToken }
      profile = userProfile

      callback()
    })
  }
}

/**
 * Use Auth0 library to parse the incoming authentication [from the url hash]
 * after login using JWKs: https://auth0.com/blog/navigating-rs256-and-jwks/
 * and set it in memory using setSession()
 * (used in callback.tsx)
 */
export const handleAuthentication = (cb: () => void) => {
  if (!isBrowser) {
    return
  }

  // console.log("handleAuth...")
  auth0.parseHash(setSession(cb))
}

/**
 * Automatically re-fetch the session from auth0
 * and set it in memory using setSession()
 * (Used in wrapRootElement)
 */
export const checkSession = (cb: () => void) => {
  if (!isLoggedIn()) {
    return cb()
  }

  auth0.checkSession({}, setSession(cb))
}

/**
 * Log in through auth0
 */
export const login = () => {
  if (!isBrowser) {
    return
  }

  // console.log("login...")
  // Optimistically set the expectation that we are logged in
  localStorage.setItem("isLoggedIn", "true")
  auth0.authorize()
}

/**
 * Log out through Auth0
 */
export const logout = () => {
  if (!isBrowser) {
    return
  }

  profile = {}
  tokens = {}
  localStorage.removeItem("isLoggedIn")

  const { protocol, host } = window.location
  const returnTo = `${protocol}//${host}`

  auth0.logout({ returnTo })
}
