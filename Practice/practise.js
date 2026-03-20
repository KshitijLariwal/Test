let a = new Array(250,645,300,900,5);
for (let i = 0; i < a.length; i++) {
    console.log(a[i]*0.9);
}
let companies =["Bloomberg", "Microsoft","Uber","Google"];
console.log(companies.splice(0,1));
console.log(companies.splice(1,1,"Ola"));
console.log(companies.splice(3,0,"Amazon"));
console.log(companies);

//(Arrow Function
let sum = (a,b) => a+b;
console.log(sum(5,10));

// Map Method
let numbers = [1,2,3,4,5];
let squares = numbers.map(x => x*x);
console.log(squares);

// Filter Method
let marks = [87,98,64,99,86];
let filteredMarks = marks.filter(x => x >= 90);
console.log(filteredMarks);

// Filter Method
let evenNumbers = numbers.filter(x => x % 2 === 0);
console.log(evenNumbers);

// Reduce Method
let total = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(total);

//Filter method
let array = [1, 2, 3, 4, 5];
let largest = array.filter(x =>x === Math.max(...array));
console.log(largest);

// DOM Manipulation
// document.getElementById("btn").addEventListener("click", function() {
//     alert("Button Clicked!");
// });

//Query Handling by creating a new button element and adding class to it
let newButton = document.createElement("button");
newButton.className = "myClass";

document.querySelector(".myClass").addEventListener("click", function() {
    alert("Element with class 'myClass' clicked!");
});

//Create a new paragraph element and add class to it
let newParagraph = document.createElement("p");
newParagraph.className = "newClass";
newParagraph.textContent = "This is a new paragraph.";
document.body.appendChild(newParagraph);

// //Event Handling

// document.querySelector("#btn").addEventListener("click", function() {
//     alert("Button event!");
// });

//Callback Function
function fetchData(callback) {
    setTimeout(() => {
        const data = "Data fetched!";
        callback(data);
    }
    , 2000);
}
 
fetchData(function(result) {
    console.log(result);
});

