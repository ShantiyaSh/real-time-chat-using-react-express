import { useState } from "react";
import { Navigate } from "react-router-dom";
import "../css/Chat.css";

const LoginForm = () => {
  const [redirect, setRedirect] = useState(false);
  const [redirectRegister, setRedirectRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const fetchLogin = async (e) => {
    e.preventDefault();
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
    } else {
      setError(true);
    }
  };
  if (redirect) {
    return <Navigate to="/chat" />;
  }
  if (redirectRegister) {
    return <Navigate to="/register" />;
  }
  return (
    <div class="container">
      {error === true ? <div class="error">Something Wrong!!</div> : ""}
      <div class="form">
        <div class="title">Welcome</div>
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
        <button type="text" class="submit" onClick={(e) => fetchLogin(e)} >
          submit
        </button>
        <button class="submit" onClick={() => setRedirectRegister(true)}>
          I dont have account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
