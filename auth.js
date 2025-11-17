// Email confirmation functions - WORKING VERSION
function sendConfirmationEmail(userData) {
    return new Promise((resolve, reject) => {
        // Generate confirmation token
        const token = generateToken();
        const confirmationLink = `${window.location.origin}/confirm-email.html?token=${token}&email=${encodeURIComponent(userData.email)}`;

        // Store user data and token
        localStorage.setItem(`confirmation_${token}`, JSON.stringify(userData));
        localStorage.setItem(`userEmail_${userData.idNumber || userData.staffNumber}`, userData.email);

        // Store confirmation token with expiration (24 hours)
        const expiration = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(`token_expiry_${token}`, expiration.toString());

        // STORE THE ACTUAL CONFIRMATION LINK FOR USER TO SEE
        localStorage.setItem('lastConfirmationLink', confirmationLink);
        localStorage.setItem('lastConfirmationEmail', userData.email);
        localStorage.setItem('lastConfirmationUser', JSON.stringify(userData));

        console.log('🔐 CONFIRMATION LINK GENERATED:');
        console.log('📧 Email:', userData.email);
        console.log('🔗 Confirmation Link:', confirmationLink);
        console.log('🆔 Token:', token);

        // Show the confirmation link to user immediately
        showConfirmationLink(confirmationLink, userData.email);

        resolve({
            success: true,
            email: userData.email,
            confirmationLink: confirmationLink
        });
    });
}

function showConfirmationLink(link, email) {
    // Create a visible confirmation link area
    const existingLink = document.getElementById('confirmation-link-area');
    if (existingLink) {
        existingLink.remove();
    }

    const linkArea = document.createElement('div');
    linkArea.id = 'confirmation-link-area';
    linkArea.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-size: 14px;
    `;

    linkArea.innerHTML = `
        <strong>📧 Email Confirmation Link</strong>
        <p style="margin: 8px 0; font-size: 12px;">Click this link to confirm your email:</p>
        <a href="${link}" 
           style="color: white; text-decoration: underline; word-break: break-all; display: block; margin: 8px 0;"
           target="_blank">${link}</a>
        <button onclick="this.parentElement.remove()" 
                style="background: white; color: #2ecc71; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
            Close
        </button>
    `;

    document.body.appendChild(linkArea);
}

function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}