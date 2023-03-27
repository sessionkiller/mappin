import { useRef, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import RoomIcon from '@mui/icons-material/Room';
import "./login.css";
import request from "../utils/request";

export default function Login({ setShowModal, setCurrentUsername,myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await request.post("/users/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem('user', res.data.username);
      setShowModal(null)
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon className="logoIcon" />
        <span>NajibPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon className="loginCancel" onClick={() => setShowModal(null)} />
    </div>
  );
}