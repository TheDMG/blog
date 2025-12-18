// Search functionality
(function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  let posts = [];

  // Fetch the search index
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      posts = data;
    })
    .catch(err => console.error('Error loading search index:', err));

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Search function
  function search(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    const q = query.toLowerCase();
    const results = posts.filter(post => {
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      const categories = (post.categories || []).join(' ').toLowerCase();
      const tags = (post.tags || []).join(' ').toLowerCase();

      return title.includes(q) ||
             content.includes(q) ||
             categories.includes(q) ||
             tags.includes(q);
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }

    const html = results.map(post => {
      const cats = post.categories ? post.categories.join(', ') : '';
      const tags = post.tags ? post.tags.join(', ') : '';
      let meta = post.date;
      if (cats) meta += ` · ${cats}`;

      return `
        <a href="${post.url}" class="result-item">
          <div class="result-title">${post.title}</div>
          <div class="result-meta">${meta}</div>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;
  }

  // Attach event listener
  searchInput.addEventListener('input', debounce(function(e) {
    search(e.target.value);
  }, 150));

  // Close on result click
  searchResults.addEventListener('click', function(e) {
    if (e.target.closest('.result-item')) {
      document.getElementById('search-modal').classList.remove('active');
      document.getElementById('search-overlay').classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();
