"use client";

import { useState } from "react";
import { JobFilter } from "@/lib/jobs";
import { Search, Filter, X } from "lucide-react";

interface JobFiltersProps {
	filters: JobFilter;
	onFilterChange: (filters: JobFilter) => void;
	categories: string[];
}

export function JobFilters({
	filters,
	onFilterChange,
	categories,
}: JobFiltersProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleInputChange = (
		key: keyof JobFilter,
		value: string | boolean | undefined
	) => {
		onFilterChange({
			...filters,
			[key]: value,
		});
	};

	const clearFilters = () => {
		onFilterChange({});
	};

	const hasActiveFilters = Object.values(filters).some(
		(value) => value !== undefined && value !== ""
	);

	return (
		<div className="bg-white rounded-lg border shadow-sm p-6">
			{/* Mobile Filter Toggle */}
			<div className="lg:hidden mb-4">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center space-x-2 w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
				>
					<Filter className="h-4 w-4" />
					<span>Filters</span>
					{hasActiveFilters && (
						<span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
							Active
						</span>
					)}
				</button>
			</div>

			{/* Desktop Filters */}
			<div className={`lg:block ${isOpen ? "block" : "hidden"}`}>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900">Filters</h3>
					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="text-sm text-blue-600 hover:text-blue-700"
						>
							Clear all
						</button>
					)}
				</div>

				{/* Keywords Search */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Keywords
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<input
							type="text"
							placeholder="Job title, company, skills..."
							value={filters.keywords || ""}
							onChange={(e) => handleInputChange("keywords", e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				{/* Category Filter */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Category
					</label>
					<select
						value={filters.category || ""}
						onChange={(e) => handleInputChange("category", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Categories</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				{/* Location Filter */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Location
					</label>
					<input
						type="text"
						placeholder="City, country, or remote"
						value={filters.location || ""}
						onChange={(e) => handleInputChange("location", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				{/* Remote Filter */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Work Type
					</label>
					<div className="space-y-2">
						<label className="flex items-center">
							<input
								type="radio"
								name="remote"
								value=""
								checked={filters.remote === undefined}
								onChange={() => handleInputChange("remote", undefined)}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">All</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="remote"
								value="true"
								checked={filters.remote === true}
								onChange={() => handleInputChange("remote", true)}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">Remote Only</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="remote"
								value="false"
								checked={filters.remote === false}
								onChange={() => handleInputChange("remote", false)}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">On-site Only</span>
						</label>
					</div>
				</div>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className="border-t pt-4">
						<h4 className="text-sm font-medium text-gray-700 mb-2">
							Active Filters:
						</h4>
						<div className="flex flex-wrap gap-2">
							{filters.keywords && (
								<span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
									Keywords: {filters.keywords}
									<button
										onClick={() => handleInputChange("keywords", "")}
										className="ml-1 hover:text-blue-900"
									>
										<X className="h-3 w-3" />
									</button>
								</span>
							)}
							{filters.category && (
								<span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
									Category: {filters.category}
									<button
										onClick={() => handleInputChange("category", "")}
										className="ml-1 hover:text-blue-900"
									>
										<X className="h-3 w-3" />
									</button>
								</span>
							)}
							{filters.location && (
								<span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
									Location: {filters.location}
									<button
										onClick={() => handleInputChange("location", "")}
										className="ml-1 hover:text-blue-900"
									>
										<X className="h-3 w-3" />
									</button>
								</span>
							)}
							{filters.remote !== undefined && (
								<span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
									{filters.remote ? "Remote Only" : "On-site Only"}
									<button
										onClick={() => handleInputChange("remote", undefined)}
										className="ml-1 hover:text-blue-900"
									>
										<X className="h-3 w-3" />
									</button>
								</span>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
