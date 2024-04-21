'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


///////////////////////////////////////////////// displaying every movement in the account

const displayMovements = function (movement, sort = false) {
  
  containerMovements.innerHTML = '';

  // for sorting 

  const movs = sort? movement.slice().sort((a,b) => a-b) : movement;
  
  movs.forEach((mov,i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}, ${type}</div>
    <div class="movements__value">${mov} €</div>
  </div>
    `

    containerMovements.insertAdjacentHTML("afterbegin", html);

  });
}

/////////////// creating username for every account /////////

const createUsernames = function (accounts) {
   accounts.forEach(function (accs) {
    accs.username = accs.owner.toLowerCase().split(' ').map(name => name[0]).join('')
    accs.balance = accs.movements.reduce((acc,mov) => acc+mov , 0);
   })
 }

createUsernames(accounts);

const acc1Mov = account1.movements.filter(function (mov) {
  return mov<0;
})
// console.log(acc1Mov)

/////////// calculating the total amount in each accont using the reduce method ////////////

const calculateBalance = function (movement) {
  const bal = movement.reduce((acc,mov) => acc+mov , 0);
  labelBalance.textContent = `${bal} €`;
}


///////////////     calculating the summary of deposit and withdrawals for every account    /////////////

const calcDisplaySummary = function (acc) {
  /////calculating the deposits//////////
  const incomes = acc.movements.filter(mov=> mov>0).reduce((acc, mov) => acc+mov, 0);
  labelSumIn.textContent = `${incomes} €`

  /////// calculating the withdrawals /////////
  const outcomes = acc.movements.filter(mov=> mov<0).reduce((acc, mov) => acc+mov, 0);
  labelSumOut.textContent = `${outcomes} €`

  ////// calculating the interest //////
  const interest = acc.movements.filter(mov => mov>0).map(mov => mov*acc.interestRate/100).filter(mov => mov>1).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest} €`
}


///////////////     creating events handlers for the login of users       ///// //////////


let currentAccount;

btnLogin.addEventListener('click', function(e) {
  //// prevent the form from submitting /////
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

///// login conditions /////
if(currentAccount?.pin === Number(inputLoginPin.value)) {
  /// disp;lay ui and message ////
  labelWelcome.textContent = `welcome back ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = '100';

  ///// clear the input fields after successful login ////

  inputLoginUsername.value = inputLoginPin.value = '';
  //// remove the cursor focus from the input field after login ///

  inputLoginPin.blur();

  updateUi(currentAccount)
}
})

///////// creating a functio for updating the user interface ////////// 

const updateUi = function (acc) {
  displayMovements(acc.movements);

  /////// display balance for the current account /////
  calculateBalance(acc.movements);

  /////// display summary for the current account /////
  calcDisplaySummary(acc);
}


/////////////// implementing the transfer between accounts ///////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=> acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);

  inputTransferAmount.value=inputTransferTo.value= '';
  // currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(amount>0 && receiverAcc && amount <= currentAccount.balance && receiverAcc?.username !== currentAccount.username && currentAccount.balance!==0) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }  else {
    alert('pls enter a valid amount');
  }

  updateUi(currentAccount)

});


/////////////////        implementing the loan feature      //////////////


btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount>0 && currentAccount.movements.some(mov => mov>= amount*0.1)) {
    // adding the loan amount to the account
    currentAccount.movements.push(amount);
    //  updatin the ui after the eloan ha been granted

    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';

})



//////////////////       for closing an account          ///////////

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //// deleting the acccount /////
    accounts.splice(index, 1);

    //// hide UI /////
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

////////////// sorting the accounts movements on click ///////////


// checking if we,ve sorted the movements prior

let sorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted);
  sorted=!sorted;
});




// coding challenge 

// test datas 

// let juliaData = [3,5,2,12,7];
// const kateData = [4,1,15,8,3];
// juliaData = juliaData.splice(1,2);
// const finalDate = [...juliaData,...kateData];

// const dogAge = (dogData) => {
//   dogData.forEach((data,ind) => {
//     const dogsAge = data >= 3 ? 'Adult' : 'puppy';
//     console.log(`Dog number ${ind + 1} is a ${dogsAge}, and is ${data} years old`);
//   });
// };

// dogAge(finalDate);


//------------------------- coding challenge 3 -----------------



// const testData1 = [5,2,4,1,15,8,3];
// const testData2 = [16,6,10,5,6,1,4];

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map((item)=> {
//     if(item<=2){
//       return item * 2;
//     } else {
//       return 16 + item * 4;
//     };
// });
// console.log(humanAge);
//     const adults = humanAge.filter((ite)=>{
//   return ite>=18;
// });
// console.log(adults)
//     const average = adults.reduce(function(acc,mov) {
//   return (acc+mov);
// },0); return average/adults.length;
// };



// const avg1 = calcAverageHumanAge([5,2,4,1,15,8,3]);
// const avg2 = calcAverageHumanAge([16,6,10,5,6,1,4]);
// console.log(avg1, avg2).

// array methods practice  

// 1. calculating the sum of all the movements in all accounts

const bankDepositSum = accounts.flatMap(mov => mov.movements)
.filter(mov => mov>0).reduce((acc, mov)=> acc+mov);

console.log(bankDepositSum);

// 2. getting how many deposits is greater than or equal to 1000 in all the account.

const bigDeposit = accounts.flatMap(mov => mov.movements)
.filter(mov => mov>= 1000).length

console.log(bigDeposit);

//  3. 

const convertTitleCase = function(phrase) {
  const exception = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const convert =  phrase.toLowerCase().split(' ')
  .map(cur => exception.includes(cur) ? cur : cur[0].toUpperCase() + cur.slice(1)).join(' ');
  return convert;
}

// console.log(convertTitleCase('this is a nice title'))
// console.log(convertTitleCase('this is a long title but not too long'))
// console.log(convertTitleCase('just another not too long of a title'))


// coding shallenge no 4

/* 
Julia and Kate are still studying dogs, and this time they
 are studying if dogs are eating too much or too little.

Eating too much means the dog's current food portion is larger than the recommended portion,
 and eating too little is the opposite.

Eating an okay amount means the dog's current food portion is within a range
 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion
 and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla:
  recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

2. Find Sarah's dog and log to the console whether it's eating too much or too little.
 HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array,
  and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch')
 and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!
" and "Sarah and John and Michael's dogs eat too little!"

5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended
 (just true or false)

6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)

7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order
 (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉

HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10).
 Basically, the current portion should be between 90% and 110% of the recommended portion.
TEST DATA:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
]; */

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];


//  solution 1 : adding a new key to the dog object from the array

dogs.forEach(dog => dog.recommendedFood = (dog.weight**0.75 *28).toFixed(2));


//  for calculating if a dog eat too much or too little ;

const dogeating = function (dog) {

  if(dog.curFood > Number(dog.recommendedFood)*0.90 && dog.curFood < Number(dog.recommendedFood)*1.10) {
    return (`${dog.owners} dog eats okay`)
  } else if(dog.curFood < (Number(dog.recommendedFood)*0.90)) {
    return (`${dog.owners} dog eats too little`)
  } else if(dog.curFood > (Number(dog.recommendedFood)*1.10)) {
    return (`${dog.owners} dog eats too much jeez!`)
  }
}

//  solution 2:

const sarahDog = dogs.find(dog => dog.owners.find(own => own === 'Sarah'));
// console.log(dogeating(sarahDog));

//  solution 3:
const everyDog = dogs.forEach(dog => console.log(dogeating(dog)));

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > Number(dog.recommendedFood)*1.10).flatMap(dog=> dog.owners);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < Number(dog.recommendedFood)*0.90).flatMap(dog=> dog.owners);

console.log(ownersEatTooMuch, ownersEatTooLittle);

//  solution 4 :

console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much`)
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little`)


// solution 6 :

const checkEatingOkay =dog => dog.curFood>dog.recommendedFood* 0.9 && dog.curFood<dog.recommendedFood*1.1 ;

console.log(dogs.some(checkEatingOkay));

// solution 7:

console.log(dogs.filter(checkEatingOkay))

// solution 8 

let shallow = dogs.slice().sort((a,b) => a.recommendedFood - b.recommendedFood)
console.log(shallow)