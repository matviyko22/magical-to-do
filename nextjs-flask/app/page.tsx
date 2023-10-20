"use client";

import React, { useState } from 'react';

type ListType = {
  title: string;
  items: { title: string; subItems: any[] }[];
};

const TodoApp = () => {
  const [lists, setLists] = useState<ListType[]>([]);
  const [activeList, setActiveList] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [warningVisible, setWarningVisible] = useState(false);

  const createList = () => {
    if (newListTitle.trim() !== '') {
      const newList = {
        title: newListTitle,
        items: [],
      };
      setLists([...lists, newList]);
      setNewListTitle('');
    }
  };

  const deleteList = (index: number) => {
    const updatedLists = [...lists];
    updatedLists.splice(index, 1);
    setLists(updatedLists);
  };

  const createItem = (listIndex: number) => {
    if (newItemTitle.trim() !== '') {
      const newItem = {
        title: newItemTitle,
        subItems: [],
      };
      const updatedLists = [...lists];
      updatedLists[listIndex].items.push(newItem);
      setLists(updatedLists);
      setNewItemTitle('');
    }
  };

  const deleteItem = (listIndex: number, itemIndex: number) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].items.splice(itemIndex, 1);
    setLists(updatedLists);
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <nav className="bg-blue-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Magical To-Do</h1>
          <button className="px-3 py-1 bg-red-700 rounded hover:bg-red-600" onClick={() => setLists([])}>
            Reset
          </button>
        </div>
      </nav>
      <div className="flex flex-1">
        <div className="bg-white w-1/4 p-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Create a To-Do Item</h2>
          <input
            type="text"
            placeholder="To-Do Name"
            className="w-full border p-2 rounded mb-2 text-blue-600"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (newListTitle.trim() === '') {
                setWarningVisible(true);
              } else {
                createList();
                setWarningVisible(false);
              }
            }}
          >
            Create
          </button>
          {warningVisible && (
            <p className="text-red-500">Please enter a name for the To-Do list.</p>
          )}
        </div>
        <div className="w-3/4 p-4">
          {lists.map((list, listIndex) => (
            <div key={listIndex} className="bg-white rounded shadow p-4 mb-4">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                {list.title}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => deleteList(listIndex)}
                >
                  Delete
                </button>
              </h2>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Item Title"
                  className="w-full border p-2 rounded mb-2 text-blue-600"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => createItem(listIndex)}
                >
                  Add Item
                </button>
              </div>
              <ul>
                {list.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="mb-2">
                    {item.title}
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => deleteItem(listIndex, itemIndex)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
