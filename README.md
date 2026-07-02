# My Task Board (React Kanban App)

This is my Sprint 5 project for Prodesk IT. I built a Trello-style task management board using React.js and Vite. It has three columns - To Do, In Progress and Done - and you can add, edit, delete and move tasks between them.

## What I built

- 3 column layout (To Do / In Progress / Done)
- Add new tasks using an input box
- Delete any task with the cross button
- Move tasks between columns using buttons
- Click on a task to edit its text directly
- Priority dropdown (High/Medium/Low) with color coded cards
- Data is saved in localStorage so tasks don't disappear on refresh
- Drag and drop support - you can literally drag cards between columns
- Search bar to filter tasks in real time

## Tech Stack

- React.js (useState, useEffect hooks)
- Vite (for the build/dev setup, since create-react-app is deprecated now)
- Plain CSS for styling
- localStorage for persistence
- Native HTML5 drag and drop (didn't use any extra library for this)

## Base Layout

I started with just the basic 3 column layout and a dummy task to make sure everything was rendering fine. Then I added the input box and connected it to state using useState.

## Add, Delete, Move

Adding a task pushes a new object into the todo array. For delete, I used the filter() method to remove a task by its id. For move, I remove the task from one array and push it into another array using spread operator.

## Priority System

I added priority levels and used a helper function to add a CSS class based on the priority value, which changes the left border color of the card.

## Inline Editing

Each task has an isEditing flag. Clicking on the text toggles this flag, and if it's true, it shows an input box instead of plain text.

## Persistence

I used useEffect to save the state to localStorage every time any of the three task arrays change. When the page loads, I read from localStorage first before falling back to a default task.

## Drag and Drop + Search

I added drag and drop using the native HTML5 drag events (dragstart, dragover, drop) instead of installing a library, and a search bar that filters the visible tasks based on what's typed.

## Live Link

https://kanban-board-pink-pi-94.vercel.app/

## Author

Developed by Akarshi Agrahari
