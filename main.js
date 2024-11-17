const inputs = document.querySelector('.input_task');
const button = document.querySelector("button");
const list = document.querySelector(".tasks");

const apiUrl = "https://673612775995834c8a954fe2.mockapi.io/api/v1/tasks";
let savedList = [];

fetchTasksFromAPI();

button.onclick = addItem;

async function fetchTasksFromAPI() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        savedList = tasks;

        savedList.forEach((item, index) => {
            const listItem = createListItem(item.content, item.strikeoff, index);
            list.appendChild(listItem);
        });
    } catch (error) {
        console.log("Error fetching tasks:", error);
    }
}

async function addItem() {
    if (inputs.value !== "") {
        const newTask = {
            content: inputs.value,
            strikeoff: false,
        };

        const newListItem = createListItem(inputs.value, false, savedList.length);
        list.appendChild(newListItem);

        await postTaskToAPI(newTask);

        savedList.push(newTask);
        updateLocalStorage();

        inputs.value = "";
    }
}

async function postTaskToAPI(task) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        const newTask = await response.json();
        console.log("Task added:", newTask);
    } catch (error) {
        console.log("Error posting task:", error);
    }
}

function createListItem(content, strikeoff, index) {
    const listItem = document.createElement("li");
    listItem.innerText = content;

    if (strikeoff) {
        listItem.classList.add('strikethrough');
    }

    const div = document.createElement("div");
    listItem.appendChild(div);

    editButton(div, index);
    deleteButton(div, index);

    listItem.ondblclick = () => {
        listItem.classList.toggle('strikethrough');
        savedList[index].strikeoff = listItem.classList.contains('strikethrough');
        updateLocalStorage();
        updateTaskInAPI(savedList[index]);
    };

    return listItem;
}

function editButton(item, index) {
    const editBtn = document.createElement("button");
    editBtn.name = "Edit";
    editBtn.innerText = "Edit";
    editBtn.className = "edit_button";

    editBtn.onclick = () => {
        inputs.value = savedList[index].content;
        button.innerText = "Update";

        button.onclick = async () => {
            if (inputs.value !== "") {
                savedList[index].content = inputs.value;
                updateTaskInAPI(savedList[index]);
                item.parentElement.firstChild.textContent = inputs.value;

                updateLocalStorage();

                inputs.value = "";
                button.innerText = "Add";
                button.onclick = addItem;
            }
        };
    };

    item.appendChild(editBtn);
}

function deleteButton(item, index) {
    const deleteBtn = document.createElement("button");
    deleteBtn.name = "delete";
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "li_button";

    deleteBtn.onclick = async () => {
        item.parentElement.remove();

        await deleteTaskFromAPI(savedList[index].id);

        savedList.splice(index, 1);
        updateLocalStorage();
    };

    item.appendChild(deleteBtn);
}

async function deleteTaskFromAPI(taskId) {
    try {
        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Task with ID ${taskId} removed from API.`);
        } else {
            console.log(`Failed to remove task with ID ${taskId} from API.`);
        }
    } catch (error) {
        console.log("Error deleting task:", error);
    }
}

async function updateTaskInAPI(task) {
    try {
        const response = await fetch(`${apiUrl}/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        const updatedTask = await response.json();
        console.log("Task updated:", updatedTask);
    } catch (error) {
        console.log("Error updating task:", error);
    }
}

function updateLocalStorage() {
    localStorage.setItem("list", JSON.stringify(savedList));
}
