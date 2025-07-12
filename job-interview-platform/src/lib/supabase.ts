import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client
export const createServerClient = () => {
	return createClient(supabaseUrl, supabaseAnonKey);
};

// Type definitions
export interface JobData {
	id: string;
	title: string;
	company: string;
	location: string;
	tags: string[];
	apply_url: string;
	description: string;
	salary?: string;
	posted_date: string;
}

export interface ResumeAnalysis {
	skills: string[];
	experience: string[];
	education: string[];
	summary: string;
	generated_questions: {
		technical: string[];
		behavioral: string[];
	};
}

export interface InterviewFeedback {
	clarity: number;
	accuracy: number;
	tone: number;
	suggestions: string[];
	overall_score: number;
}

// Database types
export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					email: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					email: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			pinned_jobs: {
				Row: {
					id: string;
					user_id: string;
					job_id: string;
					job_data: JobData;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					job_id: string;
					job_data: JobData;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					job_id?: string;
					job_data?: JobData;
					created_at?: string;
				};
			};
			resume_analysis: {
				Row: {
					id: string;
					user_id: string;
					resume_text: string;
					analysis: ResumeAnalysis;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					resume_text: string;
					analysis: ResumeAnalysis;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					resume_text?: string;
					analysis?: ResumeAnalysis;
					created_at?: string;
				};
			};
			interview_history: {
				Row: {
					id: string;
					user_id: string;
					question: string;
					answer: string;
					feedback: InterviewFeedback;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					question: string;
					answer: string;
					feedback: InterviewFeedback;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					question?: string;
					answer?: string;
					feedback?: InterviewFeedback;
					created_at?: string;
				};
			};
		};
	};
}
