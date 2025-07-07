
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('click', () => {
            window.location.href = 'search_page.html';
        });
    }
});
