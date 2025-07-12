import Link from "next/link";
import { Briefcase, FileText, Search, Upload, Brain } from "lucide-react";

export default function HomePage() {
	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="text-center py-20">
				<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
					Find Your Dream Job &{" "}
					<span className="text-blue-600">Ace Your Interviews</span>
				</h1>
				<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
					Discover remote opportunities from top companies worldwide and
					practice interviews with AI-powered feedback to land your next role.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/jobs"
						className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Search className="mr-2 h-5 w-5" />
						Browse Jobs
					</Link>
					<Link
						href="/resume"
						className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
					>
						<Upload className="mr-2 h-5 w-5" />
						Upload Resume
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
					Everything You Need to Succeed
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{/* Job Board Feature */}
					<div className="bg-white p-8 rounded-lg shadow-sm border">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
							<Briefcase className="h-6 w-6 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Global Job Board
						</h3>
						<p className="text-gray-600 mb-4">
							Access thousands of remote jobs from top companies worldwide.
							Filter by skills, location, and preferences.
						</p>
						<Link
							href="/jobs"
							className="text-blue-600 hover:text-blue-700 font-medium"
						>
							Browse Jobs →
						</Link>
					</div>

					{/* Resume Analysis Feature */}
					<div className="bg-white p-8 rounded-lg shadow-sm border">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
							<FileText className="h-6 w-6 text-green-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							AI Resume Analysis
						</h3>
						<p className="text-gray-600 mb-4">
							Upload your resume and get instant analysis with skill extraction
							and personalized interview questions.
						</p>
						<Link
							href="/resume"
							className="text-green-600 hover:text-green-700 font-medium"
						>
							Analyze Resume →
						</Link>
					</div>

					{/* Interview Practice Feature */}
					<div className="bg-white p-8 rounded-lg shadow-sm border">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
							<Brain className="h-6 w-6 text-purple-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							AI Interview Practice
						</h3>
						<p className="text-gray-600 mb-4">
							Practice interviews with AI-generated questions and get instant
							feedback on your responses.
						</p>
						<Link
							href="/interview"
							className="text-purple-600 hover:text-purple-700 font-medium"
						>
							Start Practice →
						</Link>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-blue-600 text-white py-16 rounded-lg">
				<div className="text-center">
					<h2 className="text-3xl font-bold mb-8">
						Trusted by Job Seekers Worldwide
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div>
							<div className="text-4xl font-bold mb-2">10K+</div>
							<div className="text-blue-100">Remote Jobs</div>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">5K+</div>
							<div className="text-blue-100">Companies</div>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">50K+</div>
							<div className="text-blue-100">Interviews Practiced</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="text-center py-16">
				<h2 className="text-3xl font-bold text-gray-900 mb-4">
					Ready to Land Your Dream Job?
				</h2>
				<p className="text-xl text-gray-600 mb-8">
					Join thousands of professionals who have found success with our
					platform.
				</p>
				<Link
					href="/jobs"
					className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
				>
					Get Started Today
				</Link>
			</section>
		</div>
	);
}
