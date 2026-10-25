import React from 'react';
import { StudentProfile } from '../types/student';
import { YADHU_AVATAR_SVG } from '../data/yadhuAvatar';
import {
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Award,
  Heart,
  Briefcase,
  CheckCircle,
  Share2,
  Download,
  BookOpen,
  Droplet
} from 'lucide-react';

interface StudentProfileCardProps {
  profile: StudentProfile;
  onEdit: () => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ profile, onEdit }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.usn || 'student'}_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Action Bar (hidden on print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700">Official Student Profile Dossier</span>
          <span className="text-xs text-slate-400">| Last updated: {profile.lastUpdated || 'Today'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200 cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Print Card */}
      <div className="print-card bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-10 space-y-8">
        {/* Header Ribbon / University Banner */}
        <div className="border-b-2 border-slate-900/10 pb-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Student Photo */}
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-sm shrink-0">
              <img
                src={profile.photoUrl || '/image/profile.jpg'}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = YADHU_AVATAR_SVG;
                }}
              />
            </div>

            {/* Core Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile.fullName || 'Student Name'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {profile.usn || 'USN PENDING'}
                </span>
              </div>

              <p className="text-sm font-semibold text-indigo-600">
                {profile.department} &bull; {profile.currentSemester}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {profile.collegeName || 'National Institute of Engineering & Technology'}
              </p>

              {/* Badges for Blood Group & Gender */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                {profile.bloodGroup && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <Droplet className="w-3 h-3 text-rose-600 fill-rose-600" />
                    Blood Group: {profile.bloodGroup}
                  </span>
                )}
                {profile.gender && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    Gender: {profile.gender}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Status: Placement Eligible
                </span>
              </div>
            </div>
          </div>

          {/* CGPA Score Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 min-w-[150px] shrink-0 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Cumulative CGPA
            </span>
            <div className="text-3xl font-black text-indigo-700 font-mono my-0.5">
              {Number(profile.cgpa).toFixed(2)}
            </div>
            <span className="text-[11px] font-semibold text-slate-600">Scale of 10.0</span>
            <div className="mt-2 text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              {profile.cgpa >= 8.5 ? 'Distinction' : profile.cgpa >= 7.0 ? 'First Class' : 'Pass'}
            </div>
          </div>
        </div>

        {/* Contact & Personal Metadata Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">{profile.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{profile.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>DOB: {profile.dob || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">{profile.address || 'Campus Residence'}</span>
          </div>
        </div>

        {/* Career Objective */}
        {profile.careerObjective && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Professional Summary & Career Objective
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {profile.careerObjective}
            </p>
          </div>
        )}

        {/* TARGETED COMPANIES (Infosys, TCS, Wipro, etc.) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-600" />
              Target Recruiter Aspirations (Companies)
            </h3>
            {profile.targetPackageLPA && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Target: {profile.targetPackageLPA}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interestedCompanies.map((comp) => (
              <span
                key={comp}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* ACADEMIC PERFORMANCE & INTERNAL MARKS TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Semester Academic Performance & Internal Evaluation (50 Marks)
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3">SGPA</th>
                  <th className="py-2.5 px-3">Internal Test 1 (15)</th>
                  <th className="py-2.5 px-3">Internal Test 2 (15)</th>
                  <th className="py-2.5 px-3">Assignment (20)</th>
                  <th className="py-2.5 px-3">Total Internal (50)</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profile.academicRecords.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-800">{r.semester}</td>
                    <td className="py-2 px-3 font-mono font-bold text-indigo-700">{Number(r.sgpa).toFixed(2)}</td>
                    <td className="py-2 px-3 font-mono">{r.test1Marks} / 15</td>
                    <td className="py-2 px-3 font-mono">{r.test2Marks} / 15</td>
                    <td className="py-2 px-3 font-mono">{r.assignmentMarks} / 20</td>
                    <td className="py-2 px-3">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {r.totalInternal} / 50
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono">{r.attendancePercentage}%</td>
                    <td className="py-2 px-3">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {r.gradeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SKILLS & NSS SIDE BY SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              Verified Skills & Proficiencies ({profile.skills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* NSS & Extracurriculars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" />
              NSS & Extracurricular Activities ({profile.nssActivities.length})
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {profile.nssActivities.map((act) => (
                <li key={act} className="flex items-start gap-2 bg-rose-50/40 p-2 rounded-lg border border-rose-100">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Authorization / Sign-off */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>Verified Candidate Dossier &bull; Placement Cell & Academic Registry</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-mono text-[10px] text-slate-600">
                {profile.fullName}
              </div>
              <span className="text-[10px]">Student Signature</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-mono text-[10px] text-slate-600">
                Placement Officer
              </div>
              <span className="text-[10px]">Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
