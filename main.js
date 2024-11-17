const inputs = document.querySelector('.input_task');
const button = document.querySelector("button");
const list = document.querySelector(".tasks");

const savedList = JSON.parse(localStorage.getItem("list")) || [];

savedList.forEach((item, index) => {
    const listItem = createListItem(item.content, item.strikeoff, index);
    list.appendChild(listItem);
});

button.onclick = addItem;

function addItem() {
    if (inputs.value !== "") {
       
        const newListItem = createListItem(inputs.value, false, savedList.length);
        list.appendChild(newListItem);

        
        const newToDo = {
            content: inputs.value,
            strikeoff: false,
        };
        savedList.push(newToDo);

        updateLocalStorage();

        inputs.value = "";
    }
}

function createListItem(content, strikeoff, index) {
    const listItem = document.createElement("li");
    listItem.innerText = content;

    if (strikeoff) {
        listItem.classList.add('strikethrough');
    }

    const div = document.createElement("div");
    listItem.appendChild(div)

    editButton(div, index);
    deleteButton(div, index);

    listItem.ondblclick = () => {
        listItem.classList.toggle('strikethrough');
        savedList[index].strikeoff = listItem.classList.contains('strikethrough');
        updateLocalStorage();
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
    };

    item.appendChild(editBtn);
}

function deleteButton(item, index) {
    const deleteBtn = document.createElement("button");
    deleteBtn.name = "delete";
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "li_button";

    deleteBtn.onclick = () => {
        item.parentElement.remove()

       
        savedList.splice(index, 1);

        updateLocalStorage();

    };

    item.appendChild(deleteBtn);
}

function updateLocalStorage() {
    localStorage.setItem("list", JSON.stringify(savedList));
}

