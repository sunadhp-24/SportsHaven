import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user } = useSelector((state) => state.user.user); // Assuming user state is stored in Redux
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality here
    navigate("/");
  };
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/user/${searchQuery}`);
    }
  };

  useEffect(() => {
    const toggleOpen = document.getElementById("toggleOpen");
    const toggleClose = document.getElementById("toggleClose");
    const collapseMenu = document.getElementById("collapseMenu");

    const handleClick = () => {
      if (collapseMenu.style.display === "block") {
        collapseMenu.style.display = "none";
      } else {
        collapseMenu.style.display = "block";
      }
    };

    if (toggleOpen) {
      toggleOpen.addEventListener("click", handleClick);
    }
    if (toggleClose) {
      toggleClose.addEventListener("click", handleClick);
    }

    // Cleanup event listeners
    return () => {
      if (toggleOpen) {
        toggleOpen.removeEventListener("click", handleClick);
      }
      if (toggleClose) {
        toggleClose.removeEventListener("click", handleClick);
      }
    };
  }, []);

  const handleClick = () => {
    if (user.activelobby) {
      navigate(`/activelobby/${user.currentlobby}`);
    } else {
      navigate("/no-active-lobby");
    }
  };
  const goToPFP = () => {
    navigate(`/user/${user.username}`);
  };

  return (
    <header className="flex border-b py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center gap-5 w-full">
        <h1 className="font-bold text-[20px] text-[#007bff]">SportsHaven</h1>
        <div
          id="collapseMenu"
          className="max-lg:hidden lg:!block max-lg:w-full max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        >
          <button
            id="toggleClose"
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>

          <ul className="lg:flex lg:ml-14 lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <h1 className="font-bold text-[20px] text-[#007bff]">
              SportsHaven
            </h1>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <a
                href="/home"
                className="lg:hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Home
              </a>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <button
                onClick={handleClick}
                className="lg:hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Active Lobby
              </button>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <a
                href={`/user/${user.username}`}
                className="lg:hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                My Profile
              </a>
            </li>
            <li className="max-lg:border-b max-lg:py-3 px-3">
              <a
                href="javascript:void(0)"
                className="lg:hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                About
              </a>
            </li>
            <li
              className="max-lg:border-b max-lg:py-3 px-3"
              onClick={() => setShowLogoutDialog(true)}
            >
              <a
                href="javascript:void(0)"
                className="lg:hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
        <button id="toggleOpen" className="lg:hidden ml-auto">
          <svg
            className="w-7 h-7"
            fill="#000"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="flex lg:ml-auto max-lg:w-full">
          <div className="flex xl:w-80 max-xl:w-full bg-gray-100 px-6 py-3 rounded outline outline-transparent focus-within:outline-[#007bff] focus-within:bg-transparent">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full text-sm bg-transparent rounded outline-none pr-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="cursor-pointer fill-gray-400"
              onClick={() => navigate(`/user/${searchQuery}`)}
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div>
        </div>
      </div>
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-96 md:w-1/3 lg:w-1/4">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
