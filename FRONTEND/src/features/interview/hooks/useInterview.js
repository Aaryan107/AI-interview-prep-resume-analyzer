import { useContext } from 'react'
import { InterviewContext } from '../interview.context.jsx'
import { GenerateInterviewReport, getInterviewReportById, getAllInterviewReportsByUser } from '../services/interview.api.js'

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) throw new Error('useInterview must be used within an InterviewProvider')

    const { loading, setLoading, report, setReport, reports, setreports } = context

    const generateReport = async (jobDescription, selfDescription, resumeFile) => {
        setLoading(true)
        try {
            const response = await GenerateInterviewReport(jobDescription, selfDescription, resumeFile)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            const message = err?.response?.data?.error || err?.response?.data?.message || err.message
            console.error('generateReport failed:', message, err)
            setReport(null)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const fetchReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            console.log(err)
            setReport(null)
        } finally {
            setLoading(false)
        }
    }

    const fetchAllReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReportsByUser()
            if (response && response.data) {
                setreports(response.data)
            } else {
                setreports([])
            }
            return response
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return { loading, report, reports, generateReport, fetchReportById, fetchAllReports }
}
