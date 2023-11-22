import React, {useState } from "react";
import axios from "axios";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

function Forgot( { match }) {
  const [email, setEmail] = useState("");

  function sendEmail() {
    if (email) {
      axios.get(`/auth/check_email?email=${email}`).then((response) => {
        if (response.status === 200) {
          axios.post("/auth/send_email", {
              recipient_email: email,
            })
            .then(() => {
              // setPage("otp")
            })
            .catch(console.log);
          } else {
            alert("User with this email does not exist!");
            console.log(response.data.message);
          }
        })
        .catch(console.log);
    } else {
      alert("Please enter your email");
    }
  }

  return (
    <div className="container">
        <h2>Reset Password Request</h2>
        <form  className="form">
            <label  />  Email:  
            <input
                type="email"
                placeholder=""
                required=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={() => sendEmail}>Send Email</button>
        </form>
    </div>
  );}

export default compose(withRouter)(Forgot);
