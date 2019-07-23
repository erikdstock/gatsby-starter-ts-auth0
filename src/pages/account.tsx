import React from "react"
import { Router, RouteComponentProps } from "@reach/router"
import { login, isAuthenticated, getProfile, logout } from "../utils/auth"
import { Link } from "gatsby"
import Layout from "../components/layout"

type RouteComponent = React.FunctionComponent<RouteComponentProps>

const Home: RouteComponent = () => <h3>Account Home</h3>
const Settings: RouteComponent = () => <h3>Settings</h3>
const Billing: RouteComponent = () => <h3>Billing</h3>

const AccountPage = () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  const user = getProfile()

  return (
    <>
      <Layout>
        <nav>
          <Link to="/">Home</Link> <Link to="/account">Account</Link>{" "}
          <Link to="/account/billing">Billing</Link>{" "}
          <Link to="/account/settings">Settings</Link>{" "}
          <a
            href="#logout"
            onClick={e => {
              logout()
              e.preventDefault()
            }}
          >
            Log Out
          </a>
        </nav>
        <pre>Hello, {user.name}</pre>
        <Router>
          <Settings path="/account/settings" />
          <Billing path="/account/billing" />
          <Home default />
        </Router>
      </Layout>
    </>
  )
}

export default AccountPage
