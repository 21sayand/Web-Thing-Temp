import React from 'react';
import { StudentProfile, StudentTask } from '../types/student';
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Building2,
  Award,
  BookOpen,
  Heart,
  BarChart3,
  Percent
} from 'lucide-react';

interface AnalyticsViewProps {
  profile: StudentProfile;
  tasks: StudentTask[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ profile, tasks }) => {
  // Placement readiness computation
  const cgpaScore = Math.min(10, Number(profile.cgpa) || 0);
  const skillsCount = profile.skills.length;
  const nssCount = profile.nssActivities.length;
  const avgInternals = profile.academicRecords.length > 0
    ? profile.academicRecords.reduce((acc, r) => acc + (r.totalInternal || 0), 0) / profile.academicRecords.length
    : 0;

  // Criteria score calculation (0 - 100)
  const cgpaWeight = (cgpaScore / 10) * 40; // Max 40%
  const skillsWeight = Math.min(30, (skillsCount / 8) * 30); // Max 30%
  const nssWeight = Math.min(15, (nssCount / 3) * 15); // Max 15%
  const internalWeight = Math.min(15, (avgInternals / 50) * 15); // Max 15%

  const readinessScore = Math.min(100, Math.round(cgpaWeight + skillsWeight + nssWeight + internalWeight));

  // Eligibility benchmark
  const companyCriteria = [
    { name: 'Infosys', minCgpa: 6.0, requiredSkills: ['Python', 'Java', 'SQL & Relational Databases'], package: '3.6 - 9.5 LPA' },
    { name: 'TCS (Tata Consultancy Services)', minCgpa: 6.0, requiredSkills: ['Java', 'C / C++', 'Data Structures & Algorithms'], package: '3.36 - 7.0 LPA' },
    { name: 'Wipro', minCgpa: 6.0, requiredSkills: ['Java', 'Python', 'Critical Problem Solving'], package: '3.5 - 6.5 LPA' },
    { name: 'Accenture', minCgpa: 6.5, requiredSkills: ['React.js', 'SQL & Relational Databases', 'Critical Problem Solving'], package: '4.5 - 11.0 LPA' },
    { name: 'Google / Amazon (Product)', minCgpa: 8.0, requiredSkills: ['Data Structures & Algorithms', 'C / C++', 'System Design'], package: '20 - 45 LPA' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Recruitment Readiness Index
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Placement & Academic Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Live evaluation based on your cumulative CGPA, semester internals (out of 50), verified technical skills, and NSS community leadership credits.
          </p>
        </div>

        {/* Big Circular Score */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 min-w-[200px] text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Readiness Index
          </span>
          <div className="text-5xl font-black text-indigo-700 font-mono my-1">
            {readinessScore}%
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            readinessScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {readinessScore >= 85 ? 'Placement Star Ready' : readinessScore >= 70 ? 'Highly Competitive' : 'Developing Profile'}
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* CGPA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Academic CGPA</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {Number(profile.cgpa).toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (profile.cgpa / 10) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">Weight: 40% of readiness</span>
        </div>

        {/* Skills */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Technical Skills</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {skillsCount} <span className="text-xs font-normal text-slate-400">checked</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (skillsCount / 10) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">Weight: 30% of readiness</span>
        </div>

        {/* Average Internals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Internal Marks</span>
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {avgInternals.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 50</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (avgInternals / 50) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">Weight: 15% of readiness</span>
        </div>

        {/* NSS & Extracurriculars */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">NSS Activities</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {nssCount} <span className="text-xs font-normal text-slate-400">activities</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (nssCount / 4) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">Weight: 15% of readiness</span>
        </div>
      </div>

      {/* Recruiter Eligibility Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              Company Eligibility & Cut-off Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Live automated eligibility check for key campus recruiters against student CGPA and skills.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Min CGPA Required</th>
                <th className="py-2.5 px-3">Your CGPA</th>
                <th className="py-2.5 px-3">Target Compensation</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyCriteria.map((c) => {
                const isEligible = profile.cgpa >= c.minCgpa;
                const isInterested = profile.interestedCompanies.some((ic) =>
                  ic.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
                );

                return (
                  <tr key={c.name} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {c.name}
                      {isInterested && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          Your Target
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">{c.minCgpa.toFixed(1)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">{Number(profile.cgpa).toFixed(2)}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">{c.package}</td>
                    <td className="py-3 px-3">
                      {isEligible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Needs {(c.minCgpa - profile.cgpa).toFixed(2)} more
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
