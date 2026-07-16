import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router'
import { getInterviewReportById, getResumePdfApi } from '../services/interview.api'
import { InterviewContext } from '../interview.context'
import './interview.form.scss' 

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical', icon: '💻' },
    { id: 'behavioral', label: 'Behavioral', icon: '🤝' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' }
]

export const Interview = () => {
    const { interviewId } = useParams()
    const { report, setReport } = useContext(InterviewContext)
    const [activeSection, setActiveSection] = useState('technical')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [downloading, setDownloading] = useState(false)

    const getResumePdf = async (id) => {
        try {
            setDownloading(true)
            const blob = await getResumePdfApi(id)
            
            // Create a temporary link element to trigger the download
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `resume_${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Failed to download PDF:", err)
            alert("Failed to download the resume PDF.")
        } finally {
            setDownloading(false)
        }
    }

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true)
                const res = await getInterviewReportById(interviewId)
                if (res && res.data) {
                    setReport(res.data)
                }
            } catch (err) {
                console.error(err)
                setError('Failed to load interview report.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchReport()
    }, [interviewId, setReport])

    if (loading) {
        return <div className='interview-page'><div className='interview-layout'><div style={{padding: '2rem'}}>Loading...</div></div></div>
    }

    if (error || !report) {
        return <div className='interview-page'><div className='interview-layout'><div style={{padding: '2rem', color: '#ff4d4d'}}>{error || "Report not found"}</div></div></div>
    }

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeSection === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                        <button
                        onClick={() => { getResumePdf(interviewId) }}
                        disabled={downloading}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        {downloading ? "Downloading..." : "Download Resume"}
                        </button>
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    <section>
                        <div className='content-header'>
                            <h2>
                                {activeSection === 'technical' ? 'Technical Questions' : 
                                 activeSection === 'behavioral' ? 'Behavioral Questions' : 'Preparation Roadmap'}
                            </h2>
                        </div>
                        
                        {(activeSection === 'technical' || activeSection === 'behavioral') && (
                            <div className='q-list'>
                                {(activeSection === 'technical' ? report.technicalQuestions : report.behavioralQuestions)?.map((q, i) => (
                                    <div key={i} className='q-card'>
                                        <div className='q-card__header'>
                                            <span className='q-card__index'>Q{i + 1}</span>
                                            <p className='q-card__question'>{q.question}</p>
                                        </div>
                                        <div className='q-card__body'>
                                            <div className='q-card__section'>
                                                <span className='q-card__tag q-card__tag--intention'>Intention</span>
                                                <p>{q.intention}</p>
                                            </div>
                                            <div className='q-card__section'>
                                                <span className='q-card__tag q-card__tag--answer'>Answer Guide</span>
                                                <p>{q.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === 'roadmap' && (
                            <div className='roadmap-list'>
                                {report.preparationPlan?.map((plan, i) => (
                                    <div key={i} className='roadmap-day'>
                                        <div className='roadmap-day__header'>
                                            <span className='roadmap-day__badge'>Day {plan.day}</span>
                                            <p className='roadmap-day__focus'>{plan.focus}</p>
                                        </div>
                                        <ul className='roadmap-day__tasks'>
                                            {plan.tasks?.map((t, j) => (
                                                <li key={j}>
                                                    <span className='roadmap-day__bullet'></span>
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                            <span className='match-score__value'>{report.matchScore || '-'}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps?.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity?.toLowerCase() || 'medium'}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}
