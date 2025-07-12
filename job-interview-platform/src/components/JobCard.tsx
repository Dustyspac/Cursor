"use client";

import { useState } from "react";
import { JobData } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import {
	MapPin,
	Calendar,
	Tag,
	ExternalLink,
	Bookmark,
	BookmarkCheck,
} from "lucide-react";

interface JobCardProps {
	job: JobData;
	userId?: string;
}

export function JobCard({ job, userId }: JobCardProps) {
	const [isPinned, setIsPinned] = useState(false);
	const [pinning, setPinning] = useState(false);

	const handlePinJob = async () => {
		if (!userId) return;

		try {
			setPinning(true);

			if (isPinned) {
				// Unpin job
				const { error } = await supabase
					.from("pinned_jobs")
					.delete()
					.eq("user_id", userId)
					.eq("job_id", job.id);

				if (error) throw error;
				setIsPinned(false);
			} else {
				// Pin job
				const { error } = await supabase.from("pinned_jobs").insert({
					user_id: userId,
					job_id: job.id,
					job_data: job,
				});

				if (error) throw error;
				setIsPinned(true);
			}
		} catch (error) {
			console.error("Error pinning job:", error);
		} finally {
			setPinning(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Today";
		if (diffDays === 2) return "Yesterday";
		if (diffDays <= 7) return `${diffDays - 1} days ago`;
		return date.toLocaleDateString();
	};

	return (
		<div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
			<div className="flex justify-between items-start mb-4">
				<div className="flex-1">
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						{job.title}
					</h3>
					<p className="text-lg text-gray-700 mb-2">{job.company}</p>
				</div>
				{userId && (
					<button
						onClick={handlePinJob}
						disabled={pinning}
						className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
					>
						{isPinned ? (
							<BookmarkCheck className="h-5 w-5 text-blue-600" />
						) : (
							<Bookmark className="h-5 w-5" />
						)}
					</button>
				)}
			</div>

			<div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
				<div className="flex items-center space-x-1">
					<MapPin className="h-4 w-4" />
					<span>{job.location}</span>
				</div>
				<div className="flex items-center space-x-1">
					<Calendar className="h-4 w-4" />
					<span>{formatDate(job.posted_date)}</span>
				</div>
			</div>

			{job.salary && (
				<div className="mb-4">
					<span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
						{job.salary}
					</span>
				</div>
			)}

			<div className="mb-4">
				<div className="flex items-center space-x-2 mb-2">
					<Tag className="h-4 w-4 text-gray-500" />
					<span className="text-sm font-medium text-gray-700">Skills:</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{job.tags.slice(0, 5).map((tag, index) => (
						<span
							key={index}
							className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
						>
							{tag}
						</span>
					))}
					{job.tags.length > 5 && (
						<span className="text-xs text-gray-500">
							+{job.tags.length - 5} more
						</span>
					)}
				</div>
			</div>

			<p className="text-gray-600 mb-4 line-clamp-3">
				{job.description.length > 200
					? `${job.description.substring(0, 200)}...`
					: job.description}
			</p>

			<div className="flex justify-between items-center">
				<a
					href={job.apply_url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
				>
					<ExternalLink className="h-4 w-4" />
					<span>Apply Now</span>
				</a>
			</div>
		</div>
	);
}
