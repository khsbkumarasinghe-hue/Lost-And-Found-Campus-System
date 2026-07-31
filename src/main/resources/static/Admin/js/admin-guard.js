// Blocks access to any admin page unless the logged-in user's role is ADMIN
(function () {
    const userId = localStorage.getItem('loggedInUserId');
    const role = localStorage.getItem('loggedInUserRole');

    if (!userId || role !== 'ADMIN') {
        window.location.href = '../User/login.html';
    }
})();