import React, { useState } from 'react';
import {
  StudentProfile,
  Gender,
  BloodGroup,
  FormValidationErrors,
  AcademicRecord
} from '../types/student';
import {
  POPULAR_COMPANIES,
  TECHNICAL_SKILLS_LIST,
  SOFT_SKILLS_LIST,
  NSS_ACTIVITIES_LIST,
  DEFAULT_AVATARS,
  DEMO_PROFILES
} from '../data/initialData';
import {
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  Award,
  Heart,
  Briefcase,
  FileCheck,
  Eye,
  CheckSquare,
  Square,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { YADHU_AVATAR_SVG } from '../data/yadhuAvatar';
import confetti from 'canvas-confetti';

interface StudentProfileFormProps {
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onPreviewProfile: () => void;
}

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  profile: initialProfile,
  onSaveProfile,
  onPreviewProfile
}) => {
  const [formData, setFormData] = useState<StudentProfile>(initialProfile);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customCompanyInput, setCustomCompanyInput] = useState('');
  const [selectedCompanyDropdown, setSelectedCompanyDropdown] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Sync initialProfile and sanitize old placeholder photo
  React.useEffect(() => {
    if (initialProfile) {
      if (initialProfile.photoUrl && initialProfile.photoUrl.includes('1539571696357')) {
        setFormData({ ...initialProfile, photoUrl: YADHU_AVATAR_SVG });
      } else {
        setFormData(initialProfile);
      }
    }
  }, [initialProfile]);

  // Reusable image processor
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleInputChange('photoUrl', reader.result);
        setStatusMessage({
          type: 'success',
          text: 'Profile photo updated successfully!'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Global paste listener for easy photo pasting
  React.useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileProcess(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // Validate form fields
  const validateForm = (data: StudentProfile): { isValid: boolean; newErrors: FormValidationErrors } => {
    const errs: FormValidationErrors = {};

    // Name validation
    if (!data.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (data.fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters long.';
    }

    // USN validation (University Seat Number / Roll No)
    if (!data.usn.trim()) {
      errs.usn = 'USN / Roll Number is required (e.g., 1RV22CS042).';
    } else if (data.usn.trim().length < 5) {
      errs.usn = 'Please enter a valid USN / Roll number.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!data.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(data.phone.trim().replace(/\s/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    // Gender validation (Radio buttons)
    if (!data.gender) {
      errs.gender = 'Please select a gender.';
    }

    // Blood Group validation (Dropdown)
    if (!data.bloodGroup) {
      errs.bloodGroup = 'Please select a blood group.';
    }

    // Department validation
    if (!data.department.trim()) {
      errs.department = 'Branch / Department is required.';
    }

    // CGPA validation
    if (data.cgpa === undefined || data.cgpa === null || isNaN(data.cgpa)) {
      errs.cgpa = 'CGPA is required.';
    } else if (data.cgpa < 0 || data.cgpa > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0.';
    }

    // Interested companies validation (Dropdown)
    if (!data.interestedCompanies || data.interestedCompanies.length === 0) {
      errs.interestedCompanies = 'Please select at least one interested company (e.g. Infosys, TCS, Wipro).';
    }

    // Skills validation (Checkboxes)
    if (!data.skills || data.skills.length === 0) {
      errs.skills = 'Please check at least one skill.';
    }

    // NSS activities validation (Checkboxes)
    if (!data.nssActivities || data.nssActivities.length === 0) {
      errs.nssActivities = 'Please check at least one NSS or extracurricular activity.';
    }

    return {
      isValid: Object.keys(errs).length === 0,
      newErrors: errs
    };
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { newErrors } = validateForm(formData);
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof StudentProfile, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      const { newErrors } = validateForm(updated);
      setErrors(newErrors);
    }
  };

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Toggle company
  const toggleCompany = (company: string) => {
    const exists = formData.interestedCompanies.includes(company);
    const updated = exists
      ? formData.interestedCompanies.filter((c) => c !== company)
      : [...formData.interestedCompanies, company];
    handleInputChange('interestedCompanies', updated);
  };

  // Add custom company
  const handleAddCustomCompany = () => {
    const comp = customCompanyInput.trim();
    if (comp && !formData.interestedCompanies.includes(comp)) {
      handleInputChange('interestedCompanies', [...formData.interestedCompanies, comp]);
      setCustomCompanyInput('');
    }
  };

  // Handle company dropdown selection
  const handleCompanyDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCompanyDropdown(val);
    if (val && !formData.interestedCompanies.includes(val)) {
      handleInputChange('interestedCompanies', [...formData.interestedCompanies, val]);
    }
  };

  // Toggle skill
  const toggleSkill = (skill: string) => {
    const exists = formData.skills.includes(skill);
    const updated = exists
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    handleInputChange('skills', updated);
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    const s = customSkillInput.trim();
    if (s && !formData.skills.includes(s)) {
      handleInputChange('skills', [...formData.skills, s]);
      setCustomSkillInput('');
    }
  };

  // Toggle NSS activity
  const toggleNssActivity = (activity: string) => {
    const exists = formData.nssActivities.includes(activity);
    const updated = exists
      ? formData.nssActivities.filter((a) => a !== activity)
      : [...formData.nssActivities, activity];
    handleInputChange('nssActivities', updated);
  };

  // Academic table handlers
  const handleAcademicChange = (
    index: number,
    field: keyof AcademicRecord,
    val: any
  ) => {
    const updatedRecords = [...formData.academicRecords];
    const target = { ...updatedRecords[index], [field]: val };

    // Recalculate total internals if any internal component changed
    if (['test1Marks', 'test2Marks', 'assignmentMarks'].includes(field as string)) {
      const t1 = Math.min(15, Math.max(0, Number(target.test1Marks) || 0));
      const t2 = Math.min(15, Math.max(0, Number(target.test2Marks) || 0));
      const asg = Math.min(20, Math.max(0, Number(target.assignmentMarks) || 0));
      target.test1Marks = t1;
      target.test2Marks = t2;
      target.assignmentMarks = asg;
      target.totalInternal = t1 + t2 + asg;
    }

    if (field === 'sgpa') {
      const sgpaVal = Math.min(10, Math.max(0, Number(val) || 0));
      target.sgpa = Number(sgpaVal.toFixed(2));
      // auto grade status
      if (sgpaVal >= 8.5) target.gradeStatus = 'Distinction';
      else if (sgpaVal >= 7.0) target.gradeStatus = 'First Class';
      else if (sgpaVal >= 5.5) target.gradeStatus = 'Second Class';
      else target.gradeStatus = 'Pass';
    }

    updatedRecords[index] = target;

    // Recalculate average CGPA from SGPA of all recorded semesters
    const validSgpas = updatedRecords
      .map((r) => Number(r.sgpa))
      .filter((s) => !isNaN(s) && s > 0);
    const avgCgpa = validSgpas.length > 0
      ? Number((validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2))
      : formData.cgpa;

    const newProfile = {
      ...formData,
      academicRecords: updatedRecords,
      cgpa: avgCgpa
    };

    setFormData(newProfile);
  };

  const handleAddSemester = () => {
    const nextSemNum = formData.academicRecords.length + 1;
    if (nextSemNum > 8) {
      alert('Maximum 8 semesters supported.');
      return;
    }
    const newRecord: AcademicRecord = {
      id: `sem-${nextSemNum}`,
      semester: `Semester ${nextSemNum}`,
      sgpa: 8.0,
      test1Marks: 12,
      test2Marks: 12,
      assignmentMarks: 18,
      totalInternal: 42,
      attendancePercentage: 85,
      gradeStatus: 'First Class'
    };
    const updated = [...formData.academicRecords, newRecord];
    const validSgpas = updated.map((r) => r.sgpa).filter((s) => s > 0);
    const avgCgpa = Number((validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2));
    setFormData({
      ...formData,
      academicRecords: updated,
      cgpa: avgCgpa
    });
  };

  const handleRemoveSemester = (index: number) => {
    if (formData.academicRecords.length <= 1) {
      alert('At least one semester academic record must be present.');
      return;
    }
    const updated = formData.academicRecords.filter((_, i) => i !== index);
    const validSgpas = updated.map((r) => r.sgpa).filter((s) => s > 0);
    const avgCgpa = validSgpas.length > 0
      ? Number((validSgpas.reduce((a, b) => a + b, 0) / validSgpas.length).toFixed(2))
      : 8.0;
    setFormData({
      ...formData,
      academicRecords: updated,
      cgpa: avgCgpa
    });
  };

  // Form submission & validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all touched
    const allTouched: Record<string, boolean> = {
      fullName: true,
      usn: true,
      email: true,
      phone: true,
      gender: true,
      bloodGroup: true,
      department: true,
      cgpa: true,
      interestedCompanies: true,
      skills: true,
      nssActivities: true
    };
    setTouched(allTouched);

    const { isValid, newErrors } = validateForm(formData);
    setErrors(newErrors);

    if (!isValid) {
      setStatusMessage({
        type: 'error',
        text: 'Form contains validation errors. Please check the highlighted fields above.'
      });
      // Scroll to top of form smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Success!
    const finalProfile: StudentProfile = {
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSaveProfile(finalProfile);
    setStatusMessage({
      type: 'success',
      text: 'Student Profile successfully validated and updated!'
    });

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      setFormData({
        fullName: '',
        usn: '',
        email: '',
        phone: '',
        dob: '',
        gender: '' as Gender,
        bloodGroup: '',
        photoUrl: '',
        department: 'Computer Science and Engineering',
        currentSemester: '6th Semester',
        collegeName: 'Engineering & Technology College',
        address: '',
        interestedCompanies: [],
        targetPackageLPA: '10 LPA',
        careerObjective: '',
        cgpa: 0,
        academicRecords: [
          {
            id: 'sem-1',
            semester: 'Semester 1',
            sgpa: 0,
            test1Marks: 0,
            test2Marks: 0,
            assignmentMarks: 0,
            totalInternal: 0,
            attendancePercentage: 0,
            gradeStatus: 'Pass'
          }
        ],
        skills: [],
        nssActivities: [],
        certifications: [],
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      setTouched({});
      setStatusMessage({ type: 'success', text: 'Form has been reset to blank.' });
    }
  };

  // Load sample demo profile
  const handleLoadDemo = (profileIndex: number) => {
    const demo = DEMO_PROFILES[profileIndex].profile;
    setFormData(demo);
    setErrors({});
    setStatusMessage({
      type: 'success',
      text: `Loaded demo profile: ${DEMO_PROFILES[profileIndex].label}`
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Official Academic & Placement Profile Form
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Profile Web Page & Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete your academic details, internal marks, skills, and recruiter preferences with live validation.
          </p>
        </div>

        {/* Action presets */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="dropdown relative inline-block text-left w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleLoadDemo(0)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 w-full sm:w-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load YADHU SAGAR N Profile
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleLoadDemo(1)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 w-full sm:w-auto cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            Demo: NSS Lead & Placement Star
          </button>
          <button
            type="button"
            onClick={onPreviewProfile}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 w-full sm:w-auto cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Card
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-sm font-medium">{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold underline opacity-70 hover:opacity-100 cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* SECTION 1: Personal Details & Photo */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Personal Information & Photo</h3>
              <p className="text-xs text-slate-500">Student identity, contact details, gender, and blood group.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Photo Column */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(true);
              }}
              onDragLeave={() => setIsDraggingPhoto(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileProcess(file);
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed text-center space-y-4 transition-all ${
                isDraggingPhoto
                  ? 'bg-indigo-50/90 border-indigo-500 scale-[1.02]'
                  : 'bg-slate-50/80 border-slate-300 hover:border-indigo-400'
              }`}
            >
              <div className="relative group">
                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-slate-200 border-4 border-white shadow-md flex items-center justify-center relative">
                  <img
                    src={formData.photoUrl || '/image/profile.jpg'}
                    alt={formData.fullName || 'Student'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = YADHU_AVATAR_SVG;
                    }}
                  />
                  {isDraggingPhoto && (
                    <div className="absolute inset-0 bg-indigo-600/80 text-white flex flex-col items-center justify-center text-xs font-bold p-2 backdrop-blur-xs">
                      <Upload className="w-6 h-6 mb-1 animate-bounce" />
                      Drop photo here!
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full space-y-2.5">
                {/* Standard File Upload */}
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                  />
                </label>

                {/* Camera Capture Input (hidden) */}
                <input
                  type="file"
                  id="camera-photo-input"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileProcess(f);
                  }}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      // Add timestamp to bust any cache when reloading the file
                      handleInputChange('photoUrl', `/image/profile.jpg?t=${Date.now()}`);
                      setStatusMessage({
                        type: 'success',
                        text: 'Linked to image/profile.jpg!'
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-semibold cursor-pointer transition border border-indigo-200"
                    title="Reload from image/profile.jpg"
                  >
                    <ImageIcon className="w-3 h-3 text-indigo-600" />
                    image/profile.jpg
                  </button>

                  <label
                    htmlFor="camera-photo-input"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition"
                    title="Take a photo with your webcam / phone camera"
                  >
                    <Camera className="w-3 h-3 text-slate-600" />
                    Camera
                  </label>

                  <button
                    type="button"
                    onClick={() => handleInputChange('photoUrl', YADHU_AVATAR_SVG)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition"
                    title="Load Yadhu Sagar portrait"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Avatar
                  </button>

                  {formData.photoUrl && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('photoUrl', '')}
                      className="px-2 py-1 text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-tight">
                  Linked to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700 font-semibold">image/profile.jpg</code>. Replace it in the root folder, or click "Choose File" above.
                </p>

                {/* Preset Avatar Picker */}
                {showAvatarModal && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg mt-2 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('photoUrl', YADHU_AVATAR_SVG);
                        setShowAvatarModal(false);
                      }}
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-indigo-500 hover:border-indigo-700 transition cursor-pointer p-0.5 bg-slate-50"
                      title="Yadhu Sagar Portrait"
                    >
                      <img src={YADHU_AVATAR_SVG} alt="Yadhu Avatar" className="w-full h-full object-cover" />
                    </button>
                    {DEFAULT_AVATARS.map((url, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          handleInputChange('photoUrl', url);
                          setShowAvatarModal(false);
                        }}
                        className="w-12 h-12 rounded-lg overflow-hidden border-2 hover:border-indigo-600 transition cursor-pointer"
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-slate-400">
                  Tip: Drag & drop image here or paste with Ctrl+V anytime.
                </p>
              </div>
            </div>

            {/* Inputs Column */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.fullName && touched.fullName
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
                  }`}
                  required
                />
                {errors.fullName && touched.fullName && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* USN / Roll Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  USN / Roll Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={(e) => handleInputChange('usn', e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('usn')}
                  placeholder="e.g. 1RV22CS042"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono transition-all focus:outline-none focus:ring-2 ${
                    errors.usn && touched.usn
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
                  }`}
                  required
                />
                {errors.usn && touched.usn && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.usn}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="student@college.edu"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email && touched.email
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
                  }`}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.phone && touched.phone
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
                  }`}
                  required
                />
                {errors.phone && touched.phone && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Department / Branch */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Department / Branch <span className="text-rose-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  onBlur={() => handleBlur('department')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                >
                  <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                  <option value="Information Science and Engineering">Information Science & Engineering</option>
                  <option value="Electronics and Communication Engineering">Electronics & Communication</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics</option>
                </select>
              </div>

              {/* Current Semester */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Current Semester
                </label>
                <select
                  name="currentSemester"
                  value={formData.currentSemester}
                  onChange={(e) => handleInputChange('currentSemester', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="1st Semester (S1)">1st Semester (S1)</option>
                  <option value="2nd Semester (S2)">2nd Semester (S2)</option>
                  <option value="3rd Semester (S3)">3rd Semester (S3)</option>
                  <option value="4th Semester (S4)">4th Semester (S4)</option>
                  <option value="5th Semester (S5)">5th Semester (S5)</option>
                  <option value="6th Semester (S6)">6th Semester (S6)</option>
                  <option value="7th Semester (S7)">7th Semester (S7)</option>
                  <option value="8th Semester (S8)">8th Semester (S8)</option>
                  <option value="S7">S7</option>
                </select>
              </div>

              {/* BLOOD GROUP (Dropdown List Requirement) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Blood Group (Dropdown) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value as BloodGroup)}
                    onBlur={() => handleBlur('bloodGroup')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.bloodGroup && touched.bloodGroup
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
                    }`}
                    required
                  >
                    <option value="">-- Select Blood Group --</option>
                    <option value="A+">A+ (A Positive)</option>
                    <option value="A-">A- (A Negative)</option>
                    <option value="B+">B+ (B Positive)</option>
                    <option value="B-">B- (B Negative)</option>
                    <option value="AB+">AB+ (AB Positive)</option>
                    <option value="AB-">AB- (AB Negative)</option>
                    <option value="O+">O+ (O Positive)</option>
                    <option value="O-">O- (O Negative)</option>
                  </select>
                </div>
                {errors.bloodGroup && touched.bloodGroup && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.bloodGroup}
                  </p>
                )}
              </div>

              {/* GENDER (Radio Buttons Requirement) */}
              <div className="md:col-span-2 space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Gender (Radio Buttons) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Male', 'Female', 'Other', 'Prefer not to say'] as Gender[]).map((genderOption) => {
                    const isSelected = formData.gender === genderOption;
                    return (
                      <label
                        key={genderOption}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={genderOption}
                          checked={isSelected}
                          onChange={() => handleInputChange('gender', genderOption)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="text-xs">{genderOption}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.gender && touched.gender && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.gender}
                  </p>
                )}
              </div>

              {/* Residential Address */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Address for Communication
                </label>
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Door No, Street name, City, State, Pincode"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Interested Companies (Dropdown list & multi-pick) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Interested Recruitment Companies (Dropdown & Selection)
              </h3>
              <p className="text-xs text-slate-500">
                Target tech recruiters such as Infosys, TCS, Wipro, Accenture, Cognizant, and product firms.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Dropdown selector as specifically requested */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Recruiter from Dropdown List <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCompanyDropdown}
                  onChange={handleCompanyDropdownSelect}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                >
                  <option value="">-- Choose Company (e.g. Infosys, TCS, Wipro) --</option>
                  {POPULAR_COMPANIES.map((company) => (
                    <option key={company} value={company}>
                      {company} {formData.interestedCompanies.includes(company) ? '(Selected)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">Selecting will add company to your targeted profile list.</p>
              </div>

              {/* Add Custom Company */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Or Add Other Company
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCompanyInput}
                    onChange={(e) => setCustomCompanyInput(e.target.value)}
                    placeholder="e.g. Atlassian, Goldman Sachs"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCompany();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCompany}
                    className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Companies Badges */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Currently Selected Companies ({formData.interestedCompanies.length}):
              </label>
              {formData.interestedCompanies.length === 0 ? (
                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  No companies selected yet. Please pick from the dropdown above or click any of the popular shortcuts below.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.interestedCompanies.map((company) => (
                    <span
                      key={company}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 shadow-2xs"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                      {company}
                      <button
                        type="button"
                        onClick={() => toggleCompany(company)}
                        className="w-4 h-4 rounded-full hover:bg-amber-200 inline-flex items-center justify-center text-amber-700 hover:text-amber-900 font-bold ml-1 cursor-pointer"
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Fast Toggle Buttons for prominent companies */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500 mr-2">Quick Toggle Recruiters:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Infosys', 'TCS (Tata Consultancy Services)', 'Wipro', 'Accenture', 'Cognizant', 'Google', 'Microsoft', 'Amazon'].map(
                    (comp) => {
                      const isChecked = formData.interestedCompanies.includes(comp);
                      return (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => toggleCompany(comp)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition cursor-pointer ${
                            isChecked
                              ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isChecked ? '✓ ' : '+ '}
                          {comp.split(' ')[0]}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {errors.interestedCompanies && touched.interestedCompanies && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-3 h-3" /> {errors.interestedCompanies}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: Academic Performance Table (CGPA, SGPA, Internal Marks) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Academic Performance & Internal Marks Table
                </h3>
                <p className="text-xs text-slate-500">
                  Semester SGPA, cumulative CGPA, Test 1, Test 2, and assignment marks.
                </p>
              </div>
            </div>

            {/* Cumulative CGPA badge */}
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                  Cumulative CGPA
                </span>
                <span className="text-xl font-extrabold text-blue-900 font-mono">
                  {Number(formData.cgpa).toFixed(2)} / 10.0
                </span>
              </div>
              <div className="pl-3 border-l border-blue-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Class</span>
                <span className="text-xs font-bold text-blue-800">
                  {formData.cgpa >= 8.5 ? 'First Class with Distinction' : formData.cgpa >= 7.0 ? 'First Class' : 'Pass'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">SGPA (0 - 10)</th>
                  <th className="py-3 px-3">Internal Test 1 (Max 15)</th>
                  <th className="py-3 px-3">Internal Test 2 (Max 15)</th>
                  <th className="py-3 px-3">Assignment (Max 20)</th>
                  <th className="py-3 px-3">Total Internal (Max 50)</th>
                  <th className="py-3 px-3">Attendance %</th>
                  <th className="py-3 px-3">Grade Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {formData.academicRecords.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {record.semester}
                    </td>

                    {/* SGPA Input */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={record.sgpa}
                        onChange={(e) => handleAcademicChange(index, 'sgpa', e.target.value)}
                        className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-sm font-mono font-medium focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Test 1 Marks (Max 15) */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="15"
                        value={record.test1Marks}
                        onChange={(e) => handleAcademicChange(index, 'test1Marks', e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Test 2 Marks (Max 15) */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="15"
                        value={record.test2Marks}
                        onChange={(e) => handleAcademicChange(index, 'test2Marks', e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Assignment Marks (Max 20) */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="20"
                        value={record.assignmentMarks}
                        onChange={(e) => handleAcademicChange(index, 'assignmentMarks', e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Total Internal (Computed out of 50) */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          record.totalInternal >= 45
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.totalInternal >= 35
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {record.totalInternal} / 50
                      </span>
                    </td>

                    {/* Attendance */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={record.attendancePercentage}
                          onChange={(e) =>
                            handleAcademicChange(
                              index,
                              'attendancePercentage',
                              Math.min(100, Math.max(0, Number(e.target.value) || 0))
                            )
                          }
                          className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-500">%</span>
                      </div>
                    </td>

                    {/* Grade status badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          record.gradeStatus === 'Distinction'
                            ? 'bg-indigo-100 text-indigo-700'
                            : record.gradeStatus === 'First Class'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {record.gradeStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSemester(index)}
                        disabled={formData.academicRecords.length <= 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 p-1 rounded-md transition cursor-pointer"
                        title="Delete Semester Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleAddSemester}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Next Semester Record
            </button>
            <p className="text-xs text-slate-500">
              * Internal marks: Test 1 (15) + Test 2 (15) + Assignments (20) = 50 Marks total.
            </p>
          </div>
        </section>

        {/* SECTION 4: Skills (Checkboxes with Categories & Custom Addition) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Skills Inventory (Checkboxes)
              </h3>
              <p className="text-xs text-slate-500">
                Check relevant technical and professional proficiencies for company shortlisting.
              </p>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Technical & Programming Skills <span className="text-rose-500">*</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {formData.skills.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {TECHNICAL_SKILLS_LIST.map((skill) => {
                const isChecked = formData.skills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-semibold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSkill(skill)}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                    <span className="truncate">{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Professional & Soft Skills
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SOFT_SKILLS_LIST.map((skill) => {
                const isChecked = formData.skills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSkill(skill)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="truncate">{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Custom Skill Input */}
          <div className="pt-2 flex gap-2 max-w-md">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Add other skill (e.g. Flutter, Kubernetes)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-3.5 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition cursor-pointer"
            >
              Add Skill
            </button>
          </div>

          {errors.skills && touched.skills && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {errors.skills}
            </p>
          )}
        </section>

        {/* SECTION 5: NSS & Extracurricular Activities (Checkboxes Requirement) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                NSS & Extracurricular Activities (Checkboxes)
              </h3>
              <p className="text-xs text-slate-500">
                National Service Scheme (NSS), community service, sports, and leadership initiatives.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Participated Activities <span className="text-rose-500">*</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {formData.nssActivities.length} checked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NSS_ACTIVITIES_LIST.map((activity) => {
                const isChecked = formData.nssActivities.includes(activity);
                return (
                  <label
                    key={activity}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50/60 text-rose-950 font-medium shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleNssActivity(activity)}
                      className="mt-0.5 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 shrink-0"
                    />
                    <span className="leading-snug">{activity}</span>
                  </label>
                );
              })}
            </div>

            {errors.nssActivities && touched.nssActivities && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-2">
                <AlertTriangle className="w-3 h-3" /> {errors.nssActivities}
              </p>
            )}
          </div>
        </section>

        {/* SECTION 6: Basic Form Buttons (Submit, Reset, Preview) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Interactive JavaScript validation enforced</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-300 cursor-pointer w-full sm:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Form
            </button>

            <button
              type="button"
              onClick={onPreviewProfile}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200 cursor-pointer w-full sm:w-auto"
            >
              <Eye className="w-3.5 h-3.5" />
              View Profile Card
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit & Validate Profile
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};
