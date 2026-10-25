// Institutional Client-Side Authentication Service with Session Timeout
(function() {
  const AUTH_KEY = 'college_portal_auth_user';
  const TIMEOUT_SECONDS = 90; // 90-second inactivity / session timeout

  const FACULTY_CREDENTIALS = {
    username: 'faculty',
    password: 'cse@stthomas'
  };

  window.CollegeAuth = {
    getCurrentUser() {
      try {
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        
        // Check timeout
        const now = Date.now();
        if (data.expiresAt && now > data.expiresAt) {
          this.logout(true); // timed out
          return null;
        }

        // Renew activity timestamp
        data.expiresAt = now + (TIMEOUT_SECONDS * 1000);
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
        return data.user;
      } catch (e) {
        return null;
      }
    },

    login(identifier, password) {
      if (!identifier || !password) {
        return { success: false, message: 'Please enter both identifier and password.' };
      }

      const idClean = identifier.trim().toUpperCase();
      const passClean = password.trim();
      const now = Date.now();
      const expiresAt = now + (TIMEOUT_SECONDS * 1000);

      // 1. Check Faculty Login
      if (
        (idClean === 'FACULTY' || idClean === 'ADMIN' || idClean === 'TEACHER') &&
        (passClean === FACULTY_CREDENTIALS.password || passClean === 'admin123' || passClean === 'faculty')
      ) {
        const user = {
          role: 'faculty',
          name: 'Faculty Member / Department Head',
          regNo: 'FACULTY_CSE',
          id: 'faculty'
        };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user, expiresAt }));
        this.startTimer();
        return { success: true, user, redirect: 'index.html' };
      }

      // 2. Check Student Login against STUDENTS_DATA
      const students = window.STUDENTS_DATA || [];
      const student = students.find(s => 
        (s.regNo && s.regNo.toUpperCase() === idClean) ||
        (s.rollNo && s.rollNo.toString() === idClean) ||
        (s.id && s.id === idClean)
      );

      if (student) {
        const validPass = passClean.toUpperCase() === student.regNo.toUpperCase() ||
                          passClean === student.rollNo.toString() ||
                          passClean.toUpperCase() === student.id.toUpperCase();

        if (validPass) {
          const user = {
            role: 'student',
            name: student.name,
            regNo: student.regNo,
            rollNo: student.rollNo,
            id: student.id
          };
          sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user, expiresAt }));
          this.startTimer();
          return { success: true, user, redirect: `${student.id}/index.html` };
        } else {
          return { success: false, message: 'Invalid password. For students, default password is your University Register No.' };
        }
      }

      return { success: false, message: 'Register Number not found. Please check your KTU register number.' };
    },

    startTimer() {
      if (this._interval) clearInterval(this._interval);
      this._interval = setInterval(() => {
        try {
          const raw = sessionStorage.getItem(AUTH_KEY);
          if (!raw) return;
          const data = JSON.parse(raw);
          if (Date.now() > data.expiresAt) {
            clearInterval(this._interval);
            alert('Your session has expired due to 90 seconds of inactivity. Please log in again.');
            this.logout();
          }
        } catch(e) {}
      }, 5000);
    },

    logout(isTimeout = false) {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      if (this._interval) clearInterval(this._interval);

      // Return to portal index
      let target = 'index.html';
      if (window.location.pathname.includes('/')) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length > 1 && /^\d+$/.test(segments[segments.length - 2])) {
          target = '../index.html';
        } else if (segments.length > 0 && /^\d+$/.test(segments[segments.length - 1])) {
          target = '../index.html';
        }
      }
      window.location.href = target;
    }
  };

  // Start background watchdog if already logged in
  if (sessionStorage.getItem(AUTH_KEY)) {
    window.CollegeAuth.startTimer();
  }
})();
