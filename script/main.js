const REMOVE_SYMBOL = '\u00D7';
const LIST_STORAGE_KEY = 'shuffled_list';
const ENTER_KEY_CODE = 13;
const COLOR_BLACK = 'black';
const COLOR_RED = 'red';
const OPACITY_SHOW = '1';
const OPACITY_HIDE = '0';
const DOT_CHAR = '.'
const EMPTY = '';

const input = document.querySelector('.input');
const addButton = document.querySelector('.add');
const addIcon = document.querySelector('.add__icon');
const shuffleButton = document.querySelector('.shuffle');
const resetButton = document.querySelector('.reset');
const list = document.querySelector('.list');
const message = document.querySelector('.content__message');

function saveToStorage() {
    const itemNames = list.querySelectorAll('.item__name');
    const storageList = Array.from(itemNames).map(value => value.textContent);
    localStorage.setObj(LIST_STORAGE_KEY, storageList);
}

function createListItem(textContent) {
    const listItem = document.createElement('li');
    listItem.className = 'list__item';

    const itemNumber = document.createElement('span');
    itemNumber.className = 'item__number';

    const itemName = document.createElement('span');
    itemName.className = 'item__name';
    itemName.textContent = textContent;

    listItem.appendChild(itemNumber);
    listItem.appendChild(itemName);
    listItem.appendChild(createRemoveButton());

    return listItem;
}

function createRemoveButton() {
    const removeButton = document.createElement('span');
    removeButton.className = 'item__remove';
    removeButton.textContent = REMOVE_SYMBOL;
    removeButton.addEventListener('click', () => {
        const li = removeButton.parentElement;
        li.parentElement.removeChild(li);
        updateNumbering()
        saveToStorage();
    })
    return removeButton;
}

function updateNumbering() {
    Array.from(list.children).forEach((element, index) => {
        element.firstChild.textContent = (index + 1) + DOT_CHAR;
    });
}

function changeInputColor(color) {
    input.style.borderBottom = '1px solid ' + color;
}

function showMessage() {
    message.style.opacity = OPACITY_SHOW;
}

function hideMessage() {
    message.style.opacity = OPACITY_HIDE;
}

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key));
}

window.onload = function () {
    const storageList = localStorage.getObj(LIST_STORAGE_KEY);
    if (storageList) {
        storageList.forEach((item) => {
            list.appendChild(createListItem(item));
        })
        updateNumbering()
    }
};

document.addEventListener('click', event => {
    const eventTarget = event.target;
    if (eventTarget !== input
        && eventTarget !== addIcon
        && eventTarget !== addButton) {
        changeInputColor(COLOR_BLACK);
    }
})

input.addEventListener('keydown', event => {
    if (event.keyCode === ENTER_KEY_CODE) {
        event.preventDefault();
        addButton.click();
    }
});

addButton.addEventListener('click', event => {
    event.preventDefault()
    const inputValue = input.value.trim();
    if (inputValue !== EMPTY) {
        const listItem = createListItem(inputValue);
        list.appendChild(listItem);
        updateNumbering()
        changeInputColor(COLOR_BLACK);
        hideMessage();
        saveToStorage();
    } else {
        changeInputColor(COLOR_RED);
    }
    input.value = EMPTY;
})

shuffleButton.addEventListener('click', event => {
    event.preventDefault()
    if (list.children.length > 0) {
        for (let i = list.children.length; i > 0; i--) {
            list.appendChild(list.children[Math.random() * i | 0]);
        }
        updateNumbering()
        hideMessage();
    } else {
        showMessage();
    }
    saveToStorage();
})

resetButton.addEventListener('click', event => {
    event.preventDefault();
    list.innerHTML = EMPTY;
    saveToStorage();
})
