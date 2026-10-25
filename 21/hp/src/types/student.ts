export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';

export interface AcademicRecord {
  id: string;
  semester: string;
  sgpa: number;
  test1Marks: number;    // Max 15
  test2Marks: number;    // Max 15
  assignmentMarks: number; // Max 20
  totalInternal: number; // Max 50 (test1 + test2 + assignment)
  attendancePercentage: number;
  gradeStatus: 'Distinction' | 'First Class' | 'Second Class' | 'Pass';
}

export interface StudentProfile {
  // Personal Details
  fullName: string;
  usn: string; // University Seat Number / Roll No
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  photoUrl: string;
  department: string;
  currentSemester: string;
  collegeName: string;
  address: string;

  // Placement Interests
  interestedCompanies: string[];
  targetPackageLPA: string;
  careerObjective: string;

  // Academic Records
  cgpa: number;
  academicRecords: AcademicRecord[];

  // Skills & Extracurriculars
  skills: string[];
  nssActivities: string[];
  certifications: string[];

  // Profile metadata
  lastUpdated: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Placement Prep' | 'Internal Exams' | 'Assignments' | 'Project' | 'NSS & Club' | 'Personal';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface StudentTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  relatedCompany?: string;
  createdAt: string;
}

export interface FormValidationErrors {
  fullName?: string;
  usn?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  department?: string;
  cgpa?: string;
  interestedCompanies?: string;
  skills?: string;
  nssActivities?: string;
  general?: string;
}
