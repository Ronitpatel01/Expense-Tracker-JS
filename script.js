// 1. Load data from LocalStorage
let expenses = JSON.parse(localStorage.getItem("myExpenses")) || [];

let myChart = null; // Variable to store the chart instance

// 2. Define an Initialization function
function init() {
  renderList();
  renderChart();
}

// 3. Run it!
init();

// --- CORE FUNCTIONS ---

function addExpense() {
  // 1. Get values from the HTML inputs
  const desc = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  // 2. Basic validation
  if (desc === "" || amount === "") {
    alert("Please fill in all fields");
    return;
  }

  // 3. Create an expense object
  const expense = {
    desc: desc,
    amount: Number(amount),
    category: category,
  };

  // 4. Add to our array
  expenses.push(expense);
  saveData(); // Save to memory immediately

  // 5. Update the UI
  renderList();
  renderChart();

  // 6. Clear inputs
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

function deleteExpense(index) {
  // Remove the item at the specific index
  expenses.splice(index, 1);

  // Save the new list to memory
  saveData();

  // Update the UI
  renderList();
  renderChart();
}

function renderList() {
  const list = document.getElementById("expense-list");
  list.innerHTML = ""; // Clear current list so we don't duplicate

  // Loop through the array and create HTML for each item
  expenses.forEach((item, index) => {
    const li = document.createElement("li");

    // We add a 'span' that acts as a clickable button
    // NOTICE: We pass 'index' to deleteExpense so it knows which one to remove
    li.innerHTML = `
            <span>${item.desc} - ₹${item.amount} (${item.category})</span>
            <span class="delete-btn" onclick="deleteExpense(${index})">🗑️</span>
        `;

    list.appendChild(li);
  });
}

function renderChart() {
  // Safety check: specific to making sure the canvas exists
  const ctx = document.getElementById("expenseChart").getContext("2d");

  // Calculate totals for each category
  const foodTotal = expenses
    .filter((e) => e.category === "Food")
    .reduce((sum, e) => sum + e.amount, 0);
  const travelTotal = expenses
    .filter((e) => e.category === "Travel")
    .reduce((sum, e) => sum + e.amount, 0);
  const shoppingTotal = expenses
    .filter((e) => e.category === "Shopping")
    .reduce((sum, e) => sum + e.amount, 0);

  // If a chart already exists, destroy it before making a new one
  if (myChart) {
    myChart.destroy();
  }

  // Create the new chart
  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Food", "Travel", "Shopping"],
      datasets: [
        {
          data: [foodTotal, travelTotal, shoppingTotal],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Fits the container size defined in CSS
    },
  });
}

function saveData() {
  localStorage.setItem("myExpenses", JSON.stringify(expenses));
}

// --- ENTER KEY NAVIGATION ---

document
  .getElementById("description")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("amount").focus();
    }
  });

document.getElementById("amount").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("category").focus();
  }
});

document
  .getElementById("category")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addExpense();
      document.getElementById("description").focus();
    }
  });
