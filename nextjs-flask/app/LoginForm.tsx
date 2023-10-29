// Importing necessary libraries and components
import React, { useState, useEffect } from "react";
// Importing Firebase authentication functions
import { signInWithPopup, signOut } from "firebase/auth";
// Importing Firebase authentication and Google provider configurations
import { auth, googleProvider } from "./firebase";
// Importing Firebase Firestore functions
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// Importing the ListType from page.tsx
import { ListType } from "./page";

// Initializing Firestore
const db = getFirestore();

// Defining the type for LoginForm props
type LoginFormProps = {
  username: string; // The username of the user
  setUsername: React.Dispatch<React.SetStateAction<string>>; // Function to set the username
  setLists: React.Dispatch<React.SetStateAction<ListType[]>>; // Function to set the lists
  lists: ListType[]; // The lists of the user
};

// LoginForm component
const LoginForm = ({ username, setUsername, setLists, lists }: LoginFormProps) => {
  // State for showing the login form
  const [showLogin, setShowLogin] = useState(false);
  // State for showing the greeting message
  const [showGreeting, setShowGreeting] = useState(false);
  // State for storing the tasks
  const [tasks, setTasks] = useState([]);

  // Function to handle login
  const handleLogin = async () => {
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      // Get the user from the result
      const user = result.user;
      // Set the username
      setUsername(user.displayName || "");
  
      // If the user exists and has a uid
      if (user && user.uid) {
        // Get the document reference from Firestore
        const docRef = doc(db, "users", user.uid);
        // Get the document snapshot
        const docSnap = await getDoc(docRef);
        // If the document exists
        if (docSnap.exists()) {
          // Log the user data
          console.log("User data:", docSnap.data());
          // Store the fetched data in a variable
          const fetchedLists = docSnap.data().lists;
          // Log the fetched data
          console.log("Fetched lists from Firestore:", fetchedLists);
          // Update the lists state with the fetched data
          setLists(fetchedLists);
        } else {
          // Log that no data was found for this user in Firestore
          console.log("No data found for this user in Firestore.");
          // Reset the lists state
          setLists([]);
        }
      }
  
      // Save lists to Firestore
      await setDoc(doc(db, "users", user.uid), { lists });
      // Log the saved data
      console.log("Lists saved to Firestore:", lists);
  
      // Hide the login form and show the greeting message
      setShowLogin(false);
      setShowGreeting(true);
    } catch (error) {
      // Log any errors
      console.log("Error in handleLogin:", error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Save lists to Firestore before logging out
      if (username.trim() !== "") {
        await setDoc(doc(db, "users", username), { lists });
        console.log("Lists saved to Firestore:", lists);
      } else {
        console.error("Username is empty, cannot save to Firestore");
      }
  
      // Sign out the user
      await signOut(auth);
      // Reset the username and lists state
      setUsername("");
      setLists([]); // Reset tasks
      console.log("Lists after logout:", []); 
      // Hide the greeting message
      setShowGreeting(false);
    } catch (error) {
      // Log any errors
      console.log(error);
    }
  };

  // Effect to hide the greeting message after a certain time
  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 1000); // Change this to your desired time in milliseconds
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  // Render the LoginForm component
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

// Export the LoginForm component
export default LoginForm;
