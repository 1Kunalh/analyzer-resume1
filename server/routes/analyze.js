const express = require('express')
const router = express.Router()
const { GoogleGenAI } = require('@google/genai')
require('dotenv').config()

router.post('/analyze', async (req, res) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })

    try {
        if (!req.files || !req.files.resume)
            return res.status(400).json({ error: "No file uploaded" })

        const resumeFile = req.files.resume
        const base64PDF = resumeFile.data.toString('base64')
        const inlineDataPart = {
            inlineData: {
                data: base64PDF,
                mimeType: resumeFile.mimetype,
            }
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                inlineDataPart
            ],
            config: {
                systemInstruction:
                    `You are an AI Resume Optimization Expert trained on top ATS systems like Greenhouse, Lever, and Workday. Analyze the following resume and suggest detailed improvements to increase its ATS score.

Your analysis should include:

### 1. ATS score (out of 100):

### 2. Resume Summary:
- Candidate profile: experience level, domain
- Notable strengths

### 3. ATS Score Factors (with suggestions):
- ✅ **Keyword Optimization**: Are relevant job keywords present? Suggest missing ones.
- ✅ **Section Completeness**: Does the resume include all critical sections (Summary, Skills, Experience, Education, Projects)?
- ✅ **Formatting for ATS**: Check for issues like tables, columns, images, or fonts that ATS might not parse correctly.
- ✅ **Action Verbs & Metrics**: Does the experience use strong action verbs and quantified results?
- ✅ **Consistency**: Check tense, date formatting, bullet formatting, etc.
- ✅ **Customizability**: How easy is it to tailor this resume to a specific job?

### 4. ATS Optimization Suggestions:
- List 5–10 specific, actionable tips to improve the resume’s ATS score.
- Mention tools/techniques (e.g., add a skills section, replace passive verbs, remove tables).

### 5. Optional: ATS-Friendly Rewrite Snippet
- Rewrite a sample section (like Experience or Summary) in an ATS-optimized format.

### 6. Final ATS Readiness Score (out of 100)

Output in markdown format with clear section headers and bullet points.`
            }
        })
        res.status(200).json({ message: response.text })
    } catch (e) {
        res.status(500)
    }
})

module.exports = router