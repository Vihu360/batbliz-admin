"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiManager, type TableColumn, type TableDataResponse } from "@/lib/api";
import { ArrowLeft, Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TableManagementProps {
  params: Promise<{
    category: string;
    table: string;
  }>;
}

export default function TableManagement({ params }: TableManagementProps) {
  const router = useRouter();
  const { category, table } = use(params);
  
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadTableData();
    loadTableSchema();
  }, [table, page, searchTerm]);

  const loadTableSchema = async () => {
    try {
      const response = await apiManager.getTableSchema(table);
      if (response.success) {
        setColumns(response.data.columns);
      } else {
        setError(response.error || "Failed to load table schema");
      }
    } catch (err) {
      setError("Failed to load table schema");
    }
  };

  const loadTableData = async () => {
    setLoading(true);
    try {
      const filters = searchTerm ? { search: searchTerm } : undefined;
      const response = await apiManager.getTableData(table, page, limit, filters);
      console.log('API Response:', response); // Debug log
      console.log('Response data:', response.data); // Debug log
      console.log('Is array?', Array.isArray(response.data)); // Debug log
      
      if (response.success && response.data) {
        // The data is directly in response.data, not response.data.data
        const tableData = Array.isArray(response.data) ? response.data : [];
        console.log('Setting data to:', tableData); // Debug log
        setData(tableData);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        });
        setError(null); // Clear any previous errors
      } else {
        console.log('API call failed:', response.error); // Debug log
        const errorMsg = response.error || "Failed to load table data";
        setError(errorMsg);
        setData([]);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error loading table data:', err);
      const errorMsg = "Failed to load table data";
      setError(errorMsg);
      setData([]);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      // Transform form data to match API expectations
      const transformedData = { ...formData };
      
      // Convert snake_case to camelCase for specific fields
      if (formData.start_date) {
        transformedData.startDate = formData.start_date;
        delete transformedData.start_date;
      }
      if (formData.end_date) {
        transformedData.endDate = formData.end_date;
        delete transformedData.end_date;
      }
      if (formData.external_ids) {
        transformedData.externalIds = formData.external_ids;
        delete transformedData.external_ids;
      }
      if (formData.created_at) {
        transformedData.createdAt = formData.created_at;
        delete transformedData.created_at;
      }
      if (formData.updated_at) {
        transformedData.updatedAt = formData.updated_at;
        delete transformedData.updated_at;
      }
      
      const response = await apiManager.createRecord(table, transformedData);
      if (response.success) {
        toast.success("Record created successfully!");
        setIsCreateDialogOpen(false);
        setFormData({});
        loadTableData();
      } else {
        toast.error(response.error || "Failed to create record");
        // Keep the dialog open on error
      }
    } catch (err) {
      toast.error("Failed to create record");
      // Keep the dialog open on error
    }
  };

  const handleUpdate = async () => {
    if (!selectedRecord) return;
    
    try {
      // Transform form data to match API expectations
      const transformedData = { ...formData };
      
      // Convert snake_case to camelCase for specific fields
      if (formData.start_date) {
        transformedData.startDate = formData.start_date;
        delete transformedData.start_date;
      }
      if (formData.end_date) {
        transformedData.endDate = formData.end_date;
        delete transformedData.end_date;
      }
      if (formData.external_ids) {
        transformedData.externalIds = formData.external_ids;
        delete transformedData.external_ids;
      }
      if (formData.created_at) {
        transformedData.createdAt = formData.created_at;
        delete transformedData.created_at;
      }
      if (formData.updated_at) {
        transformedData.updatedAt = formData.updated_at;
        delete transformedData.updated_at;
      }
      
      const id = selectedRecord.id;
      const response = await apiManager.updateRecord(table, id, transformedData);
      if (response.success) {
        toast.success("Record updated successfully!");
        setIsEditDialogOpen(false);
        setSelectedRecord(null);
        setFormData({});
        loadTableData();
      } else {
        toast.error(response.error || "Failed to update record");
        // Keep the dialog open on error
      }
    } catch (err) {
      toast.error("Failed to update record");
      // Keep the dialog open on error
    }
  };

  const handleDelete = async (record: any) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const id = record.id;
      const response = await apiManager.deleteRecord(table, id);
      if (response.success) {
        toast.success("Record deleted successfully!");
        loadTableData();
      } else {
        toast.error(response.error || "Failed to delete record");
      }
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  const openEditDialog = (record: any) => {
    setSelectedRecord(record);
    setFormData(record);
    setIsEditDialogOpen(true);
  };

  const renderFormField = (column: TableColumn) => {
    const isRequired = !column.nullable && column.name !== 'id';
    const isIdField = column.name === 'id' || column.name.endsWith('_at');
    
    // Skip ID fields and timestamp fields for create/edit forms
    if (isIdField) return null;
    
    if (column.type.includes('date') || column.type.includes('timestamp')) {
      return (
        <div key={column.name} className="space-y-2">
          <Label htmlFor={column.name}>
            {column.name.replace(/_/g, ' ').toUpperCase()}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={column.name}
            type="date"
            value={formData[column.name] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.name]: e.target.value }))}
            placeholder={`Enter ${column.name.replace(/_/g, ' ')}`}
          />
        </div>
      );
    }
    
    if (column.type.includes('jsonb')) {
      return (
        <div key={column.name} className="space-y-2">
          <Label htmlFor={column.name}>
            {column.name.replace(/_/g, ' ').toUpperCase()}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id={column.name}
            value={typeof formData[column.name] === 'string' ? formData[column.name] : JSON.stringify(formData[column.name] || {})}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData(prev => ({ ...prev, [column.name]: parsed }));
              } catch {
                setFormData(prev => ({ ...prev, [column.name]: e.target.value }));
              }
            }}
            placeholder={`Enter JSON for ${column.name.replace(/_/g, ' ')}`}
            rows={3}
          />
        </div>
      );
    }
    
    if (column.type.includes('USER-DEFINED')) {
      return (
        <div key={column.name} className="space-y-2">
          <Label htmlFor={column.name}>
            {column.name.replace(/_/g, ' ').toUpperCase()}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={column.name}
            value={formData[column.name] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.name]: e.target.value }))}
            placeholder={`Enter ${column.name.replace(/_/g, ' ')}`}
          />
        </div>
      );
    }
    
    return (
      <div key={column.name} className="space-y-2">
        <Label htmlFor={column.name}>
          {column.name.replace(/_/g, ' ').toUpperCase()}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={column.name}
          value={formData[column.name] || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, [column.name]: e.target.value }))}
          placeholder={`Enter ${column.name.replace(/_/g, ' ')}`}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading table data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/tables/${category}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {category}
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold capitalize">{table.replace(/_/g, ' ')}</h1>
              <p className="text-muted-foreground">Manage {table.replace(/_/g, ' ')} data</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New {table.replace(/_/g, ' ')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {columns.filter(col => col.name !== 'id' && !col.name.endsWith('_at')).map(renderFormField)}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreate} className="flex-1">
                    Create
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Table Data</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.filter(col => col.name !== 'id').map((column) => (
                      <TableHead key={column.name} className="capitalize">
                        {column.name.replace(/_/g, ' ')}
                      </TableHead>
                    ))}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? data.map((record, index) => (
                    <TableRow key={index}>
                      {columns.filter(col => col.name !== 'id').map((column) => (
                        <TableCell key={column.name}>
                          {record[column.name]?.toString() || '-'}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(record)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={columns.filter(col => col.name !== 'id').length + 1} className="text-center py-8 text-muted-foreground">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {table.replace(/_/g, ' ')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {columns.filter(col => col.name !== 'id' && !col.name.endsWith('_at')).map(renderFormField)}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdate} className="flex-1">
                  Update
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
