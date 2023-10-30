"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getApps, initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from "uuid";

const db = getFirestore();

export type ListType = {
  id: string;
  title: string;
  completed?: boolean;
  items: {
    title: string;
    subItems: { title: string }[];
    completed: boolean;
  }[];
};

const TodoApp = () => {
  const [lists, setLists] = useState<ListType[]>([]);
  const [newSubItemTitle, setNewSubItemTitle] = useState("");
  const [newSubItemTitles, setNewSubItemTitles] = useState<string[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<boolean[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [warningVisible, setWarningVisible] = useState(false);
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    console.log("Current lists:", lists);
  }, [lists]);

  useEffect(() => {
    const fetchLists = async () => {
      if (username && username.trim() !== "") {
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("User data:", docSnap.data());
          const fetchedLists = docSnap.data().lists;
          console.log("Fetched lists from Firestore:", fetchedLists);
          setLists(fetchedLists);
        } else {
          console.log("No data found for this user in Firestore.");
          setLists([]);
        }
      }
    };

    fetchLists();
  }, [username]);

  useEffect(() => {
    if (lists) {
      setExpandedTasks(lists.map(() => false));
    }
  }, [lists]);

  useEffect(() => {
    if (lists) {
      setNewSubItemTitles(lists.map(() => ""));
    }
  }, [lists]);

  const createList = async () => {
    if (username.trim() === "") {
      console.error("Please, login to add tasks");
      return;
    }
    if (newListTitle.trim() !== "") {
      const newList = {
        id: uuidv4(),
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
      setExpandedTasks([...expandedTasks]);
      setNewItemTitle("");

      // Save lists to Firestore
      if (username.trim() !== "") {
        await setDoc(doc(db, "users", username), { lists: updatedLists });
      } else {
        console.error("Username is empty, cannot save to Firestore");
      }
    }
  };

  const createSubItem = async (
    listId: string,
    itemIndex: number,
    newSubItemTitle: string
  ) => {
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
      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          const updatedItems = [...list.items];
          updatedItems[itemIndex].subItems.push(newSubItem);
          return { ...list, items: updatedItems };
        }
        return list;
      });
      setLists(updatedLists);
      setExpandedTasks([...expandedTasks]);
      setNewSubItemTitle("");

      // Reset the corresponding newSubItemTitle
      const listIndex = lists.findIndex((list) => list.id === listId);
      const updatedSubItemTitles = [...newSubItemTitles];
      updatedSubItemTitles[listIndex] = "";
      setNewSubItemTitles(updatedSubItemTitles);

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

  const markAsCompleted = async (id: string) => {
    const updatedLists = lists.map((list) =>
      list.id === id ? { ...list, completed: true } : list
    );
    console.log(`List with id ${id} marked as completed`);
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
            lists={lists}
          />
          <button
            className="px-3 ml-1 py-1 bg-red-700 rounded hover:bg-red-600"
            onClick={() => setLists([])}
          >
            Reset
          </button>
          <button
            className="px-3 ml-1 py-1 bg-green-700 rounded hover:bg-green-600"
            onClick={async () => {
              if (username.trim() !== "") {
                await setDoc(doc(db, "users", username), { lists });
                console.log("Lists saved to Firestore:", lists);
              } else {
                console.error("Username is empty, cannot save to Firestore");
              }
            }}
          >
            Save
          </button>
        </div>
      </nav>
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="bg-white w-full md:w-1/4 p-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Create a To-Do Item
          </h2>
          {username ? (
            <form
              onSubmit={(e) => {
                e.stopPropagation();
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
        <div className="w-full md:w-3/4 p-4">
          {lists &&
            lists
              .filter((list) => !list.completed)
              .map((list, listIndex) => (
                <div
                  key={list.id}
                  className="bg-white rounded shadow p-4 mb-4"
                  style={{ cursor: "pointer" }}
                  onMouseDown={(e) => {
                    if (e.currentTarget === e.target) {
                      handleTaskClick(listIndex);
                    }
                  }}
                >
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">
                    <button
                      className="rounded border-blue-600 border-2 px-2 mx-2 hover:bg-blue-100 focus:bg-blue-200"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleTaskClick(listIndex);
                      }}
                    >
                      {expandedTasks[listIndex] ? "v" : ">"}
                    </button>
                    {list.title}
                    <button
                      className="ml-2 text-red-500"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        deleteList(listIndex);
                      }}
                    >
                      Delete
                    </button>
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-500 ml-2"
                      onClick={(e) => {
                        markAsCompleted(list.id);
                      }}
                    />
                  </h2>
                  {expandedTasks[listIndex] && (
                    <div className="mb-2">
                      {username ? (
                        <form
                          onSubmit={(e) => {
                            e.stopPropagation();
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
                        <p className="text-red-500">
                          Please, login to add tasks
                        </p>
                      )}
                    </div>
                  )}
                  {expandedTasks[listIndex] && (
                    <ul>
                      {list.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="mb-2 text-blue-600">
                          {item.title}
                          <button
                            className="ml-2 text-red-500"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              deleteItem(listIndex, itemIndex);
                            }}
                          >
                            Delete
                          </button>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              createSubItem(
                                list.id,
                                itemIndex,
                                newSubItemTitles[listIndex]
                              );
                            }}
                          >
                            <input
                              className="w-1/2 border p-1 rounded mb-2 mr-3 text-blue-600"
                              type="text"
                              value={newSubItemTitles[listIndex]}
                              onChange={(e) => {
                                const updatedSubItemTitles = [
                                  ...newSubItemTitles,
                                ];
                                updatedSubItemTitles[listIndex] =
                                  e.target.value;
                                setNewSubItemTitles(updatedSubItemTitles);
                              }}
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
                              {subItem.title}
                              <button
                                className="ml-2 text-red-500"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  deleteSubItem(
                                    listIndex,
                                    itemIndex,
                                    subItemIndex
                                  );
                                }}
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
        <div className="w-full md:w-1/4 p-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Completed To-Do Items
          </h2>
          {lists &&
            lists
              .filter((list) => list.completed)
              .map((list) => (
                <div
                  key={list.id}
                  className="bg-white rounded shadow p-4 mb-4"
                  style={{ cursor: "pointer", opacity: 0.5 }}
                >
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">
                    {list.title}
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-500 ml-2"
                      checked
                      readOnly
                    />
                  </h2>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
