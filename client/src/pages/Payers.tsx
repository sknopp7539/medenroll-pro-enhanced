import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Building2, Plus, Pencil, Trash2, X, Users } from "lucide-react";
import { BulkEnrollDialog } from "../components/BulkEnrollDialog";

type PayerType = "commercial" | "medicare" | "medicaid" | "other";

interface PayerFormData {
  name: string;
  type: PayerType;
  productLines: string[];
}

export default function Payers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayer, setEditingPayer] = useState<any>(null);
  const [formData, setFormData] = useState<PayerFormData>({
    name: "",
    type: "commercial",
    productLines: [],
  });
  const [newProductLine, setNewProductLine] = useState("");
  const [bulkEnrollDialogOpen, setBulkEnrollDialogOpen] = useState(false);
  const [selectedPayerForEnroll, setSelectedPayerForEnroll] = useState<{id: string; name: string} | null>(null);

  const { data: payers, refetch } = trpc.payers.list.useQuery();
  const createMutation = trpc.payers.create.useMutation({
    onSuccess: () => {
      refetch();
      closeDialog();
    },
  });
  const updateMutation = trpc.payers.update.useMutation({
    onSuccess: () => {
      refetch();
      closeDialog();
    },
  });
  const deleteMutation = trpc.payers.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const openDialog = (payer?: any) => {
    if (payer) {
      setEditingPayer(payer);
      setFormData({
        name: payer.name,
        type: payer.type,
        productLines: payer.productLines || [],
      });
    } else {
      setEditingPayer(null);
      setFormData({
        name: "",
        type: "commercial",
        productLines: [],
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPayer(null);
    setNewProductLine("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayer) {
      updateMutation.mutate({
        id: editingPayer.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this payer?")) {
      deleteMutation.mutate({ id });
    }
  };

  const addProductLine = () => {
    if (newProductLine.trim()) {
      setFormData({
        ...formData,
        productLines: [...formData.productLines, newProductLine.trim()],
      });
      setNewProductLine("");
    }
  };

  const removeProductLine = (index: number) => {
    setFormData({
      ...formData,
      productLines: formData.productLines.filter((_, i) => i !== index),
    });
  };

  const getPayerTypeColor = (type: PayerType) => {
    switch (type) {
      case "commercial":
        return "bg-blue-100 text-blue-800";
      case "medicare":
        return "bg-red-100 text-red-800";
      case "medicaid":
        return "bg-green-100 text-green-800";
      case "other":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPayerTypeLabel = (type: PayerType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Payers</h1>
            <p className="text-gray-600 mt-1">
              Manage insurance companies and product lines
            </p>
          </div>
          <Button onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payers?.map((payer) => (
            <Card key={payer.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg">{payer.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(payer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(payer.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedPayerForEnroll({ id: payer.id, name: payer.name });
                      setBulkEnrollDialogOpen(true);
                    }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Enroll Providers
                  </Button>
                  <div>
                    <Badge className={getPayerTypeColor(payer.type)}>
                      {getPayerTypeLabel(payer.type)}
                    </Badge>
                  </div>
                  {payer.productLines && payer.productLines.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Product Lines:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {payer.productLines.map((line: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {line}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {payers?.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payers yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first insurance payer
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payer
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPayer ? "Edit Payer" : "Add New Payer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Payer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Blue Cross Blue Shield"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Payer Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: PayerType) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="medicare">Medicare</SelectItem>
                      <SelectItem value="medicaid">Medicaid</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Product Lines</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newProductLine}
                      onChange={(e) => setNewProductLine(e.target.value)}
                      placeholder="e.g., PPO, HMO, EPO"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addProductLine();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addProductLine}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.productLines.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.productLines.map((line, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {line}
                          <button
                            type="button"
                            onClick={() => removeProductLine(index)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingPayer ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {selectedPayerForEnroll && (
          <BulkEnrollDialog
            open={bulkEnrollDialogOpen}
            onOpenChange={setBulkEnrollDialogOpen}
            payerId={selectedPayerForEnroll.id}
            payerName={selectedPayerForEnroll.name}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

