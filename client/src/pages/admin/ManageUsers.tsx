import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Eye, Search, KeyRound, Mail, Phone, Building, MapPin, User as UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User } from "@shared/schema";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ManageUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // --- UPDATED SEARCH LOGIC ---
  const filteredUsers = users.filter(user => {
    const query = searchQuery.trim();
    if (!query) return true; // Show all users if search is empty

    const isNumericQuery = !isNaN(Number(query));
    
    // If the query is a number, ONLY search by User ID.
    if (isNumericQuery) {
        return user.id.toString() === query;
    }
    
    // Otherwise, search by text fields.
    const lowerCaseQuery = query.toLowerCase();
    return (
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery) ||
        user.businessName.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const getUserInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>Manage Users - Fourkids Admin</title>
        <meta name="description" content="Manage user accounts for the Fourkids platform." />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground">View and manage customer accounts.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Name, Email, Business, or User ID..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading users...</div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-dashed border-2 rounded-lg">
              <p className="font-medium">{searchQuery ? "No users match your search." : "No users registered."}</p>
            </div>
          ) : (
            <>
              {/* --- DESKTOP VIEW: TABLE (Hidden on mobile) --- */}
              <div className="hidden md:block border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>{getUserInitials(user.name)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.businessName}</TableCell>
                        <TableCell><Badge variant="outline">#{user.id}</Badge></TableCell>
                        <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setViewUser(user)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* --- MOBILE VIEW: CARDS (Hidden on desktop) --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setViewUser(user)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback>{getUserInitials(user.name)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.businessName}</p>
                          </div>
                        </div>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* User Details Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="text-xl">{getUserInitials(viewUser.name)}</AvatarFallback></Avatar>
                <div>
                  <h3 className="text-xl font-bold">{viewUser.name}</h3>
                  <p className="text-muted-foreground">{viewUser.businessName}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div className="flex items-start gap-3">
                  <KeyRound className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div><p className="font-medium">User ID</p><p className="text-muted-foreground">{viewUser.id}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div><p className="font-medium">Email</p><p className="text-muted-foreground">{viewUser.email}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div><p className="font-medium">Phone</p><p className="text-muted-foreground">{viewUser.phoneNumber}</p></div>
                </div>
                {viewUser.gstin && (
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div><p className="font-medium">GSTIN</p><p className="text-muted-foreground">{viewUser.gstin}</p></div>
                  </div>
                )}
                <div className="sm:col-span-2 flex items-start gap-3">
                   <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                   <div><p className="font-medium">Address</p><p className="text-muted-foreground">{viewUser.address}</p></div>
                </div>
                <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div><p className="font-medium">Role</p><Badge variant={viewUser.role === "admin" ? "default" : "secondary"}>{viewUser.role}</Badge></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageUsers;