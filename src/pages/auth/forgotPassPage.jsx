import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../core/firebase";
import { toast } from "react-toastify";
import { URL } from "../../routes/urlEndpoints";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.info("Please enter your email.");
      return;
    }
    try {
      setSending(true);
      await sendPasswordResetEmail(auth, trimmed);
      toast.success("Password reset link sent. Check your inbox.");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Could not send reset email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="border relative px-4 pt-7 pb-8 bg-bgLightColor border-textMainColor shadow-md shadow-shadowColor w-11/12 sm:w-3/4 md:w-2/3 max-w-md mx-auto sm:px-10 rounded-md">
        <div className="text-3xl text-textMainColor pb-6">Forgot Password</div>

        <form onSubmit={onSubmit}>
          <label className="block pb-1 text-textPrimaryColor">Email</label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={sending}
              className="mt-2 bg-mainColor hover:bg-mainDarkBgColor text-textPrimaryLightColor uppercase text-sm font-semibold px-6 py-2 rounded disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Reset Link"}
            </button>

            <NavLink
              to={URL.LOGIN}
              className="mt-2 text-hintTextColor hover:text-mainColor uppercase text-sm font-semibold"
            >
              Back to Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
