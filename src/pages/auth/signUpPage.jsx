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

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setPhotoFile(file);
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
        profile_picture_url: profileURL || "",
        uid: uid,
        dob: userData.dob ? `${userData.dob}T00:00:00.000` : "",
      };
      console.log(userDoc);
      await setDoc(doc(db, "users", uid), userDoc);

      toast.success("Account created!");
      navigate(URL.INDEX ?? "/");
    } catch (err) {
      console.error(err);
      const msg = err?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bgColor py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
      <div className="border relative px-4 pt-7 pb-8 bg-bgLightColor border-mainColor shadow-md shadow-shadowColor w-11/12 sm:w-3/4 md:w-2/3 max-w-md mx-auto sm:px-10 rounded-md">
        <form autoComplete="on" onSubmit={onContinue}>
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-borderColor overflow-hidden bg-mainLightColor">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt=""
                  className="object-cover w-full h-full"
                />
              ) : (
                <></>
              )}
            </div>
            <label
              htmlFor="photo"
              className="mt-3 px-4  rounded-md  text-textPrimaryColor text-sm  cursor-pointer "
            >
              {photoPreview ? "Change" : "Pick Profile"}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>

          <label className="block pb-1 text-textPrimaryColor">Name</label>
          <input
            name="name"
            type="text"
            required
            onChange={handleChange}
            value={userData.name}
            placeholder="John Doe"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />

          <label className="block pb-1 text-textPrimaryColor">Email</label>
          <input
            name="email"
            type="email"
            required
            onChange={handleChange}
            value={userData.email}
            placeholder="you@example.com"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />

          <label className="block pb-1 text-textPrimaryColor">Phone</label>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            pattern="^\+?[0-9]*$"
            onChange={(e) => {
              const num = e.target.value.replace(/[^0-9+]/g, "");
              setUserData((prev) => ({ ...prev, phone: num }));
            }}
            value={userData.phone}
            placeholder="+923000000000"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />

          <label className="block pb-1 text-textPrimaryColor">
            Date of Birth
          </label>
          <input
            name="dob"
            type="date"
            onChange={handleChange}
            value={userData.dob}
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />

          <label className="block pb-1 text-textPrimaryColor">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            onChange={handleChange}
            value={userData.password}
            placeholder="Password"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-5 rounded-md text-textPrimaryColor"
          />

          <label className="block pb-1 text-textPrimaryColor">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            onChange={handleChange}
            value={userData.confirmPassword}
            placeholder="Confirm Password"
            className="border border-borderColor focus:border-focusBorderColor focus:ring-1 focus:ring-focusBorderColor w-full h-10 px-3 mb-3 rounded-md text-textPrimaryColor"
          />

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className="mt-5 bg-mainColor hover:bg-mainDarkBgColor text-textPrimaryLightColor uppercase text-sm font-semibold px-14 py-3 rounded disabled:opacity-60"
            >
              {loading ? "Creating..." : "Signup"}
            </button>

            <NavLink
              to={URL.LOGIN}
              className="mt-5 text-hintTextColor hover:text-mainColor uppercase text-sm font-semibold"
            >
              Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
