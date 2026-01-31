// 1. Select the element
const para = document.getElementById('myParagraph');


// 2. Apply some direct styling using JS
para.style.marginTop = '50px';
para.style.textAlign = 'center';


// 3. Append the new CSS class
// This adds 'highlight-box' to the existing 'initial-style' class
para.classList.add('highlight-box');


console.log(para.className); // Output: "initial-style highlight-box"
