/**
 * =========================================================
 *  Luminescent.io — Supabase Auth Module
 *  Handles Supabase initialization, auth flows, and session management
 * =========================================================
 */

/* Keys are fetched dynamically from the /keys directory */
const SUPABASE_URL = 'https://lbinyquyfxdfcckcyskl.supabase.co';
let supabase = null;
let _supabaseInitPromise = null;

async function initSupabase() {
  if (_supabaseInitPromise) return _supabaseInitPromise;
  
  _supabaseInitPromise = (async () => {
    if (typeof window.supabase === 'undefined') {
      console.warn('Supabase SDK not loaded. Please ensure the CDN script is included.');
      return;
    }

    try {
      const response = await fetch('/keys/supabase_anon_key.txt');
      if (!response.ok) throw new Error('Failed to fetch key');
      const anonKey = (await response.text()).trim();
      
      if (anonKey && !anonKey.includes('YOUR_SUPABASE')) {
        supabase = window.supabase.createClient(SUPABASE_URL, anonKey);
      } else {
        console.warn('Supabase key is a placeholder in /keys/supabase_anon_key.txt');
      }
    } catch (err) {
      console.error('Auth Module: Could not fetch Supabase anon key from /keys/', err);
    }
  })();

  return _supabaseInitPromise;
}

/**
 * Saves a user session (Legacy compatibility wrapper, Supabase does this automatically)
 */
function saveSession(userObject) {
  // Supabase persists the session automatically in localStorage.
  // We keep this for backward compatibility if needed.
}

/**
 * Retrieves the current session from Supabase local storage asynchronously
 * @returns {Promise<Object|null>}
 */
async function getSession() {
  if (!supabase) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  
  return {
    token: session.access_token,
    name: session.user.user_metadata.full_name || session.user.email,
    email: session.user.email,
    loginTime: session.user.created_at
  };
}

/**
 * Retrieves synchronous session (Warning: may be null on initial load before Supabase resolves)
 */
function getSyncSession() {
  const sessionStr = localStorage.getItem('sb-lbinyquyfxdfcckcyskl-auth-token');
  if (sessionStr) {
    try {
      const sbSession = JSON.parse(sessionStr);
      return {
        name: sbSession.user.user_metadata?.full_name || sbSession.user.email,
        email: sbSession.user.email
      };
    } catch(e) {
      return null;
    }
  }
  return null;
}

/**
 * Clears the current session from Supabase
 */
async function clearSession() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Checks if a user is currently logged in (Synchronous check for initial loads)
 * @returns {boolean} True if a valid session exists in local storage
 */
function isLoggedIn() {
  return localStorage.getItem('sb-lbinyquyfxdfcckcyskl-auth-token') !== null;
}

/**
 * Redirects the user to chat.html if they are already logged in.
 */
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'chat.html';
  }
}

/**
 * Redirects the user to login.html if they are not logged in.
 */
function redirectIfGuest() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

/**
 * Validates an email address format using a regex pattern.
 */
function isValidEmail(emailAddress) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailAddress);
}

/**
 * Displays a toast notification.
 */
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-container');
  if (existingToast) {
    existingToast.remove();
  }

  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';

  const toastElement = document.createElement('div');
  toastElement.className = `toast toast--${type}`;
  toastElement.textContent = message;

  toastContainer.appendChild(toastElement);
  document.body.appendChild(toastContainer);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toastElement.classList.add('show');
    });
  });

  setTimeout(() => {
    toastElement.classList.remove('show');
    setTimeout(() => toastContainer.remove(), 300);
  }, 3000);
}

/**
 * Initializes the starfield canvas background animation.
 */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 120;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        xPosition: Math.random() * canvas.width,
        yPosition: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      star.opacity += star.speed * star.direction;
      if (star.opacity >= 1) {
        star.opacity = 1;
        star.direction = -1;
      } else if (star.opacity <= 0.1) {
        star.opacity = 0.1;
        star.direction = 1;
      }

      ctx.beginPath();
      ctx.arc(star.xPosition, star.yPosition, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.6})`;
      ctx.fill();
    }

    requestAnimationFrame(animateStars);
  }

  resizeCanvas();
  createStars();
  animateStars();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
  });
}
