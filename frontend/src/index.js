import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Main from "./pages/Main";
import "./font/Lato-Light.ttf";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="login" element={<LoginForm />} />
          <Route path="chat" element={<Main />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NoPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
