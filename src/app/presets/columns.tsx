import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CookingPot, Trash } from "lucide-react";
import Image from "next/image";
import Barcode from "react-barcode";
import i18n from "@/lib/i18n";

export type PresetOnTable = {
    id: number;
    name: string;
    image?: string;
    unit: string;
    barcode: string;
    deleteFunction: () => void;

}

export const columns: ColumnDef<PresetOnTable>[] = [
    {
        accessorKey: 'image',
        header: i18n.t('presetColumns.image'),
        cell: ({ row }) => {
            const image = row.getValue('image');
            return typeof image === 'string' && image
                ? <Image src={image} width={8} height={8} alt="icon" className="h-8 w-8 rounded-full" />
                : <CookingPot />;
        }
    },
    {
        accessorKey: 'name',
        header: i18n.t('presetColumns.name'),
    },
    {
        accessorKey: 'unit',
        header: i18n.t('presetColumns.unit'),
    },
    {
        accessorKey: 'barcode',
        header: i18n.t('presetColumns.barcode'),
        cell: ({ row }) => (
            row.getValue('barcode') && row.getValue('barcode') !== ''
                ? <Barcode fontSize={12} height={25} width={1} margin={1} value={row.getValue('barcode')} />
                : i18n.t('presetColumns.noBarcode')
        )
    },
    {
        id: 'delete',
        cell: ({ row }) => (
                <Button onClick={() => row.original.deleteFunction()} variant="destructive" size="icon">
                    <Trash />
                </Button>
        )
    }
];