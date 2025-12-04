// ==================== SNOWFLAKE ANIMATION ====================

function createSnow() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = Math.random() * 10 + 10 + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = Math.random() * 0.5 + 1 + 'em';
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
        snowContainer.appendChild(snowflake);
    }
}

// ==================== SPARKLES EFFECT ====================

function createSparkle(x, y) {
    const sparklesContainer = document.getElementById('sparkles-container');
    if (!sparklesContainer) return;

    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.innerHTML = '✨';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparklesContainer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 2000);
}

// Generate random sparkles on page interaction
document.addEventListener('click', (e) => {
    if (e.target.id !== 'music-toggle' && !e.target.classList.contains('bell')) {
        createSparkle(e.clientX, e.clientY);
    }
});

// ==================== URL UTILITIES ====================

function getQueryParam(param) {
    const url = new URL(window.location);
    return url.searchParams.get(param);
}

function generateLink(fromName, themeId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/wish?from=${encodeURIComponent(fromName)}&theme=${themeId}`;
}

// ==================== MUSIC CONTROL ====================

function initMusicControl() {
    const musicToggle = document.getElementById('music-toggle');
    const christmasMusic = document.getElementById('christmas-music');

    if (musicToggle && christmasMusic) {
        // Try to play music with muted attribute first (allowed by browsers)
        christmasMusic.play().catch(err => console.log('Autoplay prevented:', err));
        musicToggle.classList.add('playing');

        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (christmasMusic.paused) {
                christmasMusic.muted = false;
                christmasMusic.play().catch(err => console.log('Autoplay prevented:', err));
                musicToggle.classList.add('playing');
            } else {
                christmasMusic.pause();
                musicToggle.classList.remove('playing');
            }
        });

        // Unmute on first user interaction and play
        document.addEventListener('click', () => {
            christmasMusic.muted = false;
            christmasMusic.play().catch(err => console.log('Autoplay prevented:', err));
            musicToggle.classList.add('playing');
        }, { once: true });

        // Also unmute on any keyboard interaction
        document.addEventListener('keydown', () => {
            if (christmasMusic.muted) {
                christmasMusic.muted = false;
                christmasMusic.play().catch(err => console.log('Autoplay prevented:', err));
            }
        }, { once: true });

        // Stop music when user leaves or closes the page
        window.addEventListener('beforeunload', () => {
            christmasMusic.pause();
            christmasMusic.currentTime = 0;
        });

        // Also handle page visibility (when user switches tabs)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                christmasMusic.pause();
            } else {
                if (!christmasMusic.paused) {
                    christmasMusic.play().catch(err => console.log('Autoplay prevented:', err));
                }
            }
        });
    }
}

// ==================== HOMEPAGE FUNCTIONALITY ====================

function initHomepage() {
    const wishForm = document.getElementById('wish-form');
    const fromNameInput = document.getElementById('from-name');
    const linkSection = document.getElementById('link-section');
    const generatedLink = document.getElementById('generated-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const createAnotherBtn = document.getElementById('create-another-btn');
    let selectedTheme = 'snow';
    let wishId = null;

    // Theme selection
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTheme = btn.dataset.theme;
        });
    });

    // Form submission
    if (wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fromName = fromNameInput.value.trim();
            if (!fromName) {
                alert('Please enter your name!');
                return;
            }

            // Create wish via API
            try {
                const response = await fetch('/api/wishes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from_name: fromName,
                        background_theme: selectedTheme,
                        greeting_style: 'standard'
                    })
                });

                const data = await response.json();
                if (data.link) {
                    wishId = data.id;
                    generatedLink.value = data.link;
                    linkSection.classList.remove('hidden');

                    // Scroll to link section
                    setTimeout(() => {
                        linkSection.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                } else {
                    alert('Failed to generate link. Try again!');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error creating wish. Please try again!');
            }
        });
    }

    // Copy link button
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            generatedLink.select();
            document.execCommand('copy');

            copyLinkBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyLinkBtn.textContent = '📋 Copy Link';
            }, 2000);
        });
    }

    // Create another wish
    if (createAnotherBtn) {
        createAnotherBtn.addEventListener('click', () => {
            wishForm.reset();
            linkSection.classList.add('hidden');
            fromNameInput.focus();
            themeBtns.forEach(b => b.classList.remove('active'));
            themeBtns[0].classList.add('active');
            selectedTheme = 'snow';
        });
    }

    // Share buttons
    const shareWhatsApp = document.getElementById('share-whatsapp');
    const shareFacebook = document.getElementById('share-facebook');
    const shareTwitter = document.getElementById('share-twitter');

    if (shareWhatsApp) {
        shareWhatsApp.addEventListener('click', () => {
            const link = generatedLink.value;
            const text = `🎄 I created a Christmas wish for you! Open it and input your name to wish a different person: ${link}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    if (shareFacebook) {
        shareFacebook.addEventListener('click', () => {
            const link = generatedLink.value;
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
        });
    }

    if (shareTwitter) {
        shareTwitter.addEventListener('click', () => {
            const link = generatedLink.value;
            const text = `🎄 I created a Christmas wish for you! Open it and input your name to wish a different person: ${link}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
        });
    }
}

// ==================== WISH PAGE FUNCTIONALITY ====================

function getRandomWishMessage(fromName) {
    const messages = [
        `🎄 Merry Christmas! 🎄

This festive wish is from <strong>${fromName}</strong> to you!

May your holidays be filled with joy, laughter, and love.
Wishing you a magical Christmas season! 🎅⛄✨`,
        
        `✨ A Special Christmas Wish ✨

<strong>${fromName}</strong> has sent you warmest Christmas greetings!

May this season bring you happiness, peace, and endless blessings.
Here's to a wonderful and memorable holiday! 🎁🎄🌟`,
        
        `❄️ Warm Wishes from ${fromName} ❄️

This Christmas, may you be surrounded by love and joy!

<strong>${fromName}</strong> wishes you a season filled with laughter, magic, and cherished moments.
Happy Holidays! 🎅✨🎄`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}

function initWishPage() {
    const wishId = getQueryParam('id');
    const wishMessage = document.getElementById('wish-message');
    const createOwnWishBtn = document.getElementById('create-own-wish');
    const bells = document.querySelectorAll('.bell');
    const wishBody = document.getElementById('wish-body');

    // Fetch wish data from database
    if (wishId) {
        fetch(`/api/wishes/id/${wishId}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.from_name) {
                    const fromName = data.from_name;
                    const theme = data.background_theme || 'snow';
                    
                    // Apply theme
                    applyTheme(theme, wishBody);

                    // Display random message
                    const customMessage = getRandomWishMessage(fromName);
                    wishMessage.innerHTML = customMessage;
                } else {
                    wishMessage.textContent = 'Wish not found! 🎄';
                    applyTheme('snow', wishBody);
                }
            })
            .catch(error => {
                console.error('Error fetching wish:', error);
                wishMessage.textContent = 'Error loading wish! 🎄';
                applyTheme('snow', wishBody);
            });
    } else {
        wishMessage.textContent = 'Welcome to your Christmas wish! 🎄';
        applyTheme('snow', wishBody);
    }

    // Create own wish button
    if (createOwnWishBtn) {
        createOwnWishBtn.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    // Bell clicking easter egg
    const bellSound = document.getElementById('bell-sound');
    bells.forEach(bell => {
        bell.addEventListener('click', (e) => {
            e.stopPropagation();
            bell.classList.add('ringing');

            if (bellSound) {
                bellSound.currentTime = 0;
                bellSound.play().catch(err => console.log('Bell sound error:', err));
            }

            setTimeout(() => {
                bell.classList.remove('ringing');
            }, 300);
        });
    });
}

// ==================== THEME APPLICATION ====================

function applyTheme(theme, element) {
    if (!element) element = document.body;

    switch (theme) {
        case 'lights':
            element.style.background = 'linear-gradient(135deg, #1a1a3e 0%, #3d1a5c 50%, #1a1a2e 100%)';
            break;
        case 'santa':
            element.style.background = 'linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #8b0000 100%)';
            break;
        case 'fireplace':
            element.style.background = 'linear-gradient(135deg, #2d1a0a 0%, #8b4513 50%, #1a0f05 100%)';
            break;
        case 'snow':
        default:
            element.style.background = 'linear-gradient(135deg, #0f2818 0%, #1a3a2e 50%, #0d1f17 100%)';
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Create snow effect
    createSnow();

    // Initialize music control
    initMusicControl();

    // Ensure music plays after a short delay on wish page
    const isWishPage = window.location.pathname === '/wish';
    if (isWishPage) {
        setTimeout(() => {
            const christmasMusic = document.getElementById('christmas-music');
            if (christmasMusic && christmasMusic.paused) {
                christmasMusic.play().catch(err => console.log('Music play attempted'));
            }
        }, 500);
    }

    // Check if we're on homepage or wish page
    if (isWishPage) {
        initWishPage();
    } else {
        initHomepage();
    }
});

// ==================== RESPONSIVE PARTICLES ====================

// Create additional sparkles periodically on wish page
if (window.location.pathname === '/wish') {
    setInterval(() => {
        if (Math.random() > 0.7) {
            createSparkle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }
    }, 500);
}
