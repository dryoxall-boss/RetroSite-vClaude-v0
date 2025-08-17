// Configuration
const CONFIG = {
  FEED_BATCH_SIZE: 20,
  SCROLL_THRESHOLD: 0.8,
  STORAGE_KEYS: {
    SETTINGS: 'retroScroll:settings',
    STATS: 'retroScroll:stats',
    GAMES: 'retroScroll:games',
    IDENTITY: 'retroScroll:identity'
  }
};

// State Management
const state = {
  feed: [],
  lastId: 0,
  loading: false,
  view: 'feed',
  identity: null,
  stats: {
    xp: 0,
    level: 1,
    streak: 0,
    visits: 0,
    distance: 0
  },
  games: new Map(),
  currentGame: null
};

// Anonymous Identity Generation
function generateIdentity() {
  const adjectives = ['Cosmic', 'Pixel', 'Retro', 'Neon', 'Digital'];
  const nouns = ['Wizard', 'Ninja', 'Hacker', 'Runner', 'Ghost'];
  const number = Math.floor(Math.random() * 9999);
  
  return {
    username: `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`,
    avatar: `data:image/svg+xml,${encodeURIComponent(generatePixelAvatar())}`
  };
}

function generatePixelAvatar() {
  // Generate a simple 8x8 pixel art avatar as SVG
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
  let svg = '<svg width="64" height="64" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">';
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (Math.random() > 0.5) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        svg += `<rect x="${i}" y="${j}" width="1" height="1" fill="${color}"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

// Mock Content Generation
function generateMockContent() {
  const types = ['fact', 'image', 'achievement', 'ai', 'ad'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  state.lastId++;
  
  switch (type) {
    case 'fact':
      return {
        id: state.lastId,
        type,
        content: `Did you know? ${Math.random().toString(36).slice(2)}`,
        source: 'RetroFacts™'
      };
    case 'image':
      return {
        id: state.lastId,
        type,
        imageUrl: `data:image/svg+xml,${encodeURIComponent(generatePixelArt())}`,
        caption: `Awesome pixel art #${state.lastId}`
      };
    case 'ad':
      return {
        id: state.lastId,
        type,
        sponsored: true,
        title: 'Retro Gaming Bundle',
        description: 'Get your pixels worth!',
        cta: 'Shop Now'
      };
    default:
      return {
        id: state.lastId,
        type: 'fact',
        content: 'Random content',
        source: 'RetroScroll'
      };
  }
}

function generatePixelArt() {
  // Generate a simple colored pixel art SVG
  return '<svg width="100" height="100" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="10" height="10" fill="#000"/>' +
    Array(20).fill().map(() => 
      `<rect x="${Math.floor(Math.random() * 10)}" y="${Math.floor(Math.random() * 10)}" width="1" height="1" fill="hsl(${Math.random() * 360}, 100%, 50%)"/>`
    ).join('') +
    '</svg>';
}

// View Management
function initializeViews() {
  const views = ['feed', 'games', 'about'];
  const navButtons = document.querySelectorAll('[data-view]');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewName = btn.dataset.view;
      switchView(viewName);
    });
  });
}

function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show selected view
  document.getElementById(`${viewName}View`).classList.add('active');
  
  // Update navigation
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
  
  state.view = viewName;
  
  // Handle special view initialization
  if (viewName === 'games' && !state.currentGame) {
    initializeGames();
  }
}

// Feed Management
async function initializeFeed() {
  const feedGrid = document.querySelector('.feed-grid');
  
  // Initial load
  await loadMoreContent();
  
  // Infinite scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.loading) {
        loadMoreContent();
      }
    });
  }, {
    threshold: CONFIG.SCROLL_THRESHOLD
  });
  
  // Observe last item
  const sentinel = document.createElement('div');
  sentinel.className = 'sentinel';
  feedGrid.appendChild(sentinel);
  observer.observe(sentinel);
}

async function loadMoreContent() {
  state.loading = true;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newContent = Array(CONFIG.FEED_BATCH_SIZE).fill().map(generateMockContent);
  state.feed.push(...newContent);
  
  renderFeed();
  state.loading = false;
}

function renderFeed() {
  const feedGrid = document.querySelector('.feed-grid');
  const fragment = document.createDocumentFragment();
  
  state.feed.forEach(item => {
    const card = createCard(item);
    fragment.appendChild(card);
  });
  
  feedGrid.innerHTML = '';
  feedGrid.appendChild(fragment);
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-id', item.id);
  
  switch (item.type) {
    case 'fact':
      card.innerHTML = `
        <p>${item.content}</p>
        <small>Source: ${item.source}</small>
      `;
      break;
    case 'image':
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.caption}" loading="lazy">
        <p>${item.caption}</p>
      `;
      break;
    case 'ad':
      card.innerHTML = `
        <div class="ad-card">
          <span class="ad-label">Sponsored</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <button class="cta-button">${item.cta}</button>
        </div>
      `;
      break;
  }
  
  return card;
}

// Games Management
function initializeGames() {
  const games = [
    {
      id: 'flappy',
      title: 'Flappy Cat',
      thumbnail: generateGameThumbnail('flappy'),
      module: '/games/flappy.js'
    },
    {
      id: 'pacman',
      title: 'Pixel Maze',
      thumbnail: generateGameThumbnail('pacman'),
      module: '/games/pacman.js'
    },
    {
      id: 'dino',
      title: 'Pixel Runner',
      thumbnail: generateGameThumbnail('dino'),
      module: '/games/dino.js'
    }
  ];
  
  const gamesGrid = document.querySelector('.games-grid');
  gamesGrid.innerHTML = '';
  
  games.forEach(game => {
    const gameCard = createGameCard(game);
    gamesGrid.appendChild(gameCard);
  });
}

function generateGameThumbnail(gameId) {
  // Generate simple game preview
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="200" height="200" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" fill="#000"/>
      <text x="10" y="10" fill="#0f0" text-anchor="middle">${gameId}</text>
    </svg>`
  )}`;
}

function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.innerHTML = `
    <img src="${game.thumbnail}" alt="${game.title}">
    <div class="game-info">
      <h3>${game.title}</h3>
      <button class="play-btn">Play</button>
    </div>
  `;
  
  card.querySelector('.play-btn').addEventListener('click', () => {
    loadGame(game);
  });
  
  return card;
}

async function loadGame(game) {
  const container = document.querySelector('.game-container');
  container.classList.remove('hidden');
  
  // Mock game loading
  container.innerHTML = `
    <button class="close-game">×</button>
    <div class="game-frame">
      <h2>${game.title}</h2>
      <canvas width="400" height="300"></canvas>
      <div class="game-controls">
        <button class="control-btn">←</button>
        <button class="control-btn">→</button>
        <button class="control-btn">Space</button>
      </div>
    </div>
  `;
  
  container.querySelector('.close-game').addEventListener('click', () => {
    container.classList.add('hidden');
    if (state.currentGame) {
      state.currentGame.destroy();
      state.currentGame = null;
    }
  });
  
  // Mock game initialization
  state.currentGame = {
    destroy: () => {
      console.log('Game cleanup');
    }
  };
}

// Stats & Progress
function initializeStats() {
  const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.STATS);
  if (stored) {
    state.stats = JSON.parse(stored);
  }
  
  updateStatsDisplay();
}

function updateStatsDisplay() {
  document.getElementById('xpValue').textContent = state.stats.xp;
  document.getElementById('levelValue').textContent = state.stats.level;
  document.getElementById('streakValue').textContent = state.stats.streak;
}

function awardXP(amount) {
  state.stats.xp += amount;
  const nextLevel = Math.floor(state.stats.xp / 100) + 1;
  
  if (nextLevel > state.stats.level) {
    state.stats.level = nextLevel;
    showLevelUp();
  }
  
  updateStatsDisplay();
  saveStats();
}

function showLevelUp() {
  // Simple confetti effect
  const confetti = document.createElement('div');
  confetti.className = 'level-up-confetti';
  document.body.appendChild(confetti);
  
  setTimeout(() => {
    confetti.remove();
  }, 3000);
}

// Storage Management
function saveStats() {
  localStorage.setItem(CONFIG.STORAGE_KEYS.STATS, JSON.stringify(state.stats));
}

// Initialize App
function initializeApp() {
  // Setup identity
  const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.IDENTITY);
  state.identity = stored ? JSON.parse(stored) : generateIdentity();
  
  if (!stored) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.IDENTITY, JSON.stringify(state.identity));
  }
  
  // Initialize components
  initializeViews();
  initializeFeed();
  initializeStats();
  
  // Setup keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'g') {
      switchView('games');
    } else if (e.key === 'f') {
      switchView('feed');
    }
  });
  
  // Easter egg
  let konami = '';
  document.addEventListener('keydown', (e) => {
    konami += e.key;
    if (konami.includes('arcade')) {
      startGameParade();
      konami = '';
    }
  });
}

function startGameParade() {
  // Trigger a sequence of game previews
  const games = document.querySelectorAll('.game-card');
  let index = 0;
  
  const interval = setInterval(() => {
    if (index >= games.length) {
      clearInterval(interval);
      return;
    }
    
    games[index].querySelector('.play-btn').click();
    index++;
  }, 2000);
}

// Start the app
initializeApp();