import { StudentProfile, StudentTask } from '../types/student';
import { YADHU_AVATAR_SVG } from './yadhuAvatar';

export const POPULAR_COMPANIES = [
  'Infosys',
  'TCS (Tata Consultancy Services)',
  'Wipro',
  'Accenture',
  'Cognizant',
  'Capgemini',
  'Google',
  'Microsoft',
  'Amazon',
  'LTI Mindtree',
  'IBM',
  'Oracle',
  'HCL Technologies',
  'Deloitte',
  'Cisco'
];

export const TECHNICAL_SKILLS_LIST = [
  'Python',
  'Java',
  'C / C++',
  'JavaScript / TypeScript',
  'React.js',
  'Node.js & Express',
  'SQL & Relational Databases',
  'Data Structures & Algorithms',
  'HTML5 & Tailwind CSS',
  'Git & Version Control',
  'Machine Learning & AI',
  'Cloud Computing (AWS / GCP)',
  'Cybersecurity Fundamentals',
  'REST APIs'
];

export const SOFT_SKILLS_LIST = [
  'Critical Problem Solving',
  'Team Leadership',
  'Effective Communication',
  'Time Management',
  'Agile / Scrum Methodologies',
  'Technical Documentation'
];

export const NSS_ACTIVITIES_LIST = [
  'NSS Annual Special Camp Volunteer (7-Day Village Camp)',
  'Blood Donation Drive Coordinator',
  'Swachh Bharat Cleanliness & Waste Management Drive',
  'Tree Plantation & Environmental Sustainability Drive',
  'Youth Red Cross / Health Checkup Camp Volunteer',
  'Digital Literacy Campaign for Rural Schools',
  'National Integration Camp Participant',
  'Disaster Relief & Community Service Drive',
  'NCC Cadet / Republic Day Parade Training',
  'College Technical Fest & Cultural Committee Member'
];

export const DEFAULT_AVATARS = [
  '/image/profile.jpg',
  YADHU_AVATAR_SVG,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
];

export const DEMO_PROFILES: { label: string; profile: StudentProfile }[] = [
  {
    label: 'Hridush prakash (CSE S7 - STM23CS022)',
    profile: {
      fullName: 'Hridush prakash',
      usn: 'STM23CS022',
      email: 'hridukithu23@gmail.com',
      phone: '8075733450',
      dob: '2005-08-13',
      gender: 'Male',
      bloodGroup: 'O+',
      photoUrl: '/image/profile.jpg',
      department: 'Computer Science and Engineering',
      currentSemester: '7th Semester (S7)',
      collegeName: 'College of Engineering & Technology',
      address: 'Pulikkal House Vaiparambu Chal P. O Azhikode, 670009',
      interestedCompanies: ['Infosys', 'TCS (Tata Consultancy Services)', 'Wipro', 'Accenture', 'Cognizant', 'Google'],
      targetPackageLPA: '10 - 18 LPA',
      careerObjective: 'Motivated 7th-semester Computer Science undergraduate with hands-on expertise in Full-Stack Engineering, Algorithms, and Cloud Systems. Aspiring to engineer robust software solutions in leading technology firms like Infosys, TCS, and Wipro.',
      cgpa: 8.82,
      academicRecords: [
        {
          id: 'sem-1',
          semester: 'Semester 1 (S1)',
          sgpa: 8.60,
          test1Marks: 14,
          test2Marks: 14,
          assignmentMarks: 19,
          totalInternal: 47,
          attendancePercentage: 94,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-2',
          semester: 'Semester 2 (S2)',
          sgpa: 8.75,
          test1Marks: 14,
          test2Marks: 13,
          assignmentMarks: 19,
          totalInternal: 46,
          attendancePercentage: 92,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-3',
          semester: 'Semester 3 (S3)',
          sgpa: 8.90,
          test1Marks: 15,
          test2Marks: 14,
          assignmentMarks: 20,
          totalInternal: 49,
          attendancePercentage: 95,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-4',
          semester: 'Semester 4 (S4)',
          sgpa: 8.85,
          test1Marks: 14,
          test2Marks: 15,
          assignmentMarks: 19,
          totalInternal: 48,
          attendancePercentage: 91,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-5',
          semester: 'Semester 5 (S5)',
          sgpa: 8.95,
          test1Marks: 15,
          test2Marks: 15,
          assignmentMarks: 20,
          totalInternal: 50,
          attendancePercentage: 96,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-6',
          semester: 'Semester 6 (S6)',
          sgpa: 8.88,
          test1Marks: 14,
          test2Marks: 15,
          assignmentMarks: 19,
          totalInternal: 48,
          attendancePercentage: 93,
          gradeStatus: 'Distinction'
        }
      ],
      skills: [
        'Python',
        'Java',
        'C / C++',
        'JavaScript / TypeScript',
        'React.js',
        'SQL & Relational Databases',
        'Data Structures & Algorithms',
        'HTML5 & Tailwind CSS',
        'Git & Version Control',
        'Critical Problem Solving',
        'Team Leadership'
      ],
      nssActivities: [
        'NSS Annual Special Camp Volunteer (7-Day Village Camp)',
        'Blood Donation Drive Coordinator',
        'Swachh Bharat Cleanliness & Waste Management Drive',
        'College Technical Fest & Cultural Committee Member'
      ],
      certifications: [
        'Full Stack Web Development Certification',
        'AWS Certified Cloud Practitioner'
      ],
      lastUpdated: '2026-09-29'
    }
  },
  {
    label: 'Sneha Kulkarni (ISE - Placement Star & NSS Lead)',
    profile: {
      fullName: 'Sneha Kulkarni',
      usn: '1RV22IS089',
      email: 'sneha.kulkarni@college.edu',
      phone: '+91 97412 88452',
      dob: '2003-08-22',
      gender: 'Female',
      bloodGroup: 'B+',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      department: 'Information Science and Engineering',
      currentSemester: '6th Semester',
      collegeName: 'National Institute of Engineering & Technology',
      address: 'Plot 55, Shantiniketan Colony, Hubballi - 580023',
      interestedCompanies: ['Infosys', 'TCS (Tata Consultancy Services)', 'Wipro', 'Microsoft', 'Capgemini'],
      targetPackageLPA: '14 - 22 LPA',
      careerObjective: 'Driven engineering student passionate about distributed systems, modern web engineering, and collaborative social impact through NSS and leadership initiatives.',
      cgpa: 9.15,
      academicRecords: [
        {
          id: 'sem-1',
          semester: 'Semester 1',
          sgpa: 9.00,
          test1Marks: 15,
          test2Marks: 14,
          assignmentMarks: 20,
          totalInternal: 49,
          attendancePercentage: 96,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-2',
          semester: 'Semester 2',
          sgpa: 9.10,
          test1Marks: 14,
          test2Marks: 15,
          assignmentMarks: 20,
          totalInternal: 49,
          attendancePercentage: 94,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-3',
          semester: 'Semester 3',
          sgpa: 9.25,
          test1Marks: 15,
          test2Marks: 15,
          assignmentMarks: 20,
          totalInternal: 50,
          attendancePercentage: 98,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-4',
          semester: 'Semester 4',
          sgpa: 9.18,
          test1Marks: 14,
          test2Marks: 15,
          assignmentMarks: 19,
          totalInternal: 48,
          attendancePercentage: 95,
          gradeStatus: 'Distinction'
        },
        {
          id: 'sem-5',
          semester: 'Semester 5',
          sgpa: 9.22,
          test1Marks: 15,
          test2Marks: 15,
          assignmentMarks: 20,
          totalInternal: 50,
          attendancePercentage: 97,
          gradeStatus: 'Distinction'
        }
      ],
      skills: [
        'Python',
        'C / C++',
        'JavaScript / TypeScript',
        'React.js',
        'Node.js & Express',
        'SQL & Relational Databases',
        'Data Structures & Algorithms',
        'Machine Learning & AI',
        'Team Leadership',
        'Effective Communication'
      ],
      nssActivities: [
        'NSS Annual Special Camp Volunteer (7-Day Village Camp)',
        'Blood Donation Drive Coordinator',
        'Digital Literacy Campaign for Rural Schools',
        'Tree Plantation & Environmental Sustainability Drive'
      ],
      certifications: [
        'Google Cloud Associate Cloud Engineer',
        'Meta Front-End Developer Specialization'
      ],
      lastUpdated: '2026-09-29'
    }
  }
];

export const INITIAL_TASKS: StudentTask[] = [
  {
    id: 'task-1',
    title: 'Infosys Certification Mock Test - Pseudo Code & DSA',
    description: 'Solve 25 pseudocode questions and revise time complexity algorithms for Infosys recruitment round.',
    category: 'Placement Prep',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-10-05',
    relatedCompany: 'Infosys',
    createdAt: '2026-09-25'
  },
  {
    id: 'task-2',
    title: 'TCS NQT Numerical Ability & Verbal Practice',
    description: 'Complete 3 full-length sectional tests on TCS NQT portal covering statistics and reasoning.',
    category: 'Placement Prep',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-10-08',
    relatedCompany: 'TCS (Tata Consultancy Services)',
    createdAt: '2026-09-26'
  },
  {
    id: 'task-3',
    title: 'Database Management Systems - Internal Test 2 Revision',
    description: 'Revise B+ Trees, Indexing, Normalization (3NF/BCNF), and ACID properties for upcoming internal test (target 15/15).',
    category: 'Internal Exams',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-10-10',
    createdAt: '2026-09-27'
  },
  {
    id: 'task-4',
    title: 'Wipro Elite NLTH Coding Practice on Arrays & Strings',
    description: 'Solve 10 medium level string manipulation and matrix problems in Java / C++.',
    category: 'Placement Prep',
    priority: 'Medium',
    status: 'Todo',
    dueDate: '2026-10-14',
    relatedCompany: 'Wipro',
    createdAt: '2026-09-28'
  },
  {
    id: 'task-5',
    title: 'Organize Blood Donation Drive Banner & Volunteer Roster',
    description: 'Coordinate with College Red Cross society and allocate 15 student volunteers for registration desk.',
    category: 'NSS & Club',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-09-28',
    createdAt: '2026-09-20'
  },
  {
    id: 'task-6',
    title: 'Submit Machine Learning Lab Assignment 3',
    description: 'Implement Logistic Regression and Random Forest classifier on Titanic dataset with confusion matrix analysis.',
    category: 'Assignments',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-10-03',
    createdAt: '2026-09-29'
  }
];
