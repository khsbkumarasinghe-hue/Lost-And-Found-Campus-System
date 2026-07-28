const CLAIM_API = '/api/claims';
let adminClaims = [];
let itemMap = {};

const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

async function loadClaims() {
    try {
        const [claimsResponse, itemsResponse] = await Promise.all([fetch(CLAIM_API), fetch('/api/items')]);
        if (!claimsResponse.ok || !itemsResponse.ok) throw new Error('Could not load claim records.');
        adminClaims = await claimsResponse.json();
        const items = await itemsResponse.json();
        itemMap = Object.fromEntries(items.map(item => [item.id, item.name]));
        renderAdminClaims();
    } catch (error) {
        document.getElementById('adminClaimEmpty').textContent = error.message;
        showAdminMessage(error.message, 'error');
    }
}

function renderAdminClaims() {
    const query = document.getElementById('adminClaimSearch').value.toLowerCase().trim();
    const status = document.getElementById('adminClaimStatus').value;
    const filtered = adminClaims.filter(claim => {
        const text = `${claim.id} ${claim.itemId} ${itemMap[claim.itemId] ?? ''} ${claim.claimantId} ${claim.proofDescription}`.toLowerCase();
        return (!status || claim.status === status) && text.includes(query);
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    document.getElementById('adminClaimBody').innerHTML = filtered.map(claim => `
        <tr>
            <td>#${claim.id}</td>
            <td><strong>${escapeHtml(itemMap[claim.itemId] ?? `Item #${claim.itemId}`)}</strong><br><span class="admin-small-text">ID: ${claim.itemId}</span></td>
            <td>User #${claim.claimantId}</td>
            <td class="admin-message-cell">${escapeHtml(claim.proofDescription)}</td>
            <td>${escapeHtml(formatDate(claim.createdAt))}</td>
            <td><span class="claim-status ${claim.status}">${escapeHtml(claim.status)}</span></td>
            <td><div class="admin-claim-actions">
                ${claim.status === 'PENDING' ? `
                    <button class="claim-approve" onclick="updateStatus(${claim.id}, 'APPROVED')">Approve</button>
                    <button class="claim-reject" onclick="updateStatus(${claim.id}, 'REJECTED')">Reject</button>` : ''}
                <button class="claim-delete" onclick="deleteClaim(${claim.id})">Delete</button>
            </div></td>
        </tr>`).join('');

    const empty = document.getElementById('adminClaimEmpty');
    empty.classList.toggle('hidden', filtered.length > 0);
    if (!filtered.length) empty.textContent = adminClaims.length ? 'No claims match your filters.' : 'No claims have been submitted.';
}

function formatDate(value) {
    return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
}

async function updateStatus(id, status) {
    if (!confirm(`${status === 'APPROVED' ? 'Approve' : 'Reject'} claim #${id}?`)) return;
    await performAction(`${CLAIM_API}/${id}/status?status=${status}`, { method: 'PATCH' }, `Claim ${status.toLowerCase()}.`);
}

async function deleteClaim(id) {
    if (!confirm(`Permanently delete claim #${id}?`)) return;
    await performAction(`${CLAIM_API}/${id}`, { method: 'DELETE' }, 'Claim deleted.');
}

async function performAction(url, options, message) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('The action could not be completed.');
        showAdminMessage(message);
        await loadClaims();
    } catch (error) {
        showAdminMessage(error.message, 'error');
    }
}

function showAdminMessage(message, type = 'success') {
    const element = document.getElementById('adminClaimMessage');
    element.textContent = message;
    element.className = `claim-message ${type}`;
    window.setTimeout(() => element.classList.add('hidden'), 4000);
}

function logout() {
    localStorage.removeItem('loggedInUserId');
    window.location.href = '../User/login.html';
}

loadClaims();
