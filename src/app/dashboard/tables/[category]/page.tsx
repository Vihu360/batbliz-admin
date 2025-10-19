import { DashboardLayout } from "@/components/dashboard-layout";
import { TABLE_CATEGORIES, type TableCategory } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Database, Eye, Edit, Plus } from "lucide-react";

interface TableCategoryPageProps {
  params: {
    category: string;
  };
}

export default function TableCategoryPage({ params }: TableCategoryPageProps) {
  const categoryKey = params.category.toUpperCase() as TableCategory;
  const category = TABLE_CATEGORIES[categoryKey];

  if (!category) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Category not found</h1>
          <p className="text-muted-foreground">The requested category does not exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Category Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Tables in this category</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.tables.map((table) => (
                      <Badge key={table} variant="secondary">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.tables.map((table) => (
                <Card key={table} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="capitalize">{table.replace(/_/g, ' ')}</span>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Manage {table.replace(/_/g, ' ')} data with full CRUD operations
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/dashboard/tables/${categoryKey.toLowerCase()}/${table}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="flex-1">
                        <Link href={`/dashboard/tables/${categoryKey.toLowerCase()}/${table}/edit`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                    <Button size="sm" variant="secondary" className="w-full" asChild>
                      <Link href={`/dashboard/tables/${categoryKey.toLowerCase()}/${table}/create`}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add New
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
