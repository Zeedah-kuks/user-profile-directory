const API_URL = "https://jsonplaceholder.typicode.com/users";

const userCards = document.getElementById("userCards");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const search = document.getElementById("search");
const filterCity = document.getElementById("filterCity");
const filterCompany = document.getElementById("filterCompany");
const darkModeBtn = document.getElementById("darkModeBtn");
const body = document.getElementById("body");

let users = [];

// Fetch users
async function fetchUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    users = await response.json();

    populateFilters(users);
    displayUsers(users);
  } catch (err) {
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

// Display users
function displayUsers(userList) {
  userCards.innerHTML = "";
  userList.forEach(user => {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition duration-300";

    card.innerHTML = `
      <h2 class="text-xl font-bold">${user.name}</h2>
      <p class="text-gray-300 dark:text-gray-300">@${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Company:</strong> ${user.company.name}</p>
      <p><strong>City:</strong> ${user.address.city}</p>
      <button class="mt-3 text-blue-600 hover:underline detailsBtn">View More</button>
      <div class="details hidden mt-3 text-sm text-gray-700 dark:text-gray-400">
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
      </div>
    `;

    const btn = card.querySelector(".detailsBtn");
    const details = card.querySelector(".details");
    btn.addEventListener("click", () => {
      details.classList.toggle("hidden");
      btn.textContent = details.classList.contains("hidden")
        ? "View More"
        : "Hide Details";
    });

    userCards.appendChild(card);
  });
}

// Populate filters
function populateFilters(users) {
  const cities = [...new Set(users.map(u => u.address.city))];
  const companies = [...new Set(users.map(u => u.company.name))];

  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    filterCity.appendChild(opt);
  });

  companies.forEach(company => {
    const opt = document.createElement("option");
    opt.value = company;
    opt.textContent = company;
    filterCompany.appendChild(opt);
  });
}

// Search & Filter
function applyFilters() {
  let filtered = users;

  const searchValue = search.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(
      u =>
        u.name.toLowerCase().includes(searchValue) ||
        u.username.toLowerCase().includes(searchValue)
    );
  }

  if (filterCity.value) {
    filtered = filtered.filter(u => u.address.city === filterCity.value);
  }

  if (filterCompany.value) {
    filtered = filtered.filter(u => u.company.name === filterCompany.value);
  }

  displayUsers(filtered);
}

search.addEventListener("input", applyFilters);
filterCity.addEventListener("change", applyFilters);
filterCompany.addEventListener("change", applyFilters);

// Dark mode toggle
darkModeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  body.classList.toggle("bg-gray-900");
  body.classList.toggle("text-white");
});

// Run
fetchUsers();
