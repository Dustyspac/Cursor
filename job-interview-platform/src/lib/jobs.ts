import { JobData } from "./supabase";

export interface JobFilter {
	keywords?: string;
	category?: string;
	location?: string;
	remote?: boolean;
}

interface RemoteOKJob {
	id: number;
	position?: string;
	title?: string;
	company?: string;
	location?: string;
	tags?: string[];
	url?: string;
	apply_url?: string;
	description?: string;
	salary?: string;
	date?: string;
}

interface RemotiveJob {
	id: number;
	title?: string;
	company_name?: string;
	candidate_required_location?: string;
	tags?: string[];
	url?: string;
	description?: string;
	salary?: string;
	publication_date?: string;
}

export class JobService {
	private async fetchRemoteOKJobs(filter?: JobFilter): Promise<JobData[]> {
		try {
			const response = await fetch("https://remoteok.com/api");
			const jobs = await response.json();

			return jobs
				.filter((job: RemoteOKJob) => job && job.id)
				.map((job: RemoteOKJob) => ({
					id: job.id.toString(),
					title: job.position || job.title || "Unknown Position",
					company: job.company || "Unknown Company",
					location: job.location || "Remote",
					tags: job.tags || [],
					apply_url: job.url || job.apply_url || "",
					description: job.description || "",
					salary: job.salary || undefined,
					posted_date: job.date || new Date().toISOString(),
				}))
				.filter((job: JobData) => this.matchesFilter(job, filter));
		} catch (error) {
			console.error("Error fetching RemoteOK jobs:", error);
			return [];
		}
	}

	private async fetchRemotiveJobs(filter?: JobFilter): Promise<JobData[]> {
		try {
			const response = await fetch("https://remotive.com/api/remote-jobs");
			const data = await response.json();
			const jobs = data.jobs || [];

			return jobs
				.filter((job: RemotiveJob) => job && job.id)
				.map((job: RemotiveJob) => ({
					id: job.id.toString(),
					title: job.title || "Unknown Position",
					company: job.company_name || "Unknown Company",
					location: job.candidate_required_location || "Remote",
					tags: job.tags || [],
					apply_url: job.url || "",
					description: job.description || "",
					salary: job.salary || undefined,
					posted_date: job.publication_date || new Date().toISOString(),
				}))
				.filter((job: JobData) => this.matchesFilter(job, filter));
		} catch (error) {
			console.error("Error fetching Remotive jobs:", error);
			return [];
		}
	}

	private matchesFilter(job: JobData, filter?: JobFilter): boolean {
		if (!filter) return true;

		if (filter.keywords) {
			const keywords = filter.keywords.toLowerCase();
			const searchText = `${job.title} ${job.company} ${
				job.description
			} ${job.tags.join(" ")}`.toLowerCase();
			if (!searchText.includes(keywords)) return false;
		}

		if (filter.category && job.tags.length > 0) {
			const category = filter.category.toLowerCase();
			if (!job.tags.some((tag) => tag.toLowerCase().includes(category)))
				return false;
		}

		if (filter.location) {
			const location = filter.location.toLowerCase();
			if (!job.location.toLowerCase().includes(location)) return false;
		}

		if (filter.remote !== undefined) {
			const isRemote =
				job.location.toLowerCase().includes("remote") ||
				job.location.toLowerCase().includes("anywhere");
			if (filter.remote !== isRemote) return false;
		}

		return true;
	}

	async getJobs(filter?: JobFilter): Promise<JobData[]> {
		const [remoteOKJobs, remotiveJobs] = await Promise.all([
			this.fetchRemoteOKJobs(filter),
			this.fetchRemotiveJobs(filter),
		]);

		// Combine and deduplicate jobs
		const allJobs = [...remoteOKJobs, ...remotiveJobs];
		const uniqueJobs = allJobs.filter(
			(job, index, self) => index === self.findIndex((j) => j.id === job.id)
		);

		// Sort by posted date (newest first)
		return uniqueJobs.sort(
			(a, b) =>
				new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
		);
	}

	async getJobById(jobId: string): Promise<JobData | null> {
		try {
			// Try RemoteOK first
			const remoteOKResponse = await fetch(`https://remoteok.com/api/${jobId}`);
			if (remoteOKResponse.ok) {
				const job: RemoteOKJob = await remoteOKResponse.json();
				return {
					id: job.id.toString(),
					title: job.position || job.title || "Unknown Position",
					company: job.company || "Unknown Company",
					location: job.location || "Remote",
					tags: job.tags || [],
					apply_url: job.url || job.apply_url || "",
					description: job.description || "",
					salary: job.salary || undefined,
					posted_date: job.date || new Date().toISOString(),
				};
			}

			// Try Remotive
			const remotiveResponse = await fetch(
				`https://remotive.com/api/remote-jobs/${jobId}`
			);
			if (remotiveResponse.ok) {
				const job: RemotiveJob = await remotiveResponse.json();
				return {
					id: job.id.toString(),
					title: job.title || "Unknown Position",
					company: job.company_name || "Unknown Company",
					location: job.candidate_required_location || "Remote",
					tags: job.tags || [],
					apply_url: job.url || "",
					description: job.description || "",
					salary: job.salary || undefined,
					posted_date: job.publication_date || new Date().toISOString(),
				};
			}

			return null;
		} catch (error) {
			console.error("Error fetching job by ID:", error);
			return null;
		}
	}

	getCategories(): string[] {
		return [
			"Software Development",
			"Design",
			"Marketing",
			"Sales",
			"Customer Service",
			"Data Science",
			"DevOps",
			"Product Management",
			"Content Writing",
			"Translation",
			"Finance",
			"Legal",
			"Healthcare",
			"Education",
			"Other",
		];
	}
}

export const jobService = new JobService();
