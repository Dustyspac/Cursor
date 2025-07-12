"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Briefcase, FileText, MessageSquare, User, LogOut } from "lucide-react";

export function Navbar() {
	const { user, loading, signIn, signOut } = useAuth();

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<Briefcase className="h-8 w-8 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">JobPlatform</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/jobs"
							className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
						>
							<Briefcase className="h-4 w-4" />
							<span>Jobs</span>
						</Link>
						<Link
							href="/resume"
							className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
						>
							<FileText className="h-4 w-4" />
							<span>Resume</span>
						</Link>
						<Link
							href="/interview"
							className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
						>
							<MessageSquare className="h-4 w-4" />
							<span>Interview</span>
						</Link>
					</div>

					{/* Auth Section */}
					<div className="flex items-center space-x-4">
						{loading ? (
							<div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
						) : user ? (
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-gray-600" />
									<span className="text-sm text-gray-700">{user.email}</span>
								</div>
								<button
									onClick={() => signOut()}
									className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
								>
									<LogOut className="h-4 w-4" />
									<span className="hidden sm:inline">Sign Out</span>
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<button
									onClick={() => signIn("google")}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
								>
									Sign In
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
