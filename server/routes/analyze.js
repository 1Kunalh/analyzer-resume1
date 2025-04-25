const express = require('express')
const router = express.Router()
const { GoogleGenAI, createUserContent } = require('@google/genai')
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
            },
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                createUserContent([
                    inlineDataPart
                ])
            ],
            config: {
                systemInstruction: "You are a resume reviewer. Analyze the following resume content and suggest improvements in bullet points. Give suggestions in a list format. Do not include any other information.",
            }
        })
        res.status(200).json({ message: response })
    } catch (e) {
        res.status(500).json({ message: "Try again later! Error in server", error: e.message })
    }
})

module.exports = router

// {
//     "message": {
//         "candidates": [
//             {
//                 "content": {
//                     "parts": [
//                              "text": "Okay, here are some suggestions to improve the bullet points in your resume, focusing on making them more impactful and specific:\n\n**Internship**\n\n*   **Ajanta Industries (Jan 24-Feb 24)**\n    *   Instead of \"Gained hands-on experience in manufacturing, motor design, winding, and testing\", try:\n        *   \"Participated in the manufacturing process, gaining hands-on experience in motor design, winding, and performance testing.\"\n    *   Instead of \"Assisted inproduction line analysis and quality assurance\", try:\n        *   \"Supported production line analysis and quality assurance processes, contributing to improved product reliability.\"\n\n*   **SS Systems (July 24-August 24)**\n    *   Instead of \"Worked on circuit design, troubleshooting, and efficiency optimization\", try:\n        *   \"Contributed to circuit design, troubleshooting, and efficiency optimization efforts, resulting in improved system performance.\"\n    *   Instead of \"Gained insights into power electronics and system functionality.\", try:\n        *   \"Developed understanding of power electronics and system functionality through hands-on project involvement.\"\n\n**Projects**\n\n*   **Smart Street Light System**\n    *   Instead of \"Designed an energy-efficient street lighting system using LDR and motion sensors to automatically control lights based on ambient light and vehicle movement.\", try:\n        *   \"Developed an energy-efficient street lighting system leveraging LDR and motion sensors for automated light control based on ambient light and vehicle presence, resulting in [quantifiable result, if available, e.g. 'a 20% reduction in energy consumption'].\"\n\n*   **Home Energy Monitoring System**\n    *   Instead of \"Developed a system using current sensors and Arduino to monitor household energy consumption in real-time, helping users track and reduce power usage.\", try:\n        *   \"Designed and implemented a home energy monitoring system using current sensors and Arduino to provide real-time consumption data, enabling users to track and reduce energy usage.\"\n\n**Achievements**\n\n*   **Secured 2nd place in CALIBRE X -SNS COLORS (National Design Thinking Contest & Festival)**\n    *   Consider adding context: \"Secured 2nd place in CALIBRE X -SNS COLORS (National Design Thinking Contest & Festival) for innovative design [mention the project or key aspect].\"\n*   **Secured 3rd place in Paper presentation - Karpagam Academy of higher education (ELECTTRICCO 2k24)**\n    *   Consider adding context: \"Secured 3rd place in Paper presentation at Karpagam Academy of higher education (ELECTTRICCO 2k24) for research on [topic of presentation].\"\n\n**General advice:**\n\n*   **Quantify when possible:**  Whenever you can, add numbers to your accomplishments (e.g., \"Improved efficiency by X%,\" \"Reduced costs by Y amount,\" etc.).  This provides concrete evidence of your impact.\n*   **Action verbs:**  Start each bullet point with a strong action verb (e.g., Developed, Implemented, Analyzed, Designed, Managed, Optimized, etc.).\n*   **STAR method:**  Consider using the STAR method (Situation, Task, Action, Result) to structure your bullet points and provide more context. Describe the situation, the task you were assigned, the action you took, and the result of your action.\n*   **Tailor to the job:**  Adjust the bullet points to emphasize the skills and experience most relevant to the jobs you're applying for.\n\nBy implementing these suggestions, you can make your resume more compelling and showcase your accomplishments effectively. Good luck!\n"
//                         }
//                     ],
//                     "role": "model"
//                 },
//                 "finishReason": "STOP",
//                 "avgLogprobs": -0.2119762944240196
//             }
//         ],
//             "modelVersion": "gemini-2.0-flash",
//                 "usageMetadata": {
//             "promptTokenCount": 1309,
//                 "candidatesTokenCount": 765,
//                     "totalTokenCount": 2074,
//                         "promptTokensDetails": [
//                             {
//                                 "modality": "DOCUMENT",
//                                 "tokenCount": 1290
//                             },
//                             {
//                                 "modality": "TEXT",
//                                 "tokenCount": 19
//                             }
//                         ],
//                             "candidatesTokensDetails": [
//                                 {
//                                     "modality": "TEXT",
//                                     "tokenCount": 765
//                                 }
//                             ]
//         }
//     }
// }