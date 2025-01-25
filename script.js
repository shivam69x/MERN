document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Basic validation
    if (username === '' || password === '') {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    // Simulate a login process (replace this with actual authentication logic)
    if (username === 'admin' && password === 'password') {
        alert('Login successful!');
        // Redirect or perform other actions here
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
});