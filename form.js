document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('fileRequestForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const companyInput = document.getElementById('company');
    const phoneInput = document.getElementById('phone');
    const fileTypeSelect = document.getElementById('fileType');
    const descriptionInput = document.getElementById('fileDescription');
    const fileUploadInput = document.getElementById('fileUpload');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const filePreview = document.getElementById('filePreview');
    const privacyCheckbox = document.getElementById('privacyPolicy');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const formStatus = document.getElementById('formStatus');
    
    // Store validation messages
    const validationMessages = {
        name: document.getElementById('name-validation'),
        email: document.getElementById('email-validation'),
        company: document.getElementById('company-validation'),
        phone: document.getElementById('phone-validation'),
        filetype: document.getElementById('filetype-validation'),
        description: document.getElementById('description-validation'),
        file: document.getElementById('file-validation'),
        privacy: document.getElementById('privacy-validation')
    };
    
    // Store uploaded file info
    let uploadedFile = null;
    
    // Real-time validation for name
    nameInput.addEventListener('input', function() {
        validateName();
    });
    
    // Real-time validation for email
    emailInput.addEventListener('input', function() {
        validateEmail();
    });
    
    // Real-time validation for phone
    phoneInput.addEventListener('input', function() {
        validatePhone();
    });
    
    // Real-time validation for file description
    descriptionInput.addEventListener('input', function() {
        validateDescription();
    });
    
    // Real-time validation for file type
    fileTypeSelect.addEventListener('change', function() {
        validateFileType();
    });
    
    // File upload handling
    fileUploadArea.addEventListener('click', function() {
        fileUploadInput.click();
    });
    
    fileUploadInput.addEventListener('change', function(e) {
        handleFileUpload(e.target.files[0]);
    });
    
    // Drag and drop file upload
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function() {
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isFileTypeValid = validateFileType();
        const isDescriptionValid = validateDescription();
        const isPrivacyValid = validatePrivacy();
        
        // If all validations pass
        if (isNameValid && isEmailValid && isPhoneValid && isFileTypeValid && isDescriptionValid && isPrivacyValid) {
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(function() {
                // Show success message
                formStatus.textContent = 'Form submitted successfully! We will contact you within 24 hours.';
                formStatus.className = 'form-status success';
                
                // Reset button state
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';
                submitBtn.disabled = false;
                
                // Reset form after 5 seconds
                setTimeout(resetForm, 5000);
            }, 2000);
        } else {
            // Show error message
            formStatus.textContent = 'Please fix the errors in the form before submitting.';
            formStatus.className = 'form-status error';
        }
    });
    
    // Form reset
    resetBtn.addEventListener('click', resetForm);
    
    // Validation functions
    function validateName() {
        const name = nameInput.value.trim();
        if (name.length === 0) {
            showValidationError('name', 'Name is required');
            return false;
        } else if (name.length < 2) {
            showValidationError('name', 'Name must be at least 2 characters');
            return false;
        } else {
            showValidationSuccess('name');
            return true;
        }
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length === 0) {
            showValidationError('email', 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showValidationError('email', 'Please enter a valid email address');
            return false;
        } else {
            showValidationSuccess('email');
            return true;
        }
    }
    
    function validatePhone() {
        const phone = phoneInput.value.trim();
        // Allow empty phone number
        if (phone.length === 0) {
            clearValidation('phone');
            return true;
        }
        
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            showValidationError('phone', 'Please enter a valid phone number');
            return false;
        } else {
            showValidationSuccess('phone');
            return true;
        }
    }
    
    function validateFileType() {
        const fileType = fileTypeSelect.value;
        if (!fileType) {
            showValidationError('filetype', 'Please select a file type');
            return false;
        } else {
            showValidationSuccess('filetype');
            return true;
        }
    }
    
    function validateDescription() {
        const description = descriptionInput.value.trim();
        if (description.length === 0) {
            showValidationError('description', 'File description is required');
            return false;
        } else if (description.length < 10) {
            showValidationError('description', 'Description must be at least 10 characters');
            return false;
        } else {
            showValidationSuccess('description');
            return true;
        }
    }
    
    function validatePrivacy() {
        if (!privacyCheckbox.checked) {
            showValidationError('privacy', 'You must agree to the privacy policy');
            return false;
        } else {
            showValidationSuccess('privacy');
            return true;
        }
    }
    
    // File upload handling function
    function handleFileUpload(file) {
        if (!file) return;
        
        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showValidationError('file', 'File size exceeds 5MB limit');
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                             'application/msword', 'application/zip', 'application/x-rar-compressed'];
        
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|zip|rar)$/i)) {
            showValidationError('file', 'File type not allowed. Please upload JPG, PNG, PDF, DOC, or ZIP files.');
            return;
        }
        
        // Store file
        uploadedFile = file;
        showValidationSuccess('file');
        showFilePreview(file);
    }
    
    // Show file preview
    function showFilePreview(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let iconClass = 'fas fa-file';
        
        // Set icon based on file type
        if (file.type.includes('image')) {
            iconClass = 'fas fa-file-image';
        } else if (file.type.includes('pdf')) {
            iconClass = 'fas fa-file-pdf';
        } else if (file.type.includes('word') || file.name.match(/\.(doc|docx)$/i)) {
            iconClass = 'fas fa-file-word';
        } else if (file.type.includes('zip') || fileExtension === 'rar') {
            iconClass = 'fas fa-file-archive';
        }
        
        // Format file size
        const fileSize = formatFileSize(file.size);
        
        // Create preview HTML
        filePreview.innerHTML = `
            <div class="preview-item">
                <div class="preview-info">
                    <i class="${iconClass} preview-icon"></i>
                    <div class="preview-details">
                        <h4>${file.name}</h4>
                        <p>${fileSize}</p>
                    </div>
                </div>
                <button class="remove-file" id="removeFileBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        filePreview.classList.add('active');
        
        // Add event listener to remove button
        document.getElementById('removeFileBtn').addEventListener('click', removeFile);
    }
    
    // Remove uploaded file
    function removeFile() {
        uploadedFile = null;
        fileUploadInput.value = '';
        filePreview.innerHTML = '';
        filePreview.classList.remove('active');
        clearValidation('file');
    }
    
    // Helper functions
    function showValidationError(field, message) {
        validationMessages[field].textContent = message;
        validationMessages[field].className = 'validation-message error';
    }
    
    function showValidationSuccess(field) {
        validationMessages[field].textContent = '✓ Valid';
        validationMessages[field].className = 'validation-message success';
    }
    
    function clearValidation(field) {
        validationMessages[field].textContent = '';
        validationMessages[field].className = 'validation-message';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Reset form
    function resetForm() {
        form.reset();
        
        // Clear all validation messages
        Object.keys(validationMessages).forEach(key => {
            validationMessages[key].textContent = '';
            validationMessages[key].className = 'validation-message';
        });
        
        // Remove file preview
        removeFile();
        
        // Clear form status
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        // Reset urgency to default
        document.querySelector('input[name="urgency"][value="low"]').checked = true;
        
        // Reset button state if needed
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';
        submitBtn.disabled = false;
    }
    
    // Phone number formatting
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = `(${value.substring(0,3)}) ${value.substring(3)}`;
            } else if (value.length <= 10) {
                value = `(${value.substring(0,3)}) ${value.substring(3,6)}-${value.substring(6)}`;
            } else {
                value = `(${value.substring(0,3)}) ${value.substring(3,6)}-${value.substring(6,10)}`;
            }
        }
        
        e.target.value = value;
    });
});