import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, CheckCircle, XCircle, Clock, Edit3, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ReviewExtraction from "@/components/ReviewExtraction";

export default function ReviewQueue() {
  const [statusFilter, setStatusFilter] = useState<"needs_review" | "approved" | "rejected" | "edited" | undefined>("needs_review");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [showOnlyDiscrepancies, setShowOnlyDiscrepancies] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<"P0" | "P1" | "P2" | "P3" | undefined>(undefined);
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assigned" | "unassigned" | "mine">("all");
  const [selectedExtractionIds, setSelectedExtractionIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const { data: extractions, isLoading, refetch } = trpc.review.list.useQuery({
    status: statusFilter,
  });

  const { data: currentUser } = trpc.auth.me.useQuery();
  
  // Bulk actions mutations
  const bulkDecideMutation = trpc.review.bulkDecide.useMutation({
    onSuccess: (results) => {
      alert(`Success: ${results.success.length} extractions updated. Failed: ${results.failed.length}`);
      setSelectedExtractionIds(new Set());
      refetch();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });
  
  const bulkReassignMutation = trpc.review.bulkReassign.useMutation({
    onSuccess: (results) => {
      alert(`Success: ${results.success.length} extractions reassigned. Failed: ${results.failed.length}`);
      setSelectedExtractionIds(new Set());
      refetch();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });
  
  // Selection helpers
  const toggleSelection = (extractionId: string) => {
    const newSelection = new Set(selectedExtractionIds);
    if (newSelection.has(extractionId)) {
      newSelection.delete(extractionId);
    } else {
      newSelection.add(extractionId);
    }
    setSelectedExtractionIds(newSelection);
  };
  
  const toggleSelectAll = () => {
    if (selectedExtractionIds.size === filteredExtractions.length) {
      setSelectedExtractionIds(new Set());
    } else {
      setSelectedExtractionIds(new Set(filteredExtractions.map(e => e.id)));
    }
  };
  
  const clearSelection = () => {
    setSelectedExtractionIds(new Set());
  };
  
  // Bulk action handlers
  const handleBulkApprove = () => {
    if (selectedExtractionIds.size === 0) return;
    if (confirm(`Approve ${selectedExtractionIds.size} extractions?`)) {
      bulkDecideMutation.mutate({
        extractionIds: Array.from(selectedExtractionIds),
        decision: "approve",
      });
    }
  };
  
  const handleBulkReject = () => {
    if (selectedExtractionIds.size === 0) return;
    if (confirm(`Reject ${selectedExtractionIds.size} extractions?`)) {
      bulkDecideMutation.mutate({
        extractionIds: Array.from(selectedExtractionIds),
        decision: "reject",
      });
    }
  };
  
  const filteredExtractions = extractions?.filter(ext => {
    const discrepancies = (ext.discrepancies as any[]) || [];
    
    if (showOnlyDiscrepancies && discrepancies.length === 0) return false;
    
    if (priorityFilter) {
      const hasPriority = discrepancies.some((d: any) => d.priority === priorityFilter);
      if (!hasPriority) return false;
    }
    
    // Assignment filtering
    if (assignmentFilter === "assigned" && !ext.assignedTo) return false;
    if (assignmentFilter === "unassigned" && ext.assignedTo) return false;
    if (assignmentFilter === "mine" && ext.assignedTo !== currentUser?.id) return false;
    
    return true;
  }) || [];
  
  // Calculate priority statistics
  const priorityStats = extractions?.reduce((acc, ext) => {
    const discrepancies = (ext.discrepancies as any[]) || [];
    discrepancies.forEach((d: any) => {
      if (d.priority) {
        acc[d.priority] = (acc[d.priority] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>) || {};

  const { data: stats } = trpc.review.stats.useQuery();

  const getKindColor = (kind: string) => {
    switch (kind) {
      case "License":
        return "bg-blue-100 text-blue-800";
      case "COI":
        return "bg-green-100 text-green-800";
      case "W9":
        return "bg-purple-100 text-purple-800";
      case "DEA":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "needs_review":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "edited":
        return <Edit3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (selectedDocumentId) {
    return (
    <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDocumentId(null);
              refetch();
            }}
            className="mb-4"
          >
            ← Back to Queue
          </Button>
          <ReviewExtraction
            documentId={selectedDocumentId}
            onComplete={() => {
              setSelectedDocumentId(null);
              refetch();
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Extraction Review Queue</h1>
            <p className="text-gray-600 mt-1">Review and approve AI-extracted document data</p>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedExtractionIds.size > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-blue-900">
                    {selectedExtractionIds.size} extraction{selectedExtractionIds.size !== 1 ? 's' : ''} selected
                  </div>
                  <Button
                    onClick={clearSelection}
                    variant="outline"
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleBulkApprove}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={bulkDecideMutation.isLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Selected
                  </Button>
                  <Button
                    onClick={handleBulkReject}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={bulkDecideMutation.isLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Selected
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Statistics */}
          {stats && (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                </Card>
                <Card className="p-4 border-yellow-200 bg-yellow-50">
                  <div className="text-sm text-yellow-700">Needs Review</div>
                  <div className="text-3xl font-bold text-yellow-900">{stats.needsReview}</div>
                </Card>
                <Card className="p-4 border-green-200 bg-green-50">
                  <div className="text-sm text-green-700">Approved</div>
                  <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
                </Card>
                <Card className="p-4 border-blue-200 bg-blue-50">
                  <div className="text-sm text-blue-700">Edited</div>
                  <div className="text-3xl font-bold text-blue-900">{stats.edited}</div>
                </Card>
                <Card className="p-4 border-red-200 bg-red-50">
                  <div className="text-sm text-red-700">Rejected</div>
                  <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
                </Card>
              </div>
            
              {/* Priority Statistics */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 border-red-300 bg-red-50">
                  <div className="text-sm text-red-700 font-semibold">P0 - Critical</div>
                  <div className="text-2xl font-bold text-red-900">{priorityStats.P0 || 0}</div>
                </Card>
                <Card className="p-4 border-orange-300 bg-orange-50">
                  <div className="text-sm text-orange-700 font-semibold">P1 - High</div>
                  <div className="text-2xl font-bold text-orange-900">{priorityStats.P1 || 0}</div>
                </Card>
                <Card className="p-4 border-yellow-300 bg-yellow-50">
                  <div className="text-sm text-yellow-700">P2 - Medium</div>
                  <div className="text-2xl font-bold text-yellow-900">{priorityStats.P2 || 0}</div>
                </Card>
                <Card className="p-4 border-blue-300 bg-blue-50">
                  <div className="text-sm text-blue-700">P3 - Low</div>
                  <div className="text-2xl font-bold text-blue-900">{priorityStats.P3 || 0}</div>
                </Card>
              </div>
            </div>
          )}

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="select-all"
                  checked={filteredExtractions.length > 0 && selectedExtractionIds.size === filteredExtractions.length}
                  onCheckedChange={toggleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Select All ({filteredExtractions.length})
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                <Select
                  value={statusFilter || "all"}
                  onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value as any)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="needs_review">Needs Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="edited">Edited</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Priority:</label>
                <Select
                  value={priorityFilter || "all"}
                  onValueChange={(value) => setPriorityFilter(value === "all" ? undefined : value as any)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="P0">P0 - Critical</SelectItem>
                    <SelectItem value="P1">P1 - High</SelectItem>
                    <SelectItem value="P2">P2 - Medium</SelectItem>
                    <SelectItem value="P3">P3 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Assignment:</label>
                <Select
                  value={assignmentFilter}
                  onValueChange={(value) => setAssignmentFilter(value as any)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="mine">Assigned to Me</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="discrepancies"
                  checked={showOnlyDiscrepancies}
                  onCheckedChange={(checked) => setShowOnlyDiscrepancies(!!checked)}
                />
                <label
                  htmlFor="discrepancies"
                  className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Show Only with Discrepancies
                </label>
              </div>
            </div>
          </Card>

          {/* Extraction List */}
          <Card className="divide-y">
            {isLoading ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : !filteredExtractions || filteredExtractions.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No extractions found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {statusFilter ? `No extractions with status "${statusFilter}"` : "Upload documents to start AI extraction"}
                </p>
              </div>
            ) : (
              filteredExtractions.map((extraction) => {
                const discrepancies = (extraction.discrepancies as any[]) || [];
                const confidence = parseFloat(extraction.confidence as string);
                return (
                  <div
                    key={extraction.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedExtractionIds.has(extraction.id) ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Checkbox */}
                        <Checkbox
                          checked={selectedExtractionIds.has(extraction.id)}
                          onCheckedChange={() => toggleSelection(extraction.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-2">
                          {getStatusIcon(extraction.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              Document ID: {extraction.documentId.slice(0, 12)}...
                            </span>
                            <Badge variant="outline" className={getKindColor(extraction.predictedKind)}>
                              {extraction.predictedKind}
                            </Badge>
                            {discrepancies.length > 0 && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {discrepancies.length} issue{discrepancies.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {new Date(extraction.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Confidence</div>
                          <div className={`text-lg font-bold ${confidence >= 0.8 ? "text-green-600" : confidence >= 0.6 ? "text-yellow-600" : "text-red-600"}`}>
                            {(confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Review →
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

