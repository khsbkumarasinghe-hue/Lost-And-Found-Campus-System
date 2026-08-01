const API_URL = "/api/campus-locations";

window.onload = function () {
    loadLocations();
};

function loadLocations() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("locationTable");
            table.innerHTML = "";

            data.forEach(location => {
                table.innerHTML += `
                    <tr>
                        <td>${location.id}</td>
                        <td>${location.locationName}</td>
                        <td>
                            <button class="admin-update-button" style="border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:600;"
                                onclick="editLocation(${location.id}, '${location.locationName}')">
                                Edit
                            </button>
                            <button class="admin-delete-button" style="border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:600; margin-left:6px;"
                                onclick="deleteLocation(${location.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.log(error));
}

function addLocation() {
    let locationName = document.getElementById("locationName").value.trim();

    if (locationName === "") {
        alert("Enter Location Name");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: locationName })
    })
        .then(response => response.json())
        .then(() => {
            alert("Location Added");
            clearForm();
            loadLocations();
        });
}

function editLocation(id, locationName) {
    document.getElementById("locationId").value = id;
    document.getElementById("locationName").value = locationName;
}

function updateLocation() {
    let id = document.getElementById("locationId").value;
    let locationName = document.getElementById("locationName").value.trim();

    if (id === "") {
        alert("Select a location first");
        return;
    }

    fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: locationName })
    })
        .then(response => response.json())
        .then(() => {
            alert("Location Updated");
            clearForm();
            loadLocations();
        });
}

function deleteLocation(id) {
    if (confirm("Delete this location?")) {
        fetch(API_URL + "/" + id, { method: "DELETE" })
            .then(() => {
                alert("Deleted");
                loadLocations();
            });
    }
}

function clearForm() {
    document.getElementById("locationId").value = "";
    document.getElementById("locationName").value = "";
}