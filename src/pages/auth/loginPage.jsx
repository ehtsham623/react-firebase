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
      console.error(err);
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="border relative px-4 pt-7 pb-8 bg-bgLightColor border-textMainColor shadow-md shadow-shadowColor w-1/2 max-w-md mx-auto sm:px-10 rounded-md">
        <div className="text-4xl text-textMainColor pb-6">Login</div>

        <form autoComplete="on" onSubmit={onContinue} method="post">
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
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-3 rounded-md text-textPrimaryColor"
          />

          <NavLink
            to={URL.FORGOT_PASSWORD}
            className="text-sm text-hintTextColor hover:text-mainColor underline"
          >
            Forgot password?
          </NavLink>

          <div className="flex justify-between items-center">
            {loading ? (
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
