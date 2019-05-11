import React from "react"
import { Router, RouteComponentProps } from "@reach/router"

type RouteComponent = React.FunctionComponent<RouteComponentProps>

const Home: RouteComponent = () => <div>Home</div>
const Settings: RouteComponent = () => <div>Settings</div>
const Billing: RouteComponent = () => <div>Billing</div>

const AccountPage = () => (
  <Router>
    <Settings path="/account/settings" />
    <Billing path="/account/billing" />
    <Home default />
  </Router>
)

export default AccountPage
