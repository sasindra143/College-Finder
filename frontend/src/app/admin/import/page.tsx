'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { api } from '@/lib/api';
import { toast } from '../../../components/ui/Toaster';

export default function AdminImport() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        toast.success(`Parsed ${results.data.length} rows successfully!`);
      },
      error: (error) => {
        toast.error('Error parsing CSV: ' + error.message);
      }
    });
  };

  const handleImport = async () => {
    if (data.length === 0) return toast.error('No data to import');
    setLoading(true);
    try {
      // Map common CSV headers to our API format if needed
      const normalizedData = data.map(item => ({
        name: item.name || item.Name || item.COLLEGE_NAME,
        state: item.state || item.State || item.STATE_NAME,
        city: item.city || item.City || item.DISTRICT_NAME,
        type: item.type || item.Type || 'Private',
        fees: Number(item.fees || item.Fees || 50000),
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/colleges/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colleges: normalizedData }),
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setData([]);
        setFileName('');
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      toast.error('Import failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-2">CSV Data Importer</h1>
          <p className="text-gray-500 mb-8">Convert your Excel/CSV college lists into website data instantly.</p>

          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-brand-500 transition-all">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="hidden" 
              id="csv-upload" 
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="text-5xl mb-4">📁</div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {fileName || 'Click to upload your CSV'}
              </div>
              <p className="text-sm text-gray-500">Only .csv files are supported</p>
            </label>
          </div>

          {data.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center bg-brand-50 p-4 rounded-2xl border border-brand-100">
                <div>
                  <span className="font-bold text-brand-700">{data.length}</span>
                  <span className="text-brand-600 ml-1">colleges ready to import.</span>
                </div>
                <button 
                  onClick={handleImport}
                  disabled={loading}
                  className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Importing...' : '🚀 Start Bulk Import'}
                </button>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 overflow-hidden">
                <div className="text-xs text-brand-400 font-mono mb-4 uppercase tracking-widest">JSON Data Preview</div>
                <pre className="text-gray-300 font-mono text-xs overflow-x-auto max-h-64 scrollbar-hide">
                  {JSON.stringify(data.slice(0, 3), null, 2)}
                  {data.length > 3 && '\n  ... and many more'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
