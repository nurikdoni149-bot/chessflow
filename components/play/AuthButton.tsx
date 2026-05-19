"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
{user.photoURL ? (
  <img
    src={user.photoURL}
    alt="avatar"
    className="h-8 w-8 rounded-full"
  />
) : (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
    {user.displayName?.[0] ?? "U"}
  </div>
)}
  
        <p className="hidden text-sm text-white sm:block">
          {user.displayName}
        </p>
  
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black"
    >
      Login with Google
    </button>
  );
}