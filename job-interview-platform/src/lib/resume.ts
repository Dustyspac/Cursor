import { ResumeAnalysis } from "./ai";

interface TextItem {
	str: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextMarkedContent {
	// Add properties as needed
}

type TextContentItem = TextItem | TextMarkedContent;

export class ResumeService {
	async parsePDF(file: File): Promise<string> {
		try {
			// Use a simpler client-side PDF parsing approach
			const arrayBuffer = await file.arrayBuffer();
			const pdfjsLib = await import("pdfjs-dist");

			// Set up PDF.js worker
			pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

			// Load the PDF document
			const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
			const pdf = await loadingTask.promise;

			let fullText = "";

			// Extract text from all pages
			for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
				const page = await pdf.getPage(pageNum);
				const textContent = await page.getTextContent();
				const pageText = textContent.items
					.map((item: TextContentItem) => ("str" in item ? item.str : ""))
					.join(" ");
				fullText += pageText + "\n";
			}

			return fullText.trim();
		} catch (error) {
			console.error("Error parsing PDF:", error);
			throw new Error("Failed to parse PDF file");
		}
	}

	async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
		try {
			const { aiService } = await import("./ai");
			return await aiService.analyzeResume(resumeText);
		} catch (error) {
			console.error("Error analyzing resume:", error);
			throw new Error("Failed to analyze resume");
		}
	}

	async uploadAndAnalyze(file: File): Promise<ResumeAnalysis> {
		const resumeText = await this.parsePDF(file);
		return await this.analyzeResume(resumeText);
	}

	validateFile(file: File): { isValid: boolean; error?: string } {
		// Check file type
		if (file.type !== "application/pdf") {
			return { isValid: false, error: "Only PDF files are supported" };
		}

		// Check file size (max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return { isValid: false, error: "File size must be less than 10MB" };
		}

		return { isValid: true };
	}
}

export const resumeService = new ResumeService();
