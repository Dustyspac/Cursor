"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { resumeService } from "@/lib/resume";
import { ResumeAnalysis } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import {
	Upload,
	FileText,
	Brain,
	CheckCircle,
	AlertCircle,
	Loader2,
} from "lucide-react";

export default function ResumePage() {
	const { user } = useAuth();
	const [file, setFile] = useState<File | null>(null);
	const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dragActive, setDragActive] = useState(false);

	const handleFileSelect = (selectedFile: File) => {
		const validation = resumeService.validateFile(selectedFile);
		if (!validation.isValid) {
			setError(validation.error || "Invalid file");
			return;
		}

		setFile(selectedFile);
		setError(null);
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	};

	const handleAnalyze = async () => {
		if (!file || !user) return;

		try {
			setLoading(true);
			setError(null);

			const analysisResult = await resumeService.uploadAndAnalyze(file);
			setAnalysis(analysisResult);

			// Save to database
			await supabase.from("resume_analysis").insert({
				user_id: user.id,
				resume_text: await resumeService.parsePDF(file),
				analysis: analysisResult,
			});
		} catch (error) {
			console.error("Error analyzing resume:", error);
			setError("Failed to analyze resume. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					AI Resume Analysis
				</h1>
				<p className="text-lg text-gray-600">
					Upload your resume and get instant analysis with skill extraction and
					personalized interview questions
				</p>
			</div>

			{/* Upload Section */}
			<div className="bg-white rounded-lg border shadow-sm p-8">
				<div
					className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
						dragActive
							? "border-blue-500 bg-blue-50"
							: "border-gray-300 hover:border-gray-400"
					}`}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
				>
					<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Upload your resume
					</h3>
					<p className="text-gray-600 mb-4">
						Drag and drop your PDF resume here, or click to browse
					</p>
					<input
						type="file"
						accept=".pdf"
						onChange={(e) =>
							e.target.files?.[0] && handleFileSelect(e.target.files[0])
						}
						className="hidden"
						id="file-upload"
					/>
					<label
						htmlFor="file-upload"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
					>
						Choose File
					</label>
				</div>

				{file && (
					<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
						<div className="flex items-center space-x-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							<span className="text-green-800 font-medium">{file.name}</span>
						</div>
						<p className="text-green-700 text-sm mt-1">
							File size: {(file.size / 1024 / 1024).toFixed(2)} MB
						</p>
					</div>
				)}

				{error && (
					<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-center space-x-2">
							<AlertCircle className="h-5 w-5 text-red-600" />
							<span className="text-red-800">{error}</span>
						</div>
					</div>
				)}

				{file && !analysis && (
					<div className="mt-6 text-center">
						<button
							onClick={handleAnalyze}
							disabled={loading || !user}
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Analyzing...
								</>
							) : (
								<>
									<Brain className="mr-2 h-5 w-5" />
									Analyze Resume
								</>
							)}
						</button>
						{!user && (
							<p className="text-sm text-gray-600 mt-2">
								Please sign in to analyze your resume
							</p>
						)}
					</div>
				)}
			</div>

			{/* Analysis Results */}
			{analysis && (
				<div className="space-y-6">
					{/* Summary */}
					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
							<FileText className="mr-2 h-5 w-5 text-blue-600" />
							Professional Summary
						</h3>
						<p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
					</div>

					{/* Skills */}
					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							Key Skills
						</h3>
						<div className="flex flex-wrap gap-2">
							{analysis.skills.map((skill, index) => (
								<span
									key={index}
									className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
								>
									{skill}
								</span>
							))}
						</div>
					</div>

					{/* Experience */}
					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							Experience Highlights
						</h3>
						<ul className="space-y-2">
							{analysis.experience.map((exp, index) => (
								<li key={index} className="text-gray-700 flex items-start">
									<span className="text-blue-600 mr-2">•</span>
									{exp}
								</li>
							))}
						</ul>
					</div>

					{/* Education */}
					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">
							Education
						</h3>
						<ul className="space-y-2">
							{analysis.education.map((edu, index) => (
								<li key={index} className="text-gray-700 flex items-start">
									<span className="text-blue-600 mr-2">•</span>
									{edu}
								</li>
							))}
						</ul>
					</div>

					{/* Generated Questions */}
					<div className="grid md:grid-cols-2 gap-6">
						{/* Technical Questions */}
						<div className="bg-white rounded-lg border shadow-sm p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								Technical Interview Questions
							</h3>
							<ul className="space-y-3">
								{analysis.generated_questions.technical.map(
									(question, index) => (
										<li key={index} className="text-gray-700 text-sm">
											<span className="font-medium text-blue-600">
												{index + 1}.
											</span>{" "}
											{question}
										</li>
									)
								)}
							</ul>
						</div>

						{/* Behavioral Questions */}
						<div className="bg-white rounded-lg border shadow-sm p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								Behavioral Interview Questions
							</h3>
							<ul className="space-y-3">
								{analysis.generated_questions.behavioral.map(
									(question, index) => (
										<li key={index} className="text-gray-700 text-sm">
											<span className="font-medium text-blue-600">
												{index + 1}.
											</span>{" "}
											{question}
										</li>
									)
								)}
							</ul>
						</div>
					</div>

					{/* CTA */}
					<div className="text-center">
						<a
							href="/interview"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
						>
							<Brain className="mr-2 h-5 w-5" />
							Practice Interview Questions
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
