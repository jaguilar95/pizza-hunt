// create a variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

// this event will emit if the database version changes (does not exist to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;

  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// upon a success
request.onsuccess = function (event) {
  // when db is successfully created with its object store
  db = event.target.result;

  // check if app is online
  if (navigator.onLine) {
    // if yes, upload pizza to send local db data to mongo
    uploadPizza();
  }
};

request.onerror = function (event) {
  // log error
  console.log(event.target.errorCode);
};

// will execute if we attempt to submit a new pizza with no internet
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for 'new_pizza
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon a successful getAll(), run on success
  getAll.onsuccess = function () {
    // if there's data in indexedDb's store
    if (getAll.result.length > 0) {
      // send to api server
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");

          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");

          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizzas has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", uploadPizza);
