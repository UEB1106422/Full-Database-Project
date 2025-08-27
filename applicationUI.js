console.log('applicationUI.js loaded');

// Dynamically generate navigation bar
function generateNavbar() {
    document.getElementById('navbarContainer').innerHTML = `
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">G</div>
                <span class="text-xl font-bold text-green-600 dark:text-green-400">Greenwood High</span>
            </div>
            <nav class="hidden md:flex space-x-8">
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showSection('home')">Home</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showSection('about')">About</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showSection('courses')">Courses</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showModal('contactModal')">Contact</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showModal('applyModal')">Apply</a>
            </nav>
            <div class="flex items-center space-x-4">
                <button id="authBtn" class="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition" onclick="showModal('loginModal')">Login</button>
                <button class="md:hidden text-gray-800 dark:text-gray-200" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars text-2xl"></i>
                </button>
            </div>
        </div>
        <div id="mobileMenu" class="md:hidden hidden bg-white dark:bg-gray-900 shadow-lg">
            <div class="container mx-auto px-4 py-3 flex flex-col space-y-3">
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showSection('home'); toggleMobileMenu()">Home</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showSection('about'); toggleMobileMenu()">About</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showSection('courses'); toggleMobileMenu()">Courses</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showModal('contactModal'); toggleMobileMenu()">Contact</a>
                <a href="#" class="nav-link text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400" onclick="showModal('applyModal'); toggleMobileMenu()">Apply</a>
            </div>
        </div>
    `;
}

// Dynamically generate footer
function generateFooter() {
    document.getElementById('footerContainer').innerHTML = `
        <div class="bg-gray-900 text-white py-12">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-xl font-bold mb-4">Greenwood High</h3>
                        <p class="text-gray-400">Excellence in education since 1995.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-4">Quick Links</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition" onclick="showSection('home')">Home</a></li>
                            <li><a href="#" class="hover:text-white transition" onclick="showSection('about')">About</a></li>
                            <li><a href="#" class="hover:text-white transition" onclick="showSection('courses')">Courses</a></li>
                            <li><a href="#" class="hover:text-white transition" onclick="showModal('contactModal')">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-4">Contact Us</h3>
                        <p class="text-gray-400">123 Greenwood Lane<br>Education City, ED 12345<br>Phone: (555) 123-4567<br>Email: info@greenwoodhigh.edu</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-4">Newsletter</h3>
                        <p class="text-gray-400 mb-4">Subscribe to our newsletter for updates and announcements.</p>
                        <div class="flex">
                            <input type="email" id="newsletterEmail" placeholder="Your email" class="px-4 py-2 rounded-l-lg w-full text-gray-900">
                            <button id="newsletterSubmit" class="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-8 text-center text-gray-400">
                    &copy; 2024 Greenwood High School. All rights reserved.
                </div>
            </div>
        </div>
    `;
}

// Generate Login Modal
function generateLoginModal() {
    document.getElementById('loginModal').innerHTML = `
        <div class="modal-content">
            <button class="close-modal absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="hideModal('loginModal')">&times;</button>
            <h2 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
            <form id="loginForm" class="space-y-4">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" class="form-control" required>
                </div>
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" class="rounded text-green-600 focus:ring-green-500">
                        <span class="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                    </label>
                    <a href="#" class="text-sm text-green-600 hover:text-green-700">Forgot password?</a>
                </div>
                <button type="submit" class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Login
                </button>
            </form>
            <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Don't have an account? <a href="#" class="text-green-600 hover:text-green-700" onclick="hideModal('loginModal'); showModal('registerModal')">Register</a>
            </p>
        </div>
    `;
}

// Generate Register Modal
function generateRegisterModal() {
    document.getElementById('registerModal').innerHTML = `
        <div class="modal-content">
            <button class="close-modal absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="hideModal('registerModal')">&times;</button>
            <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>
            <form id="registerForm" class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" placeholder="Enter your first name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" placeholder="Enter your last name" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" placeholder="Enter your email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Password</label>
                    <input type="password" id="registerPassword" placeholder="Enter your password" class="form-control" required>
                    <div class="password-strength mt-1 rounded"></div>
                    <p id="passwordHelp" class="text-xs text-gray-500 mt-1">Password must be at least 5 characters</p>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm your password" class="form-control" required>
                </div>
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="terms" class="rounded text-green-600 focus:ring-green-500" required>
                    <label for="terms" class="text-sm text-gray-600 dark:text-gray-300">I agree to the terms and conditions</label>
                </div>
                <button type="submit" class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Register
                </button>
            </form>
            <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Already have an account? <a href="#" class="text-green-600 hover:text-green-700" onclick="hideModal('registerModal'); showModal('loginModal')">Login</a>
            </p>
        </div>
    `;
}

// Generate Contact Modal
function generateContactModal() {
    document.getElementById('contactModal').innerHTML = `
        <div class="modal-content">
            <button class="close-modal absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="hideModal('contactModal')">&times;</button>
            <h2 class="text-2xl font-bold mb-6 text-center">Contact Us</h2>
            <form id="contactForm" class="space-y-4">
                <div class="form-group">
                    <label for="contactName">Name</label>
                    <input type="text" id="contactName" placeholder="Your name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="contactEmail">Email</label>
                    <input type="email" id="contactEmail" placeholder="Your email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="contactSubject">Subject</label>
                    <input type="text" id="contactSubject" placeholder="Subject" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="contactMessage">Message</label>
                    <textarea id="contactMessage" rows="5" placeholder="Your message" class="form-control" required></textarea>
                </div>
                <button type="submit" class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Send Message
                </button>
            </form>
        </div>
    `;
}

// Generate Account Modal
function generateAccountModal() {
    document.getElementById('accountModal').innerHTML = `
        <div class="modal-content">
            <button class="close-modal absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="hideModal('accountModal')">&times;</button>
            <h2 class="text-2xl font-bold mb-6 text-center">My Account</h2>
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    ${window.authToken ? getUserInitials() : 'G'}
                </div>
                <p class="text-gray-600 dark:text-gray-300">Welcome back!</p>
            </div>
            <div class="space-y-4">
                <button id="viewApplicationsBtn" class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    View My Applications
                </button>
                <button id="logoutBtn" class="w-full py-3 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition">
                    Logout
                </button>
            </div>
            <div id="applicationsList" class="mt-6 hidden">
                <h3 class="text-xl font-bold mb-4">My Applications</h3>
                <div class="border rounded-lg p-4">
                    <p class="text-gray-600 dark:text-gray-300 text-center">No applications yet.</p>
                </div>
            </div>
        </div>
    `;
}

// Generate Apply Not Logged In Content
function generateApplyNotLoggedIn() {
    document.getElementById('applyNotLoggedInContainer').innerHTML = `
        <div class="text-center p-8">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-lock text-2xl text-red-600 dark:text-red-400"></i>
            </div>
            <h2 class="text-2xl font-bold mb-4">Login Required</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to submit an application.</p>
            <div class="space-y-3">
                <button class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" onclick="hideModal('applyModal'); showModal('loginModal')">
                    Login to Apply
                </button>
                <button class="w-full px-6 py-3 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition" onclick="hideModal('applyModal'); showModal('registerModal')">
                    Create Account
                </button>
            </div>
        </div>
    `;
}

// Generate Apply Modal Content
function generateApplyModal() {
    document.getElementById('applyModal').innerHTML = `
        <div class="modal-content">
            <button class="close-modal absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="hideModal('applyModal')">&times;</button>
            <h2 class="text-2xl font-bold mb-6 text-center">Apply to Greenwood High</h2>
            <div id="applyNotLoggedInContainer" class="hidden"></div>
            <div id="applicationFormContainer" class="hidden"></div>
        </div>
    `;
}

// Helper function to get user initials
function getUserInitials() {
    // This is a placeholder - you would get this from user data
    return 'U';
}

// Generate all modals on load
function generateModals() {
    generateLoginModal();
    generateRegisterModal();
    generateContactModal();
    generateAccountModal();
    generateApplyModal();
}

// Load everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    generateNavbar();
    generateFooter();
    generateModals();

    // About Section Cards
    const aboutCards = [
        { icon: 'fa-graduation-cap', title: 'Academic Excellence', text: 'Our rigorous curriculum is designed to challenge and inspire students to reach their full potential.' },
        { icon: 'fa-users', title: 'Dedicated Faculty', text: 'Our experienced teachers are passionate about education and committed to student success.' },
        { icon: 'fa-building', title: 'Modern Facilities', text: 'State-of-the-art classrooms, labs, and sports facilities support comprehensive learning.' },
        { icon: 'fa-globe', title: 'Our Community', text: 'We pride ourselves on our diverse and inclusive community where every student feels valued. Our active PTA and alumni network provide strong support for our programs.' }
    ];
    const aboutGrid = document.querySelector('#about .grid');
    if (aboutGrid) {
        aboutGrid.innerHTML = aboutCards.map((card, i) => `
            <div class="card p-8 rounded-xl fade-in delay-${i+1}">
                <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                    <i class="fas ${card.icon} text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <h3 class="text-xl font-bold mb-4">${card.title}</h3>
                <p class="text-gray-600 dark:text-gray-300">${card.text}</p>
            </div>
        `).join('');
    }

    // Courses Section Cards
    const coursesCards = [
        { icon: 'fa-atom', title: 'STEM Program', text: 'Our Science, Technology, Engineering, and Math program prepares students for careers in fast-growing fields.', items: ['Advanced Placement courses', 'Robotics lab', 'Industry partnerships'] },
        { icon: 'fa-paint-brush', title: 'Arts & Humanities', text: 'Our comprehensive arts program nurtures creativity and critical thinking.', items: ['Visual and performing arts', 'Creative writing workshops', 'International exchange programs'] },
        { icon: 'fa-briefcase', title: 'Vocational Training', text: 'Practical skills training for students pursuing careers directly after high school.', items: ['Automotive technology', 'Culinary arts', 'Healthcare certifications'] }
    ];
    const coursesGrid = document.querySelector('#courses .grid');
    if (coursesGrid) {
        coursesGrid.innerHTML = coursesCards.map((card, i) => `
            <div class="card p-6 rounded-xl fade-in delay-${i+1}">
                <div class="w-full h-40 bg-green-600 rounded-lg mb-4 flex items-center justify-center text-white">
                    <i class="fas ${card.icon} text-5xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-3">${card.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${card.text}</p>
                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                    ${card.items.map(item => `<li class="flex items-center"><i class="fas fa-check-circle text-green-500 mr-2"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
});