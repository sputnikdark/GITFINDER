'use strict';

class GithubSearch {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.error = document.getElementById('error');
    this.profile = document.getElementById('profile');

    this.searchBtn.addEventListener('click', () => {
      const userName = this.searchInput.value.trim();

      if (userName.length > 1) {
        this.fetchUser(userName);
      }
    });
  }

  async fetchUser(username) {
    try {
      this.searchBtn.disabled = true;
      this.searchBtn.textContent = 'Loading...';

      this.error.classList.add('hidden');
      this.error.textContent = '';

      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();

      if (response.status === 200) {
        this.renderProfile(data);
      } else if (response.status === 404) {
        this.showError('Пользователь не найден');
      } else {
        this.showError('Ошибка сети');
      }
    } catch(err) {
      console.error(err);
    } finally {
      this.searchBtn.disabled = false;
      this.searchBtn.textContent = 'SEARCH';
    }
  }

  renderProfile(data) {
    const { avatar_url, name, login, public_repos, followers, html_url, bio } = data;
    this.profile.classList.remove('hidden');
    this.profile.innerHTML = `
      <img src="${avatar_url}" class="avatar">
      <h2 class="name">${name || login}</h2> <a href="${html_url}" target="_blank" class="login">@${login}</a>
      <p>${bio || 'Нет описания'}</p>
      <div class="stats">
      <div class="stat-item">
          <span class="stat-val">${public_repos}</span>
          <span class="stat-label">Repos</span>
      </div>
      <div class="stat-item">
          <span class="stat-val">${followers}</span>
          <span class="stat-label">Followers</span>
      </div>
      </div>
    `;
  }

  showError(message) {
    this.error.classList.remove('hidden');
    this.profile.classList.add('hidden');

    this.error.textContent = message;
  }
}

new GithubSearch();

// by Claus Maslov :3