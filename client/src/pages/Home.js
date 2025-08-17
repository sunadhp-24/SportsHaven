import { useEffect, useState } from "react";
import axios from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketballBall,
  faFutbol,
  faBaseball,
  faTableTennis,
  faTable,
  faChess,
  faExclamationCircle,
  faVolleyball,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import badminton from "../assets/reshot-icon-badminton-RXYNAQ749M.svg";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "@headlessui/react";
import { setLobbies } from "../redux/LobbySlice.js";
import { setSports } from "../redux/sportsSlice.js";
import { setPendingLobbies } from "../redux/PendingLobbySlice.js";
import { updateUser } from "../redux/UserSlice.js";

// Mapping sport names to FontAwesome icons
const sportIcons = {
  Basketball: faBasketballBall,
  Football: faFutbol,
  Cricket: faBaseball,
  "Table Tennis": faTableTennis,
  Chess: faChess,
  Volleyball: faVolleyball,
};

const Card = ({ lobbyid, sport, currSize, maxSize }) => (
  <div className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg sm:px-10">
    <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[10]"></span>
    <div className="relative z-10 mx-auto max-w-md">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 transition-all duration-300 group-hover:bg-sky-400">
        <FontAwesomeIcon
          icon={sportIcons[sport]}
          className="h-10 w-10 text-white transition-all"
        />
      </span>
      <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
        <p className="font-bold text-lg">{sport.toUpperCase()}</p>
        <p className="bg-white px-2 py-1 rounded text-gray-700 transition-all  duration-300 group-hover:bg-sky-400 group-hover:text-white">
          {currSize}/{maxSize}
        </p>
      </div>
      <div className="pt-5 text-base font-semibold leading-7">
        <p>
          <a
            href={`/lobbies/${lobbyid}`}
            className="text-sky-500 transition-all duration-300 group-hover:text-white"
          >
            Know more &rarr;
          </a>
        </p>
      </div>
    </div>
  </div>
);

const App = () => {
  const [sportsMap, setSportsMap] = useState({});
  const [filteredLobbies, setFilteredLobbies] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLobby, setNewLobby] = useState({ sport: "", maxSize: "" });
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user.user);
  const { lobbies } = useSelector((state) => state.lobby);
  const { sports } = useSelector((state) => state.sports);

  const fetchSports = async () => {
    try {
      const response = await axios.get("/sports/all");
      const sportsData = response.data.reduce((acc, sport) => {
        acc[sport.sportid] = sport.name;
        return acc;
      }, {});
      setSportsMap(sportsData);
      dispatch(setSports(response.data));
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const fetchLobbies = async () => {
    try {
      const response = await axios.get("/lobbies/getactive");
      const response2 = await axios.get("/lobbies/getpending");
      //   setLobbies(response.data);
      dispatch(setPendingLobbies(response2.data));
      dispatch(setLobbies(response.data));
      setFilteredLobbies(response.data); // Initially show all lobbies
    } catch (error) {
      console.error("Error fetching active lobbies:", error);
    }
  };
  const fetchUser = async () => {
    try {
      axios.get(`/users/${user.userid}`).then((response) => {
        const data = response.data;
        dispatch(updateUser(data));
        console.log(user);
      });
    } catch (error) {}
  };
  useEffect(() => {
    fetchSports();
    fetchLobbies();
    fetchUser();
  }, []);

  const openFilterDialog = () => {
    setIsFilterOpen(true);
  };

  const closeFilterDialog = () => {
    setIsFilterOpen(false);
  };

  const filterLobbies = (sport) => {
    const filtered = lobbies.filter(
      (lobby) => sportsMap[lobby.sportid] === sport
    );
    setFilteredLobbies(filtered);
    closeFilterDialog();
  };

  const openCreateDialog = () => {
    setIsCreateOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateOpen(false);
    setErrors([]);
    setNewLobby({ sport: "", maxSize: "" });
    fetchLobbies();
  };

  const createLobby = async () => {
    const { sport, maxSize } = newLobby;
    const sportId = Object.keys(sportsMap).find(
      (key) => sportsMap[key] === sport
    );

    if (!sport || !maxSize) {
      setErrors(["Please fill in all fields."]);
      return;
    }

    if (!sportId) {
      setErrors(["Invalid sport selected."]);
      return;
    }

    try {
      await axios.post("/lobbies", { sportid: sportId, maxsize: maxSize });
      fetchLobbies();
      fetchUser();
      setErrors([]);
      setIsCreateOpen(false);
      setNewLobby({ sport: "", maxSize: "" });
    } catch (error) {
      console.log(error.response.data.message);
      setErrors([error.response.data.message]);
      // if (error.response.status === 400) {
      //   setErrors(["User is already in a lobby."]);
      // } else {
      //   setErrors(["Error creating lobby. Please try again."]);
      // }
    }
  };
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lobbies Available</h1>
          <div className="flex space-x-4">
            <button
              onClick={openCreateDialog}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create Lobby
            </button>
            <button
              onClick={openFilterDialog}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Filter Sports
            </button>
          </div>
        </div>
        {/* <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredLobbies.map((lobby) => (
            <Card
              key={lobby.id}
              sport={sportsMap[lobby.sportid]}
              currSize={lobby.currentsize}
              maxSize={lobby.maxsize}
            />
          ))}
        </div> */}
      </div>

      {/* Filter Sports Dialog */}
      <Dialog
        open={isFilterOpen}
        onClose={closeFilterDialog}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-4">
            <Dialog.Title className="text-lg font-bold">
              Select Sport
            </Dialog.Title>
            <div className="mt-4 space-y-4 overflow-y-auto max-h-96">
              {Object.entries(sportsMap).map(([id, name]) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => filterLobbies(name)}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={sportIcons[name] ? sportIcons[name] : faRunning}
                      className="h-6 w-6 text-gray-700 mr-2"
                    />
                    <span className="font-semibold">{name.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={closeFilterDialog}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => setFilteredLobbies(lobbies)}
              className="mt-4 ml-4 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Remove Filters
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Create Lobby Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={closeCreateDialog}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-4">
            <Dialog.Title className="text-lg font-bold">
              Create a Lobby
            </Dialog.Title>
            <div className="mt-4 space-y-4">
              {errors.length > 0 && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="mr-2"
                  />
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              <div className="flex flex-col">
                <label className="font-semibold">Sport</label>
                <select
                  value={newLobby.sport}
                  onChange={(e) =>
                    setNewLobby({ ...newLobby, sport: e.target.value })
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select Sport</option>
                  {/* {Object.values(sportsMap).map((name) => (
                    <option key={name} value={name}>
                      {name.toUpperCase()}
                    </option>
                  ))} */}
                  {sports.map((sport) => (
                    <option key={sport.sportid} value={sport.name}>
                      {sport.name.toUpperCase()} (
                      {sport.maxsize - sport.currentsize} spots left)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Maximum Size</label>
                <input
                  type="number"
                  value={newLobby.maxSize}
                  onChange={(e) =>
                    setNewLobby({ ...newLobby, maxSize: e.target.value })
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <button
                onClick={createLobby}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
              <button
                onClick={closeCreateDialog}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {filteredLobbies.map((lobby) => (
          <Card
            key={lobby.lobbyid}
            lobbyid={lobby.lobbyid}
            sport={sportsMap[lobby.sportid]}
            currSize={lobby.currentsize}
            maxSize={lobby.maxsize}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
