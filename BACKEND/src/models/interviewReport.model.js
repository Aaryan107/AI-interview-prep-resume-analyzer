const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, 'Question is required' ]
    },
    answer: {
        type: String,
        required: [ true, 'Answer is required' ]
    },
    intention: {
        type: String,
        required: [ true, 'Intention is required' ]
    }
},{ _id: false })

const BehavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, 'Question is required' ]
    },
    answer: {
        type: String,
        required: [ true, 'Answer is required' ]
    },
    intention: {
        type: String,
        required: [ true, 'Intention is required' ]
    }
},{ _id: false })

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, 'Skill is required' ]
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'Low', 'Medium', 'High'],
        required: [ true, 'Severity is required' ]
    }
},{_id: false})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, 'Day is required' ]
    },
    focus: {
        type: String,
        required: [ true, 'Focus is required' ]
    },
    tasks: {
        type: [ String ],
        required: [ true, 'Tasks are required' ]
    }
},{_id: false})

const interviewSchema = new mongoose.Schema({
    selfDescription: {
        type: String,
    },
    jobDescription: {
        type: String,
        required: [ true, 'Job description is required' ]
    },
    resume:{
        type: String,
    },
    matchScore:{
        type: Number, 
        
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ BehavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'User reference is required' ]
    },
    title:{
         type:String
    }
}, { timestamps: true });

module.exports = mongoose.model('InterviewReport', interviewSchema);
