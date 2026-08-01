const API_URL = "/api/users";
let allUsers = [];

window.onload = function () {
    loadUsers();
};

async function loadUsers() {
    const response = await fetch(API_URL);
    allUsers = await response.json();
    displayUsers();
}

function displayUsers() {
    const search = document.getElementById("userSearch").value.toLowerCase();

    const filtered = allUsers.filter(u =>
        (u.name ?? "").toLowerCase().includes(search) ||
        (u.email ?? "").toLowerCase().includes(search)
    );

    const body = document.getElementById("userTableBody");
    const emptyMessage = document.getElementById("userEmptyMessage");
    body.innerHTML = "";

    if (filtered.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }
    emptyMessage.style.display = "none";

    filtered.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name ?? ""}</td>
            <td>${user.email ?? ""}</td>
            <td>${user.phone ?? ""}</td>
            <td>
                <select class="status-select" onchange="changeRole(${user.id}, this.value)">
                    <option value="USER" ${user.role === "USER" ? "selected" : ""}>USER</option>
                    <option value="ADMIN" ${user.role === "ADMIN" ? "selected" : ""}>ADMIN</option>
                </select>
            </td>
            <td>
                <div class="admin-action-buttons">
                    <button class="admin-delete-button" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            </td>
        `;
        body.appendChild(row);
    });
}

async function changeRole(id, newRole) {
    await fetch(`${API_URL}/${id}/role?role=${newRole}`, { method: "PATCH" });
    loadUsers();
}

async function deleteUser(id) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadUsers();
}

function logout() {
    localStorage.removeItem("loggedInUserId");
    window.location.href = "../User/login.html";
}