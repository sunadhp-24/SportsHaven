import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/api.js";
import { useSelector } from "react-redux";
import badminton from "../assets/reshot-icon-badminton-RXYNAQ749M.svg";
import cricket from "../assets/reshot-icon-cricket-M2EUHT437N.svg";
import football from "../assets/reshot-icon-football-VRDHMFPCS4.svg";
import basketball from "../assets/reshot-icon-basketball-LD4KY59N6A.svg";
import chess from "../assets/reshot-icon-chess-8LDNJZTBAM.svg";
import tabletennis from "../assets/table-tennis.png";
import squash from "../assets/squash.png";
import tennis from "../assets/reshot-icon-tennis-SGW93DHACU.svg";
import volleyball from "../assets/reshot-icon-volleyball-GPN3QHDSUC.svg";
import { ReactComponent as Played } from "../assets/stadium-svgrepo-com.svg";
import { ReactComponent as Medal } from "../assets/medal-sports-and-competition-svgrepo-com.svg";

const ProfilePage = () => {
  const sportIcons = {
    Basketball: basketball,
    Football: football,
    Cricket: cricket,
    Tennis: tennis,
    "Table Tennis": tabletennis,
    Squash: squash,
    Chess: chess,
    Badminton: badminton,
    Volleyball: volleyball,
  };
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState("");
  const [won, setWon] = useState([]);
  const [lost, setLost] = useState([]);
  const [updatedLobbies, setUpdatedLobbies] = useState([]);
  const [showMore, setShowMore] = useState({}); // State to manage "more" clicks
  const { sports } = useSelector((state) => state.sports);
  const sportsMap = sports.reduce((acc, sport) => {
    acc[sport.sportid] = sport.name;
    return acc;
  }, {});

  // Fetch user information
  const fetchUser = async () => {
    try {
      const person = await axios.get(`/users/getbyname/${username}`);
      setUser(person.data);
    } catch (error) {
      console.log(error);
      navigate("/no-user");
    }
  };

  // Fetch results (won and lost lobbies)
  const fetchResults = async () => {
    if (user.userid) {
      try {
        const response1 = await axios.post(`/results/won`, {
          userid: user.userid,
        });
        const response2 = await axios.post(`/results/lost`, {
          userid: user.userid,
        });
        setWon(response1.data);
        setLost(response2.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Fetch updated lobbies and filter them
  const fetchUpdatedLobbies = async () => {
    try {
      const updatedResponse = await axios.get(`/lobbies/getUpdated`);
      const filteredLobbies = updatedResponse.data.filter(
        (lobby) => won.includes(lobby.lobbyid) || lost.includes(lobby.lobbyid)
      );
      setUpdatedLobbies(filteredLobbies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  useEffect(() => {
    if (user.userid) {
      fetchResults();
    }
  }, [user]);

  useEffect(() => {
    if (won.length > 0 || lost.length > 0) {
      fetchUpdatedLobbies();
    }
  }, [won, lost]);

  const handleShowMore = (lobbyid) => {
    setShowMore((prev) => ({ ...prev, [lobbyid]: !prev[lobbyid] }));
  };

  if (!user) {
    return <div>Loading...</div>; // Optional: add a loading state
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Profile Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {username}'s Profile
        </h1>

        {/* Stat Cards */}
        <div className="mb-6 grid gap-6 sm:grid-cols-3">
          <div className="flex items-center justify-between p-6 bg-gray-900 rounded-lg text-white">
            <div>
              <div className="text-sm font-medium">Total Matches</div>
              <div className="text-3xl font-bold text-indigo-400">
                {won.length + lost.length}
              </div>
              <div className="text-sm text-gray-400">
                <button onClick={() => navigate("/home")}>
                  Wanna play more? Click here!
                </button>
              </div>
            </div>
            <div className="text-indigo-400">
              <Played
                className="w-8 h-8 text-indigo-400"
                style={{ fill: "currentColor" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-900 rounded-lg text-white">
            <div>
              <div className="text-sm font-medium">Matches Won</div>
              <div className="text-3xl font-bold text-pink-400">
                {won.length}
              </div>
            </div>
            <div className="text-pink-400">
              <Medal
                className="w-8 h-8 text-pink-400"
                style={{ fill: "currentColor" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-900 rounded-lg text-white">
            <div>
              <div className="text-sm font-medium">Win Rate</div>
              <div className="text-3xl font-bold">
                {won.length + lost.length === 0
                  ? "-"
                  : `${Math.round(
                      (won.length / (won.length + lost.length)) * 100
                    )}%`}
              </div>
              <div className="text-sm text-purple-400">
                {won.length + lost.length === 0
                  ? "No games played yet, start now!"
                  : Math.round(
                      (won.length / (won.length + lost.length)) * 100
                    ) <= 25
                  ? "Every setback is a setup for a comeback."
                  : Math.round(
                      (won.length / (won.length + lost.length)) * 100
                    ) <= 50
                  ? "Progress, not perfection, is the key."
                  : Math.round(
                      (won.length / (won.length + lost.length)) * 100
                    ) <= 75
                  ? "You're halfway there; keep pushing!"
                  : Math.round(
                      (won.length / (won.length + lost.length)) * 100
                    ) <= 90
                  ? "Almost there! The finish line is in sight."
                  : "Celebrate your victories, but don't stop striving."}
              </div>
            </div>
            <div className="relative text-center">
              <img
                className="w-12 h-12 rounded-full border-2 border-gray-700"
                src={`http://localhost:3010/${user.profile_pic.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={username}
              />
              <span className="absolute right-0 bottom-0 bg-green-400 w-3 h-3 rounded-full border-2 border-gray-900"></span>
            </div>
          </div>
        </div>

        {/* Lobby Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {updatedLobbies.map((lobby) => (
            <div
              key={lobby.lobbyid}
              className={`py-8 px-8 w-full rounded-xl shadow-lg space-y-4 sm:py-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 ${
                won.includes(lobby.lobbyid) ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <img
                className="block mx-auto h-24 w-24 rounded-full sm:mx-0 sm:shrink-0 bg-gray-300"
                src={sportIcons[sportsMap[lobby.sportid]]}
                alt={sportsMap[lobby.sportid]}
              />
              <div className="text-center space-y-4 sm:text-left">
                <div className="space-y-2">
                  <p className="text-lg text-white font-semibold">
                    {sportsMap[lobby.sportid].toUpperCase()}
                  </p>
                  <p className="text-slate-100 font-medium">
                    {showMore[lobby.lobbyid]
                      ? lobby.winner
                      : `${lobby.winner.slice(0, 20)}`}
                    {lobby.winner.length > 20 && (
                      <button
                        onClick={() => handleShowMore(lobby.lobbyid)}
                        className="text-slate-100 underline ml-1"
                      >
                        {showMore[lobby.lobbyid] ? "...less" : "...more"}
                      </button>
                    )}
                  </p>
                  <p
                    className={`px-4 py-1 text-sm w-24 text-center ${
                      won.includes(lobby.lobbyid)
                        ? "text-green-800"
                        : "text-red-800"
                    } font-bold rounded-full border border-transparent bg-gray-200`}
                  >
                    {lobby.score}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
