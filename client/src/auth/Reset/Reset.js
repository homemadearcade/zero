import React, {useState, useContext} from "react";
import { RecoveryContext } from "../../App";
import axios from "axios";
import { compose } from "redux";
import { withRouter } from "react-router-dom";


function Reset( { match }) {
  const [password, setPassword] = useState("");

  const code = match.params.code;

  function changePassword() {
    if(password) {
      try {
        axios.put("auth/reset_password/" + code, {
          newPassword: password,
        })
        .then(() => {
          // setPage("login")
        });
        return alert("Password changed successfully, please login!");
      } catch (error) {console.log(error);}
    }
    
    return alert("Please enter your new Password");
  }

  return (
    <div className="container">
        <h2> Change Password </h2>
        <form  className="form">
            <label  />  New Password:  
            <input
                type="password"
                placeholder="••••••••"
                required=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => changePassword()}>Reset passwod </button>
        </form>
    </div>
  );}

export default compose(withRouter)(Reset);
