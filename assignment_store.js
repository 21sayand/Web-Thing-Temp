// Central shared state management for Assignment Submissions
(function() {
  const STORAGE_KEY = 'college_portal_assignments_state';
  const CONFIG_KEY = 'college_portal_assignments_meta';

  const defaultMeta = [
    { id: 'A1', title: 'Assignment 1: Responsive Web Profile', maxMarks: 10, dueDate: '2026-11-05' },
    { id: 'A2', title: 'Assignment 2: JavaScript DOM & Validation', maxMarks: 10, dueDate: '2026-11-15' }
  ];

  window.AssignmentStore = {
    getAssignments() {
      try {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? JSON.parse(stored) : defaultMeta;
      } catch (e) {
        return defaultMeta;
      }
    },

    saveAssignments(assignments) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(assignments));
      window.dispatchEvent(new Event('assignmentsUpdated'));
    },

    addAssignment(title, dueDate = '2026-12-01') {
      const current = this.getAssignments();
      const nextNum = current.length + 1;
      const newId = `A${nextNum}`;
      current.push({ id: newId, title, maxMarks: 10, dueDate });
      this.saveAssignments(current);
      return newId;
    },

    getState() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    },

    isSubmitted(studentId, assignmentId = 'A1') {
      const state = this.getState();
      return state[studentId] && state[studentId][assignmentId] === 1;
    },

    toggleSubmission(studentId, assignmentId = 'A1', fileName = '') {
      const state = this.getState();
      if (!state[studentId]) state[studentId] = {};
      
      const currentVal = state[studentId][assignmentId] || 0;
      const newVal = currentVal === 1 ? 0 : 1;
      state[studentId][assignmentId] = newVal;
      
      if (newVal === 1) {
        if (!state[studentId]._meta) state[studentId]._meta = {};
        state[studentId]._meta[assignmentId] = {
          fileName: fileName || `submission_${assignmentId.toLowerCase()}.pdf`,
          submittedAt: new Date().toISOString()
        };
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event('submissionsUpdated'));
      return newVal;
    },

    setSubmitted(studentId, assignmentId = 'A1', fileName = '') {
      const state = this.getState();
      if (!state[studentId]) state[studentId] = {};
      state[studentId][assignmentId] = 1;
      if (!state[studentId]._meta) state[studentId]._meta = {};
      state[studentId]._meta[assignmentId] = {
        fileName: fileName || `submission_${assignmentId.toLowerCase()}.pdf`,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event('submissionsUpdated'));
    },

    getStudentStats(studentId) {
      const assignments = this.getAssignments();
      const state = this.getState();
      const sData = state[studentId] || {};
      let submittedCount = 0;
      assignments.forEach(a => {
        if (sData[a.id] === 1) submittedCount++;
      });
      return {
        submittedCount,
        totalCount: assignments.length,
        isFullySubmitted: assignments.length > 0 && submittedCount === assignments.length
      };
    },

    exportData() {
      return {
        exportedAt: new Date().toISOString(),
        assignments: this.getAssignments(),
        submissions: this.getState()
      };
    },

    importData(importedObj) {
      if (importedObj && importedObj.submissions) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importedObj.submissions));
        if (importedObj.assignments) {
          localStorage.setItem(CONFIG_KEY, JSON.stringify(importedObj.assignments));
        }
        window.dispatchEvent(new Event('submissionsUpdated'));
        window.dispatchEvent(new Event('assignmentsUpdated'));
        return true;
      }
      return false;
    }
  };
})();
