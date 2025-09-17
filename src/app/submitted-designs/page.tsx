
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Search, Filter } from 'lucide-react';
import mockSubmissions from '@/lib/submitted-designs.json';
import { CardDetails } from '@/components/design/card-data';
import { useToast } from '@/hooks/use-toast';
import SubmissionCardPreview from './SubmissionCardPreview';

export type Submission = {
    orderId: string;
    customerName: string;
    customerContact: string;
    submissionDate: string;
    status: 'Pending' | 'In Progress' | 'Finalized' | 'Exported';
    cardDetails: CardDetails;
};

type Status = Submission['status'];


export default function SubmittedDesigns() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
    const { toast } = useToast();

    useEffect(() => {
        // In a real app, this would be an API call.
        // For this demo, we'll use a local copy that can be mutated.
        setSubmissions(mockSubmissions as Submission[]);
        setIsMounted(true);
    }, []);

    useEffect(() => {
        let filtered = submissions;

        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.cardDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            filtered = filtered.filter(s => s.status === statusFilter);
        }

        setFilteredSubmissions(filtered);
    }, [searchTerm, statusFilter, submissions]);

    const handleStatusChange = (orderId: string, newStatus: Status) => {
        setSubmissions(prev =>
            prev.map(s => (s.orderId === orderId ? { ...s, status: newStatus } : s))
        );
        toast({
            title: 'Status Updated',
            description: `Order ${orderId} is now "${newStatus}".`,
        });
    };

    const getStatusVariant = (status: Status) => {
        switch (status) {
            case 'Pending':
                return 'outline';
            case 'In Progress':
                return 'secondary';
            case 'Finalized':
                return 'default';
            case 'Exported':
                return 'destructive'; // Using destructive to be visible, can be changed
            default:
                return 'outline';
        }
    };

    if (!isMounted) {
        return <div className="p-6">Loading submissions...</div>;
    }
    
    return (
        <div className="flex flex-col h-screen">
            <header className="flex flex-col items-start justify-between gap-4 p-6 border-b sm:flex-row sm:items-center shrink-0 border-border">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Submitted Designs</h1>
                    <p className="text-muted-foreground">
                        Review and manage customer card design submissions.
                    </p>
                </div>
            </header>

            <div className="flex flex-col gap-4 p-6 border-b sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Order ID, Customer, or Card Name..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className='w-full sm:w-auto'>
                                <Filter className="w-4 h-4 mr-2" />
                                Filter by Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | 'All')}>
                                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="In Progress">In Progress</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Finalized">Finalized</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Exported">Exported</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <main className="flex-1 p-6 overflow-auto">
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Preview</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Template/Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map(submission => (
                                    <TableRow key={submission.orderId}>
                                        <TableCell className="font-medium">{submission.orderId}</TableCell>
                                        <TableCell>
                                            <SubmissionCardPreview cardDetails={submission.cardDetails} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{submission.customerName}</div>
                                            <div className="text-sm text-muted-foreground">{submission.customerContact}</div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(submission.submissionDate), 'PPP')}
                                        </TableCell>
                                        <TableCell>{submission.cardDetails.category}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(submission.status)}>{submission.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/design?id=${submission.cardDetails.id}`}>
                                                            <Pencil className="w-4 h-4 mr-2" />
                                                            Review & Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuRadioGroup value={submission.status} onValueChange={(v) => handleStatusChange(submission.orderId, v as Status)}>
                                                        <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="In Progress">In Progress</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="Finalized">Finalized</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="Exported">Exported</DropdownMenuRadioItem>
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
}
