const interviewReportModel = require('../models/interviewReport.model');
const aiServices = require('../services/ai.services');
const { PDFParse } = require('pdf-parse');
async function generateInterviewReport(req, res) {
    try {
        const resumeFile = req.file;

        let resumeText = '';
        if (req.file && req.file.buffer) {
            const parser = new PDFParse({ data: req.file.buffer });
            const result = await parser.getText();
            resumeText = result.text;
            await parser.destroy();
        }
        
        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAI = await aiServices.generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        /*console.log("AI Response:", JSON.stringify(interviewReportByAI, null, 2));*/

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            selfDescription,
            jobDescription,
            resume: resumeText,
            technicalQuestions: interviewReportByAI.technicalQuestions,
            behavioralQuestions: interviewReportByAI.behavioralQuestions,
            skillGaps: interviewReportByAI.skillGaps,
            preparationPlan: interviewReportByAI.preparationPlan,
            matchScore: interviewReportByAI.matchScore,
        });

        await interviewReport.save();

        res.status(201).json({
            message: 'Interview report generated successfully',
            interviewReport: interviewReport
        });
    } catch (error) {
        console.error("Error in generateInterviewReport:", error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getInterviewReport(req, res) {

    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: 'Interview report not found',

        })
    }

    res.status(200).json({
        message: 'interview report found successfully',
        data: interviewReport
    })

}

async function getAllInterviewReportsByAUser(req, res) {

    try {
        const interviewreports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        if (!interviewreports || interviewreports.length === 0) {
            return res.status(404).json({
                message: 'no interview reports found',
            })
        }

        return res.status(200).json({
            message: 'all interview reports found successfully',
            data: interviewreports
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

}

async function generateResumePdf(req,res){
    try {
        const {interviewId}=req.params

        const report = await interviewReportModel.findById(interviewId);

        if(!report){
            return res.status(404).json({
                message: 'Interview report not found',
            })
        }
        const {resume,selfDescription,jobDescription} = report
        const pdf = await aiServices.generateResumePdf({resume,selfDescription,jobDescription})

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
        })

        res.send(pdf)
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
} 

module.exports = { generateInterviewReport, getInterviewReport, getAllInterviewReportsByAUser ,generateResumePdf };
