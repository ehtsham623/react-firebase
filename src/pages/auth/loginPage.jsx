import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { URL } from "../../routes/urlEndpoints";
import { useNavigate } from "react-router-dom";
import CircularLoader from "../../components/circularLoader";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isRememberMe, setIsRememberMe] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onContinue = async (event) => {
    event.preventDefault();

    // login({
    //   isRememberMe,
    //   data: {
    //     email: userData.email,
    //     password: userData.password,
    //   },
    // }).then((data) => {
    //   setUserData({
    //     email: "",
    //     password: "",
    //   });
    //   if (data.payload.statusCode === 200) {
    //     navigate(URL.HOME);
    //   }
    // });
  };
  return (
    <div className="min-h-screen bg-bgLightColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <span className="border text-4xl text-textMainColor px-6  shadow-md shadow-shadowColor pt-10 pb-8 bg-bgLightColor w-1/2 max-w-md mx-auto rounded-t-md sm:px-10">
        Login
      </span>
      <div className="border relative px-4 pt-7 pb-8 bg-bgLightColor shadow-md shadow-shadowColor w-1/2 max-w-md mx-auto sm:px-10 rounded-b-md">
        <form action="#" autoComplete="on" onSubmit={onContinue} method="post">
          <label className="block pb-1 text-textPrimaryColor">Email</label>
          <input
            name="email"
            type="email"
            required
            onChange={handleChange}
            value={userData.email || ""}
            placeholder="you@example.com"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />
          <label className="block pb-1 text-textPrimaryColor">Password</label>
          <input
            name="password"
            type="text"
            required
            minLength={8}
            onChange={handleChange}
            value={userData.password || ""}
            placeholder="Password"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />
          <div className="flex items-start">
            <div className="flex items-center">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                checked={isRememberMe}
                onChange={() => setIsRememberMe(!isRememberMe)}
                className="h-4 w-4 rounded bg-bgLightColor border border-borderColor focus:ring-3 focus:ring-focusBorderColor"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-textPrimaryColor ml-3"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="flex justify-between items-center">
            {false ? (
              <div className="mt-4">
                <CircularLoader />
              </div>
            ) : (
              <button
                type="submit"
                className="mt-5 bg-mainColor hover:bg-mainDarkBgColor text-textPrimaryLightColor uppercase text-sm font-semibold px-14 py-3 rounded"
              >
                Login
              </button>
            )}
            <NavLink
              to={URL.SIGNUP}
              className="mt-5 text-hintTextColor hover:text-mainColor uppercase text-sm font-semibold"
            >
              SignUp
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
