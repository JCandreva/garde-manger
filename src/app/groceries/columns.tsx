'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CookingPot, MoreHorizontal, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import i18n from '@/lib/i18n';

export type GroceryOnTable = {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    expirationDate: number;
    icon?: string;
    deleteFunction: () => void;
    setQuantityFunction: (quantity: number) => void;
}

export const columns: ColumnDef<GroceryOnTable>[] = [
    {
        id: 'expired',
        cell: ({ row }) => {
            const expires: number = row.getValue('expirationDate');
            if (expires < Date.now()) {
                return <Badge variant="destructive"><TriangleAlert />{i18n.t('groceryColumns.expired')}</Badge>;
            }
            const daysLeft = Math.ceil((expires - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 3) {
                return <Badge className="bg-amber-300 text-black"><TriangleAlert />{i18n.t('groceryColumns.daysLeft', { count: daysLeft })}</Badge>;
            }

        }
    },
    {
        accessorKey: 'icon',
        header: i18n.t('groceryColumns.icon'),
        cell: ({ row }) => {
            const icon = row.getValue('icon');
            return typeof icon === 'string' && icon
                ? <Image src={icon} alt="icon" className="h-8 w-8 rounded-full" width={8} height={8} />
                : <CookingPot />;
        }
    },
    {
        accessorKey: 'name',
        enableHiding: false,
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >{i18n.t('groceryColumns.name')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
            )
        },
    },
    {
        accessorKey: 'quantity',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >{i18n.t('groceryColumns.quantity')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
            )
        },
    },
    {
        accessorKey: 'unit',
        header: i18n.t('groceryColumns.unit'),
    },
    {
        accessorKey: 'expirationDate',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >{i18n.t('groceryColumns.expires')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('expirationDate'));
            return date.toLocaleDateString();
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const { deleteFunction, setQuantityFunction, quantity, name } = row.original;
            return (
                <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{i18n.t('groceryColumns.openMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => deleteFunction()}
                            >
                                {i18n.t('groceryColumns.delete')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem

                                onClick={() => setQuantityFunction(quantity + 1)}
                            >
                                                {i18n.t('groceryColumns.increaseQuantity')}
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                >
                                                    {i18n.t('groceryColumns.setQuantity')}
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem
                                onClick={() => setQuantityFunction(quantity - 1)}
                            >
                                                {i18n.t('groceryColumns.decreaseQuantity')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                                                <DialogContent>
                                <DialogHeader>
                                                <DialogTitle>{i18n.t('groceryColumns.newQuantity')}</DialogTitle>
                                <DialogDescription>
                                                    {i18n.t('groceryColumns.newQuantityDescription', { name })}
                                </DialogDescription>
                                </DialogHeader>
                                <Input id="newQuantity" type="number" value={quantity} onChange={(e) => setQuantityFunction(parseInt(e.target.value))}/>
                                <DialogClose asChild>
                                                <Button type="submit">{i18n.t('common.save')}</Button>
                                </DialogClose>
                            </DialogContent>
                                </Dialog>

        )}
    }
];

