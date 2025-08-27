import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { URL } from "../../routes/urlEndpoints";
import CircularLoader from "../../components/circularLoader";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../core/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onContinue = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(
        auth,
        userData.email.trim(),
        userData.password,
      );
      console.log(cred);
      toast.success("Logged in successfully!");
      setUserData({ email: "", password: "" });
      navigate(URL.INDEX ?? "/");
    } catch (err) {
      toast.error(err?.code || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="ring-2 ring-gray-900/5 relative px-4 pt-6 pb-8 bg-bgLightColor  shadow-md shadow-shadowColor w-1/2 max-w-md mx-auto sm:px-6 rounded-2xl">
        <div className="font-heading font-semibold text-2xl leading-5 tracking-[-0.01em]  text-textPrimaryColor pb-8">
          Login to Punchpad
        </div>

        <form autoComplete="on" onSubmit={onContinue} method="post">
          <label className="block pb-1 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            value={userData.email || ""}
            placeholder="you@example.com"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />
          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Password
          </label>
          <input
            name="password"
            type="text"
            required
            minLength={8}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            value={userData.password || ""}
            placeholder="Password"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />
          <div className="pt-3 text-right">
            <NavLink
              to={URL.FORGOT_PASSWORD}
              className="text-sm text-textPlaceholderColor hover:text-mainColor "
            >
              Forgot password?
            </NavLink>
          </div>
          <div className="flex">
            {loading ? (
              <div className="mt-4">
                <CircularLoader />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full h-12 mt-5 bg-mainColor hover:bg-mainDarkBgColor text-textPrimaryLightColor uppercase text-sm font-semibold px-14  rounded-full"
              >
                Login
              </button>
            )}
          </div>
          <div className="text-center mt-3">
            <span className="text-sm text-textPlaceholderColor">
              Didn’t have an account yet?{" "}
            </span>
            <NavLink
              to={URL.SIGNUP}
              className="text-sm font-semibold text-mainColor hover:text-mainDarkColor "
            >
              Create Account
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
