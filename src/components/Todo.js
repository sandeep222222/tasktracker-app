import React, { useState, useEffect } from "react";

// import TodoForm from "./TodoForm";
// import TodoList from "./TodoList";

const Todo = () => {
  const [showForm, setshowform] = useState(false);
  const [showNew, setshowNew] = useState(true);
  const [showDelete, setshowDelete] = useState(true);
  const [toggleSubmit, settoggleSubmit] = useState(true);
  const [isEditItem, setisEditItem] = useState(null);
  const [showList, setshowList] = useState(true);
  const [editMessage, seteditMessage] = useState(false);
  const [deleteMessage, setdeleteMessage] = useState(false);
  const [inputTitle, setinputTitle] = useState("");
  const [inputDesc, setinputDesc] = useState("");
  const [filterCompleted, setFilterCompleted] = useState("all");
  const [items, setitems] = useState(() => {
    const storedItems = localStorage.getItem("todoItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const loadDataFromLocalStorage = () => {
    const storedItems = localStorage.getItem("todoItems");
    if (storedItems) {
      setitems(JSON.parse(storedItems));
    }
  };

  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem("todoItems", JSON.stringify(items));
  }, [items]);

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
  };

  const handleInput = (e) => {
    setinputTitle(e.target.value);
  };

  const handleInputdesc = (e) => {
    setinputDesc(e.target.value);
  };


  const handleSubmit = (e) => {
    setshowList(true);
    setshowNew(true);
    e.preventDefault();
    if (!inputTitle || !inputDesc) {
      alert("Fill in the data");
      setshowList(false);
    } else if (inputTitle && !toggleSubmit) {
      setitems((prevItems) =>
        prevItems.map((elem) => {
          if (elem.id === isEditItem) {
            return { ...elem, name: inputTitle, desc: inputDesc };
          }
          return elem;
        })
      );
      setinputTitle("");
      setinputDesc("");
      settoggleSubmit(true);
      setshowform(false);
      setshowDelete(true);
      seteditMessage(true);
      setTimeout(() => {
        seteditMessage(false);
      }, 2000);
    } else {
      const newItem = {
        id: new Date().getTime().toString(),
        name: inputTitle,
        desc: inputDesc,
        createdAt: getCurrentDateTime(),
        completed: false,
      };
      setitems((prevItems) => [newItem, ...prevItems]);
      setinputTitle("");
      setinputDesc("");
      setshowform(false);
    }
  };

  const handleDelete = (id) => {
    const updatedItems = items.filter((elem) => elem.id !== id);
    setdeleteMessage(true);
    setTimeout(() => {
      setitems(updatedItems);
      setdeleteMessage(false);
    }, 2000);
  };

  const handleEdit = (id) => {
    setshowList(false);
    setshowDelete(false);
    setshowNew(false);
    setshowform(true);
    settoggleSubmit(false);

    const editItem = items.find((elem) => elem.id === id);
    setinputTitle(editItem.name);
    setinputDesc(editItem.desc);
    setisEditItem(id);
  };

  const handleAdd = () => {
    setshowform(true);
    setshowList(true);
    setshowNew(false);
  };

  const handleCompleteToggle = (id) => {
    setitems((prevItems) =>
      prevItems.map((elem) =>
        elem.id === id ? { ...elem, completed: !elem.completed } : elem
      )
    );
  };

  const handleMoveUp = (id) => {
    const currentIndex = items.findIndex((elem) => elem.id === id);
    if (currentIndex > 0) {
      const updatedItems = [...items];
      [updatedItems[currentIndex], updatedItems[currentIndex - 1]] = [
        updatedItems[currentIndex - 1],
        updatedItems[currentIndex],
      ];
      setitems(updatedItems);
    }
  };

  const handleMoveDown = (id) => {
    const currentIndex = items.findIndex((elem) => elem.id === id);
    if (currentIndex < items.length - 1) {
      const updatedItems = [...items];
      [updatedItems[currentIndex], updatedItems[currentIndex + 1]] = [
        updatedItems[currentIndex + 1],
        updatedItems[currentIndex],
      ];
      setitems(updatedItems);
    }
  };

  const handleFilterChange = (filter) => {
    setFilterCompleted(filter);
  };

  const filteredItems = items.filter((elem) => {
    if (filterCompleted === "all") {
      return true;
    } else if (filterCompleted === "completed") {
      return elem.completed;
    } else if (filterCompleted === "incomplete") {
      return !elem.completed;
    }
    return true;
  });

  return (
    <>
      {showNew ? (
        <div className="container">
          <div className="col-12 text-end">
            <button className="btn btn-outline-primary " onClick={handleAdd}>
              + New Task
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {showForm ? (
        <>
          <div className="container border rounded d-flex justify-content-center shadow p-3 mb-5 bg-white ">
            <div className="row">
              <div className="text-center">
                <h2>{toggleSubmit ? "Add Task" : " Edit Task"}</h2>
              </div>
              <form className="col-12 p-2" onSubmit={handleSubmit}>
                <label htmlFor="title" className="my-2">
                  Enter Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  className="w-100 my-1 p-2"
                  onChange={handleInput}
                  value={inputTitle}
                />
                <label className="my-2" htmlFor="description">
                  Enter Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  className="w-100 my-1 p-2"
                  onChange={handleInputdesc}
                  value={inputDesc}
                />
                {toggleSubmit ? (
                  <button className="btn btn-outline-primary my-2">Save</button>
                ) : (
                  <button className="btn btn-outline-primary my-2">Update</button>
                )}
              </form>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {showList ? (
        <div className="container py-2 ">
          {deleteMessage ? (
            <p className="text-center text-danger">Item Deleted Successfully</p>
          ) : (
            ""
          )}
          {editMessage ? (
            <p className="text-center text-danger">Item Edited Successfully</p>
          ) : (
            ""
          )}
          <div className=" mb-3">
            <label className="form-label">Filter By Completion:</label>
            <select
              className="form-select"
              value={filterCompleted}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          {filteredItems.map((elem) => (
            <div
              className="border rounded shadow p-3 mb-3 bg-white "
              key={elem.id}
            >
              <div className="d-md-flex justify-content-between align-items-center">
                <div className="order-1">
                  <h4><strong>Title :</strong>  {elem.name}</h4>
                  <p><strong>Description :</strong> {elem.desc}</p>
                  <p><strong>Created At :</strong> {elem.createdAt}</p>
                </div>
                <div className="order-2">
                  <button
                    className={`btn ${
                      elem.completed ? "btn-outline-success" : "btn-outline-warning"
                    } m-2`}
                    onClick={() => handleCompleteToggle(elem.id)}
                  >
                    {elem.completed ? "Completed" : "Incomplete"}
                  </button>
                  {!elem.completed && (
                    <button
                      className="btn btn-outline-primary m-2"
                      onClick={() => handleEdit(elem.id)}
                    >
                      Edit
                    </button>
                  )}
                  {showDelete ? (
                    <button
                      className="btn btn-outline-danger m-2 "
                      onClick={() => handleDelete(elem.id)}
                    >
                      Delete
                    </button>
                  ) : (
                    ""
                  )}
                  <div
                    className="btn btn-outline-dark m-2 rounded"
                    onClick={() => handleMoveUp(elem.id)}
                  >
                    <i className="bi bi-arrow-bar-up"></i>
                  </div>
                  <div
                    className="btn btn-outline-dark m-2 rounded"
                    onClick={() => handleMoveDown(elem.id)}
                  >
                    <i className="bi bi-arrow-bar-down"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
    // <>
    //     {showNew && (
    //     <div className="container">
    //       <div className="col-12 text-end">
    //         <button className="btn btn-primary " onClick={handleAdd}>
    //           New Task
    //         </button>
    //       </div>
    //     </div>
    //   )}

    //   {/* Render TodoForm and TodoList components */}
    //   <TodoForm
    //     toggleSubmit={toggleSubmit}
    //     inputTitle={inputTitle}
    //     inputDesc={inputDesc}
    //     handleInput={handleInput}
    //     handleInputdesc={handleInputdesc}
    //     handleSubmit={handleSubmit}
    //   />
    //   <TodoList
    //     items={items}
    //     filterCompleted={filterCompleted}
    //     handleCompleteToggle={handleCompleteToggle}
    //     handleEdit={handleEdit}
    //     handleDelete={handleDelete}
    //     handleMoveUp={handleMoveUp}
    //     handleMoveDown={handleMoveDown}
    //   />
    // </>
  );
};

export default Todo;