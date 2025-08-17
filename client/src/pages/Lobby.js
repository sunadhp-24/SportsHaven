import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableTennis,
  faTable,
  faChess,
  faExclamationCircle,
  faRightToBracket,
  faCircle,
  faPlus,
  faVolleyball,
} from "@fortawesome/free-solid-svg-icons";
import badminton from "../assets/reshot-icon-badminton-RXYNAQ749M.svg";
import cricket from "../assets/reshot-icon-cricket-M2EUHT437N.svg";
import football from "../assets/reshot-icon-football-VRDHMFPCS4.svg";
import basketball from "../assets/reshot-icon-basketball-LD4KY59N6A.svg";
import chess from "../assets/reshot-icon-chess-8LDNJZTBAM.svg";
import tabletennis from "../assets/table-tennis.png";
import squash from "../assets/squash.png";
import tennis from "../assets/reshot-icon-tennis-SGW93DHACU.svg";
import volleyball from "../assets/reshot-icon-volleyball-GPN3QHDSUC.svg";
import { Dialog } from "@headlessui/react";
import { updateUser } from "../redux/UserSlice";
import NoActiveLobby from "./NoActiveLobby";

const sportIcons = {
  Basketball: basketball,
  Football: football,
  Cricket: cricket,
  Tennis: tennis,
  "Table Tennis": tabletennis,
  Squash: squash,
  Carrom: faChess,
  Chess: chess,
  Badminton: badminton,
  volleyball: volleyball,
};

const DetailedLobbyCard = ({ type }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.user);
  const { lobbyid } = useParams();
  const navigate = useNavigate();
  const { lobbies } = useSelector((state) => state.lobby);
  const { pendingLobbies } = useSelector((state) => state.pendingLobby);
  const lobby =
    lobbies.find((lobby) => lobby.lobbyid === parseInt(lobbyid)) ||
    pendingLobbies.find((lobby) => lobby.lobbyid === parseInt(lobbyid));
  const { sports } = useSelector((state) => state.sports);
  const sport = sports.find(
    (sport) => sport.sportid === parseInt(lobby.sportid)
  );
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isConcludeOpen, setIsConcludeOpen] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [isInactiveDialogOpen, setIsInactiveDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [winnerScore, setWinnerScore] = useState("");
  const [loserScore, setLoserScore] = useState("");
  const [winnerComments, setWinnerComments] = useState("");
  const [winners, setWinners] = useState([]);

  const openJoinDialog = () => setIsJoinDialogOpen(true);
  const closeJoinDialog = () => setIsJoinDialogOpen(false);
  const openConcludeDialog = () => setIsConcludeOpen(true);
  const closeConcludeDialog = () => setIsConcludeOpen(false);
  const openErrorDialog = () => setIsErrorDialogOpen(true);
  const closeErrorDialog = () => setIsErrorDialogOpen(false);
  const openExitDialog = () => setIsExitDialogOpen(true);
  const closeExitDialog = () => setIsExitDialogOpen(false);
  const openInactiveDialog = () => setIsInactiveDialogOpen(true);
  const closeInactiveDialog = () => setIsInactiveDialogOpen(false);
  const openAddUserDialog = () => setIsAddUserDialogOpen(true);
  const closeAddUserDialog = () => setIsAddUserDialogOpen(false);

  const fetchLobbyUsers = async () => {
    try {
      const response = await axios.get(`/lobbies/lobbyusers/${lobbyid}`);
      const lobbyUsers = response.data;

      const userRequests = lobbyUsers.map((lobbyUser) => {
        // console.log(lobbyUser.userid);
        return axios.get(`/users/${lobbyUser.userid}`);
      });
      const userResponses = await Promise.all(userRequests);
      const usersData = userResponses.map((res) => res.data);

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching lobby users:", error);
    }
  };

  useEffect(() => {
    fetchLobbyUsers();
  }, [lobbyid]);

  const toggleWinner = (user) => {
    if (winners.find((winner) => winner === user.userid)) {
      setWinners(winners.filter((winner) => winner !== user.userid));
    } else {
      setWinners([...winners, user.userid]);
    }
  };

  const handleJoinLobby = async () => {
    try {
      await axios.put(`/lobbies/enter/${lobbyid}`);
      dispatch(updateUser({ activelobby: true, currentlobby: lobbyid }));
      closeJoinDialog();
      navigate("/home");
    } catch (error) {
      console.error("Error joining lobby:", error);
      if (error.response.status === 400) {
        setErrorMessage("Can't join! You are already in a lobby.");
      } else {
        setErrorMessage("Error joining the lobby. Please try again.");
      }
      openErrorDialog();
    }
  };
  const handleAddUser = async () => {
    try {
      await axios.put(`/lobbies/adduser/${lobbyid}`, {
        username: inputUsername,
      });
      closeAddUserDialog();
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error adding the user. Please try again."
      );
      openErrorDialog();
    }
  };

  const handleExitLobby = async () => {
    try {
      await axios.put(`/lobbies/exit`, { userId: user.userid });
      dispatch(updateUser({ activelobby: false, currentlobby: null }));
      closeExitDialog();
      navigate("/home");
    } catch (error) {
      setErrorMessage("Unexpected error, Try Again!");
      openErrorDialog();
    }
  };

  const handleSetInactive = async () => {
    try {
      const response = await axios.put(`/lobbies/update/${lobbyid}`, {
        isactive: !lobby.isactive,
      });
      console.log(response);
      closeInactiveDialog();
      navigate("/home");
    } catch (error) {
      setErrorMessage("Unexpected error, Try Again!");
      openErrorDialog();
    }
  };

  const handleSubmit = async () => {
    try {
      const losers = users
        .filter((user) => !winners.includes(user.userid))
        .map((user) => user.userid);
      await axios.put(`/lobbies/updateWinners/${lobbyid}`, {
        winnerids: winners,
        loserids: losers,
        winner_comments: winnerComments,
        score: `${winnerScore}-${loserScore}`,
      });
      for (const user of users) {
        await axios.put(`/lobbies/exit`, { userId: user.userid });
        dispatch(updateUser({ activelobby: false, currentlobby: null }));
      }
      closeConcludeDialog();
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      openErrorDialog();
    }
  };

  return (
    <div className="h-screen dark:bg-gray-700 bg-gray-200 pt-12 relative">
      <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg relative">
        {type === "active" && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-gray-500 hover:text-green-500 cursor-pointer"
              onClick={openAddUserDialog}
            />
            <FontAwesomeIcon
              icon={faCircle}
              className="text-gray-500 hover:text-yellow-500 cursor-pointer"
              onClick={openInactiveDialog}
            />
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={openExitDialog}
            />
          </div>
        )}
        <div className="border-b px-4 pb-6">
          <div className="text-center my-4">
            {type == "join" ? (
              <span className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4 flex items-center justify-center bg-sky-500">
                <img
                  src={sportIcons[sport.name]}
                  alt={sport.name}
                  className="h-20 w-20"
                />
              </span>
            ) : (
              <span className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4 flex items-center justify-center bg-green-500">
                <img
                  src={sportIcons[sport.name]}
                  alt={sport.name}
                  className="h-20 w-20"
                />
              </span>
            )}
            <div className="py-2">
              <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                {sport.name.toUpperCase()}
              </h3>
              <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                </svg>
                IIIT ALLAHABAD
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-2">
            {type == "join" ? (
              <button
                onClick={openJoinDialog}
                className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
              >
                Join Lobby
              </button>
            ) : (
              <button
                onClick={openConcludeDialog}
                className="flex-1 rounded-full bg-green-600 dark:bg-green-800 text-white dark:text-white antialiased font-bold hover:bg-green-800 dark:hover:bg-green-900 px-4 py-2"
              >
                Conclude
              </button>
            )}
            <button
              onClick={() => navigate("/home")}
              className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" />
            </svg>
            <span>
              <strong className="text-black dark:text-white">
                {lobby.currentsize}/{lobby.maxsize}
              </strong>{" "}
              Members
            </span>
          </div>
          <div className="flex flex-wrap justify-center">
            {users.map((user) => (
              <div
                key={user.userid}
                className="flex flex-col items-center mx-2 my-2"
              >
                <img
                  className="border-2 border-white dark:border-gray-800 rounded-full h-10 w-10"
                  src={`http://localhost:3010/${user.profile_pic.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={user.username}
                />
                <span className="text-sm text-gray-800 dark:text-gray-300">
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isJoinDialogOpen} onClose={closeJoinDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              Join Lobby
            </Dialog.Title>
            <div className="mt-4">
              <p>Are you sure you want to join this lobby?</p>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleJoinLobby}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={closeJoinDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={isAddUserDialogOpen} onClose={closeAddUserDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">Add User</Dialog.Title>
            <div className="mt-4">
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleAddUser}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add User
              </button>
              <button
                onClick={closeAddUserDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isErrorDialogOpen} onClose={closeErrorDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="flex items-center text-lg font-bold text-red-600">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
              Error
            </Dialog.Title>
            <div className="mt-4">
              <p>{errorMessage}</p>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              {!isJoinDialogOpen ? (
                <button
                  onClick={() => {
                    closeErrorDialog();
                  }}
                  className="bg-red-700 text-white px-4 py-2 rounded"
                >
                  Try Again
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate(`/activelobby/${user.currentlobby}`);
                    closeErrorDialog();
                    closeJoinDialog();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  My Lobby
                </button>
              )}
              <button
                onClick={() => {
                  closeErrorDialog();
                  closeAddUserDialog();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isConcludeOpen} onClose={closeConcludeDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              Conclude Match
            </Dialog.Title>
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Winner Score
                </label>
                <input
                  type="number"
                  value={winnerScore}
                  onChange={(e) => setWinnerScore(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Loser Score
                </label>
                <input
                  type="number"
                  value={loserScore}
                  onChange={(e) => setLoserScore(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Winner Comments
                </label>
                <textarea
                  value={winnerComments}
                  onChange={(e) => setWinnerComments(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Winners
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleWinner(user)}
                      className={`cursor-pointer p-2 rounded-lg flex items-center space-x-2 ${
                        winners.includes(user.userid)
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <img
                        src={`http://localhost:3010/${user.profile_pic.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {user.username}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={closeConcludeDialog}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isInactiveDialogOpen} onClose={closeInactiveDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              Lobby Status
            </Dialog.Title>
            <div className="mt-4">
              <p>
                The lobby is currently
                {lobby.isactive === true ? " active" : " inactive"}
              </p>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleSetInactive}
                className="bg-yellow-700 text-white px-4 py-2 rounded"
              >
                {lobby.isactive === true ? "Set Inactive" : "Set Active"}
              </button>
              <button
                onClick={closeInactiveDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Go Back
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isExitDialogOpen} onClose={closeExitDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              Exit Lobby
            </Dialog.Title>
            <div className="mt-4">
              <p>Are you sure you want to exit this lobby?</p>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleExitLobby}
                className="bg-red-700 text-white px-4 py-2 rounded"
              >
                Exit
              </button>
              <button
                onClick={closeExitDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailedLobbyCard;
