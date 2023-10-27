"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const db = getFirestore();

export type ListType = {
  title: string;
  items: {
    title: string;
    subItems: { title: string; completed: boolean }[];
    completed: boolean;
  }[];
};

const TodoApp = () => {
  const [lists, setLists] = useState<ListType[]>([]);
  const [newSubItemTitle, setNewSubItemTitle] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<boolean[]>([]);
  const [activeList, setActiveList] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [warningVisible, setWarningVisible] = useState(false);
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    console.log("Current lists:", lists);
  }, [lists]);

  useEffect(() => {
    fetch("http://127.0.0.1:5328/api/python")
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (lists) {
      setExpandedTasks(lists.map(() => false));
    }
  }, [lists]);

  const createList = async () => {
    if (username.trim() === "") {
      console.error("Please, login to add tasks");
      return;
    }
    if (newListTitle.trim() !== "") {
      const newList = {
        title: newListTitle,
        items: [],
      };
      const updatedLists = Array.isArray(lists)
        ? [...lists, newList]
        : [newList];
      setLists(updatedLists);
      setNewListTitle("");

      // Save lists to Firestore
      if (username.trim() !== "") {
        await setDoc(doc(db, "users", username), { lists: updatedLists });
      } else {
        console.error("Username is empty, cannot save to Firestore");
      }
    }
  };

  const deleteList = (index: number) => {
    const updatedLists = [...lists];
    updatedLists.splice(index, 1);
    setLists(updatedLists);
  };

  const createItem = async (listIndex: number) => {
    if (username.trim() === "") {
      console.error("Please, login to add tasks");
      return;
    }
    if (newItemTitle.trim() !== "") {
      const newItem = {
        title: newItemTitle,
        subItems: [],
        completed: false,
      };
      const updatedLists = [...lists];
      updatedLists[listIndex].items.push(newItem);
      setLists(updatedLists);
      setNewItemTitle("");

      // Save lists to Firestore
      if (username.trim() !== "") {
        await setDoc(doc(db, "users", username), { lists: updatedLists });
      } else {
        console.error("Username is empty, cannot save to Firestore");
      }
    }
  };

  const createSubItem = async (listIndex: number, itemIndex: number) => {
    if (username.trim() === "") {
      console.error("Please, login to add tasks");
      return;
    }
    if (newSubItemTitle.trim() !== "") {
      const newSubItem = {
        title: newSubItemTitle,
        completed: false,
        subItems: [],
      };
      const updatedLists = [...lists];
      updatedLists[listIndex].items[itemIndex].subItems.push(newSubItem);
      setLists(updatedLists);
      setNewSubItemTitle("");

      // Save lists to Firestore
      if (username.trim() !== "") {
        await setDoc(doc(db, "users", username), { lists: updatedLists });
      } else {
        console.error("Username is empty, cannot save to Firestore");
      }
    }
  };

  const handleTaskClick = (index: number) => {
    setExpandedTasks(
      expandedTasks.map((expanded, i) => (i === index ? !expanded : expanded))
    );
  };

  const deleteItem = (listIndex: number, itemIndex: number) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].items.splice(itemIndex, 1);
    setLists(updatedLists);
  };

  const deleteSubItem = (
    listIndex: number,
    itemIndex: number,
    subItemIndex: number
  ) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].items[itemIndex].subItems.splice(subItemIndex, 1);
    setLists(updatedLists);
  };

  const markAsCompleted = async (
    listIndex: number,
    itemIndex: number,
    subItemIndex?: number
  ) => {
    const updatedLists = [...lists];
    if (subItemIndex !== undefined) {
      updatedLists[listIndex].items[itemIndex].subItems[
        subItemIndex
      ].completed = true;
    } else {
      updatedLists[listIndex].items[itemIndex].completed = true;
    }
    setLists(updatedLists);

    // Save lists to Firestore
    if (username.trim() !== "") {
      await setDoc(doc(db, "users", username), { lists: updatedLists });
    } else {
      console.error("Username is empty, cannot save to Firestore");
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <nav className="bg-blue-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Magical To-Do</h1>
          <LoginForm
            username={username}
            setUsername={setUsername}
            setLists={setLists}
          />
          <button
            className="px-3 py-1 bg-red-700 rounded hover:bg-red-600"
            onClick={() => setLists([])}
          >
            Reset
          </button>
        </div>
      </nav>
      <div className="flex flex-1">
        <div className="bg-white w-1/4 p-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Create a To-Do Item
          </h2>
          {username ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newListTitle.trim() === "") {
                  setWarningVisible(true);
                } else {
                  createList();
                  setWarningVisible(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="To-Do Name"
                className="w-full border p-2 rounded mb-2 text-blue-600"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                type="submit"
              >
                Create
              </button>
            </form>
          ) : (
            <p className="text-red-500">Please, login to add tasks</p>
          )}
          {warningVisible && (
            <p className="text-red-500">
              Please enter a name for the To-Do list.
            </p>
          )}
        </div>
        <div className="w-3/4 p-4">
          {lists &&
            lists.map((list, listIndex) => (
              <div
                key={listIndex}
                className="bg-white rounded shadow p-4 mb-4"
                style={{ cursor: "pointer" }}
              >
                <h2
                  className="text-lg font-semibold text-blue-700 mb-2"
                  onClick={() => handleTaskClick(listIndex)}
                >
                  {expandedTasks[listIndex] ? "v" : ">"} {list.title}
                  <button
                    className="ml-2 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(listIndex);
                    }}
                  >
                    Delete
                  </button>
                </h2>
                {expandedTasks[listIndex] && (
                  <div className="mb-2">
                    {username ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (newItemTitle.trim() !== "") {
                            createItem(listIndex);
                            setNewItemTitle("");
                          }
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Item Title"
                          className="w-full border p-2 rounded mb-2 text-blue-600"
                          value={newItemTitle}
                          onChange={(e) => setNewItemTitle(e.target.value)}
                        />
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          type="submit"
                        >
                          Add Item
                        </button>
                      </form>
                    ) : (
                      <p className="text-red-500">Please, login to add tasks</p>
                    )}
                  </div>
                )}
                {expandedTasks[listIndex] && (
                  <ul>
                    {list.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-2 text-blue-600">
                        <input type="checkbox" className="form-checkbox text-blue-500 border-blue-600 border-2" style={{backgroundColor: item.completed ? 'blue' : 'white'}} onClick={() => markAsCompleted(listIndex, itemIndex)} />
                        {item.title}
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => deleteItem(listIndex, itemIndex)}
                        >
                          Delete
                        </button>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            createSubItem(listIndex, itemIndex);
                          }}
                        >
                          <input
                            className="w-1/2 border p-1 rounded mb-2 mr-3 text-blue-600"
                            type="text"
                            value={newSubItemTitle}
                            onChange={(e) => setNewSubItemTitle(e.target.value)}
                          />
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            type="submit"
                          >
                            Add Sub-Item
                          </button>
                        </form>
                        {item.subItems.map((subItem, subItemIndex) => (
                          <div
                            key={subItemIndex}
                            className="ml-4 mb-2 text-blue-600"
                          >
                            <input type="checkbox" className="form-checkbox text-blue-500" style={{backgroundColor: subItem.completed ? 'blue' : 'white'}} onClick={() => markAsCompleted(listIndex, itemIndex, subItemIndex)} />
                            {subItem.title}
                            <button
                              className="ml-2 text-red-500"
                              onClick={() =>
                                deleteSubItem(
                                  listIndex,
                                  itemIndex,
                                  subItemIndex
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
