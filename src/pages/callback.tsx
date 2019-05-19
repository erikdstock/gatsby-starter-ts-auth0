import React from "react"
import { handleAuthentication } from "../utils/auth"
import { navigate } from "gatsby"

const Callback = () => {
  handleAuthentication(() => navigate("/account"))

  return <p>Callback</p>
}

export default Callback
