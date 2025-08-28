import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../core/firebase";
import { toast } from "react-toastify";
import { URL } from "../../routes/urlEndpoints";
import FormLabel from "../../components/FormLabel";

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
      toast.error(err?.code || "Could not send reset email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className=" ring-2 ring-gray-900/5 relative px-4 pt-6 pb-8 bg-bgLightColor  shadow-md shadow-shadowColor w-1/2 max-w-md mx-auto sm:px-6 rounded-2xl">
        <div className="font-semibold text-2xl leading-5 tracking-[-0.01em]  text-textPrimaryColor pb-2">
          Forgot Password
        </div>
        <div className="text-sm text-textPlaceholderColor pb-4">
          Please provide your email address to receive the password reset link.
        </div>

        <form onSubmit={onSubmit}>
          <FormLabel>Email Address</FormLabel>
          <input
            type="email"
            name="email"
            required
            value={email}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <div className="pt-3 text-right">
            <NavLink
              to={URL.LOGIN}
              className="text-sm text-textPlaceholderColor hover:text-mainColor "
            >
              Back to Login
            </NavLink>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full h-12 mt-4 bg-mainColor hover:bg-mainDarkBgColor text-textPrimaryLightColor uppercase text-sm font-semibold px-14  rounded-full"
          >
            {sending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
