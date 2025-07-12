"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/JobCard";
import { JobFilters } from "@/components/JobFilters";
import { JobFilter } from "@/lib/jobs";
import { JobData } from "@/lib/supabase";
import { jobService } from "@/lib/jobs";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";

export default function JobsPage() {
	const [jobs, setJobs] = useState<JobData[]>([]);
	const [filteredJobs, setFilteredJobs] = useState<JobData[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<JobFilter>({});
	const { user } = useAuth();

	useEffect(() => {
		loadJobs();
	}, []);

	useEffect(() => {
		// Apply filters
		let filtered = jobs;

		if (filters.keywords) {
			const keywords = filters.keywords.toLowerCase();
			filtered = filtered.filter(
				(job) =>
					job.title.toLowerCase().includes(keywords) ||
					job.company.toLowerCase().includes(keywords) ||
					job.description.toLowerCase().includes(keywords) ||
					job.tags.some((tag) => tag.toLowerCase().includes(keywords))
			);
		}

		if (filters.category) {
			filtered = filtered.filter((job) =>
				job.tags.some((tag) =>
					tag.toLowerCase().includes(filters.category!.toLowerCase())
				)
			);
		}

		if (filters.location) {
			filtered = filtered.filter((job) =>
				job.location.toLowerCase().includes(filters.location!.toLowerCase())
			);
		}

		if (filters.remote !== undefined) {
			filtered = filtered.filter((job) => {
				const isRemote =
					job.location.toLowerCase().includes("remote") ||
					job.location.toLowerCase().includes("anywhere");
				return filters.remote === isRemote;
			});
		}

		setFilteredJobs(filtered);
	}, [jobs, filters]);

	const loadJobs = async () => {
		try {
			setLoading(true);
			const fetchedJobs = await jobService.getJobs();
			setJobs(fetchedJobs);
		} catch (error) {
			console.error("Error loading jobs:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (newFilters: JobFilter) => {
		setFilters(newFilters);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Find Your Next Remote Job
				</h1>
				<p className="text-lg text-gray-600">
					Discover thousands of remote opportunities from top companies
					worldwide
				</p>
			</div>

			{/* Filters and Jobs Grid */}
			<div className="grid lg:grid-cols-4 gap-8">
				{/* Filters Sidebar */}
				<div className="lg:col-span-1">
					<JobFilters
						filters={filters}
						onFilterChange={handleFilterChange}
						categories={jobService.getCategories()}
					/>
				</div>

				{/* Jobs List */}
				<div className="lg:col-span-3">
					<div className="mb-4">
						<p className="text-gray-600">
							Showing {filteredJobs.length} of {jobs.length} jobs
						</p>
					</div>

					{filteredJobs.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">
								No jobs found matching your criteria.
							</p>
							<button
								onClick={() => setFilters({})}
								className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
							>
								Clear all filters
							</button>
						</div>
					) : (
						<div className="space-y-4">
							{filteredJobs.map((job) => (
								<JobCard key={job.id} job={job} userId={user?.id} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
