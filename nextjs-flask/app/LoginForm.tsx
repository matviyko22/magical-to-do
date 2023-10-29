import React, { useState, useEffect } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { ListType } from "./page";

const db = getFirestore();

type LoginFormProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setLists: React.Dispatch<React.SetStateAction<ListType[]>>;
  lists: ListType[];
};

const LoginForm = ({ username, setUsername, setLists, lists }: LoginFormProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUsername(user.displayName || "");
  
      if (user && user.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("User data:", docSnap.data());
          const fetchedLists = docSnap.data().lists; // Store the fetched data in a variable
          console.log("Fetched lists from Firestore:", fetchedLists); // Log the fetched data
          setLists(fetchedLists); // Update the lists state with the fetched data
        } else {
          console.log("No data found for this user in Firestore.");
          setLists([]);
        }
      }
  
      // Save lists to Firestore
      await setDoc(doc(db, "users", user.uid), { lists });
      console.log("Lists saved to Firestore:", lists); // Log the saved data
  
      setShowLogin(false);
      setShowGreeting(true);
    } catch (error) {
      // Handle error here
      console.log("Error in handleLogin:", error); // Log any errors
    }
  };

  const handleLogout = async () => {
    try {
      // Save lists to Firestore before logging out
      if (username.trim() !== "") {
        await setDoc(doc(db, "users", username), { lists });
        console.log("Lists saved to Firestore:", lists);
      } else {
        console.error("Username is empty, cannot save to Firestore");
      }
  
      await signOut(auth);
      setUsername("");
      setLists([]); // Reset tasks
      console.log("Lists after logout:", []); 
      setShowGreeting(false);
    } catch (error) {
      // Handle error here
      console.log(error);
    }
  };

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 1000); // Change this to your desired time in milliseconds
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  return (
    <>
      {username ? (
        <>
          <span className="px-3 py-1 text-white font-medium">
            Hi, {username}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-700 rounded hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-600 text-white"
        >
          Login with Google
        </button>
      )}
      {showGreeting && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 text-blue-600 rounded">Hi, {username}</div>
        </div>
      )}
      {showLogin && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <button onClick={() => setShowLogin(false)} className="float-right">
              X
            </button>
            <form onSubmit={handleLogin} className="flex flex-col">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-600 text-white"
              >
                Login with Google
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
