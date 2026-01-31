# Assignment 4

This assignment consists of two tasks demonstrating basic JavaScript DOM manipulation and styling.

## Task 1: Dynamic Button Creation

**Objective:** Create a button element dynamically using JavaScript and insert it at the top of the HTML page.

**Files:**
- `Task-1/index.html`: The HTML structure with a heading and paragraph.
- `Task-1/script.js`: JavaScript code that creates and styles the button.

**Description:**
The script creates a `<button>` element, sets its text content to "Click me", applies inline styles (red background, white text, padding, border, cursor), and prepends it to the document body. This places the button above the existing heading.

**Key Concepts:**
- `document.createElement()` to create DOM elements
- Setting element properties and styles
- `document.body.prepend()` for insertion

## Task 2: Element Selection and Styling

**Objective:** Select an existing paragraph element, apply direct styles via JavaScript, and add a CSS class.

**Files:**
- `Task-2/index.html`: HTML page with a paragraph element.
- `Task-2/index.js`: JavaScript code for manipulation.
- `Task-2/style.css`: CSS styles for the classes.

**Description:**
The script selects the paragraph with ID "myParagraph", applies inline styles (50px top margin, center alignment), and adds the "highlight-box" class. This class provides a yellow background, orange border, padding, bold font, and dark red text.

**Key Concepts:**
- `document.getElementById()` for element selection
- Direct style manipulation via `element.style`
- `element.classList.add()` for adding CSS classes
- CSS transitions for smooth style changes