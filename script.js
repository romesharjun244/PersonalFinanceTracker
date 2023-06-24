document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("transaction-form");
  const table = document.getElementById("transaction-table");
  const balanceElement = document.getElementById("balance");
  let balance = 0;
  let transactions = [];

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const type = document.getElementById("transaction-type").value;
    const amount = parseFloat(document.getElementById("transaction-amount").value);
    const description = document.getElementById("transaction-description").value;

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transaction = {
      id: Date.now(),
      type: type,
      amount: amount,
      description: description,
    };

    transactions.push(transaction);
    updateBalance();
    renderTransactions();
    form.reset();
  });

  function deleteTransaction(id) {
    transactions = transactions.filter(function (transaction) {
      return transaction.id !== id;
    });

    updateBalance();
    renderTransactions();
  }

  function editTransaction(id) {
    const transaction = transactions.find(function (transaction) {
      return transaction.id === id;
    });

    document.getElementById("transaction-type").value = transaction.type;
    document.getElementById("transaction-amount").value = transaction.amount;
    document.getElementById("transaction-description").value = transaction.description;

    deleteTransaction(id);
  }

  function updateBalance() {
    balance = transactions.reduce(function (acc, transaction) {
      return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    balanceElement.textContent = balance.toFixed(2);
  }

  function renderTransactions() {
    table.innerHTML = `
      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Description</th>
        <th>Action</th>
      </tr>
    `;

    transactions.forEach(function (transaction) {
      const row = document.createElement("tr");

      const typeCell = document.createElement("td");
      typeCell.textContent = transaction.type;
      row.appendChild(typeCell);

      const amountCell = document.createElement("td");
      amountCell.textContent = transaction.amount.toFixed(2);
      row.appendChild(amountCell);

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = transaction.description;
      row.appendChild(descriptionCell);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", function () {
        deleteTransaction(transaction.id);
      });
      actionCell.appendChild(deleteButton);

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit-button");
      editButton.addEventListener("click", function () {
        editTransaction(transaction.id);
      });
      actionCell.appendChild(editButton);

      row.appendChild(actionCell);

      table.appendChild(row);
    });
  }

  function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));

    if (storedTransactions) {
      transactions = storedTransactions;
      renderTransactions();
    }
  }

  function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  loadTransactions();
  updateBalance();
  renderTransactions();

  window.addEventListener("beforeunload", function () {
    saveTransactions();
  });
});
