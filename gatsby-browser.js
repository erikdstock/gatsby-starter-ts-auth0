/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import { checkSession } from "./src/utils/auth"

const Loader = () => <pre>Loading Session ...</pre>

class SessionCheck extends React.Component {
  state = {
    loading: true,
  }

  componentWillMount() {
    checkSession(this.handleCheckSession)
  }

  handleCheckSession = () => {
    this.setState({ loading: false })
  }

  render() {
    return this.state.loading ? <Loader /> : <>{this.props.children}</>
  }
}

export const wrapRootElement = ({ element }) => {
  return <SessionCheck>{element}</SessionCheck>
}
