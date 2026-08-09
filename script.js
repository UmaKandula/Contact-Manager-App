// Array for storing contacts
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Stores the contact currently being edited
let editingId = null;


// Select HTML elements
const list = document.querySelector(".Contact_list");
const form = document.querySelector(".js-form");

const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("myEmail");
const phoneInput = document.getElementById("myTel");
const imageInput = document.getElementById("imgurl");

const searchInput = document.getElementById("searchInput");
const contactCount = document.getElementById("contactCount");
const noContacts = document.getElementById("noContacts");

const formTitle = document.getElementById("formTitle");
const submitButton = document.querySelector(".submitbtn");
const cancelEdit = document.getElementById("cancelEdit");


// Save contacts to localStorage
function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}


// Display contacts
function renderContacts(contactList = contacts) {

    list.innerHTML = "";

    contactList.forEach((contact) => {

        const node = document.createElement("article");

        node.className = "person";
        node.setAttribute("data-key", contact.id);

        node.innerHTML = `
            <img src="${contact.imageurl}" alt="${contact.name}">

            <div class="contactdetail">

                <h3>
                    <i class="fas fa-user-circle contactIcon"></i>
                    ${contact.name}
                </h3>

                <p>
                    <i class="fas fa-envelope contactIcon"></i>
                    ${contact.email}
                </p>

                <p>
                    <i class="fas fa-phone-alt contactIcon"></i>
                    ${contact.contactnumber}
                </p>

            </div>

            <div class="contact-actions">

                <button class="edit-contact" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="delete-contact" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>

            </div>
        `;

        list.append(node);
    });

    updateContactCount(contactList.length);

    if (contactList.length === 0) {
        noContacts.style.display = "block";
    } else {
        noContacts.style.display = "none";
    }
}


// Update contact count
function updateContactCount(count) {
    contactCount.textContent = count;
}


// Add contact
form.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const imageurl = imageInput.value.trim();


    // EDIT CONTACT
    if (editingId !== null) {

        const contact = contacts.find(
            (item) => item.id === editingId
        );

        if (contact) {
            contact.name = name;
            contact.email = email;
            contact.contactnumber = phone;
            contact.imageurl = imageurl;
        }

        editingId = null;

        formTitle.textContent = "Add Contact";
        submitButton.textContent = "Add Contact";
        cancelEdit.hidden = true;

    }

    // ADD NEW CONTACT
    else {

        const contactObject = {
            name: name,
            email: email,
            contactnumber: phone,
            imageurl: imageurl,
            id: Date.now()
        };

        contacts.push(contactObject);
    }


    saveContacts();

    form.reset();

    renderContacts();
});


// Delete or edit contact
list.addEventListener("click", (event) => {

    const contactElement = event.target.closest(".person");

    if (!contactElement) {
        return;
    }

    const id = Number(contactElement.dataset.key);


    // DELETE
    if (event.target.closest(".delete-contact")) {

        contacts = contacts.filter(
            (contact) => contact.id !== id
        );

        saveContacts();

        renderContacts();

        return;
    }


    // EDIT
    if (event.target.closest(".edit-contact")) {

        const contact = contacts.find(
            (item) => item.id === id
        );

        if (!contact) {
            return;
        }

        nameInput.value = contact.name;
        emailInput.value = contact.email;
        phoneInput.value = contact.contactnumber;
        imageInput.value = contact.imageurl;

        editingId = id;

        formTitle.textContent = "Edit Contact";
        submitButton.textContent = "Update Contact";
        cancelEdit.hidden = false;
    }
});


// Cancel editing
cancelEdit.addEventListener("click", () => {

    editingId = null;

    form.reset();

    formTitle.textContent = "Add Contact";
    submitButton.textContent = "Add Contact";

    cancelEdit.hidden = true;
});


// Search contacts
searchInput.addEventListener("input", () => {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredContacts = contacts.filter((contact) => {

        return (
            contact.name.toLowerCase().includes(searchValue) ||
            contact.email.toLowerCase().includes(searchValue) ||
            contact.contactnumber.includes(searchValue)
        );

    });

    renderContacts(filteredContacts);
});


// Display saved contacts when page opens
renderContacts();