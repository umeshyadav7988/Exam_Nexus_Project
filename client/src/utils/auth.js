// Function to save JWT token in local storage
export function saveAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Function to get JWT token from local storage
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Function to remove JWT token from local storage
export function removeAuthToken() {
  localStorage.removeItem('authToken');
}

// Function to save user details in local storage
export function saveUserDetails(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Function to get user details from local storage
export function getUserDetails() {
  return JSON.parse(localStorage.getItem('user'));
}

// Function to remove user details from local storage
export function removeUserDetails() {
  localStorage.removeItem('user');
}