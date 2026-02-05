import { allDocuments, journalEntries } from "@/lib/data";
import { FileText, BookOpen, Calendar, Layers } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const documents = allDocuments;
  const journal = journalEntries;
  
  const categories = [...new Set(documents.map((d: any) => d.category))];
  const recentDocs = documents.slice(0, 5);
  const recentJournals = journal.slice(0, 3);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Explore your Clawd knowledge base</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span className="text-gray-400 text-sm">Documents</span>
          </div>
          <p className="text-2xl font-bold">{documents.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <span className="text-gray-400 text-sm">Categories</span>
          </div>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-gray-400 text-sm">Journal Entries</span>
          </div>
          <p className="text-2xl font-bold">{journal.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span className="text-gray-400 text-sm">Last Updated</span>
          </div>
          <p className="text-sm">{documents[0]?.lastModified ? new Date(documents[0].lastModified).toLocaleDateString() : "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="space-y-2">
            {recentDocs.map((doc: any) => (
              <Link
                key={doc.id}
                href={`/doc/${encodeURIComponent(doc.id)}`}
                className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-200">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.category} • {new Date(doc.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {doc.content.slice(0, 150)}...
                </p>
              </Link>
            ))}
          </div>
          <Link 
            href="/list" 
            className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            View all documents →
          </Link>
        </div>

        {/* Recent Journal */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Journal</h2>
          <div className="space-y-2">
            {recentJournals.length > 0 ? (
              recentJournals.map((entry: any) => (
                <Link
                  key={entry.id}
                  href={`/doc/${encodeURIComponent(entry.id)}`}
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-200">{entry.title}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {entry.content.slice(0, 150)}...
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No journal entries found</p>
            )}
          </div>
          <Link 
            href="/journal" 
            className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
          >
            View all journal entries →
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <Link
              key={cat}
              href={`/list?category=${cat}`}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
