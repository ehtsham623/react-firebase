import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { URL } from "../../routes/urlEndpoints";
import { auth, db, storage } from "../../core/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview("");
    const inp = document.getElementById("photo");
    if (inp) inp.value = "";
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB");
      return;
    }
    setPhotoFile(file);
    const url = window.URL.createObjectURL(file);
    setPhotoPreview(url);
  }

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      return;
    }
    const urlLink = window.URL.createObjectURL(photoFile);
    setPhotoPreview(urlLink);
    return () => window.URL.revokeObjectURL(urlLink);
  }, [photoFile]);

  async function uploadProfilePhoto(uid, file) {
    if (!file) return "";
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `users/${uid}/profile_${Date.now()}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function onContinue(e) {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      const msg = "Passwords do not match";
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);

      if (!photoFile) {
        toast.error("Profile photo is required");
        return;
      }
      const cred = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      );

      if (userData.name) {
        await updateProfile(cred.user, { displayName: userData.name });
      }

      let profileURL = "";
      try {
        profileURL = await uploadProfilePhoto(cred.user.uid, photoFile);
      } catch (upErr) {
        console.error(upErr);
        toast.error("Photo upload failed. You can update it later.");
      }

      const uid = cred.user.uid;

      const userDoc = {
        created_at: serverTimestamp(),
        email: userData.email,
        full_name: userData.name,
        id: uid,
        phone_number: userData.phone || "",
        profile_picture_url: profileURL,
        uid: uid,
        dob: userData.dob ? `${userData.dob}T00:00:00.000` : "",
      };
      console.log(userDoc);
      await setDoc(doc(db, "users", uid), userDoc);

      toast.success("Account created!");
      navigate(URL.INDEX ?? "/");
    } catch (err) {
      const msg = err?.code || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="min-h-screen ring-2 ring-gray-900/5 relative px-4 pt-6 pb-8 bg-bgLightColor  shadow-md shadow-shadowColor w-1/2 max-w-md mx-auto sm:px-6 rounded-2xl">
        <div className="font-semibold text-2xl leading-5 tracking-[-0.01em]  text-textPrimaryColor pb-2">
          Welcome to PunchPad
        </div>
        <div className="text-sm text-textPlaceholderColor pb-4">
          Create your account to start earning amazing rewards with every
          Punchpad product purchase.
        </div>
        <form autoComplete="on" onSubmit={onContinue}>
          <label className="block pb-1 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            required
            onChange={handleChange}
            onKeyDown={(e) => {
              if (/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
              if (e.key === " " && e.currentTarget.selectionStart === 0) {
                e.preventDefault();
              }
            }}
            value={userData.name}
            placeholder="John Doe"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Email Address
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
            value={userData.email}
            placeholder="you@example.com"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            pattern="^\+?[0-9]*$"
            minLength={10}
            onChange={(e) => {
              const num = e.target.value.replace(/[^0-9+]/g, "");
              setUserData((prev) => ({ ...prev, phone: num }));
            }}
            value={userData.phone}
            placeholder="+923000000000"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Date of Birth
          </label>
          <input
            name="dob"
            type="date"
            onChange={handleChange}
            value={userData.dob}
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Create Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            value={userData.password}
            placeholder="Password"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            value={userData.confirmPassword}
            placeholder="Confirm Password"
            className="w-full h-12 px-4 pb-0.5 text-start rounded-full border border-borderColor text-textPrimaryColor placeholder-textPlaceholderColor focus:border-focusBorderColor focus:ring-2 focus:ring-focusBorderColor/15 outline-none transition"
          />

          <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
            Add Profile Picture
          </label>

          <div className="mb-6">
            {!photoPreview && (
              <label
                htmlFor="photo"
                className="w-full h-28 rounded-xl border border-borderColor bg-bgLightColor hover:bg-mainLightBgColor transition border-dashed cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <svg
                  className="w-6 h-6 text-textPrimaryColor mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12"
                  />
                </svg>
                <span className="text-base text-textPrimaryColor font-medium">
                  Upload Image
                </span>
                <span className="text-sm font-normal text-textPlaceholderColor mt-1">
                  Maximum file 10MB
                </span>
              </label>
            )}

            {photoPreview && (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="profile preview"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-textPrimaryColor text-textPrimaryLightColor flex items-center justify-center text-xs shadow-custom"
                  aria-label="Remove photo"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            )}

            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
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
                {loading ? "Creating..." : "Signup"}
              </button>
            )}
          </div>
          <div className="text-center mt-3">
            <span className="text-sm text-textPlaceholderColor">
              Already have an account?
            </span>
            <NavLink
              to={URL.LOGIN}
              className="text-sm font-semibold text-mainColor hover:text-mainDarkColor "
            >
              {" Login"}
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
