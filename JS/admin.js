async function loadUsers() {
    const response = await fetch(`http://localhost:3000/api/users`)
    const json = await response.json();
    const table = document.getElementById('usertable')
    json.forEach(element => {
        const tablerow = document.createElement('tr');
        const nameelement = document.createElement('td');
        const pfpurlelement = document.createElement('td');
        const adminelement = document.createElement('td');
        const actionselement = document.createElement('td');
        nameelement.innerHTML = element.Name;
        pfpurlelement.innerHTML = element.PFPURL;
        if (element.Admin && element.Admin == true) {
            adminelement.innerHTML = "✔"
        } else {
            adminelement.innerHTML = "✗"
        }
        const editelement = document.createElement('button');
        const deleteelement = document.createElement('button');
        editelement.innerHTML = "✏️";
        editelement.classList = "btn btn-warning me-1";
        editelement.setAttribute("data-bs-toggle", "modal");
        editelement.setAttribute("data-bs-target", "#formModal");
        editelement.onclick = function() {loadEditModal(element.Name, element.PFPURL, element.Admin, element.ID)}
        deleteelement.innerHTML = "🗑️";
        deleteelement.classList = "btn btn-danger ms-1";
        deleteelement.setAttribute("data-bs-toggle", "modal");
        deleteelement.setAttribute("data-bs-target", "#deleteModal");
        deleteelement.onclick = function() {loadDeleteModal(element.ID)}
        actionselement.appendChild(editelement);
        actionselement.appendChild(deleteelement);
        tablerow.appendChild(nameelement);
        tablerow.appendChild(pfpurlelement);
        tablerow.appendChild(adminelement);
        tablerow.appendChild(actionselement);
        table.appendChild(tablerow);
    });
}

async function loadEditModal(name, PFPURL, Admin, id) {
    const UsernameInput = document.getElementById("inputUsername");
    const PFPURLInput = document.getElementById("inputPFPURL");
    const AdminInput = document.getElementById("inputAdmin");
    const IDInput = document.getElementById("inputID");

    UsernameInput.value = name;
    PFPURLInput.value = PFPURL;
    if (Admin === 1) {
        AdminInput.checked = true;
    }
    IDInput.value = id;
}
async function loadDeleteModal(id) {
    const IDInput = document.getElementById("inputID2");
    IDInput.value = id;
}

loadUsers();