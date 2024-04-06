"use strict";
/////////Bankingfi APP////////////////

// Data
const account1 = {
  owner: "Shivang Tiwari",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Swati Goswami",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Radhe Shyam Tiwari",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Mukul Verma",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const currentDisplay = function (accs) {
  accs.balance = accs.movements.reduce((acc, mov, i, arr) => acc + mov, 0);
  labelBalance.textContent = `${accs.balance}€`;
};

const calcDisplaySummary = function (accs) {
  const incomes = accs.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = accs.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = accs.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * accs.interestRate) / 100)
    .filter((fd, i, arr) => {
      return fd >= 1;
    })
    .reduce((acc, fd) => acc + fd, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//Computing Usernames
const everyUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (n) {
        return n[0];
      })
      .join("");
  });
};

everyUsername(accounts);

const updateUI = function (accs) {
  //Display Movements
  displayMovements(accs.movements);

  //Display Balance
  currentDisplay(accs);

  //Display Summary\
  calcDisplaySummary(accs);
};

//Event Handler
let loginAccount;

// Adding dates

btnLogin.addEventListener("click", function (enter) {
  enter.preventDefault();

  loginAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(loginAccount);

  if (loginAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      loginAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //Update UI
    updateUI(loginAccount);
  }
});

// Implementing Transfers
btnTransfer.addEventListener("click", function (enter) {
  enter.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    loginAccount.balance >= amount &&
    receiverAcc.username !== loginAccount.username
  ) {
    // Clear input field
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferTo.blur();
    // Doing the transfer
    loginAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Dispalying
    updateUI(loginAccount);
  }
});

//Implementing Loan

btnLoan.addEventListener("click", function (enter) {
  enter.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && loginAccount.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(function () {
      loginAccount.movements.push(amount);

      //Update UI

      updateUI(loginAccount);
    }, 3000);
  }

  inputLoanAmount.value = "";
});

//findIndex Method by configuring close account button

btnClose.addEventListener("click", function (enter) {
  enter.preventDefault();

  if (
    loginAccount.username === inputCloseUsername.value &&
    loginAccount.pin === Number(inputClosePin.value)
  ) {
    const i = accounts.findIndex(
      (accs) => accs.username === loginAccount.username
    );
    accounts.splice(i, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // clear input field
  inputClosePin.value = inputCloseUsername.value = "";
});

//Sorting

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(loginAccount.movements, !sorted);
  sorted = !sorted;
});
