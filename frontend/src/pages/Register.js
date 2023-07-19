import { useState } from "react";
import { Navigate } from "react-router-dom";

function Register() {
  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [error, setError] = useState(null);

  const fetchRegister = async () => {
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status === 201) {
      fetchLogin();
    } else {
      setError(true);
    }
  };
  const fetchLogin = async () => {
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status === 200) {
      setRedirect(true);
    }
  };
  if (redirect) {
    return <Navigate to="/chat" />;
  }
  if (redirectLogin) {
    return <Navigate to="/login" />;
  }
  return (
    <div class="container">
      {error === true ? <div class="error">Something Wrong!!</div> : ""}
      <div class="form">
        <div class="title">Register</div>
        <div class="input-container ic1">
          <input
            id="firstname"
            class="input"
            type="text"
            placeholder=""
            onChange={(e) => setUsername(e.target.value)}
          />
          <div class="cut"></div>
          <label for="firstname" class="placeholder">
            username
          </label>
        </div>
        <div class="input-container ic2">
          <input
            id="lastname"
            class="input"
            type="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
          <div class="cut"></div>
          <label for="lastname" class="placeholder">
            password
          </label>
        </div>
        <button type="text" class="submit" onClick={() => fetchRegister()}>
          submit
        </button>
        <button class="submit" onClick={() => setRedirectLogin(true)}>
          I am alredy have account
        </button>
      </div>
    </div>
  );
}

export default Register;
