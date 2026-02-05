import { journalEntries } from "@/lib/data";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";

export default function JournalPage() {
  const entries = journalEntries;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Daily Journal</h1>
      <p className="text-gray-400 mb-8">
        {entries.length} journal entries
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />

        <div className="space-y-6">
          {entries.map((entry: any, index: number) => (
            <Link
              key={entry.id}
              href={`/doc/${encodeURIComponent(entry.id)}`}
              className="relative flex gap-4 group"
            >
              {/* Timeline dot */}
              <div className="relative z-10 w-8 h-8 bg-gray-900 border-2 border-gray-700 rounded-full flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                <Calendar className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{entry.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.lastModified).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {entry.content.slice(0, 250)}...
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <FileText className="w-3 h-3" />
                  <span>{entry.content.length} characters</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No journal entries found</p>
          <p className="text-sm text-gray-600 mt-2">
            Journal entries are created from daily memory files
          </p>
        </div>
      )}
    </div>
  );
}
