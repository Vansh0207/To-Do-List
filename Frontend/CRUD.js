// frontend/CRUD.js
const input = document.getElementById("item-input");
const form = document.querySelector(".add_item");
const ul = document.querySelector("ul");

// --- New: Get references to new input elements ---
const descriptionInput = document.getElementById("item-description");
const estimatedTimeInput = document.getElementById("item-estimated-time");
const completedInput = document.getElementById("item-completed");

// Get references to feedback elements
const loadingIndicator = document.getElementById("loading-indicator");
const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

// --- New: Get references to authentication elements ---
const authSection = document.getElementById("auth-section");
const crudSection = document.getElementById("crud-section"); // The main CRUD content wrapper
const registerContainer = document.getElementById("register-container");
const loginContainer = document.getElementById("login-container");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const showLoginLink = document.getElementById("show-login");
const showRegisterLink = document.getElementById("show-register");

const header = document.querySelector("header"); // To add logout button

// Define your API URL. This MUST match the port your backend is running on (5000).
const API_URL = "http://localhost:5000/api/items";
// Define your AUTH API URL for user registration and login
const AUTH_API_URL = "http://localhost:5000/api/users";

let items = []; // This array will now hold items fetched from the backend

// --- New: User State Variables ---
let currentUser = null; // Stores logged-in user data
let userToken = null; // Stores the JWT token

// Initial check for authenticated user when the page loads
document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  // Attempt to get token from localStorage
  userToken = localStorage.getItem("userToken");

  if (userToken) {
    // If token exists, try to get user data (to verify token validity)
    try {
      const response = await fetch(`${AUTH_API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.ok) {
        currentUser = await response.json();
        console.log("User logged in:", currentUser);
        renderApp(); // Show CRUD section
        fetchItems(); // Fetch items for the logged-in user
      } else {
        // Token invalid or expired, clear it
        console.log("Token invalid or expired. Logging out.");
        logoutUser();
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      logoutUser();
    }
  } else {
    renderApp(); // Show auth section by default
  }
}

// --- New: Function to manage app sections visibility ---
function renderApp() {
  if (userToken && currentUser) {
    authSection.classList.add("hidden");
    crudSection.classList.remove("hidden");
    addLogoutButton(); // Add logout button to header
    showMessage(successMessage, `Welcome, ${currentUser.name}!`, 3000);
  } else {
    authSection.classList.remove("hidden");
    crudSection.classList.add("hidden");
    removeLogoutButton(); // Ensure logout button is not there
  }
}

// --- New: Helper functions for feedback (same as before) ---

function showLoading() {
  loadingIndicator.classList.remove("hidden");
  hideMessage(successMessage);
  hideMessage(errorMessage);
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

function showMessage(element, message, duration = 5000) {
  // Duration from previous step
  element.textContent = message;
  element.classList.remove("hidden");
  void element.offsetWidth; // Trigger reflow
  element.classList.remove("fading");
  element.classList.add("fading");

  setTimeout(() => {
    hideMessage(element);
  }, duration);
}

function hideMessage(element) {
  element.classList.add("hidden");
  element.classList.remove("fading");
}

// --- New: Logout button handling ---
function addLogoutButton() {
  if (!document.getElementById("logout-btn")) {
    // Prevent adding multiple buttons
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.textContent = "Logout";
    logoutBtn.addEventListener("click", logoutUser);
    header.appendChild(logoutBtn);
  }
}

function removeLogoutButton() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.remove();
  }
}

// --- New: User Authentication Functions ---

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  hideMessage(errorMessage);
});

showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
  hideMessage(errorMessage);
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoading();
  hideMessage(errorMessage);

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const password2 = document.getElementById("register-password2").value;

  if (password !== password2) {
    showMessage(errorMessage, "Passwords do not match.", 3000);
    hideLoading();
    return;
  }
  if (password.length < 6) {
    // Basic frontend validation matching backend schema
    showMessage(errorMessage, "Password must be at least 6 characters.", 3000);
    hideLoading();
    return;
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    localStorage.setItem("userToken", data.token); // Store the token
    userToken = data.token;
    currentUser = data; // Store user info
    showMessage(
      successMessage,
      `Registration successful! Welcome, ${data.name}!`
    );

    // Clear forms
    registerForm.reset();
    loginForm.reset(); // Clear login form too

    renderApp(); // Update UI to show CRUD section
    fetchItems(); // Fetch items for the new user (initially empty)
  } catch (error) {
    console.error("Registration Error:", error);
    showMessage(errorMessage, `Registration failed: ${error.message}`);
  } finally {
    hideLoading();
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoading();
  hideMessage(errorMessage);

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("userToken", data.token); // Store the token
    userToken = data.token;
    currentUser = data; // Store user info
    showMessage(
      successMessage,
      `Login successful! Welcome back, ${data.name}!`
    );

    // Clear forms
    registerForm.reset();
    loginForm.reset();

    renderApp(); // Update UI to show CRUD section
    fetchItems(); // Fetch items for the logged-in user
  } catch (error) {
    console.error("Login Error:", error);
    showMessage(errorMessage, `Login failed: ${error.message}`);
  } finally {
    hideLoading();
  }
});

function logoutUser() {
  localStorage.removeItem("userToken"); // Clear token
  userToken = null;
  currentUser = null;
  showMessage(successMessage, "You have been logged out.");
  renderApp(); // Show auth section again
  ul.innerHTML = ""; // Clear displayed items
}

// --- Modified: Helper function to get auth headers for protected requests ---
function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`, // Add the JWT token
  };
}

// --- Modified: CRUD Operations to use Authentication ---

async function fetchItems() {
  if (!userToken) {
    // Don't fetch if not logged in
    items = [];
    renderItems();
    return;
  }
  showLoading();
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(), // Include auth header for GET
    });
    if (!response.ok) {
      let errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        errorText = errorData.message || errorText;
      } catch (e) {}
      // If it's a 401/403, might be an expired token
      if (response.status === 401 || response.status === 403) {
        showMessage(
          errorMessage,
          "Session expired or not authorized. Please log in again.",
          5000
        );
        logoutUser();
      }
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    const itemsData = await response.json();
    items = itemsData;
    renderItems();
  } catch (error) {
    console.error("Error fetching items:", error);
    if (error.message.includes("Failed to fetch")) {
      // Network error
      showMessage(
        errorMessage,
        "Network error. Please check your connection or server status.",
        5000
      );
    } else {
      showMessage(errorMessage, `Failed to load items: ${error.message}`);
    }
  } finally {
    hideLoading();
  }
}

function renderItems() {
  ul.innerHTML = "";

  // CRITICAL FIX: Ensure 'items' is a valid array before proceeding
  if (!Array.isArray(items) || items.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No tasks yet. Add one!";
    ul.appendChild(emptyLi);
    return;
  }

  if (items.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No tasks yet. Add one!";
    ul.appendChild(emptyLi);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details");

    const taskName = document.createElement("span");
    taskName.classList.add("task-name");
    taskName.textContent = item.name;
    taskDetails.appendChild(taskName);

    if (item.description) {
      const taskDescription = document.createElement("p");
      taskDescription.classList.add("task-description");
      taskDescription.textContent = item.description;
      taskDetails.appendChild(taskDescription);
    }

    if (item.estimatedTime > 0) {
      const taskTime = document.createElement("span");
      taskTime.classList.add("task-time");
      taskTime.textContent = `${item.estimatedTime} mins`;
      taskDetails.appendChild(taskTime);
    }

    const completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    completedCheckbox.className = "task-completed-checkbox";
    completedCheckbox.checked = item.completed;

    completedCheckbox.addEventListener("change", async () => {
      showLoading();
      hideMessage(errorMessage);

      const itemId = item._id;
      const updatedCompletedStatus = completedCheckbox.checked;
      const updateData = { completed: updatedCompletedStatus };

      try {
        const response = await fetch(`${API_URL}/${itemId}`, {
          method: "PUT",
          headers: getAuthHeaders(), // Include auth header for PUT
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          let errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            errorText = errorData.message || errorText;
          } catch (e) {}
          if (response.status === 401 || response.status === 403) {
            showMessage(
              errorMessage,
              "Session expired or not authorized. Please log in again.",
              5000
            );
            logoutUser();
          }
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const updatedItem = await response.json();
        console.log("Item completed status updated:", updatedItem);
        showMessage(
          successMessage,
          `Task "${updatedItem.name}" marked as ${
            updatedItem.completed ? "completed" : "not completed"
          }!`
        );
        // Directly update the class on the li without re-fetching all items
        if (updatedItem.completed) {
          li.classList.add("completed-task");
        } else {
          li.classList.remove("completed-task");
        }
      } catch (error) {
        console.error("Error updating completion status:", error);
        showMessage(
          errorMessage,
          `Failed to update completion status: ${error.message}`
        );
        // Revert checkbox state if update fails
        completedCheckbox.checked = !updatedCompletedStatus;
      } finally {
        hideLoading();
      }
    });

    if (item.completed) {
      li.classList.add("completed-task");
    } else {
      li.classList.remove("completed-task");
    }

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("button-group");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    buttonGroup.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(completedCheckbox);
    li.appendChild(taskDetails);
    li.appendChild(buttonGroup);

    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(
        `Are you sure you want to delete "${item.name}"?`
      );
      if (!confirmDelete) return;

      showLoading();
      hideMessage(errorMessage);

      const itemId = item._id;
      try {
        const response = await fetch(`${API_URL}/${itemId}`, {
          method: "DELETE",
          headers: getAuthHeaders(), // Include auth header for DELETE
        });

        if (!response.ok) {
          let errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            errorText = errorData.message || errorText;
          } catch (e) {}
          if (response.status === 401 || response.status === 403) {
            showMessage(
              errorMessage,
              "Session expired or not authorized. Please log in again.",
              5000
            );
            logoutUser();
          }
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        console.log("Item deleted:", itemId);
        showMessage(successMessage, `"${item.name}" deleted successfully!`);
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        showMessage(errorMessage, `Failed to delete item: ${error.message}`);
      } finally {
        hideLoading();
      }
    });

    editBtn.addEventListener("click", async () => {
      // Prompt for new values
      const newName = prompt("Edit Task Name:", item.name);
      const newDescription = prompt(
        "Edit Description:",
        item.description || ""
      );
      const newEstimatedTime = prompt(
        "Edit Estimated Time (minutes):",
        item.estimatedTime || 0
      );

      // Basic validation for prompts
      if (newName === null || newName.trim() === "") {
        showMessage(errorMessage, "Task name cannot be empty.", 2000);
        return;
      }
      if (
        newEstimatedTime === null ||
        isNaN(parseInt(newEstimatedTime)) ||
        parseInt(newEstimatedTime) < 0
      ) {
        showMessage(
          errorMessage,
          "Estimated time must be a non-negative number.",
          2000
        );
        return;
      }

      showLoading();
      hideMessage(errorMessage);

      const itemId = item._id;
      const updatedItemData = {
        name: newName.trim(),
        description: newDescription !== null ? newDescription.trim() : "",
        estimatedTime: parseInt(newEstimatedTime),
        // 'completed' status is updated via its dedicated checkbox, not via prompt edit
      };

      try {
        const response = await fetch(`${API_URL}/${itemId}`, {
          method: "PUT",
          headers: getAuthHeaders(), // Include auth header for PUT
          body: JSON.stringify(updatedItemData),
        });

        if (!response.ok) {
          let errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            errorText = errorData.message || errorText;
          } catch (e) {}
          if (response.status === 401 || response.status === 403) {
            showMessage(
              errorMessage,
              "Session expired or not authorized. Please log in again.",
              5000
            );
            logoutUser();
          }
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const updatedItem = await response.json();
        console.log("Item updated:", updatedItem);
        showMessage(
          successMessage,
          `"${updatedItem.name}" updated successfully!`
        );
        fetchItems();
      } catch (error) {
        console.error("Error updating item:", error);
        showMessage(errorMessage, `Failed to update item: ${error.message}`);
      } finally {
        hideLoading();
      }
    });

    ul.appendChild(li);
  });
}

// Event listener for adding new items (CREATE operation)
form.addEventListener("submit", async (x) => {
  x.preventDefault();

  const nameValue = input.value.trim();
  const descriptionValue = descriptionInput.value.trim();
  const estimatedTimeValue = parseInt(estimatedTimeInput.value);
  const completedValue = completedInput.checked;

  // Frontend validation for new fields
  if (!nameValue) {
    showMessage(errorMessage, "Please enter a task name.", 2000);
    return;
  }
  if (isNaN(estimatedTimeValue) || estimatedTimeValue < 0) {
    showMessage(
      errorMessage,
      "Estimated time must be a non-negative number.",
      2000
    );
    return;
  }

  showLoading();
  hideMessage(errorMessage);

  const newItem = {
    name: nameValue,
    description: descriptionValue,
    estimatedTime: estimatedTimeValue,
    completed: completedValue,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(), // Include auth header for POST
      body: JSON.stringify(newItem),
    });

    if (!response.ok) {
      let errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        errorText = errorData.message || errorText;
      } catch (e) {}
      if (response.status === 401 || response.status === 403) {
        showMessage(
          errorMessage,
          "Session expired or not authorized. Please log in again.",
          5000
        );
        logoutUser();
      }
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const addedItem = await response.json();
    console.log("Item added:", addedItem);
    input.value = "";
    descriptionInput.value = "";
    estimatedTimeInput.value = "";
    completedInput.checked = false;

    showMessage(successMessage, `"${addedItem.name}" added successfully!`);
    fetchItems();
  } catch (error) {
    console.error("Error adding item:", error);
    showMessage(errorMessage, `Failed to add task: ${error.message}`);
  } finally {
    hideLoading();
  }
});
