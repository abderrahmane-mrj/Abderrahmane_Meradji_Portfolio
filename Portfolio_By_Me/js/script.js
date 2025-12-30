// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler with EmailJS
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // EmailJS configuration
    const serviceID = 'service_dnt4iks';
    const templateID = 'template_wf7bxoh';
    const publicKey = 'PcLFncuMDkHfBtOv9';

    // SMS Notification Configuration - SMSPortal
    // Get your credentials from: https://www.smsportal.com/
    // IMPORTANT: For security, use a backend proxy instead of exposing credentials in frontend
    // See SMSPORTAL_SETUP.md for secure implementation options

    // SMSPortal API Configuration
    const smsPortalClientID = ''; // Your SMSPortal Client ID
    const smsPortalAPISecret = ''; // Your SMSPortal API Secret
    const smsPortalAPIURL = 'https://rest.smsportal.com/BulkMessages';

    // Your phone number for SMS (format: 213551027296 - without +)
    const yourPhoneNumber = '213551027296';

    // Backend Proxy URL (RECOMMENDED for security)
    // After deploying your backend, update this with your API URL
    // Vercel: https://your-project.vercel.app/api/send-sms
    // Netlify: https://your-project.netlify.app/.netlify/functions/send-sms
    const smsBackendProxyURL = ''; // TODO: Add your deployed backend URL here

    // Legacy: Email-to-SMS Gateway (leave empty if using SMSPortal)
    const smsEmailGateway = ''; // Not needed if using SMSPortal

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(publicKey);
    }

    // Function to send SMS notification via SMSPortal
    async function sendSMSNotification(name, email, message) {
        // Truncate message for SMS (SMS has 160 character limit)
        const smsMessage = `New msg from ${name} (${email}): ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;

        // Option 1: SMSPortal via Backend Proxy (RECOMMENDED - Secure)
        if (smsBackendProxyURL) {
            try {
                const response = await fetch(smsBackendProxyURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: yourPhoneNumber,
                        message: smsMessage,
                        name: name,
                        email: email
                    })
                });

                if (response.ok) {
                    console.log('SMS notification sent via SMSPortal (backend proxy)');
                } else {
                    console.error('SMS notification failed:', response.statusText);
                }
            } catch (error) {
                console.error('SMS notification error:', error);
            }
            return; // Exit early if using backend proxy
        }

        // Option 2: SMSPortal Direct API (NOT RECOMMENDED - Exposes credentials)
        // WARNING: This exposes your API credentials in frontend code
        // Use only for testing or if you understand the security risks
        if (smsPortalClientID && smsPortalAPISecret) {
            try {
                // Create Basic Auth credentials
                const credentials = btoa(`${smsPortalClientID}:${smsPortalAPISecret}`);

                const payload = {
                    messages: [
                        {
                            content: smsMessage,
                            destination: yourPhoneNumber
                        }
                    ]
                };

                const response = await fetch(smsPortalAPIURL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('SMS notification sent via SMSPortal:', data);
                } else {
                    const errorData = await response.json();
                    console.error('SMSPortal API error:', errorData);
                }
            } catch (error) {
                console.error('SMSPortal API request failed:', error);
            }
            return; // Exit early if using SMSPortal
        }

        // Option 3: Fallback - Email-to-SMS Gateway
        if (smsEmailGateway) {
            try {
                await emailjs.send(serviceID, templateID, {
                    from_name: 'Portfolio',
                    from_email: 'noreply@portfolio.com',
                    message: smsMessage,
                    to_email: smsEmailGateway,
                    subject: smsMessage
                });
                console.log('SMS notification sent via email gateway');
            } catch (error) {
                console.error('SMS notification failed:', error);
            }
        }
    }

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Clear error messages
    function clearErrors() {
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('messageError').textContent = '';

        // Remove error classes
        document.getElementById('name').classList.remove('error');
        document.getElementById('email').classList.remove('error');
        document.getElementById('message').classList.remove('error');
    }

    // Show error message
    function showError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(errorId);
        field.classList.add('error');
        errorElement.textContent = message;
    }

    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function () {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError('email', 'emailError', 'Please enter a valid email address (e.g., name@example.com)');
        } else {
            this.classList.remove('error');
            document.getElementById('emailError').textContent = '';
        }
    });

    emailInput.addEventListener('input', function () {
        if (this.classList.contains('error') && validateEmail(this.value.trim())) {
            this.classList.remove('error');
            document.getElementById('emailError').textContent = '';
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // Validation
        let isValid = true;

        // Validate name
        if (!name) {
            showError('name', 'nameError', 'Please enter your name');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'nameError', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showError('email', 'emailError', 'Please enter your email address');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'emailError', 'Please enter a valid email address (e.g., name@example.com)');
            isValid = false;
        }

        // Validate message
        if (!message) {
            showError('message', 'messageError', 'Please enter your message');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'messageError', 'Message must be at least 10 characters');
            isValid = false;
        }

        // If validation fails, stop here
        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';

        // Check if EmailJS is configured
        if (serviceID === 'YOUR_SERVICE_ID' || templateID === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY' || typeof emailjs === 'undefined') {
            // Fallback: Show alert if EmailJS is not configured yet
            setTimeout(() => {
                alert(`Thank you for your message, ${name}! I'll get back to you soon at ${email}.\n\nNote: Please configure EmailJS to receive messages automatically.`);
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            }, 500);
            return;
        }

        // Send email using EmailJS
        emailjs.send(serviceID, templateID, {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'abderrahmanemeradji26@email.com', // Your email address
            reply_to: email // So you can reply directly
        })
            .then(() => {
                // Send SMS notification
                sendSMSNotification(name, email, message);

                // Success message
                submitButton.textContent = 'Message Sent! ✓';
                submitButton.style.backgroundColor = '#10b981';
                submitButton.style.borderColor = '#10b981';

                // Show success notification
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                    submitButton.style.backgroundColor = '';
                    submitButton.style.borderColor = '';
                }, 3000);
            })
            .catch((error) => {
                // Error handling
                console.error('EmailJS Error:', error);
                submitButton.textContent = 'Error - Try Again';
                submitButton.style.backgroundColor = '#ef4444';
                submitButton.style.borderColor = '#ef4444';

                showNotification('Failed to send message. Please try again or contact me directly via email.', 'error');

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                    submitButton.style.backgroundColor = '';
                    submitButton.style.borderColor = '';
                }, 3000);
            });
    });
}

// Notification function
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Scroll to top functionality (optional - can be added if needed)
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Add scroll to top button if needed
// You can uncomment this to add a scroll-to-top button
/*
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: var(--shadow-lg);
    z-index: 999;
    transition: var(--transition);
`;
scrollTopBtn.addEventListener('click', scrollToTop);
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});
*/

