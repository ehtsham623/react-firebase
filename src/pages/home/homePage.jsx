import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../core/firebase";
import { useAuth } from "../../core/AuthProvider";

const HomePage = () => {
  const { user } = useAuth();

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="min-h-screen bg-bgLightColor  text-textPrimaryColor font-sans">
      <header className="border-b border-borderColor bg-bgColor">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-4 text-sm"></nav>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-borderColor px-3 py-1.5 text-sm hover:bg-mainLightBgColor transition"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-mainDarkColor">Dashboard</h1>
        <p className="mt-2 text-textPrimaryDarkColor">
          Welcome {user?.displayName || user?.email}
        </p>
      </main>
    </div>
  );
};

export default HomePage;
