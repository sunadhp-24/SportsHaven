import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "./pages/Register";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import DetailedLobbyCard from "./pages/Lobby.js";
import NoActiveLobby from "./pages/NoActiveLobby.js";
import ProfilePage from "./pages/ProfilePage.js";

function App() {
  const { user } = useSelector((state) => state.user);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/home" element={<Home />} />
        <Route
          path="/lobbies/:lobbyid"
          element={<DetailedLobbyCard type="join" />}
        />
        <Route
          path="/activelobby/:lobbyid"
          element={<DetailedLobbyCard type="active" />}
        />
        <Route
          path="/no-active-lobby"
          element={<NoActiveLobby type="lobby" />}
        />
        <Route path="/user/:username" element={<ProfilePage />} />
        <Route path="/no-user" element={<NoActiveLobby type="user" />} />
      </Routes>
    </Router>
  );
}

export default App;
