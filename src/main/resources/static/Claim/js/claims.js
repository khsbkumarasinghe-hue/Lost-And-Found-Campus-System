const CLAIM_API = '/api/claims';
const ITEM_API = '/api/items';
const claimantId = localStorage.getItem('loggedInUserId');

let claims = [];
let items = [];
let editingClaimId = null;

if (!claimantId) {
    window.location.href = '../User/login.html';
}

const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

function showMessage(message, type = 'success') {
    const element = document.getElementById('claimMessage');
    element.textContent = message;
    element.className = `claim-message ${type}`;
    window.setTimeout(() => element.classList.add('hidden'), 4000);
}

function itemName(itemId) {
    const item = items.find(candidate => Number(candidate.id) === Number(itemId));
    return item ? item.name : `Item #${itemId}`;
}

function formatDate(value) {
    if (!value) return 'Date unavailable';
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

async function loadPage() {
    try {
        const [itemResponse, claimResponse] = await Promise.all([
            fetch(ITEM_API),
            fetch(`${CLAIM_API}/user/${claimantId}`)
        ]);
        if (!itemResponse.ok || !claimResponse.ok) throw new Error('Could not load claims.');
        items = await itemResponse.json();
        claims = await claimResponse.json();
        populateItems();
        renderClaims();

        const requestedItem = new URLSearchParams(window.location.search).get('itemId');
        if (requestedItem && items.some(item => String(item.id) === requestedItem && item.status === 'FOUND')) {
            openClaimForm(requestedItem);
        }
    } catch (error) {
        document.getElementById('claimEmpty').textContent = error.message;
        showMessage(error.message, 'error');
    }
}

function populateItems() {
    const select = document.getElementById('itemId');
    const claimableItems = items.filter(item => item.status === 'FOUND');
    select.innerHTML = '<option value="">Select a found item</option>' + claimableItems.map(item =>
        `<option value="${item.id}">${escapeHtml(item.name)} — ${escapeHtml(item.status ?? 'ITEM')}</option>`
    ).join('');
}

function renderClaims() {
    const search = document.getElementById('claimSearch').value.trim().toLowerCase();
    const status = document.getElementById('claimStatusFilter').value;
    const filtered = claims
        .filter(claim => !status || claim.status === status)
        .filter(claim => `${itemName(claim.itemId)} ${claim.proofDescription}`.toLowerCase().includes(search))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const grid = document.getElementById('claimGrid');
    const empty = document.getElementById('claimEmpty');
    grid.innerHTML = filtered.map(claim => {
        const pending = claim.status === 'PENDING';
        return `
            <article class="claim-card">
                <div class="claim-card-top">
                    <div>
                        <span class="claim-id">CLAIM #${claim.id}</span>
                        <h3>${escapeHtml(itemName(claim.itemId))}</h3>
                    </div>
                    <span class="claim-status ${claim.status}">${escapeHtml(claim.status)}</span>
                </div>
                <p class="claim-proof">${escapeHtml(claim.proofDescription)}</p>
                <p class="claim-date">Submitted ${escapeHtml(formatDate(claim.createdAt))}</p>
                <div class="claim-actions">
                    ${pending ? `<button class="claim-edit" onclick="editClaim(${claim.id})">Edit proof</button>
                        <button class="claim-withdraw" onclick="withdrawClaim(${claim.id})">Withdraw</button>` : ''}
                    <button class="claim-delete" onclick="deleteClaim(${claim.id})">Delete</button>
                </div>
            </article>`;
    }).join('');
    empty.classList.toggle('hidden', filtered.length > 0);
    if (!filtered.length) {
        empty.textContent = claims.length ? 'No claims match your filters.' : 'You have not submitted any claims yet.';
    }
}

function openClaimForm(itemId = '') {
    editingClaimId = null;
    document.getElementById('claimForm').reset();
    document.getElementById('itemId').disabled = false;
    document.getElementById('itemId').value = itemId;
    document.getElementById('claimFormTitle').textContent = 'Submit a Claim';
    document.getElementById('submitClaimButton').textContent = 'Submit Claim';
    document.getElementById('proofCount').textContent = '0 / 1000';
    document.getElementById('claimFormPanel').classList.remove('hidden');
    document.getElementById('claimFormPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeClaimForm() {
    editingClaimId = null;
    document.getElementById('claimFormPanel').classList.add('hidden');
}

function editClaim(id) {
    const claim = claims.find(candidate => candidate.id === id);
    if (!claim) return;
    editingClaimId = id;
    document.getElementById('itemId').value = claim.itemId;
    document.getElementById('itemId').disabled = true;
    document.getElementById('proofDescription').value = claim.proofDescription;
    document.getElementById('proofCount').textContent = `${claim.proofDescription.length} / 1000`;
    document.getElementById('claimFormTitle').textContent = `Edit Claim #${id}`;
    document.getElementById('submitClaimButton').textContent = 'Save Changes';
    document.getElementById('claimFormPanel').classList.remove('hidden');
    document.getElementById('claimFormPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('proofDescription').addEventListener('input', event => {
    document.getElementById('proofCount').textContent = `${event.target.value.length} / 1000`;
});

document.getElementById('claimForm').addEventListener('submit', async event => {
    event.preventDefault();
    const button = document.getElementById('submitClaimButton');
    button.disabled = true;
    try {
        const proofDescription = document.getElementById('proofDescription').value.trim();
        const payload = editingClaimId
            ? { proofDescription }
            : { itemId: Number(document.getElementById('itemId').value), claimantId: Number(claimantId), proofDescription };
        const response = await fetch(editingClaimId ? `${CLAIM_API}/${editingClaimId}` : CLAIM_API, {
            method: editingClaimId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('The claim could not be saved.');
        showMessage(editingClaimId ? 'Claim updated successfully.' : 'Claim submitted successfully.');
        closeClaimForm();
        await refreshClaims();
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        button.disabled = false;
    }
});

async function refreshClaims() {
    const response = await fetch(`${CLAIM_API}/user/${claimantId}`);
    if (!response.ok) throw new Error('Could not refresh claims.');
    claims = await response.json();
    renderClaims();
}

async function withdrawClaim(id) {
    if (!confirm('Withdraw this pending claim?')) return;
    await runClaimAction(`${CLAIM_API}/${id}/withdraw`, { method: 'PATCH' }, 'Claim withdrawn.');
}

async function deleteClaim(id) {
    if (!confirm('Permanently delete this claim? This cannot be undone.')) return;
    await runClaimAction(`${CLAIM_API}/${id}`, { method: 'DELETE' }, 'Claim deleted.');
}

async function runClaimAction(url, options, successMessage) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('The action could not be completed.');
        showMessage(successMessage);
        await refreshClaims();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('loggedInUserId');
    window.location.href = '../User/login.html';
}

loadPage();
