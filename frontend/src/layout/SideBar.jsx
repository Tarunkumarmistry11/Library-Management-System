import React, { useEffect } from "react";
import LmsLogo from "../assets/Lms logo.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import UsersIcon from "../assets/user.png";
import settingIcon from "../assets/setting-white.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/close-square.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup } = useSelector((state) => state.popup);
  const { loading, error, user, isAuthenticated, message } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-indigo-500 text-white flex-col h-full`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8">
          <img src={LmsLogo} alt="logo" />
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="Books" />
            <span>Books</span>
          </button>
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="Books" />
                <span>Catalog</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={UsersIcon} alt="Books" />
                <span>Users</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" /> <span>Add New Admin</span>
              </button>
            </>
          )}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("My Borrowed Books")}
              >
                <img src={catalogIcon} alt="Icon" />
                <span>My Borrowed Books</span>
              </button>
            </>
          )}
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            // onClick={() => setSelectedComponent("My Borrowed Books")}
          >
            <img src={settingIcon} alt="Icon" />
            <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
          <button className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit">
            <img src={logoutIcon} alt="Icon" />
            <span>Log Out</span>
          </button>
        </div>
        <img
          src={closeIcon}
          alt="Close"
          onClick={() => setIsSideBarOpen(!setIsSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
      </aside>
    </>
  );
};

export default SideBar;
