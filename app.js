/**
 * 1. Modular Pattern using IIFE.
 * 2. Storage Controller will take care of localStorage get and set methods.
 * 3. Item Controller will take care of getting and setting the input of items.
 * 4. App Controller will take care of starting the app and is the main controller.
 * 5. UI Controller will take care of UI functionality like building new tags and editing them from JS
 */


// Storage Controller
const StorageCtrl = (function () {
    // Public Methods
    return {
        storeItems: (item) => {
            let items = [];
            // Check if any items
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        displayItems: () => {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage: (updateitem) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (updateitem.id === item.id) {
                    items.splice(index, 1, updateitem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemStorage: (id) => {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // Data Structure/State
    const data = {
        items: StorageCtrl.displayItems(),
        currentItem: null,
        totalCalories: 0
    };

    return {
        logData: () => data,

        getItems: () => data.items,

        getTotalCalories: () => {
            let total = 0;
            data.items.forEach((item) => {
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },

        addItem: (name, calories) => {
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // String calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);
            return newItem;
        },

        getItemById: (id) => {
            let found = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        updateItem: (name, calories) => {
            // calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: (id) => {
            // Get ids
            const ids = data.items.map((item) => item.id);
            // Get index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index, 1);
        },

        setCurrentItem: (item) => {
            data.currentItem = item;
        },

        getCurrentItem: () => data.currentItem,

        clearAll: () => {
            data.items = [];
        }
    }
})();


// UI Controller
const UICtrl = (function () {
    // Getting all selectors
    const UISselectors = {
        list: '#item-list',
        listItem: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    return {
        populateItems: (items) => {
            // Loop through items
            let html = '';
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fas fa-pen edit-item"></i>
                    </a>
                </li>
                `;
            });

            // Insert List Items
            document.querySelector(UISselectors.list).innerHTML = html;
        },

        getSelectors: () => UISselectors,


        addNewItem: (item) => {
            // Show list
            document.querySelector(UISselectors.list).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="fas fa-pen edit-item"></i>
                </a>
            `;
            // Insert Item
            document.querySelector(UISselectors.list).insertAdjacentElement('beforeend', li);
        },

        clearInput: () => {
            document.querySelector(UISselectors.itemNameInput).value = '';
            document.querySelector(UISselectors.itemCaloriesInput).value = '';
        },

        hideList: () => {
            document.querySelector(UISselectors.list).style.display = 'none';
        },

        showTotalCalories: (totalCalories) => {
            document.querySelector(UISselectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISselectors.updateBtn).style.display = 'none';
            document.querySelector(UISselectors.deleteBtn).style.display = 'none';
            document.querySelector(UISselectors.backBtn).style.display = 'none';
            document.querySelector(UISselectors.addBtn).style.display = 'inline';
        },

        showEditState: () => {
            document.querySelector(UISselectors.updateBtn).style.display = 'inline';
            document.querySelector(UISselectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISselectors.backBtn).style.display = 'inline';
            document.querySelector(UISselectors.addBtn).style.display = 'none';
        },

        addItemToForm: () => {
            document.querySelector(UISselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISselectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        getItemInput: () => {
            return {
                name: document.querySelector(UISselectors.itemNameInput).value,
                calories: document.querySelector(UISselectors.itemCaloriesInput).value
            }
        },

        updateListItem: (item) => {
            let listItems = document.querySelectorAll(UISselectors.listItem);

            // Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach((listitem) => {
                const itemID = listitem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fas fa-pen edit-item"></i>
                    </a>
                    `;
                }
            });
        },

        deleteListItem: (id) => {
            const item = document.querySelector(`#item-${id}`);
            item.remove();
        },

        removeAll: () => {
            let allItems = document.querySelectorAll(UISselectors.listItem);
            allItems = Array.from(allItems);
            allItems.forEach((item) => {
                item.remove();
            });
        }

    }
})();


// App Controller
const AppCtrl = (function (ItemCtrl, UICtrl, StorageCtrl) {
    // Load EventListeners
    const loadEventListeners = () => {
        // Get UI Selectors
        const UISselectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISselectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable enter key
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Add Edit event
        document.querySelector(UISselectors.list).addEventListener('click', itemEditSubmit);

        // Add Update event
        document.querySelector(UISselectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete event
        document.querySelector(UISselectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back Button Event
        document.querySelector(UISselectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Clear Button Event
        document.querySelector(UISselectors.clearBtn).addEventListener('click', clearAllItems);

    }
    // Add item submit
    const itemAddSubmit = (e) => {

        e.preventDefault();
        // Get Form Input from UICtrl
        const input = UICtrl.getItemInput();

        // Check for input
        if (input.name !== '' && input.calories !== '') {

            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add Item to UI List
            UICtrl.addNewItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Update Total Calories in UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in Local Storage
            StorageCtrl.storeItems(newItem);

            // Clear fields
            UICtrl.clearInput();

        }
    }

    // Edit item submit
    const itemEditSubmit = (e) => {

        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
    }

    // Update item submit
    const itemUpdateSubmit = (e) => {

        e.preventDefault();
        // Get item input
        const item = UICtrl.getItemInput();
        // Update item
        const updateItem = ItemCtrl.updateItem(item.name, item.calories);
        // Update UI
        UICtrl.updateListItem(updateItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Update Total Calories in UI
        UICtrl.showTotalCalories(totalCalories);
        // Update local Storage
        StorageCtrl.updateItemStorage(updateItem);
        UICtrl.clearEditState();
    }

    // Delete item
    const itemDeleteSubmit = (e) => {

        e.preventDefault();
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete item
        ItemCtrl.deleteItem(currentItem.id);
        // Delete item from UI
        UICtrl.deleteListItem(currentItem.id);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Update Total Calories in UI
        UICtrl.showTotalCalories(totalCalories);
        // Delete Storage
        StorageCtrl.deleteItemStorage(currentItem.id);
        UICtrl.clearEditState();
    }


    const clearAllItems = (e) => {

        e.preventDefault();
        // Clear all items from dataStructure
        ItemCtrl.clearAll();
        // Clear from UI
        UICtrl.removeAll();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Update Total Calories in UI
        UICtrl.showTotalCalories(totalCalories);
        // Clear from localStorage
        StorageCtrl.clearItemsStorage();
        UICtrl.hideList();
    }
    // Public methods
    return {
        init: () => {
            // Clear edit state/set initial state
            UICtrl.clearEditState();

            // Get Items from ItemCtrl
            const items = ItemCtrl.getItems();

            // Check to see if any item exists or not
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate UI
                UICtrl.populateItems(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Update Total Calories in UI
            UICtrl.showTotalCalories(totalCalories);

            // Load Event Listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

AppCtrl.init();