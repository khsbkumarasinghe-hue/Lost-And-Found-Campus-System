const API_URL = "http://localhost:8080/api/categories";

// Load all categories
window.onload = function () {
    loadCategories();
};

// Get all categories
function loadCategories() {

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {

            let rows = "";

            data.forEach(category => {

                rows += `
                    <tr>
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td>

                            <button class="admin-update-button" style="border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:600;"
                                onclick="editCategory(${category.id}, '${category.name}')">
                                    Edit
                            </button>

                            <button class="admin-delete-button" style="border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:600; margin-left:6px;"
                                onclick="deleteCategory(${category.id})">
                                    Delete
                            </button>

                        </td>
                    </tr>
                `;

            });

            document.getElementById("categoryTable").innerHTML = rows;

        });
}

// Save Category
function saveCategory() {

    const name = document.getElementById("categoryName").value;

    if (name === "") {
        alert("Enter Category Name");
        return;
    }

    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name
        })

    })

        .then(() => {

            alert("Category Added");

            clearForm();

            loadCategories();

        });

}

// Edit Category
function editCategory(id, name) {

    document.getElementById("categoryId").value = id;

    document.getElementById("categoryName").value = name;

}

// Update Category
function updateCategory() {

    const id = document.getElementById("categoryId").value;

    const name = document.getElementById("categoryName").value;

    fetch(API_URL + "/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            id: id,

            name: name

        })

    })

        .then(() => {

            alert("Category Updated");

            clearForm();

            loadCategories();

        });

}

// Delete Category
function deleteCategory(id) {

    if (!confirm("Delete this category?")) {
        return;
    }

    fetch(API_URL + "/" + id, {

        method: "DELETE"

    })

        .then(() => {

            alert("Category Deleted");

            loadCategories();

        });

}

// Clear Form
function clearForm() {

    document.getElementById("categoryId").value = "";

    document.getElementById("categoryName").value = "";

}