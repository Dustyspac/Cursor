"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { aiService } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { InterviewFeedback } from "@/lib/ai";
import {
	MessageSquare,
	Send,
	Brain,
	Star,
	Loader2,
	Mic,
	MicOff,
} from "lucide-react";

interface InterviewSession {
	id: string;
	question: string;
	answer: string;
	feedback: InterviewFeedback;
	timestamp: Date;
}

export default function InterviewPage() {
	const { user } = useAuth();
	const [currentQuestion, setCurrentQuestion] = useState<string>("");
	const [answer, setAnswer] = useState<string>("");
	const [sessions, setSessions] = useState<InterviewSession[]>([]);
	const [loading, setLoading] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [currentFeedback, setCurrentFeedback] =
		useState<InterviewFeedback | null>(null);

	// Sample questions for demo
	const sampleQuestions = [
		"Tell me about a challenging project you worked on and how you overcame obstacles.",
		"Describe a time when you had to learn a new technology quickly.",
		"How do you handle working with difficult team members?",
		"What's your approach to debugging complex issues?",
		"Tell me about a time when you had to make a difficult technical decision.",
		"How do you stay updated with the latest industry trends?",
		"Describe a situation where you had to explain a complex technical concept to a non-technical person.",
		"What's your experience with agile development methodologies?",
		"How do you prioritize tasks when you have multiple deadlines?",
		"Tell me about a time when you failed and what you learned from it.",
	];

	const loadInterviewHistory = useCallback(async () => {
		if (!user) return;

		try {
			const { data, error } = await supabase
				.from("interview_history")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(10);

			if (error) throw error;

			const historySessions =
				data?.map((item) => ({
					id: item.id,
					question: item.question,
					answer: item.answer,
					feedback: item.feedback,
					timestamp: new Date(item.created_at),
				})) || [];

			setSessions(historySessions);
		} catch (error) {
			console.error("Error loading interview history:", error);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			loadInterviewHistory();
		}
	}, [user, loadInterviewHistory]);

	const generateQuestion = () => {
		const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
		setCurrentQuestion(sampleQuestions[randomIndex]);
		setAnswer("");
		setShowFeedback(false);
		setCurrentFeedback(null);
	};

	const handleSubmitAnswer = async () => {
		if (!answer.trim() || !currentQuestion || !user) return;

		try {
			setLoading(true);

			// Generate feedback using AI
			const feedback = await aiService.generateInterviewFeedback(
				currentQuestion,
				answer,
				"Software Developer" // Default job title
			);
			setCurrentFeedback(feedback);
			setShowFeedback(true);

			// Save to database
			await supabase.from("interview_history").insert({
				user_id: user.id,
				question: currentQuestion,
				answer: answer,
				feedback: feedback,
			});

			// Add to sessions
			const newSession: InterviewSession = {
				id: Date.now().toString(),
				question: currentQuestion,
				answer: answer,
				feedback: feedback,
				timestamp: new Date(),
			};
			setSessions((prev) => [newSession, ...prev]);
		} catch (error) {
			console.error("Error generating feedback:", error);
		} finally {
			setLoading(false);
		}
	};

	const startRecording = () => {
		if ("webkitSpeechRecognition" in window) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const recognition = new (window as any).webkitSpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = "en-US";

			recognition.onstart = () => {
				setIsRecording(true);
			};

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			recognition.onresult = (event: any) => {
				const transcript = event.results[0][0].transcript;
				setAnswer((prev) => prev + " " + transcript);
			};

			recognition.onend = () => {
				setIsRecording(false);
			};

			recognition.start();
		} else {
			alert("Speech recognition is not supported in this browser.");
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 8) return "text-green-600";
		if (score >= 6) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					AI Interview Practice
				</h1>
				<p className="text-lg text-gray-600">
					Practice interviews with AI-generated questions and get instant
					feedback
				</p>
			</div>

			{/* Interview Interface */}
			<div className="grid lg:grid-cols-2 gap-8">
				{/* Question and Answer Section */}
				<div className="space-y-6">
					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
							<MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
							Current Question
						</h3>

						{currentQuestion ? (
							<p className="text-gray-700 mb-4">{currentQuestion}</p>
						) : (
							<p className="text-gray-500 mb-4">
								Click &quot;Generate Question&quot; to start
							</p>
						)}

						<button
							onClick={generateQuestion}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Brain className="mr-2 h-4 w-4" />
							Generate Question
						</button>
					</div>

					<div className="bg-white rounded-lg border shadow-sm p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Your Answer
						</h3>
						<textarea
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder="Type your answer here..."
							className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						/>

						<div className="flex items-center space-x-4 mt-4">
							<button
								onClick={startRecording}
								disabled={isRecording}
								className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								{isRecording ? (
									<>
										<MicOff className="mr-2 h-4 w-4" />
										Stop Recording
									</>
								) : (
									<>
										<Mic className="mr-2 h-4 w-4" />
										Voice Input
									</>
								)}
							</button>

							<button
								onClick={handleSubmitAnswer}
								disabled={!answer.trim() || !currentQuestion || loading}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Analyzing...
									</>
								) : (
									<>
										<Send className="mr-2 h-4 w-4" />
										Submit Answer
									</>
								)}
							</button>
						</div>
					</div>

					{/* Feedback Section */}
					{showFeedback && currentFeedback && (
						<div className="bg-white rounded-lg border shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								AI Feedback
							</h3>

							<div className="mb-4">
								<div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
									<div
										className={`text-3xl font-bold ${getScoreColor(
											currentFeedback.score / 10
										)}`}
									>
										{currentFeedback.score}/100
									</div>
									<div className="text-sm text-gray-600">Overall Score</div>
								</div>

								<div className="mb-4">
									<h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
									<p className="text-gray-700">{currentFeedback.feedback}</p>
								</div>
							</div>

							<div className="mb-4">
								<h4 className="font-medium text-gray-900 mb-2">
									Suggestions for Improvement:
								</h4>
								<ul className="space-y-1">
									{currentFeedback.suggestions.map((suggestion, index) => (
										<li
											key={index}
											className="text-sm text-gray-700 flex items-start"
										>
											<span className="text-blue-600 mr-2">•</span>
											{suggestion}
										</li>
									))}
								</ul>
							</div>
						</div>
					)}
				</div>

				{/* Interview History */}
				<div className="bg-white rounded-lg border shadow-sm p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Recent Practice Sessions
					</h3>

					{sessions.length === 0 ? (
						<p className="text-gray-500 text-center py-8">
							No practice sessions yet. Start your first interview!
						</p>
					) : (
						<div className="space-y-4 max-h-96 overflow-y-auto">
							{sessions.map((session) => (
								<div key={session.id} className="border rounded-lg p-4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm text-gray-500">
											{session.timestamp.toLocaleDateString()}
										</span>
										<div className="flex items-center space-x-1">
											<Star className="h-4 w-4 text-yellow-500" />
											<span className="text-sm font-medium">
												{Math.round(session.feedback.score / 10)}/10
											</span>
										</div>
									</div>
									<p className="text-sm font-medium text-gray-900 mb-1">
										Q: {session.question}
									</p>
									<p className="text-sm text-gray-600 mb-2">
										A:{" "}
										{session.answer.length > 100
											? `${session.answer.substring(0, 100)}...`
											: session.answer}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
