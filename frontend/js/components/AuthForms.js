// js/components/AuthForms.js

class AuthForms {
    constructor(container) {
      this.container = container;
      this.isLogin = true;
      this.formData = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
      this.loading = false;
      this.error = '';
    }
  
    render() {
      if (!this.container) return;
      
      this.container.innerHTML = `
        <div class="auth-form-wrapper">
          <div class="auth-header">
            <h2>${this.isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>${this.isLogin ? 'Sign in to continue to NightFlow' : 'Join the music experience'}</p>
          </div>
          
          <!-- Social login buttons -->
          <div class="social-login">
            <button class="social-btn" id="google-login">
              <i class="fab fa-google"></i>
              <span>Google</span>
            </button>
            <button class="social-btn" id="spotify-login">
              <i class="fab fa-spotify"></i>
              <span>Spotify</span>
            </button>
          </div>
          
          <div class="separator">
            <span>or continue with email</span>
          </div>
          
          ${this.error ? `
            <div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              <p>${this.error}</p>
            </div>
          ` : ''}
          
          <form id="auth-form">
            ${!this.isLogin ? `
              <div class="form-group">
                <label for="username">Username</label>
                <div class="input-icon-wrapper">
                  <i class="fas fa-user"></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value="${this.formData.username}"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            ` : ''}
            
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-icon-wrapper">
                <i class="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value="${this.formData.email}"
                  placeholder="Your email address"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-icon-wrapper">
                <i class="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value="${this.formData.password}"
                  placeholder="Your password"
                />
              </div>
            </div>
            
            ${!this.isLogin ? `
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <div class="input-icon-wrapper">
                  <i class="fas fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value="${this.formData.confirmPassword}"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            ` : ''}
            
            ${this.isLogin ? `
              <div class="form-options">
                <div class="remember-me">
                  <input type="checkbox" id="remember" />
                  <label for="remember">Remember me</label>
                </div>
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>
            ` : ''}
            
            <button 
              type="submit" 
              class="btn-submit ${this.loading ? 'loading' : ''}"
              ${this.loading ? 'disabled' : ''}
            >
              ${this.loading ? `
                <i class="fas fa-spinner fa-spin"></i>
              ` : this.isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>
              ${this.isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                class="toggle-form"
                id="toggle-form"
              >
                ${this.isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      `;
      
      this.attachEventListeners();
    }
    
    attachEventListeners() {
      // Form submission
      const form = document.getElementById('auth-form');
      if (form) {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
      
      // Toggle between login and signup
      const toggleButton = document.getElementById('toggle-form');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => this.toggleForm());
      }
      
      // Input change handlers
      const inputs = this.container.querySelectorAll('input[name]');
      inputs.forEach(input => {
        input.addEventListener('input', (e) => this.handleInputChange(e));
      });
      
      // Social login buttons
      const googleBtn = document.getElementById('google-login');
      const spotifyBtn = document.getElementById('spotify-login');
      
      if (googleBtn) {
        googleBtn.addEventListener('click', () => this.handleSocialLogin('google'));
      }
      
      if (spotifyBtn) {
        spotifyBtn.addEventListener('click', () => this.handleSocialLogin('spotify'));
      }
    }
    
    handleInputChange(e) {
      this.formData = {
        ...this.formData,
        [e.target.name]: e.target.value
      };
      
      // Clear errors when user starts typing
      if (this.error) {
        this.error = '';
        this.render();
      }
    }
    
    async handleSubmit(e) {
      e.preventDefault();
      this.loading = true;
      this.error = '';
      this.render();
      
      // Form validation
      if (this.isLogin) {
        if (!this.formData.email || !this.formData.password) {
          this.error = 'Please fill in all fields';
          this.loading = false;
          this.render();
          return;
        }
      } else {
        if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.confirmPassword) {
          this.error = 'Please fill in all fields';
          this.loading = false;
          this.render();
          return;
        }
        
        if (this.formData.password !== this.formData.confirmPassword) {
          this.error = 'Passwords do not match';
          this.loading = false;
          this.render();
          return;
        }
        
        if (this.formData.password.length < 6) {
          this.error = 'Password must be at least 6 characters';
          this.loading = false;
          this.render();
          return;
        }
      }
      
      try {
        // This is where you would call your API
        // For now, let's simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would:
        // 1. Make an API call to your backend
        // 2. Store the received tokens in localStorage
        // 3. Redirect the user to the main page
        
        // Example:
        /*
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.formData.email,
            password: this.formData.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }
        
        // Store tokens
        localStorage.setItem('auth_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        
        // Redirect
        window.location.href = 'index.html';
        */
        
        // For demo: Show success and redirect
        alert(this.isLogin ? 'Login successful!' : 'Registration successful!');
        window.location.href = 'index.html';
        
      } catch (err) {
        this.error = err.message || 'Authentication failed. Please try again.';
      } finally {
        this.loading = false;
        this.render();
      }
    }
    
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.error = '';
      this.render();
    }
    
    handleSocialLogin(provider) {
      // In a real app, you would:
      // 1. Redirect to OAuth provider page
      // 2. Handle the callback and token exchange
      
      if (provider === 'spotify') {
        alert('Spotify login will be implemented with the Spotify API');
        // For real implementation:
        // window.location.href = '/api/auth/spotify';
      } else if (provider === 'google') {
        alert('Google login will be implemented with Google OAuth');
        // For real implementation:
        // window.location.href = '/api/auth/google';
      }
    }
  }
  
  export default AuthForms;