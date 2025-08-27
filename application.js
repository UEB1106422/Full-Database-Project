console.log('application.js loaded');

function generateApplicationForm() {
    const formHtml = `
        <form id="applicationForm" class="">
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div class="form-group">
                    <label for="appFirstName">First Name</label>
                    <input type="text" id="appFirstName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="appLastName">Last Name</label>
                    <input type="text" id="appLastName" class="form-control" required>
                </div>
            </div>
            <div class="form-group mb-4">
                <label for="appEmail">Email Address</label>
                <input type="email" id="appEmail" class="form-control" required>
            </div>
            <div class="form-group mb-4">
                <label for="appPhone">Phone Number</label>
                <input type="tel" id="appPhone" class="form-control" required>
            </div>
            <div class="form-group mb-4">
                <label for="appDob">Date of Birth</label>
                <input type="date" id="appDob" class="form-control" max="2010-12-31" required>
                <p class="text-xs text-gray-500 mt-1">You must be born before 2011</p>
            </div>
            <div class="form-group mb-4">
                <label for="appProgram">Program of Interest</label>
                <select id="appProgram" class="form-control" required>
                    <option value="">Select a program</option>
                    <option value="STEM">STEM Program</option>
                    <option value="Arts">Arts & Humanities</option>
                    <option value="Vocational">Vocational Training</option>
                </select>
            </div>
            <div class="form-group mb-4">
                <label for="appEducation">Previous Education</label>
                <textarea id="appEducation" rows="3" class="form-control" required></textarea>
            </div>
            <div class="form-group mb-6">
                <label for="appEssay">Personal Statement</label>
                <textarea id="appEssay" rows="5" class="form-control" required></textarea>
                <p class="text-xs text-gray-500 mt-1">Tell us about your academic goals and why you want to join our school (500 words max)</p>
            </div>
            <button type="submit" class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Submit Application
            </button>
        </form>
    `;
    document.getElementById('applicationFormContainer').innerHTML = formHtml;
    
    // Attach the event listener immediately after creating the form
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        console.log('Attaching submit handler to application form');
        applicationForm.addEventListener('submit', handleApplicationSubmit);
    }

    // Add date validation
    const dobInput = document.getElementById('appDob');
    if (dobInput) {
        dobInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const maxDate = new Date('2010-12-31');
            
            if (selectedDate > maxDate) {
                showNotification('Date of birth must be before 2011', false);
                this.value = '';
            }
        });
    }
}

// Application submit handler
async function handleApplicationSubmit(e) {
    e.preventDefault();
    console.log('Application form is being submitted');
    
    // Get auth token
    const authToken = getAuthToken();
    if (!authToken) {
        showNotification('You must be logged in to submit an application', false);
        return;
    }

    // Validate date of birth
    const dobValue = document.getElementById('appDob').value;
    const selectedDate = new Date(dobValue);
    const maxDate = new Date('2010-12-31');
    
    if (selectedDate > maxDate) {
        showNotification('Date of birth must be before 2011', false);
        return;
    }
    
    // Gather form data
    const formData = {
        first_name: document.getElementById('appFirstName').value,
        last_name: document.getElementById('appLastName').value,
        email: document.getElementById('appEmail').value,
        phone: document.getElementById('appPhone').value,
        dob: dobValue,
        program: document.getElementById('appProgram').value,
        previous_education: document.getElementById('appEducation').value,
        personal_statement: document.getElementById('appEssay').value
    };
    
    console.log('Sending application data:', formData);
    
    try {
        const response = await fetch('http://localhost:5000/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        console.log('Server response:', data);
        
        if (response.ok) {
            // Success - hide modal and show success message
            hideModal('applyModal');
            showNotification('Application submitted successfully!', true);
            // Reset form
            document.getElementById('applicationForm').reset();
        } else {
            // Error from server
            showNotification(data.error || 'Failed to submit application', false);
        }
    } catch (err) {
        console.error('Error submitting application:', err);
        showNotification('Error connecting to server. Please ensure the backend is running.', false);
    }
}

// Helper function to get auth token
function getAuthToken() {
    return window.authToken || null;
}

// Modified showModal function for application modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modalId === 'applyModal') {
        const authToken = getAuthToken();
        if (!authToken) {
            // Show login prompt
            generateApplyNotLoggedIn();
            document.getElementById('applyNotLoggedInContainer').classList.remove('hidden');
            document.getElementById('applicationFormContainer').classList.add('hidden');
        } else {
            // Show application form
            generateApplicationForm();
            document.getElementById('applicationFormContainer').classList.remove('hidden');
            document.getElementById('applyNotLoggedInContainer').classList.add('hidden');
        }
    }
    modal.classList.add('active');
}