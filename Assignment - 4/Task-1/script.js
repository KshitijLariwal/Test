// 1. Create the button element
const btn = document.createElement('button');


// 2. Set the text content
btn.textContent = 'Click me';


// 3. Apply the styles
btn.style.backgroundColor = 'red';
btn.style.color = 'white';
btn.style.padding = '10px 20px'; // Added for better visibility
btn.style.border = 'none';      // Standard clean look
btn.style.cursor = 'pointer';   // Visual feedback for users


// 4. Insert it as the first element in the body
document.body.prepend(btn);//Unlike appendChild (which puts things at the end), prepend ensures the button is the very first child of the body tag.


