// pages/document-repository.tsx
"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileText, Trash2, Info, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface DocumentItem {
  name: string;
  url: string;
  category: string;
  description: string;
  uploadedAt: string;
  uploadedBy: string;
  views: number;
}

export default function DocumentRepository() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [uploadedBy, setUploadedBy] = useState('Admin'); // In real use, fetch from user session
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState("VISITOR")


    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await fetch("/api/users/me");
            const data = await res.json();
    
            if (!res.ok) {
              toast.error(data?.error || "Failed to load society");
              return;
            }
    
            if (data?.role) {
              setRole(data?.role);
            } else {
              toast.error("No society data found");
            }
          } catch {
            toast.error("Failed to load society information");
          }
        };
    
        fetchUser();
      }, []);
  
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const newDoc: DocumentItem = {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        category,
        description,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy,
        views: 0,
      };
      setDocuments([newDoc, ...documents]);
      setSelectedFile(null);
      setDescription('');
      setCategory('General');
    }
  };

  const handleDelete = (index: number) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setDocuments(updatedDocs);
  };

  const handleView = (index: number) => {
    const updatedDocs = [...documents];
    updatedDocs[index].views++;
    setDocuments(updatedDocs);
    window.open(updatedDocs[index].url, '_blank');
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user has required role
  if (!['SOCIETY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-red-600 text-sm font-semibold text-center mt-20">
          You do not have permission to access this section.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
          <h1 className="text-4xl font-bold mb-4 text-center">
            📘 Digital Society Document Center
          </h1>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, tag, view, and manage documents like Rules, Notices,
            Financials and more. Each file is described and tracked for
            transparency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Input type="file" onChange={handleFileChange} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 rounded border border-gray-300"
            >
              <option value="General">General</option>
              <option value="Rules">Rules</option>
              <option value="Meetings">Meeting Minutes</option>
              <option value="Notices">Notices</option>
              <option value="Financial">Financial Reports</option>
            </select>
            <Input
              placeholder="Uploader Name"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="mb-10"
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
          </Button>

          <div className="mb-6">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="shadow-xl rounded-2xl border border-gray-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-blue-700 font-medium">
                          <FileText className="h-5 w-5" />
                          <span>{doc.name}</span>
                        </div>
                        <Badge variant="outline">{doc.category}</Badge>
                      </div>
                      <div className="text-sm text-gray-500 italic">
                        <Info className="inline-block mr-1 h-4 w-4" />{" "}
                        {doc.description || "No description"}
                      </div>
                      <div className="text-xs text-gray-400">
                        Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-500">
                          👁️ {doc.views} views
                        </span>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleView(index)}
                            className="text-blue-600 hover:underline"
                          >
                            <Eye className="h-4 w-4 inline-block mr-1" /> View
                          </button>
                          <a
                            href={doc.url}
                            download
                            className="text-green-600 hover:underline"
                          >
                            <Download className="h-4 w-4 inline-block mr-1" />{" "}
                            Download
                          </a>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:underline"
                          >
                            <Trash2 className="h-4 w-4 inline-block mr-1" />{" "}
                            Delete
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No documents match your search.
            </p>
          )}
        </motion.div>
    </div>
  );
}
