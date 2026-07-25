const API_URL = '/api/feedback-reports';

let adminFeedbackReports = [];

document.addEventListener('DOMContentLoaded', function () {
    loadAdminFeedback();
});


/*
    READ all feedback records.
*/
async function loadAdminFeedback() {

    const emptyMessage =
        document.getElementById('adminEmptyMessage');

    emptyMessage.style.display = 'block';
    emptyMessage.textContent = 'Loading feedback records...';

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Unable to load feedback.');
        }

        adminFeedbackReports = await response.json();

        displayAdminFeedback();

    } catch (error) {

        console.error(error);

        emptyMessage.style.display = 'block';
        emptyMessage.textContent =
            'Unable to load feedback records.';
    }
}


/*
    Search and filter records.
*/
function displayAdminFeedback() {

    const tableBody =
        document.getElementById('adminFeedbackBody');

    const emptyMessage =
        document.getElementById('adminEmptyMessage');

    const search =
        document.getElementById('feedbackSearch')
            .value
            .toLowerCase()
            .trim();

    const typeFilter =
        document.getElementById('typeFilter').value;

    const statusFilter =
        document.getElementById('statusFilter').value;

    const filteredReports =
        adminFeedbackReports.filter(report => {

            const searchContent = `
                ${report.subject || ''}
                ${report.userName || ''}
                ${report.email || ''}
                ${report.message || ''}
            `.toLowerCase();

            const matchesSearch =
                searchContent.includes(search);

            const matchesType =
                typeFilter === '' ||
                report.reportType === typeFilter;

            const matchesStatus =
                statusFilter === '' ||
                report.status === statusFilter;

            return matchesSearch &&
                matchesType &&
                matchesStatus;
        });

    tableBody.innerHTML = '';

    if (filteredReports.length === 0) {

        emptyMessage.style.display = 'block';
        emptyMessage.textContent =
            'No matching feedback records found.';

        return;
    }

    emptyMessage.style.display = 'none';

    filteredReports.forEach(report => {

        const row =
            document.createElement('tr');

        const reportTypeText =
            report.reportType === 'REPORT_ABUSE'
                ? 'Report Abuse'
                : 'Feedback';

        row.innerHTML = `
            <td>${report.id}</td>

            <td>
                <strong>${escapeHtml(report.userName)}</strong>
                <br>
                <span class="admin-small-text">
                    ${escapeHtml(report.email)}
                </span>
            </td>

            <td>
                <span class="feedback-type-badge ${report.reportType}">
                    ${reportTypeText}
                </span>
            </td>

            <td>
                ${report.itemId || '-'}
            </td>

            <td>
                ${escapeHtml(report.subject)}
            </td>

            <td class="admin-message-cell">
                ${escapeHtml(report.message)}
            </td>

            <td>
                <select
                    class="status-select"
                    id="status-${report.id}">

                    <option
                        value="PENDING"
                        ${report.status === 'PENDING'
            ? 'selected'
            : ''}>

                        Pending
                    </option>

                    <option
                        value="REVIEWED"
                        ${report.status === 'REVIEWED'
            ? 'selected'
            : ''}>

                        Reviewed
                    </option>

                    <option
                        value="RESOLVED"
                        ${report.status === 'RESOLVED'
            ? 'selected'
            : ''}>

                        Resolved
                    </option>

                </select>
            </td>

            <td>
                <div class="admin-action-buttons">

                    <button
                        class="admin-update-button"
                        onclick="updateFeedbackStatus(${report.id})">

                        Update
                    </button>

                    <button
                        class="admin-delete-button"
                        onclick="deleteAdminFeedback(${report.id})">

                        Delete
                    </button>

                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


/*
    UPDATE the status.

    The full existing object is sent because your PUT endpoint
    updates the complete feedback record.
*/
async function updateFeedbackStatus(id) {

    const report =
        adminFeedbackReports.find(
            currentReport => currentReport.id === id
        );

    if (!report) {
        alert('Feedback record not found.');
        return;
    }

    const newStatus =
        document.getElementById(`status-${id}`).value;

    const updatedReport = {
        userName: report.userName,
        email: report.email,
        reportType: report.reportType,
        subject: report.subject,
        message: report.message,
        itemId: report.itemId,
        status: newStatus
    };

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedReport)
        });

        if (!response.ok) {
            throw new Error('Unable to update the status.');
        }

        alert('Status updated successfully.');

        await loadAdminFeedback();

    } catch (error) {

        console.error(error);

        alert(
            'Unable to update the status. Please check the server.'
        );
    }
}


/*
    DELETE feedback.
*/
async function deleteAdminFeedback(id) {

    const confirmed = confirm(
        'Are you sure you want to delete this feedback record?'
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Unable to delete the feedback.');
        }

        alert('Feedback deleted successfully.');

        await loadAdminFeedback();

    } catch (error) {

        console.error(error);

        alert('Unable to delete the feedback record.');
    }
}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return '';
    }

    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


function logout() {

    localStorage.removeItem('loggedInUserId');

    window.location.href =
        '../../User/login.html';
}