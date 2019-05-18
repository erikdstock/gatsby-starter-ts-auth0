/*
  Approach taken from 
  https://github.com/gatsbyjs/store.gatsbyjs.org/blob/master/src/utils/auth.js
*/
import auth0js, { Auth0Callback, WebAuth } from "auth0-js"

export const isBrowser = typeof window !== "undefined"

const tokens: { [p: string]: string | null } = {
  accessToken: null,
  idToken: null,
  // expiresAt: false,
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

// Set tokens (in memory only)
const setSession: Auth0Callback<any> = (err, authResult) => {
  if (err) {
    throw err
  } else if (authResult) {
    tokens.idToken = authResult.idToken
    tokens.accessToken = authResult.accessToken
  }
}

/**
 * Begin the login flow through auth0
 */
export const login = () => {
  if (isBrowser) {
    auth0.authorize()
  }
}

/**
 * Automatically re-fetch the session from auth0
 * using an auth0 cookie
 */
export const renewSession = () => {
  auth0.checkSession({}, setSession)
}

/**
 * Use Auth0 library to parse the incoming
 */
export const handleAuthentication = () => {
  // Parse the token using JWKs:
  auth0.parseHash(setSession)
}

// // To speed things up, we’ll keep the profile stored unless the user logs out.
// // This prevents a flicker while the HTTP round-trip completes.
// let profile = false

// export const logout = () => {
//   localStorage.setItem("isLoggedIn", false)
//   profile = false

//   const { protocol, host } = window.location
//   const returnTo = `${protocol}//${host}`

//   auth0.logout({ returnTo })
// }

// const setSession = callback => (err, authResult) => {
//   if (!isBrowser) {
//     return
//   }

//   if (err) {
//     console.error(err)
//     callback()
//     return
//   }

//   if (authResult && authResult.accessToken && authResult.idToken) {
//     let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
//     tokens.accessToken = authResult.accessToken
//     tokens.idToken = authResult.idToken
//     tokens.expiresAt = expiresAt
//     profile = authResult.idTokenPayload
//     localStorage.setItem("isLoggedIn", true)
//     callback()
//   }
// }

// export const silentAuth = callback => {
//   if (!isBrowser) {
//     return
//   }

//   if (!isAuthenticated()) return callback()
//   auth0.checkSession({}, setSession(callback))
// }

// export const handleAuthentication = (callback = () => {}) => {
//   if (!isBrowser) {
//     return
//   }

//   auth0.parseHash(setSession(callback))
// }

// export const isAuthenticated = () => {
//   if (!isBrowser) {
//     return
//   }

//   return localStorage.getItem("isLoggedIn") === "true"
// }

// export const getAccessToken = () => {
//   if (!isBrowser) {
//     return ""
//   }

//   return tokens.accessToken
// }

// export const getUserInfo = () => {
//   if (profile) {
//     return profile
//   }
// }
