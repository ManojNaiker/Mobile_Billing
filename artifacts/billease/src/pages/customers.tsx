import React, { useState } from "react";
import { INDIAN_STATES } from "@/lib/indian-utils";
import { useListCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, getListCustomersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { StateCombobox } from "@/components/state-combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").or(z.literal("")).optional(),
  state_code: z.string().optional(),
  state_name: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function Customers() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: customers, isLoading } = useListCustomers({ search });
  
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      address: "",
      gstin: "",
      state_code: "",
      state_name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    // If state code is provided, set state name automatically
    if (data.state_code) {
      const state = INDIAN_STATES.find(s => s.code === data.state_code);
      if (state) {
        data.state_name = state.name;
      }
    }

    if (editingId) {
      updateCustomer.mutate({ id: editingId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          toast({ title: "Customer updated successfully" });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Failed to update customer", variant: "destructive" });
        }
      });
    } else {
      createCustomer.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          toast({ title: "Customer created successfully" });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Failed to create customer", variant: "destructive" });
        }
      });
    }
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer.id);
    form.reset({
      name: customer.name,
      address: customer.address,
      gstin: customer.gstin || "",
      state_code: customer.state_code || "",
      state_name: customer.state_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      address: "",
      gstin: "",
      state_code: "",
      state_name: "",
      email: "",
      phone: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteCustomer.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
        toast({ title: "Customer deleted successfully" });
      },
      onError: () => {
        toast({ title: "Failed to delete customer", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your client list and details.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Customer" : "Add New Customer"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Company or Individual Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gstin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GSTIN</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 29ABCDE1234F1Z5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <StateCombobox
                            value={field.value || ""}
                            onSelect={(code, name) => {
                              field.onChange(code);
                              form.setValue("state_name", name);
                            }}
                            placeholder="Type state name..."
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createCustomer.isPending || updateCustomer.isPending}>
                      {createCustomer.isPending || updateCustomer.isPending ? "Saving..." : "Save Customer"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-full h-12" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No customers found. Click 'Add Customer' to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.gstin || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                      <TableCell>{customer.state_name || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.email && <div>{customer.email}</div>}
                          {customer.phone && <div className="text-muted-foreground">{customer.phone}</div>}
                          {!customer.email && !customer.phone && <span className="text-muted-foreground italic">N/A</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {customer.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(customer.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}