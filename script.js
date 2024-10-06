// Simulated database of users and OTPs
const users = {};
const otps = {};

// Switch between login, register, and forgot password forms
document.getElementById("show-register").addEventListener("click", function() {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("register-container").classList.remove("hidden");
    document.getElementById("forgot-password-container").classList.add("hidden");
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("forgot-password-container").classList.add("hidden");
});

document.getElementById("show-login-forgot").addEventListener("click", function() {
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("forgot-password-container").classList.add("hidden");
});

document.getElementById("show-forgot-password").addEventListener("click", function() {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("forgot-password-container").classList.remove("hidden");
});

// Handle Registration Form submission
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    const firstName = document.getElementById("register-firstname").value;
    const middleName = document.getElementById("register-middlename").value;
    const lastName = document.getElementById("register-lastname").value;
    const age = document.getElementById("register-age").value;
    const email = document.getElementById("register-email").value;
    const mobile = document.getElementById("register-mobile").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    if (users[username]) {
        document.getElementById("register-error-message").textContent = "Username already exists!";
    } else {
        // Store user data in the simulated database
        users[username] = {
            password,
            firstName,
            middleName,
            lastName,
            age,
            email,
            mobile
        };
        alert("Registration successful! You can now log in.");
        document.getElementById("registerForm").reset(); // Reset the form
        document.getElementById("register-error-message").textContent = "";
        document.getElementById("show-login").click();  // Switch to login form
    }
});

// Handle Login Form submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (users[username] && users[username].password === password) {
        alert("Login successful!");
        // Redirect to another page (if necessary)
        window.location.href = "dashboard.html";  // You can create this page later
    } else {
        document.getElementById("login-error-message").textContent = "Invalid username or password";
    }
});

// Handle Forgot Password Form submission
document.getElementById("send-otp").addEventListener("click", function() {
    const username = document.getElementById("forgot-username").value;
    const email = document.getElementById("forgot-email").value;

    if (users[username] && users[username].email === email) {
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        otps[username] = otp;
        // Simulate sending OTP to email
        alert(`OTP sent to ${email}: ${otp}`);
        document.getElementById("otp-section").classList.remove("hidden");
    } else {
        document.getElementById("forgot-password-error-message").textContent = "Invalid username or email";
    }
});

// Handle OTP and Password Reset
document.getElementById("forgotPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting

    const username = document.getElementById("forgot-username").value;
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("new-password").value;

    if (otps[username] && otps[username] === parseInt(otp, 10)) {
        users[username].password = newPassword; // Update password in the simulated database
        delete otps[username]; // Remove OTP after successful reset
        alert("Password reset successful! You can now log in with your new password.");
        document.getElementById("forgotPasswordForm").reset(); // Reset the form
        document.getElementById("otp-section").classList.add("hidden");
        document.getElementById("forgot-password-error-message").textContent = "";
        document.getElementById("show-login-forgot").click(); // Switch to login form
    } else {
        document.getElementById("forgot-password-error-message").textContent = "Invalid OTP";
    }
});

// Show/Hide Password functionality
document.getElementById("show-password-login").addEventListener("change", function() {
    const passwordInput = document.getElementById("login-password");
    passwordInput.type = this.checked ? "text" : "password";
});

document.getElementById("show-password-register").addEventListener("change", function() {
    const passwordInput = document.getElementById("register-password");
    passwordInput.type = this.checked ? "text" : "password";
});

document.getElementById("show-password-reset").addEventListener("change", function() {
    const passwordInput = document.getElementById("new-password");
    passwordInput.type = this.checked ? "text" : "password";
});
