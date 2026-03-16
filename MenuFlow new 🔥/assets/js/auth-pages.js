document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('msg');
      msg.textContent = '';
      try {
        MenuFlowDemo.signup({
          fullName: signupForm.fullName.value.trim(),
          email: signupForm.email.value.trim(),
          password: signupForm.password.value,
          businessName: signupForm.businessName.value.trim(),
          slug: signupForm.slug.value.trim()
        });
        msg.textContent = 'Account created. Redirecting...';
        setTimeout(() => location.href = 'dashboard/index.html', 500);
      } catch (err) {
        msg.textContent = err.message || 'Sign up failed';
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('msg');
      msg.textContent = '';
      try {
        MenuFlowDemo.login({
          email: loginForm.email.value.trim(),
          password: loginForm.password.value
        });
        msg.textContent = 'Login successful. Redirecting...';
        setTimeout(() => location.href = 'dashboard/index.html', 500);
      } catch (err) {
        msg.textContent = err.message || 'Login failed';
      }
    });
  }
});
