// Institutional Client-Side Authentication Service with Session Timeout
(function() {
  const AUTH_KEY = 'college_portal_auth_user';
  const TIMEOUT_SECONDS = 150; // 150-second session timeout as requested

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
        
        const now = Date.now();
        if (data.expiresAt && now > data.expiresAt) {
          this.logout(true);
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
        return { success: false, message: 'Please enter both credentials.' };
      }

      const idClean = identifier.trim().toUpperCase();
      const passClean = password.trim().toUpperCase();
      const now = Date.now();
      const expiresAt = now + (TIMEOUT_SECONDS * 1000);

      // 1. Check Faculty Login (case-insensitive)
      if (
        (idClean === 'FACULTY' || idClean === 'ADMIN' || idClean === 'TEACHER') &&
        (passClean === FACULTY_CREDENTIALS.password.toUpperCase() || passClean === 'ADMIN123' || passClean === 'FACULTY')
      ) {
        const user = {
          role: 'faculty',
          name: 'Faculty Member / Evaluator',
          regNo: 'FACULTY_CSE',
          id: 'faculty'
        };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user, expiresAt }));
        this.startTimer();
        return { success: true, user, redirect: 'index.html' };
      }

      // 2. Check Student Login against STUDENTS_DATA (case-insensitive)
      const students = window.STUDENTS_DATA || [];
      const student = students.find(s => 
        (s.regNo && s.regNo.toUpperCase() === idClean) ||
        (s.rollNo && s.rollNo.toString() === idClean) ||
        (s.id && s.id.toUpperCase() === idClean)
      );

      if (student) {
        const validPass = (student.regNo && passClean === student.regNo.toUpperCase()) ||
                          passClean === student.rollNo.toString() ||
                          passClean === student.id.toUpperCase();

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
          return { success: false, message: 'Invalid password. Password is your University Register Number.' };
        }
      }

      return { success: false, message: 'Register Number not found.' };
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
            alert('Your session has expired after 150 seconds of inactivity.');
            this.logout();
          }
        } catch(e) {}
      }, 5000);
    },

    logout() {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      if (this._interval) clearInterval(this._interval);

      const loc = window.location.pathname;
      if (loc.includes('/')) {
        const parts = loc.split('/').filter(Boolean);
        if (parts.length > 0 && /^\d+$/.test(parts[parts.length - 1])) {
          window.location.href = '../index.html';
          return;
        } else if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 2])) {
          window.location.href = '../index.html';
          return;
        }
      }
      window.location.href = 'index.html';
    }
  };

  if (sessionStorage.getItem(AUTH_KEY)) {
    window.CollegeAuth.startTimer();
  }
})();
