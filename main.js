window.addEventListener('load', () => {
    const form = document.querySelector("#newtaskform");
    const input = document.querySelector("#newtaskinput");
    const taskList = document.querySelector("#tasks");
    const doneList = document.querySelector("#done");

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(taskText => {
        const taskEl = createTaskElement(taskText);
        taskList.appendChild(taskEl);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = input.value;

        if (!taskText) {
            alert("Please fill out your task");
            return;
        }

        const taskEl = createTaskElement(taskText);

        taskList.appendChild(taskEl);

        saveTasksToLocalStorage();

        input.value = "";
    });

    function createTaskElement(taskText) {
        const taskEl = document.createElement("div");
        taskEl.classList.add("task");

        const taskContentEl = document.createElement("div");
        taskContentEl.classList.add("content");

        taskEl.appendChild(taskContentEl);

        const taskInputEl = document.createElement("input");
        taskInputEl.classList.add("text");
        taskInputEl.type = "text";
        taskInputEl.value = taskText;
        taskInputEl.setAttribute("readonly", "readonly");

        taskContentEl.appendChild(taskInputEl);

        const taskActionsEl = document.createElement("div");
        taskActionsEl.classList.add("actions");

        const taskEditEl = document.createElement("button");
        taskEditEl.classList.add("edit");
        taskEditEl.innerHTML = "Edit";

        const taskDoneEl = document.createElement("button");
        taskDoneEl.classList.add("done");
        taskDoneEl.innerHTML = "Done";

        taskActionsEl.appendChild(taskEditEl);
        taskActionsEl.appendChild(taskDoneEl);

        taskEl.appendChild(taskActionsEl);

        taskEditEl.addEventListener('click', () => {
            if (taskEditEl.innerText.toLowerCase() == "edit") {
                taskInputEl.removeAttribute("readonly");
                taskInputEl.focus();
                taskEditEl.innerText = "Save";
            } else {
                taskInputEl.setAttribute("readonly", "readonly");
                taskEditEl.innerText = "Edit";
            }
        });

        taskDoneEl.addEventListener('click', () => {
            moveTaskToDoneList(taskEl);

            saveTasksToLocalStorage();
        });

        return taskEl;
    }

    function moveTaskToDoneList(taskEl) {
        const doneEl = taskEl.cloneNode(true);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = "Delete";

        doneEl.querySelector(".actions").innerHTML = ""; 
        doneEl.querySelector(".actions").appendChild(deleteButton);

        doneList.appendChild(doneEl);
        taskList.removeChild(taskEl);

        deleteButton.addEventListener('click', () => {
            doneList.removeChild(doneEl);
            
            saveTasksToLocalStorage();
        });
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.children).map(taskEl => taskEl.querySelector(".text").value);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
