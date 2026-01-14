// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const formMessage = document.getElementById('form-message');
            
            // Clear previous error messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
            
            // Get all required fields
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                // Remove previous error styling
                field.classList.remove('field-error');
                
                // Validate field
                if (!field.value.trim()) {
                    isValid = false;
                    showError(field, 'This field is required');
                } else {
                    // Specific validations
                    switch(field.type) {
                        case 'email':
                            if (!isValidEmail(field.value)) {
                                isValid = false;
                                showError(field, 'Please enter a valid email address');
                            }
                            break;
                        case 'tel':
                            if (!isValidPhone(field.value)) {
                                isValid = false;
                                showError(field, 'Please enter a valid phone number (10 digits)');
                            }
                            break;
                    }
                }
            });
            
            // Validate specific fields by name
            const nameField = form.querySelector('[name="name"], [name="fullName"]');
            if (nameField && nameField.value.trim().length < 2) {
                isValid = false;
                showError(nameField, 'Name must be at least 2 characters');
            }
            
            const messageField = form.querySelector('[name="message"]');
            if (messageField && messageField.value.trim().length < 10) {
                isValid = false;
                showError(messageField, 'Message must be at least 10 characters');
            }
            
            // If form is invalid, prevent submission
            if (!isValid) {
                e.preventDefault();
                
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.className = 'error';
                    formMessage.textContent = 'Please correct the errors above before submitting.';
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Focus on first error field
                const firstError = form.querySelector('.field-error');
                if (firstError) {
                    firstError.focus();
                }
            } else {
                // Clear success message if validation passes
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }
        });
        
        // Real-time validation on blur
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() && this.getAttribute('required') !== null) {
                    validateField(this);
                }
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                if (this.classList.contains('field-error')) {
                    this.classList.remove('field-error');
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    });
    
    function validateField(field) {
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        field.classList.remove('field-error');
        
        if (!field.value.trim() && field.getAttribute('required') !== null) {
            showError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (field.type === 'tel' && !isValidPhone(field.value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
        
        return true;
    }
    
    function showError(field, message) {
        field.classList.add('field-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15;
    }
});
