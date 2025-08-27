console.log('projectDatabase.js loaded successfully');

// Use window.authToken instead of localStorage directly to ensure consistency
window.authToken = localStorage.getItem('authToken') || null;

// Function to show user-friendly messages
function showNotification(message, isSuccess = true) {
    // Remove any existing notifications
    const existingNotification = document.getElementById('customNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.id = 'customNotification';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.maxWidth = '300px';
    notification.style.wordWrap = 'break-word';
    
    if (isSuccess) {
        notification.style.backgroundColor = '#4CAF50'; // Green for success
    } else {
        notification.style.backgroundColor = '#F44336'; // Red for error
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
}

// Update auth button based on login status
function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        if (window.authToken) {
            authBtn.textContent = 'My Account';
            authBtn.onclick = () => showModal('accountModal');
        } else {
            authBtn.textContent = 'Login';
            authBtn.onclick = () => showModal('loginModal');
        }
    }
}

// Modal functions
function showModal(modalId) {
    console.log('Showing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        if (modalId === 'applyModal') {
            if (!window.authToken) {
                // Generate the "not logged in" content
                generateApplyNotLoggedIn();
                document.getElementById('applyNotLoggedInContainer').classList.remove('hidden');
                document.getElementById('applicationFormContainer').classList.add('hidden');
            } else {
                // Generate the application form with event listener attached
                generateApplicationForm(); // This function now handles the event listener attachment
                document.getElementById('applyNotLoggedInContainer').classList.add('hidden');
                document.getElementById('applicationFormContainer').classList.remove('hidden');
            }
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (modalId === 'registerModal') {
            const form = document.getElementById('registerForm');
            if (form) form.reset();
            const strengthBar = document.querySelector('.password-strength');
            if (strengthBar) strengthBar.className = 'password-strength mt-1 rounded';
            const helpText = document.getElementById('passwordHelp');
            if (helpText) helpText.textContent = 'Password must be at least 5 characters';
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.querySelector('.modal.active');
    if (modal && e.target.classList.contains('modal')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Section navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

// Password strength meter
function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.password-strength');
    const helpText = document.getElementById('passwordHelp');
    
    if (!strengthBar || !helpText) return;
    
    let strength = 0;
    if (password.length >= 5) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    strengthBar.className = 'password-strength mt-1 rounded';
    if (password.length > 0) {
        if (strength < 2) {
            strengthBar.classList.add('weak');
            helpText.textContent = 'Password is weak';
        } else if (strength < 4) {
            strengthBar.classList.add('medium');
            helpText.textContent = 'Password is medium';
        } else {
            strengthBar.classList.add('strong');
            helpText.textContent = 'Password is strong';
        }
    } else {
        helpText.textContent = 'Password must be at least 5 characters';
    }
}

// Initialize all form listeners after modal generation
function initializeFormListeners() {
    console.log('Initializing form listeners...');
    
    // Login form
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Attaching login form listener');
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                try {
                    const response = await fetch('http://localhost:5000/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    console.log('Login response:', data);
                    
                    if (response.ok) {
                        window.authToken = data.token;
                        localStorage.setItem('authToken', window.authToken);
                        updateAuthButton();
                        hideModal('loginModal');
                        showNotification('Login successful!', true);
                    } else {
                        showNotification(data.error || 'Invalid credentials', false);
                    }
                } catch (err) {
                    console.error('Login error:', err);
                    showNotification('Error connecting to server', false);
                }
            });
        }
    }, 500);

    // Register form
    setTimeout(() => {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            console.log('Attaching register form listener');
            
            // Password strength checker
            const passwordInput = document.getElementById('registerPassword');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => {
                    checkPasswordStrength(e.target.value);
                });
            }
            
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Register form submitted');
                
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    showNotification('Passwords do not match', false);
                    return;
                }

                try {
                    const response = await fetch('http://localhost:5000/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            first_name: firstName, 
                            last_name: lastName, 
                            email, 
                            password 
                        })
                    });
                    
                    const data = await response.json();
                    console.log('Register response:', data);
                    
                    if (response.ok) {
                        // Registration successful - redirect to login with pre-filled email
                        hideModal('registerModal');
                        showNotification('Registration successful! Please login with your credentials.', true);
                        
                        // Show login modal and pre-fill email
                        setTimeout(() => {
                            showModal('loginModal');
                            const loginEmailInput = document.getElementById('loginEmail');
                            if (loginEmailInput) {
                                loginEmailInput.value = email;
                            }
                        }, 1000);
                    } else {
                        showNotification(data.error || 'Registration failed', false);
                    }
                } catch (err) {
                    console.error('Registration error:', err);
                    showNotification('Error connecting to server', false);
                }
            });
        }
    }, 500);

    // Contact form
    setTimeout(() => {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            console.log('Attaching contact form listener');
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Contact form submitted');
                
                const name = document.getElementById('contactName').value;
                const email = document.getElementById('contactEmail').value;
                const subject = document.getElementById('contactSubject').value;
                const message = document.getElementById('contactMessage').value;

                try {
                    const response = await fetch('http://localhost:5000/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, subject, message })
                    });
                    
                    const data = await response.json();
                    console.log('Contact response:', data);
                    
                    if (response.ok) {
                        hideModal('contactModal');
                        showNotification('Message sent successfully!', true);
                        contactForm.reset();
                    } else {
                        showNotification(data.error || 'Failed to send message', false);
                    }
                } catch (err) {
                    console.error('Contact error:', err);
                    showNotification('Error connecting to server', false);
                }
            });
        }
    }, 500);

    // Newsletter form
    setTimeout(() => {
        const newsletterSubmit = document.getElementById('newsletterSubmit');
        if (newsletterSubmit) {
            console.log('Attaching newsletter listener');
            newsletterSubmit.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const emailInput = document.getElementById('newsletterEmail');
                const email = emailInput.value;
                
                if (!email) {
                    showNotification('Please enter an email address', false);
                    return;
                }

                try {
                    const response = await fetch('http://localhost:5000/api/newsletter', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    
                    const data = await response.json();
                    console.log('Newsletter response:', data);
                    
                    if (response.ok) {
                        emailInput.value = '';
                        showNotification('Subscribed to newsletter successfully!', true);
                    } else {
                        showNotification(data.error || 'Subscription failed', false);
                    }
                } catch (err) {
                    console.error('Newsletter error:', err);
                    showNotification('Error connecting to server', false);
                }
            });
        }
    }, 500);

    // Account modal buttons
    setTimeout(() => {
        const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
        if (viewApplicationsBtn) {
            viewApplicationsBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/applications', {
                        headers: {
                            'Authorization': `Bearer ${window.authToken}`
                        }
                    });
                    
                    const applications = await response.json();
                    const applicationsList = document.getElementById('applicationsList');
                    
                    if (applicationsList) {
                        applicationsList.classList.remove('hidden');
                        if (applications.length > 0) {
                            applicationsList.innerHTML = `
                                <h3 class="text-xl font-bold mb-4">My Applications</h3>
                                ${applications.map(app => `
                                    <div class="border rounded-lg p-4 mb-2">
                                        <p><strong>Program:</strong> ${app.program}</p>
                                        <p><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleDateString()}</p>
                                    </div>
                                `).join('')}
                            `;
                        } else {
                            applicationsList.innerHTML = `
                                <h3 class="text-xl font-bold mb-4">My Applications</h3>
                                <div class="border rounded-lg p-4">
                                    <p class="text-gray-600 dark:text-gray-300 text-center">No applications yet.</p>
                                </div>
                            `;
                        }
                    }
                } catch (err) {
                    console.error('Error fetching applications:', err);
                    showNotification('Error fetching applications', false);
                }
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.authToken = null;
                localStorage.removeItem('authToken');
                updateAuthButton();
                hideModal('accountModal');
                showNotification('Logged out successfully', true);
            });
        }
    }, 500);
}

// Check backend connection
async function checkBackendConnection() {
    try {
        const response = await fetch('http://localhost:5000/api/test');
        
        if (response.ok) {
            console.log('✓ Backend server is connected');
            showNotification('Connected to server', true);
            setTimeout(() => {
                const notification = document.getElementById('customNotification');
                if (notification) notification.remove();
            }, 2000);
        } else {
            throw new Error('Server responded with error');
        }
    } catch (error) {
        console.error('Backend connection failed:', error);
        showNotification('Server not connected - Please run "node app.js" in the backend folder', false);
    }
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application');
    
    // Check backend connection first
    checkBackendConnection();
    
    // Update auth button
    updateAuthButton();
    
    // Initialize dark mode toggle
    setTimeout(() => {
        initializeDarkMode();
    }, 500);
    
    // Initialize form listeners after UI is generated
    setTimeout(() => {
        initializeFormListeners();
    }, 1000);
});