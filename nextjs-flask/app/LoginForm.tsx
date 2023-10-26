// LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from './firebase';

const LoginForm = () => {
  const [showLogin, setShowLogin] = useState(false); // State to control the visibility of the login form
  const [showGreeting, setShowGreeting] = useState(false); // State to control the visibility of the greeting
  const [username, setUsername] = useState(''); // State to store the user's name

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUsername(user.displayName||''); // Set the user's name
      setShowLogin(false); // Close the login form after successful login
      setShowGreeting(true); // Show the greeting
    } catch (error) {
      // Handle error here
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsername(''); // Clear the user's name
      setShowGreeting(false); // Hide the greeting
    } catch (error) {
      // Handle error here
    }
  };

  // Hide the greeting after 3 seconds
  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  return (
    <>
      {username ? (
        <>
        <span className="px-3 py-1 text-white font-medium">Hi, {username}</span>
        <button onClick={handleLogout} className="px-3 py-1 bg-red-700 rounded hover:bg-red-600 text-white">Logout</button>
        </>
      ) : (
        <button onClick={handleLogin} className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-600 text-white">Login with Google</button>
      )}
      {showGreeting && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            Hi, {username}
          </div>
        </div>
      )}
      {showLogin && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <button onClick={() => setShowLogin(false)} className="float-right">X</button>
            <form onSubmit={handleLogin} className="flex flex-col">
              <button type="submit" className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-600 text-white">Login with Google</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;