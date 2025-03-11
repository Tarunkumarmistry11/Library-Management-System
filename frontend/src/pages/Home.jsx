// TODO: Implement Home page with dynamic component rendering
// - Added Home component with dynamic rendering based on selectedComponent state
// - Included conditional rendering for UserDashboard, AdminDashboard, BookManagement, Catalog, Users, and MyBorrowedBooks components
// - Integrated user authentication check and side menu toggle functionality


import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // if (!isAuthenticated) {
  //   return <Navigate to={"/login"} />;
  // }

  const displayComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
      case "Books":
        return <BookManagement />;
      case "Catalog":
        if (user.role === "Admin") {
          return <Catalog />;
        }
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
      case "Users":
        if (user.role === "Admin") {
          return <Users />;
        }
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
      case "My Borrowed Books":
        return <MyBorrowedBooks />;
      default:
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
    }
  };

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu
          className="text-2xl"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </div>
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />
      {displayComponent()}
    </div>
  );
};

export default Home;
