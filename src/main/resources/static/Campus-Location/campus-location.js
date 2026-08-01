const API_URL = '/api/campus-locations'; // Adjust path according to CampusLocationController.java

document.addEventListener('DOMContentLoaded', () => {
    loadLocations();

    const locationForm = document.getElementById('locationForm');
    const cancelBtn = document.getElementById('cancelBtn');

    locationForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

// Fetch all locations
async function loadLocations() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch locations');
        const locations = await response.json();

        const tableBody = document.getElementById('locationTableBody');
        tableBody.innerHTML = '';

        locations.forEach(loc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${loc.id}</td>
                <td>${loc.name || loc.locationName || ''}</td>
                <td>${loc.building || loc.buildingName || ''}</td>
                <td>${loc.description || ''}</td>
                <td class="action-btns">
                    <button onclick="editLocation(${loc.id}, '${loc.name || loc.locationName}', '${loc.building || ''}', '${loc.description || ''}')">Edit</button>
                    <button class="delete-btn" onclick="deleteLocation(${loc.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// Handle Add / Update
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('locationId').value;
    const locationData = {
        name: document.getElementById('locationName').value,
        building: document.getElementById('buildingName').value,
        description: document.getElementById('description').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationData)
        });

        if (response.ok) {
            resetForm();
            loadLocations();
        } else {
            console.error('Error saving location details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Populate form for editing
function editLocation(id, name, building, description) {
    document.getElementById('locationId').value = id;
    document.getElementById('locationName').value = name;
    document.getElementById('buildingName').value = building;
    document.getElementById('description').value = description;

    document.getElementById('submitBtn').innerText = 'Update Location';
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

// Delete location
async function deleteLocation(id) {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadLocations();
        } else {
            console.error('Failed to delete location');
        }
    } catch (error) {
        console.error('Error deleting location:', error);
    }
}

// Reset Form
function resetForm() {
    document.getElementById('locationId').value = '';
    document.getElementById('locationForm').reset();
    document.getElementById('submitBtn').innerText = 'Save Location';
    document.getElementById('cancelBtn').style.display = 'none';
}