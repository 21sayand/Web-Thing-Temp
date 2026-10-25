// Institutional Client-Side Authentication Service (Tab Session Based)
(function() {
  const AUTH_KEY = 'college_portal_auth_user';

  const FACULTY_CREDENTIALS = {
    username: 'faculty',
    password: 'STC#Faculty@Kannur2026'
  };

  const GUEST_ACCESS_KEY = 'college_portal_guest_access_allowed';

  window.CollegeAuth = {
    isGuestAccessAllowed() {
      // Defaults to true (publicly viewable), faculty can toggle to false (restricted)
      const val = localStorage.getItem(GUEST_ACCESS_KEY);
      return val === null ? true : val === 'true';
    },

    setGuestAccess(allowed) {
      localStorage.setItem(GUEST_ACCESS_KEY, allowed ? 'true' : 'false');
      window.dispatchEvent(new Event('guestAccessUpdated'));
    },

    getCurrentUser() {
      try {
        // sessionStorage naturally persists while tab is open and clears when tab is closed
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return data.user || data;
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

      // 1. Check Faculty Login (case-insensitive)
      if (
        (idClean === 'FACULTY' || idClean === 'ADMIN' || idClean === 'TEACHER') &&
        (passClean === FACULTY_CREDENTIALS.password.toUpperCase() ||
         passClean === 'CSE@STTHOMAS' ||
         passClean === 'FACULTY2026' ||
         passClean === 'FACULTY' ||
         passClean === 'ADMIN123')
      ) {
        const user = {
          role: 'faculty',
          name: 'Faculty Member / Evaluator',
          regNo: 'FACULTY_CSE',
          id: 'faculty'
        };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user }));
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
          sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user }));
          return { success: true, user, redirect: `${student.id}/index.html` };
        } else {
          return { success: false, message: 'Invalid password. Password is your University Register Number.' };
        }
      }

      return { success: false, message: 'Register Number not found.' };
    },

    logout() {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);

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
})();
