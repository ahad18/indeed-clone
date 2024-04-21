/* eslint-disable react/no-unknown-property */
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    // logOut()
    //   .then(() => {
    //     // Sign-out successful.
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.reload()
  };

  // menu toggle btn
  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navItems = [
    { path: "/", title: "Start a search" },
    { path: "/post-job", title: "Post A Job" },
    { path: "/applied-candidates", title: "Applied Candidates" },
  ];
  const navItems2 = [
    { path: "/", title: "Start a search" },
    { path: "/my-job", title: "Applied Jobs" },
  ];
  const navigate = useNavigate()
  console.log(user);
  return (
    <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl">
       
            <img className="" style={{height: '51px',
    width: '141px',
                  }}
            src="public/images/logo.png"/>
         
        </a>

        {/* nav items */}
        <ul className="hidden md:flex gap-12">
          {user?.role === "company" ? navItems.map(({ path, title }) => {
            return (
              <li key={path} className="text-base text-primary">
                <NavLink
                  to={path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {title}
                </NavLink>
              </li>
            )
          }) : (
            navItems2.map(({ path, title }) => {
              return (
                <li key={path} className="text-base text-primary">
                  <NavLink
                    to={path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {title}
                  </NavLink>
                </li>
              )
            })
          )}
        </ul>

        {/* sign up signout btn */}
        <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
          {token ? (
            <>
              <div className="flex gap-4 items-center">
                <div class="flex -space-x-2 overflow-hidden">
                  {user?.image ?
                    <img
                      onClick={() => navigate("/profile")}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                      src={user?.image}
                      alt=""
                    /> 
                    :
                    <img
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  }

                </div>
                <button onClick={handleLogout} className="py-2 px-5 border rounded hover:bg-blue hover:text-white">Log out</button>
              </div>
            </>
          ) : (
            <>
              {" "}
              <Link to="/login" className="py-2 px-5 border rounded">
                Log in
              </Link>
              <Link
                to="/sign-up"
                className="bg-blue py-2 px-5 text-white rounded"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* mobile menu */}
        <div className="md:hidden block">
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? (
              <>
                <FaXmark className="w-5 h-5 text-primary/75" />
              </>
            ) : (
              <>
                <FaBarsStaggered className="w-5 h-5 text-primary/75" />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* mobile menu items */}
      <div
        className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"
          }`}
      >
        <ul>
          {navItems.map(({ path, title }) => (
            <li
              key={path}
              className="text-base text-white first:text-white py-1"
            >
              <NavLink
                onClick={handleMenuToggler}
                to={path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {title}
              </NavLink>
            </li>
          ))}

          <li className="text-white py-1">
            <Link to="login">Log in</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
