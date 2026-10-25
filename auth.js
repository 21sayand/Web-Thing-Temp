// Institutional Client-Side Authentication Service
(function() {
  const AUTH_KEY = 'college_portal_auth_user';

  // Default Faculty Credentials
  const FACULTY_CREDENTIALS = {
    username: 'faculty',
    password: 'cse@stthomas' // can also accept 'admin' or 'faculty123'
  };

  window.CollegeAuth = {
    getCurrentUser() {
      try {
        const stored = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    },

    login(identifier, password, remember = true) {
      if (!identifier || !password) {
        return { success: false, message: 'Please enter both University Register Number and password.' };
      }

      const idClean = identifier.trim().toUpperCase();
      const passClean = password.trim();

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
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(AUTH_KEY, JSON.stringify(user));
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
        // Password matches Register Number (case-insensitive) or Roll Number
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
          const storage = remember ? localStorage : sessionStorage;
          storage.setItem(AUTH_KEY, JSON.stringify(user));
          return { success: true, user, redirect: `${student.id}/index.html` };
        } else {
          return { success: false, message: 'Invalid password. For students, default password is your University Register No.' };
        }
      }

      return { success: false, message: 'Register Number not found. Please check your KTU register number.' };
    },

    logout() {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      window.location.href = window.location.origin + window.location.pathname.replace(/\/(\d+|assignment\.html).*$/, '/index.html');
    },

    // Guard for specific pages
    protectRoute(requiredRole = 'any', studentFolder = null) {
      const user = this.getCurrentUser();

      // If not logged in at all
      if (!user) {
        return false;
      }

      // If faculty only required (e.g. assignment.html)
      if (requiredRole === 'faculty' && user.role !== 'faculty') {
        return false;
      }

      // If on a student page, student cannot view other students' pages
      if (studentFolder && user.role === 'student' && user.id !== studentFolder) {
        return false;
      }

      return true;
    }
  };
})();
