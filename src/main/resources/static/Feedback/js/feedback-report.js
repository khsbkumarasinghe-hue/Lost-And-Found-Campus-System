const API_URL = '/api/feedback-reports';

let feedbackReports = [];

/*
    Check whether an ID is included in the URL.

    Example:
    feedback-report.html?id=5
*/
const queryParameters = new URLSearchParams(window.location.search);
const feedbackIdFromUrl = queryParameters.get('id');

document.addEventListener('DOMContentLoaded', function () {

    loadFeedbackReports();

    if (feedbackIdFromUrl) {
        loadFeedbackForEdit(feedbackIdFromUrl);
    }
});


/*
    Show Item ID only when the user selects Report Abuse.
*/
function changeReportType() {

    const reportType =
        document.getElementById('reportType').value;

    const itemIdContainer =
        document.getElementById('itemIdContainer');

    if (reportType === 'REPORT_ABUSE') {
        itemIdContainer.style.display = 'block';
    } else {
        itemIdContainer.style.display = 'none';
        document.getElementById('itemId').value = '';
    }
}


/*
    CREATE or UPDATE feedback.

    If feedbackId contains a value:
        PUT request is used.

    If feedbackId is empty:
        POST request is used.
*/
async function saveFeedback() {

    clearMessage();

    const feedbackId =
        document.getElementById('feedbackId').value;

    const userName =
        document.getElementById('userName').value.trim();

    const email =
        document.getElementById('email').value.trim();

    const reportType =
        document.getElementById('reportType').value;

    const itemIdValue =
        document.getElementById('itemId').value;

    const subject =
        document.getElementById('subject').value.trim();

    const message =
        document.getElementById('message').value.trim();

    if (userName === '') {
        showError('Please enter your name.');
        return;
    }

    if (email === '') {
        showError('Please enter your email address.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    if (reportType === '') {
        showError('Please select a submission type.');
        return;
    }

    if (subject === '') {
        showError('Please enter a subject.');
        return;
    }

    if (message === '') {
        showError('Please enter your message.');
        return;
    }

    const feedbackReport = {
        userName: userName,
        email: email,
        reportType: reportType,
        subject: subject,
        message: message,
        itemId: itemIdValue === ''
            ? null
            : Number(itemIdValue)
    };

    /*
        When editing, keep the current status.

        A normal user should not change the review status.
    */
    if (feedbackId) {

        const existingReport = feedbackReports.find(
            report => String(report.id) === String(feedbackId)
        );

        feedbackReport.status =
            existingReport?.status || 'PENDING';
    }

    const url = feedbackId
        ? `${API_URL}/${feedbackId}`
        : API_URL;

    const method = feedbackId
        ? 'PUT'
        : 'POST';

    try {

        setSubmitButtonLoading(true);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackReport)
        });

        if (!response.ok) {
            throw new Error('Unable to save feedback.');
        }

        if (feedbackId) {
            showSuccess('Feedback updated successfully.');
        } else {
            showSuccess('Feedback submitted successfully.');
        }

        resetForm();
        await loadFeedbackReports();

    } catch (error) {

        console.error(error);

        showError(
            'Unable to save the feedback. Please check whether the server is running.'
        );

    } finally {

        setSubmitButtonLoading(false);
    }
}


/*
    READ all feedback records.
*/
async function loadFeedbackReports() {

    const feedbackGrid =
        document.getElementById('feedbackGrid');

    const emptyMessage =
        document.getElementById('emptyFeedbackMessage');

    feedbackGrid.innerHTML = '';

    emptyMessage.style.display = 'block';
    emptyMessage.textContent = 'Loading feedback records...';

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Unable to load feedback.');
        }

        feedbackReports = await response.json();

        feedbackGrid.innerHTML = '';

        if (feedbackReports.length === 0) {

            emptyMessage.style.display = 'block';
            emptyMessage.textContent =
                'No feedback records have been submitted.';

            return;
        }

        emptyMessage.style.display = 'none';

        feedbackReports.forEach(report => {

            const card = document.createElement('div');
            card.className = 'feedback-card';

            const status =
                report.status || 'PENDING';

            const reportTypeText =
                report.reportType === 'REPORT_ABUSE'
                    ? 'Report Abuse'
                    : 'General Feedback';

            const itemText =
                report.itemId
                    ? `<p><strong>Item ID:</strong> ${report.itemId}</p>`
                    : '';

            const createdDate =
                report.createdAt
                    ? formatDate(report.createdAt)
                    : '';

            card.innerHTML = `
                <div class="feedback-card-header">

                    <span class="feedback-type-badge ${report.reportType}">
                        ${reportTypeText}
                    </span>

                    <span class="feedback-status-badge ${status}">
                        ${status}
                    </span>

                </div>

                <div class="feedback-card-body">

                    <h3>${escapeHtml(report.subject)}</h3>

                    <p>
                        <strong>Submitted by:</strong>
                        ${escapeHtml(report.userName)}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${escapeHtml(report.email)}
                    </p>

                    ${itemText}

                    <p class="feedback-message-text">
                        ${escapeHtml(report.message)}
                    </p>

                    <p class="feedback-date">
                        ${createdDate}
                    </p>

                    <div class="feedback-actions">

                        <button
                            class="edit-btn"
                            onclick="editFeedback(${report.id})">

                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteFeedback(${report.id})">

                            Delete
                        </button>

                    </div>

                </div>
            `;

            feedbackGrid.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        emptyMessage.style.display = 'block';
        emptyMessage.textContent =
            'Unable to load feedback records.';
    }
}


/*
    Load one record into the form when the page URL contains an ID.
*/
async function loadFeedbackForEdit(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Feedback record not found.');
        }

        const feedback = await response.json();

        fillEditForm(feedback);

    } catch (error) {

        console.error(error);
        showError('Unable to load the feedback record.');
    }
}


/*
    UPDATE: place the selected record into the form.
*/
function editFeedback(id) {

    const feedback = feedbackReports.find(
        report => report.id === id
    );

    if (!feedback) {
        showError('Feedback record not found.');
        return;
    }

    fillEditForm(feedback);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function fillEditForm(feedback) {

    document.getElementById('feedbackId').value =
        feedback.id;

    document.getElementById('userName').value =
        feedback.userName || '';

    document.getElementById('email').value =
        feedback.email || '';

    document.getElementById('reportType').value =
        feedback.reportType || '';

    document.getElementById('itemId').value =
        feedback.itemId || '';

    document.getElementById('subject').value =
        feedback.subject || '';

    document.getElementById('message').value =
        feedback.message || '';

    document.getElementById('formTitle').textContent =
        'Edit Feedback / Report';

    document.getElementById('submitButton').textContent =
        'Update Feedback';

    document.getElementById('cancelButton').style.display =
        'block';

    changeReportType();
}


/*
    DELETE feedback.
*/
async function deleteFeedback(id) {

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
            throw new Error('Unable to delete feedback.');
        }

        const currentlyEditingId =
            document.getElementById('feedbackId').value;

        if (String(currentlyEditingId) === String(id)) {
            resetForm();
        }

        showSuccess('Feedback deleted successfully.');

        await loadFeedbackReports();

    } catch (error) {

        console.error(error);
        showError('Unable to delete the feedback record.');
    }
}


function cancelEdit() {
    resetForm();
    clearMessage();
}


function resetForm() {

    document.getElementById('feedbackId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('reportType').value = '';
    document.getElementById('itemId').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';

    document.getElementById('formTitle').textContent =
        'Feedback / Report Abuse';

    document.getElementById('submitButton').textContent =
        'Submit Feedback';

    document.getElementById('cancelButton').style.display =
        'none';

    document.getElementById('itemIdContainer').style.display =
        'none';
}


function showSuccess(message) {

    const messageBox =
        document.getElementById('formMessage');

    messageBox.className = 'feedback-success-message';
    messageBox.textContent = message;
}


function showError(message) {

    const messageBox =
        document.getElementById('formMessage');

    messageBox.className = 'feedback-error-message';
    messageBox.textContent = message;
}


function clearMessage() {

    const messageBox =
        document.getElementById('formMessage');

    messageBox.className = '';
    messageBox.textContent = '';
}


function setSubmitButtonLoading(isLoading) {

    const button =
        document.getElementById('submitButton');

    button.disabled = isLoading;

    if (isLoading) {
        button.textContent = 'Saving...';
    } else {

        const feedbackId =
            document.getElementById('feedbackId').value;

        button.textContent = feedbackId
            ? 'Update Feedback'
            : 'Submit Feedback';
    }
}


function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


function formatDate(dateValue) {

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleString();
}


/*
    Protect the page from HTML entered by users.
*/
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