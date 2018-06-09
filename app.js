// Define UI Variables
const form = document.getElementById('task-form');
const newTaskField = document.getElementById('task');
const addTaskBtn = document.querySelector('#task-form .add-task');
const taskList = document.querySelector('.collection');
const clearAllBtn = document.querySelector('.clear-tasks');
const cardActionSection = document.querySelector('.card-action');
const filterTextField = document.getElementById('filter');
const noTaskText = 'No Tasks Available.';

// Load all Event Listeners. Calling it within function for security purpose
loadAllEventListeners();

// Defining loadAllEventListeners()
function loadAllEventListeners() {
  // Event for adding single tasks
  form.addEventListener('submit', addTask);
  // event for deleting a single task
  cardActionSection.addEventListener('click', deleteSingleTask);
  // event for clearing all tasks
  clearAllBtn.addEventListener('click', clearAllTasks);
  // event for disabling the ADD TASK button when the text filed is empty
  newTaskField.addEventListener('keyup', disableAddTaskBtn);
  // event for filtering tasks
  filterTextField.addEventListener('keyup', filterTasks);
}

// Render Tasks
showTasks();

// Add Singular tasks to the list and also in the local storage
function addTask(e) {
  if (newTaskField.value.trim() !== "") {
    let tasks;
    const task = newTaskField.value.trim();
    // Check if any tasks exists in local storage
    if (localStorage.getItem('tasks') === null) {
      tasks = new Array();
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    // Push the new task to the tasks array
    tasks.push(task);
    // Update the local storage with the new tasks array in string format
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Alert Task Saved.
    alert('Task Saved to the Local Storage.');
    e.target.firstElementChild.firstElementChild.value = "";
    // Render the task list
    addSingleTask(task);
    // newTaskField.value.clear();
  } else {
    alert("You have just provided blank spaces in the New Tasks field.");
  }
  e.preventDefault();
}

// Function to add a single Task into the list
function addSingleTask(task) {
  // check if no data li is showing while local storage has data
  if (taskList.children.length > 0) {
    if (taskList.firstElementChild.classList.contains('no-data')) {
      document.querySelector('.collection .no-data').remove();
    }
  }
  // Create the li.collection-item
  const collectionItem = document.createElement('li');
  collectionItem.classList.add('collection-item');
  // Add the task name to the li
  collectionItem.appendChild(document.createTextNode(task));
  // Create the a.delete-item secondary-content
  const anchorDeleteItem = document.createElement('a');
  anchorDeleteItem.classList.add('delete-item', 'secondary-content');
  anchorDeleteItem.setAttribute('href', '#');
  // Create the i.fa.fa-remove
  const removeIcon = document.createElement('i');
  removeIcon.classList.add('fa', 'fa-remove');
  // Append the i tag within the a tag
  anchorDeleteItem.appendChild(removeIcon);
  // Append the anchor tag to the li
  collectionItem.appendChild(anchorDeleteItem);
  //Show the tasks within the il.collection section
  taskList.appendChild(collectionItem);
  // Disable the add task button as when the page will reload it will not have any data
  addTaskBtn.setAttribute('disabled','disabled');
  // Call the disableClearTaskBtn() to either enable or disable clear all task button
  disableClearTaskBtn();
};

// Function to render the full task list
function showTasks() {
  if (localStorage.getItem('tasks') !== null && localStorage.getItem('tasks') !== '[]') {
    // check if no data li is showing while local storage has data
    if (taskList.children.length > 0) {
      if (taskList.firstElementChild.classList.contains('no-data')) {
        document.querySelector('.collection .no-data').remove();
      }
    }
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function (task, index) {
      // Create the li.collection-item
      const collectionItem = document.createElement('li');
      collectionItem.classList.add('collection-item');
      // Add the task name to the li
      collectionItem.appendChild(document.createTextNode(task));
      // Create the a.delete-item secondary-content
      const anchorDeleteItem = document.createElement('a');
      anchorDeleteItem.classList.add('delete-item', 'secondary-content');
      anchorDeleteItem.setAttribute('href', '#');
      // Create the i.fa.fa-remove
      const removeIcon = document.createElement('i');
      removeIcon.classList.add('fa', 'fa-remove');
      // Append the i tag within the a tag
      anchorDeleteItem.appendChild(removeIcon);
      // Append the anchor tag to the li
      collectionItem.appendChild(anchorDeleteItem);
      //Show the tasks within the il.collection section
      taskList.appendChild(collectionItem);
    });
  } else {
    // Check if .collection doesn't have any children element in it, show the default No Task message
    // Check if it has NO children in it
    if (taskList.children.length === 0) {
      taskList.innerHTML = `<li class="collection-item no-data">${noTaskText}</li>`;
    }
    // If there is no data in the local storage and the page is being loaded for the first time so, directly the HTML data will show up and the above if statement will not work, but the CLEAR TASKS button to clear all tasks should be disabled. So calling the disableClearTaskBtn() outside ogf the above if block.
    disableClearTaskBtn();
  }
}

// Function to delete Single Task using EVENT DELEGATION
function deleteSingleTask(e) {
  // Deligate for which clases the event will execute
  if (e.target.classList.contains('fa-remove') || e.target.classList.contains('delete-item')) {
    let taskNameSelected;
    // Give a confirm() popup asking the user if they really wanna delete the task
    if (confirm('Are you sure that you want to delete this task from the list?')) {
      // User clicked YES or OK
      // If the user click on the font awesome close icon
      if (e.target.classList.contains('fa-remove')) {
        e.target.parentElement.parentElement.remove();
        taskNameSelected = e.target.parentElement.parentElement.innerText;
      } else {
        // If the user clicked on the anchor tag
        e.target.parentElement.remove();
        taskNameSelected = e.target.parentElement.innerText;
      }
      // Now lets delete the item from the local storage so that it won't show up after the refresh
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      // Lets find out the index of the item we clicked removed in the local storage so that we can delete it
      const indexOfTask = tasks.indexOf(taskNameSelected);
      // Check if we actually found something
      if (indexOfTask !== -1) {
        // If we do, splice (remove) it out of the array
        tasks.splice(indexOfTask, 1);
      }
      // console.log(tasks, indexOfTask);
      // Now let's push the updated data to the local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));

      // Check if .collection doesn't have any children element in it, show the default No Task message
      // Check if it has NO children in it
      if (taskList.children.length === 0) {
        taskList.innerHTML = `<li class="collection-item no-data">${noTaskText}</li>`;
      }

      // Call the disableClearTaskBtn() to either enable or disable clear all task button
      disableClearTaskBtn();
    }
  }
}

// Function to clear all tasks at once
function clearAllTasks(e) {
  if (confirm('Are you sure that you want to clear all tasks?')) {
    localStorage.removeItem('tasks');
    // Takes less time to do it.
    while( taskList.firstChild ) {
      taskList.removeChild( taskList.firstChild );
    }
    const noDataLI = document.createElement('li') ;
    noDataLI.className = 'collection-item no-data';
    noDataLI.appendChild( document.createTextNode( noTaskText ) );
    taskList.appendChild( noDataLI );
    // The inner html way will take more time to execute.
    // taskList.innerHTML = `<li class="collection-item no-data">${noTaskText}</li>`;
    // Call the disableClearTaskBtn() to either enable or disable clear all task button
    disableClearTaskBtn();
  }
}

// Function to disable Clear All Tasks Button
function disableClearTaskBtn() {
  if (taskList.firstElementChild.classList.contains('no-data')) {
    clearAllBtn.setAttribute('disabled', 'disabled');
  } else {
    clearAllBtn.removeAttribute('disabled');
  }
}

// Function to disable ADD TASK button when the input field is empty or just blank space with no actual data
function disableAddTaskBtn(e) {
  if( e.target.value.trim() === '' ){
    addTaskBtn.setAttribute('disabled', 'disabled');
  } else {
    addTaskBtn.removeAttribute('disabled');
  }
}

// Function to filter tasks
function filterTasks(e) {
  // Lets get all li with the .collection-item class and loop through it
  document.querySelectorAll('.collection-item').forEach(function( task ) {
    const currentItemText = task.textContent.toLowerCase();
    
    if( currentItemText.indexOf( e.target.value.toLowerCase() ) !== -1 ) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}