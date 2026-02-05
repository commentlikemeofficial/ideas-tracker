import { allDocuments } from "@/lib/data";
import Link from "next/link";
import { FileText, Clock } from "lucide-react";

export default function ListPage({ 
  searchParams 
}: { 
  searchParams: { category?: string } 
}) {
  const documents = allDocuments;
  const category = searchParams.category;
  
  const filteredDocs = category 
    ? documents.filter((d: any) => d.category === category)
    : documents;

  // Group by category
  const byCategory = filteredDocs.reduce((acc: any, doc: any) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-gray-400">
            {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
            {category && ` in "${category}"`}
          </p>
        </div>
        {category && (
          <Link 
            href="/list" 
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear filter
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(byCategory).map(([cat, docs]: [string, any]) => (
          <div key={cat}>
            <h2 className="text-lg font-semibold mb-3 text-gray-300 capitalize">
              {cat.replace(/-/g, ' ')}
            </h2>
            <div className="grid gap-2">
              {docs.map((doc: any) => (
                <Link
                  key={doc.id}
                  href={`/doc/${encodeURIComponent(doc.id)}`}
                  className="flex items-center gap-4 p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors group"
                >
                  <FileText className="w-5 h-5 text-gray-600 group-hover:text-indigo-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{doc.title}</h3>
                    <p className="text-xs text-gray-500 truncate">
                      {doc.content.slice(0, 100)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(doc.lastModified).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
