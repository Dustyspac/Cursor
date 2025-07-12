import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Global Job & Interview Platform",
	description: "Find remote jobs and practice interviews with AI feedback",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<div className="min-h-screen bg-gray-50">
						<Navbar />
						<main className="container mx-auto px-4 py-8">{children}</main>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
