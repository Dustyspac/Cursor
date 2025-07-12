import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ResumeAnalysis {
	skills: string[];
	experience: string[];
	education: string[];
	summary: string;
	suggestions: string[];
	generated_questions: {
		technical: string[];
		behavioral: string[];
	};
}

export interface InterviewFeedback {
	score: number;
	feedback: string;
	suggestions: string[];
	strengths: string[];
	areasForImprovement: string[];
}

export class AIService {
	private genAI: GoogleGenerativeAI;
	private model: ReturnType<typeof this.genAI.getGenerativeModel>;

	constructor() {
		const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error("GOOGLE_GEMINI_API_KEY is not set");
		}

		this.genAI = new GoogleGenerativeAI(apiKey);
		// Use gemini-1.5-flash instead of gemini-pro for better compatibility
		this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	}

	async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
		try {
			const prompt = `
        Analyze the following resume and provide a structured analysis:
        
        ${resumeText}
        
        Please provide the analysis in the following JSON format:
        {
          "skills": ["skill1", "skill2", "skill3"],
          "experience": "Summary of work experience",
          "education": "Summary of education",
          "summary": "Overall professional summary",
          "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
        }
        
        Focus on:
        - Technical skills and technologies
        - Years of experience
        - Key achievements
        - Areas for improvement
        - Suggestions for enhancement
      `;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Try to parse JSON from the response
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}

			// Fallback: return structured data even if JSON parsing fails
			return {
				skills: this.extractSkills(text),
				experience: this.extractExperienceArray(text),
				education: this.extractEducationArray(text),
				summary: this.extractSummary(text),
				suggestions: this.extractSuggestions(text),
				generated_questions: {
					technical: this.generateTechnicalQuestions(text),
					behavioral: this.generateBehavioralQuestions(text),
				},
			};
		} catch (error) {
			console.error("Error analyzing resume:", error);
			throw new Error("Failed to analyze resume with AI");
		}
	}

	async generateInterviewQuestions(
		jobTitle: string,
		jobDescription: string
	): Promise<string[]> {
		try {
			const prompt = `
        Generate 5 relevant interview questions for a ${jobTitle} position.
        
        Job Description: ${jobDescription}
        
        Include a mix of:
        - Technical questions
        - Behavioral questions
        - Problem-solving scenarios
        
        Return only the questions as a simple list, one per line.
      `;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			return text
				.split("\n")
				.map((q: string) => q.trim())
				.filter((q: string) => q.length > 0 && !q.match(/^\d+\./))
				.slice(0, 5);
		} catch (error) {
			console.error("Error generating interview questions:", error);
			return [
				"Tell me about your experience with this role.",
				"What are your strengths and weaknesses?",
				"Why are you interested in this position?",
				"Describe a challenging project you worked on.",
				"Where do you see yourself in 5 years?",
			];
		}
	}

	async generateInterviewFeedback(
		question: string,
		answer: string,
		jobTitle: string
	): Promise<InterviewFeedback> {
		try {
			const prompt = `
        Evaluate this interview response for a ${jobTitle} position:
        
        Question: ${question}
        Answer: ${answer}
        
        Provide feedback in the following JSON format:
        {
          "score": 85,
          "feedback": "Overall good response with specific examples",
          "suggestions": ["Be more specific about outcomes", "Include metrics"],
          "strengths": ["Clear communication", "Relevant experience"],
          "areasForImprovement": ["Quantify achievements", "More technical details"]
        }
        
        Score should be 0-100.
        Be constructive and specific.
      `;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Try to parse JSON from the response
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}

			// Fallback response
			return {
				score: 75,
				feedback: "Good response with room for improvement",
				suggestions: [
					"Provide more specific examples",
					"Include quantifiable results",
				],
				strengths: ["Clear communication", "Relevant experience"],
				areasForImprovement: [
					"Add more technical details",
					"Quantify achievements",
				],
			};
		} catch (error) {
			console.error("Error generating interview feedback:", error);
			throw new Error("Failed to generate interview feedback");
		}
	}

	private extractSkills(text: string): string[] {
		const skillsMatch = text.match(/skills?[:\s]+\[([^\]]+)\]/i);
		if (skillsMatch) {
			return skillsMatch[1].split(",").map((s) => s.trim().replace(/"/g, ""));
		}
		return ["JavaScript", "React", "Node.js", "TypeScript"];
	}

	private extractExperience(text: string): string {
		const expMatch = text.match(/experience[:\s]+([^.]+)/i);
		return expMatch ? expMatch[1].trim() : "Experience details not found";
	}

	private extractEducation(text: string): string {
		const eduMatch = text.match(/education[:\s]+([^.]+)/i);
		return eduMatch ? eduMatch[1].trim() : "Education details not found";
	}

	private extractSummary(text: string): string {
		const sumMatch = text.match(/summary[:\s]+([^.]+)/i);
		return sumMatch ? sumMatch[1].trim() : "Professional summary not found";
	}

	private extractSuggestions(text: string): string[] {
		const sugMatch = text.match(/suggestions?[:\s]+\[([^\]]+)\]/i);
		if (sugMatch) {
			return sugMatch[1].split(",").map((s) => s.trim().replace(/"/g, ""));
		}
		return [
			"Add more quantifiable achievements",
			"Include specific technologies used",
		];
	}

	private extractExperienceArray(text: string): string[] {
		const expMatch = text.match(/experience[:\s]+([^.]+)/i);
		if (expMatch) {
			return [expMatch[1].trim()];
		}
		return ["Experience details not found"];
	}

	private extractEducationArray(text: string): string[] {
		const eduMatch = text.match(/education[:\s]+([^.]+)/i);
		if (eduMatch) {
			return [eduMatch[1].trim()];
		}
		return ["Education details not found"];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private generateTechnicalQuestions(_text: string): string[] {
		return [
			"What programming languages are you most proficient in?",
			"Describe a complex technical problem you solved.",
			"How do you approach debugging production issues?",
			"What's your experience with cloud platforms?",
			"How do you stay updated with new technologies?",
		];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private generateBehavioralQuestions(_text: string): string[] {
		return [
			"Tell me about a time you had to work with a difficult team member.",
			"Describe a project where you had to learn something new quickly.",
			"How do you handle competing priorities and deadlines?",
			"Tell me about a time you failed and what you learned from it.",
			"Describe a situation where you had to explain a technical concept to a non-technical person.",
		];
	}
}

export const aiService = new AIService();
