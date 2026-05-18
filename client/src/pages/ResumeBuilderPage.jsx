import React, { useState, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ResumeBuilderPage = () => {
    const [experienceLevel, setExperienceLevel] = useState('Fresher');

    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        summary: ''
    });
    
    const [experience, setExperience] = useState([{
        company: '',
        role: '',
        duration: '',
        description: ''
    }]);

    const [education, setEducation] = useState([{
        institution: '',
        degree: '',
        year: ''
    }]);

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handleExperienceChange = (index, e) => {
        const newExp = [...experience];
        newExp[index][e.target.name] = e.target.value;
        setExperience(newExp);
    };

    const handleEducationChange = (index, e) => {
        const newEdu = [...education];
        newEdu[index][e.target.name] = e.target.value;
        setEducation(newEdu);
    };

    const addExperience = () => setExperience([...experience, { company: '', role: '', duration: '', description: '' }]);
    const addEducation = () => setEducation([...education, { institution: '', degree: '', year: '' }]);

    return (
        <div className="bg-jobify text-white min-h-screen flex flex-col font-display relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>
            
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24 relative z-10 flex flex-col lg:flex-row gap-12">
                
                {/* Editor Section */}
                <div className="w-full lg:w-1/2 flex flex-col gap-8">
                    <div className="mb-4">
                        <h1 className="text-3xl font-black mb-2">Resume Builder</h1>
                        <p className="text-gray-400">Fill in your details and watch your resume build in real-time.</p>
                    </div>

                    {/* Experience Level Selector */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Experience Level</h2>
                            <p className="text-sm text-gray-400">This helps us format your resume optimally.</p>
                        </div>
                        <div className="flex bg-[#1a1a1c] p-1 rounded-xl border border-white/10">
                            <button 
                                onClick={() => setExperienceLevel('Fresher')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${experienceLevel === 'Fresher' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Fresher
                            </button>
                            <button 
                                onClick={() => setExperienceLevel('Experienced')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${experienceLevel === 'Experienced' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Experienced
                            </button>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                                <input type="text" name="fullName" placeholder="John Doe" value={personalInfo.fullName} onChange={handlePersonalInfoChange} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full transition-all" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                                <input type="email" name="email" placeholder="john@example.com" value={personalInfo.email} onChange={handlePersonalInfoChange} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full transition-all" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">LinkedIn Profile</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">linkedin.com/in/</span>
                                    <input type="text" name="linkedin" placeholder="username" value={personalInfo.linkedin.replace('https://www.linkedin.com/in/', '')} onChange={(e) => setPersonalInfo({...personalInfo, linkedin: `https://www.linkedin.com/in/${e.target.value}`})} className="bg-[#1a1a1c] border border-white/10 rounded-xl pl-[110px] pr-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full transition-all" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">GitHub Profile</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">github.com/</span>
                                    <input type="text" name="github" placeholder="username" value={personalInfo.github.replace('https://github.com/', '')} onChange={(e) => setPersonalInfo({...personalInfo, github: `https://github.com/${e.target.value}`})} className="bg-[#1a1a1c] border border-white/10 rounded-xl pl-[90px] pr-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full transition-all" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Professional Summary</label>
                                <textarea name="summary" placeholder="Briefly describe your career goals and key strengths..." rows="4" value={personalInfo.summary} onChange={handlePersonalInfoChange} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full resize-none transition-all"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">
                                    {experienceLevel === 'Fresher' ? 'rocket_launch' : 'work'}
                                </span>
                                {experienceLevel === 'Fresher' ? 'Projects & Internships' : 'Work Experience'}
                            </h2>
                            <button onClick={addExperience} className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Add More
                            </button>
                        </div>
                        {experience.map((exp, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 pb-8 border-b border-white/5 last:border-0 last:pb-0 last:mb-0 relative z-10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{experienceLevel === 'Fresher' ? 'Project Name' : 'Company Name'}</label>
                                    <input type="text" name="company" placeholder={experienceLevel === 'Fresher' ? 'e.g. Portfolio Website' : 'e.g. Google'} value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Role / Title</label>
                                    <input type="text" name="role" placeholder={experienceLevel === 'Fresher' ? 'e.g. Full Stack Developer' : 'e.g. Senior Frontend Developer'} value={exp.role} onChange={(e) => handleExperienceChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full" />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Duration</label>
                                    <input type="text" name="duration" placeholder="e.g. June 2023 - Present" value={exp.duration} onChange={(e) => handleExperienceChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full" />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Key Responsibilities / Impact</label>
                                    <textarea name="description" placeholder="Describe what you achieved..." rows="3" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full resize-none"></textarea>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Education */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-primary">Education</h2>
                            <button onClick={addEducation} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">+ Add</button>
                        </div>
                        {education.map((edu, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/5 last:border-0 last:pb-0 last:mb-0">
                                <input type="text" name="institution" placeholder="Institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full col-span-1 md:col-span-3" />
                                <input type="text" name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full col-span-1 md:col-span-2" />
                                <input type="text" name="year" placeholder="Year" value={edu.year} onChange={(e) => handleEducationChange(index, e)} className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full" />
                            </div>
                        ))}
                    </div>
                    
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(140,43,238,0.3)] transition-all flex justify-center items-center gap-2">
                        <span className="material-symbols-outlined">download</span> Download PDF
                    </button>
                </div>

                {/* Preview Section */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="sticky top-32 w-full aspect-[1/1.414] bg-white rounded-lg shadow-2xl overflow-hidden p-8 text-black font-sans box-border" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                        
                        <div className="border-b-2 border-gray-800 pb-4 mb-6">
                            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personalInfo.fullName || 'YOUR NAME'}</h1>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                {personalInfo.email && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span>{personalInfo.email}</span>}
                                {personalInfo.phone && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">phone</span>{personalInfo.phone}</span>}
                                {personalInfo.linkedin && (
                                    <span className="flex items-center gap-1 uppercase font-bold text-[10px] tracking-tighter">
                                        <span className="bg-blue-600 text-white px-1 rounded-sm">in</span>
                                        <a href={personalInfo.linkedin} className="text-blue-600 truncate max-w-[150px]">{personalInfo.linkedin.replace('https://www.linkedin.com/in/', '')}</a>
                                    </span>
                                )}
                                {personalInfo.github && (
                                    <span className="flex items-center gap-1 uppercase font-bold text-[10px] tracking-tighter">
                                        <span className="bg-gray-800 text-white px-1 rounded-sm">gh</span>
                                        <a href={personalInfo.github} className="text-gray-800 truncate max-w-[150px]">{personalInfo.github.replace('https://github.com/', '')}</a>
                                    </span>
                                )}
                            </div>
                        </div>

                        {personalInfo.summary && (
                            <div className="mb-6">
                                <p className="text-sm leading-relaxed text-gray-800">{personalInfo.summary}</p>
                            </div>
                        )}

                        {experienceLevel === 'Experienced' && experience.length > 0 && experience[0].company !== '' && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Experience</h2>
                                <div className="flex flex-col gap-4">
                                    {experience.map((exp, i) => exp.company && (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                                <span className="text-xs font-semibold text-gray-500">{exp.duration}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-primary mb-2">{exp.company}</div>
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {education.length > 0 && education[0].institution !== '' && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Education</h2>
                                <div className="flex flex-col gap-4">
                                    {education.map((edu, i) => edu.institution && (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                                <span className="text-xs font-semibold text-gray-500">{edu.year}</span>
                                            </div>
                                            <div className="text-sm text-gray-700">{edu.degree}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {experienceLevel === 'Fresher' && experience.length > 0 && experience[0].company !== '' && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Projects & Internships</h2>
                                <div className="flex flex-col gap-4">
                                    {experience.map((exp, i) => exp.company && (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                                <span className="text-xs font-semibold text-gray-500">{exp.duration}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-primary mb-2">{exp.company}</div>
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ResumeBuilderPage;
