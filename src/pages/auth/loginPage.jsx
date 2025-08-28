import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { URL } from "../../routes/urlEndpoints";
import CircularLoader from "../../components/circularLoader";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../core/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormLabel from "../../components/FormLabel";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

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

  const onGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const uid = user.uid;
      const userRef = doc(db, "users", uid);
      const existing = await getDoc(userRef);

      if (!existing.exists()) {
        const userDoc = {
          created_at: serverTimestamp(),
          email: user.email,
          full_name: user.displayName || "",
          id: uid,
          phone_number: "",
          profile_picture_url: user.photoURL || "",
          uid: uid,
          dob: "",
        };

        await setDoc(userRef, userDoc);
        console.log("New Google user saved:", userDoc);
      } else {
        console.log("User already exists, skipping Firestore save");
      }

      toast.success("Logged in with Google!");
    } catch (err) {
      console.error(err);
      toast.error(err?.code || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="ring-2 ring-gray-900/5 relative px-4 pt-6 pb-8 bg-bgLightColor  shadow-md shadow-shadowColor w-1/2 max-w-md mx-auto sm:px-6 rounded-2xl">
        <div className="font-heading font-semibold text-2xl leading-5 tracking-[-0.01em]  text-textPrimaryColor pb-8">
          Login to Punchpad
        </div>

        <form autoComplete="on" onSubmit={onContinue} method="post">
          <FormLabel>Email Address</FormLabel>
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
          <FormLabel>Password</FormLabel>
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
              Didn’t have an account yet?
            </span>
            <NavLink
              to={URL.SIGNUP}
              className="text-sm font-semibold text-mainColor hover:text-mainDarkColor "
            >
              {" Create Account"}
            </NavLink>
          </div>
        </form>

        <div className="flex items-center mb-6 mt-12">
          <div className="flex-1 h-px bg-dividerColor"></div>
          <span className="mx-3 text-sm text-textPlaceholderColor">
            or continue with
          </span>
          <div className="flex-1 h-px bg-dividerColor"></div>
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="w-full h-12 rounded-full border border-borderColor bg-bgLightColor
             flex items-center justify-center gap-3 text-textPrimaryColor
             hover:bg-mainLightBgColor transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.9 33.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.5 6 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.9 16.4 19.1 14 24 14c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.5 6 28.9 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.3 0 10.1-2 13.6-5.3l-6.3-5.2C29.4 35.5 26.9 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.4 39.6 16.1 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.7 5.9-7 7.2l6.3 5.2C37.8 37.7 40 31.3 40 24c0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          <span className="text-sm font-normal">Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
