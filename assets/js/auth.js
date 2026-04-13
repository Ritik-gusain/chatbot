/**
 * =========================================================
 *  Luminescent.io — Auth Module
 *  Handles JWT simulation, sessions, OTP, redirects
 * =========================================================
 */

const SESSION_KEY = 'lum_session';

/**
 * Generates a random 6-digit OTP string.
 * @returns {string} A 6-digit numeric string, e.g. "482910"
 */
function generateOTP() {
  const otpValue = Math.floor(100000 + Math.random() * 900000);
  return otpValue.toString();
}

/**
 * Creates a mock JWT token from user data.
 * Format: lum_[base64(user)]_[timestamp]
 * @param {Object} userObject - The user object containing name and email
 * @param {string} userObject.name - User's full name
 * @param {string} userObject.email - User's email
 * @returns {string} A fake JWT-style token string
 */
function mockJWT(userObject) {
  const payloadString = JSON.stringify({
    name: userObject.name,
    email: userObject.email,
  });
  const base64Payload = btoa(payloadString);
  const timestamp = Date.now();
  return `lum_${base64Payload}_${timestamp}`;
}

/**
 * Saves a user session to localStorage.
 * Stores token, name, email, and login time.
 * @param {Object} userObject - The user data to persist
 * @param {string} userObject.name - User's full name
 * @param {string} userObject.email - User's email
 * @returns {void}
 */
function saveSession(userObject) {
  const token = mockJWT(userObject);
  const sessionData = {
    token: token,
    name: userObject.name,
    email: userObject.email,
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

/**
 * Retrieves the current session from localStorage.
 * @returns {Object|null} Parsed session object or null if not found
 */
function getSession() {
  const rawSession = localStorage.getItem(SESSION_KEY);
  if (!rawSession) {
    return null;
  }
  try {
    return JSON.parse(rawSession);
  } catch (parseError) {
    console.error('Failed to parse session data:', parseError);
    return null;
  }
}

/**
 * Clears the current session from localStorage.
 * Also clears any conversation data.
 * @returns {void}
 */
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if a valid session exists
 */
function isLoggedIn() {
  const currentSession = getSession();
  return currentSession !== null && currentSession.token !== undefined;
}

/**
 * Redirects the user to chat.html if they are already logged in.
 * Intended for use on the login page.
 * @returns {void}
 */
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'chat.html';
  }
}

/**
 * Redirects the user to login.html if they are not logged in.
 * Intended for use on protected pages like chat.html.
 * @returns {void}
 */
function redirectIfGuest() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

/**
 * Validates an email address format using a regex pattern.
 * @param {string} emailAddress - The email to validate
 * @returns {boolean} True if the email format is valid
 */
function isValidEmail(emailAddress) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailAddress);
}

/**
 * Displays a toast notification.
 * @param {string} message - The message to display
 * @param {string} [type='info'] - Toast type: 'success', 'info', or 'error'
 * @returns {void}
 */
function showToast(message, type = 'info') {
  /* Remove any existing toast */
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

  /* Trigger animation after paint */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toastElement.classList.add('show');
    });
  });

  /* Auto-dismiss after 3 seconds */
  const dismissDelay = 3000;
  setTimeout(() => {
    toastElement.classList.remove('show');
    setTimeout(() => toastContainer.remove(), 300);
  }, dismissDelay);
}

/**
 * Initializes the starfield canvas background animation.
 * Creates twinkling dots on a <canvas id="starfield"> element.
 * @returns {void}
 */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 120;

  /**
   * Resizes canvas to fill the window.
   */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * Creates the star array with random positions, sizes, and speeds.
   */
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

  /**
   * Animation loop that draws and updates stars each frame.
   */
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
