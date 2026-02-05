import Link from "next/link";
import { FileX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <FileX className="w-16 h-16 text-gray-600 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Document not found</h1>
      <p className="text-gray-500 mb-6">The document you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
