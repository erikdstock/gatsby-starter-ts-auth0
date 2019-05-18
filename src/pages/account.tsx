import React from "react"
import { Router, RouteComponentProps } from "@reach/router"
import { login } from "../utils/auth"

type RouteComponent = React.FunctionComponent<RouteComponentProps>

const Home: RouteComponent = () => <div>Home</div>
const Settings: RouteComponent = () => <div>Settings</div>
const Billing: RouteComponent = () => <div>Billing</div>

const AccountPage = () => {
  login()
  return (
    <Router>
      <Settings path="/account/settings" />
      <Billing path="/account/billing" />
      <Home default />
    </Router>
  )
}

export default AccountPage
