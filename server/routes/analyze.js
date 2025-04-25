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
            }
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                    inlineDataPart
            ],
            config: {
                systemInstruction: "You are a resume reviewer. Analyze the following resume content in th   e file and suggest me improvement. Do not include any other information.",
            }
        })
        res.status(200).json({ message: response.text })
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
//                              "text": "dfgchvjk"
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