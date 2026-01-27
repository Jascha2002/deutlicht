import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Folder,
  File,
  FileCheck,
  FilePlus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnerDocument {
  id: string;
  document_type: string;
  document_name: string;
  storage_path: string;
  file_size: number | null;
  uploaded_at: string;
  notes: string | null;
}

interface PartnerDocumentsProps {
  partnerId: string;
  partnerNumber: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const documentTypes = [
  { value: 'contract', label: 'Partnervertrag', icon: FileCheck },
  { value: 'contract_signed', label: 'Vertrag (unterschrieben)', icon: FileCheck },
  { value: 'gewerbeschein', label: 'Gewerbeschein', icon: FileText },
  { value: 'handelsregister', label: 'Handelsregisterauszug', icon: FileText },
  { value: 'umsatzsteuer', label: 'USt-ID Bestätigung', icon: FileText },
  { value: 'other', label: 'Sonstiges', icon: File },
];

export function PartnerDocuments({
  partnerId,
  partnerNumber,
  open,
  onOpenChange,
}: PartnerDocumentsProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<PartnerDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('contract');
  const [uploadNote, setUploadNote] = useState('');

  useEffect(() => {
    if (open) {
      loadDocuments();
    }
  }, [open, partnerId]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_documents')
        .select('*')
        .eq('partner_id', partnerId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Fehler',
        description: 'Dokumente konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const storagePath = `${partnerId}/${selectedType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partner-documents')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('partner_documents')
        .insert({
          partner_id: partnerId,
          document_type: selectedType,
          document_name: file.name,
          storage_path: storagePath,
          file_size: file.size,
          uploaded_by: user?.id,
          notes: uploadNote || null,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Dokument hochgeladen',
        description: `${file.name} wurde erfolgreich hochgeladen.`,
      });

      setUploadNote('');
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Fehler',
        description: 'Dokument konnte nicht hochgeladen werden.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (doc: PartnerDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('partner-documents')
        .download(doc.storage_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.document_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Fehler',
        description: 'Dokument konnte nicht heruntergeladen werden.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (doc: PartnerDocument) => {
    if (!confirm(`Dokument "${doc.document_name}" wirklich löschen?`)) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('partner-documents')
        .remove([doc.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('partner_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      toast({
        title: 'Dokument gelöscht',
        description: `${doc.document_name} wurde gelöscht.`,
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Fehler',
        description: 'Dokument konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  const getDocTypeInfo = (type: string) => {
    return documentTypes.find((t) => t.value === type) || documentTypes[5];
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group documents by type
  const groupedDocuments = documentTypes.reduce((acc, type) => {
    acc[type.value] = documents.filter((d) => d.document_type === type.value);
    return acc;
  }, {} as Record<string, PartnerDocument[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-accent" />
            <div>
              <DialogTitle>Dokumente</DialogTitle>
              <DialogDescription>
                Partner-Nr.: {partnerNumber || 'Nicht vergeben'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Upload Section */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            Dokument hochladen
          </h3>
          <div className="flex gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Dokumenttyp" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Notiz (optional)"
              value={uploadNote}
              onChange={(e) => setUploadNote(e.target.value)}
              className="flex-1"
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Hochladen
            </Button>
          </div>
        </div>

        <Separator />

        {/* Documents List */}
        <div className="flex-1 overflow-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Noch keine Dokumente hochgeladen</p>
            </div>
          ) : (
            documentTypes.map((type) => {
              const typeDocs = groupedDocuments[type.value];
              if (typeDocs.length === 0) return null;

              return (
                <div key={type.value} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    {type.label} ({typeDocs.length})
                  </h4>
                  <div className="space-y-2">
                    {typeDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-card border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{doc.document_name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(doc.uploaded_at)}</span>
                              <span>•</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                              {doc.notes && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{doc.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doc)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info Box */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Erlaubte Dateiformate: PDF, Word-Dokumente, Bilder (JPG, PNG). 
              Dokumente werden sicher im Partnerordner gespeichert.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
