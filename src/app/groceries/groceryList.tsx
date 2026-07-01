'use client';

import { useAppSelector } from "@/lib/hooks";
import { DataTable } from '@/components/data-table';
import { GroceryOnTable, columns } from './columns';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { Database } from "@/database.types";
import i18n from "@/lib/i18n";
type preset = Database['public']['Tables']['preset']['Row']
type grocery = Database['public']['Tables']['grocery']['Row']

export default function GroceryList() {
    const supabase = createClient();
    const user = useAppSelector((state) => state.user.user);
    const [data, setData] = useState<GroceryOnTable[]>([]);

    

    useEffect(() => {
        const handleRemove = async (id: number) => {
            const { error } = await supabase
                .from('grocery')
                .delete()
                .eq('id', id)
            if (error) {
                console.error("Error removing grocery:", error);
                return;
            }
            setData(prevData => prevData.filter(item => item.id !== id));
    };
    const handleSetQuantity = async (id: number, quantity: number) => {
        await supabase
            .from('grocery')
            .update({ quantity })
            .eq('id', id)
            .then(({ error }) => {
                if (error) {
                    console.error("Error updating grocery quantity:", error);
                }
            });
    };
    async function fetchGroceries() {
            if (!user?.householdID) {
                setData([]);
                return;
            }
      const { data: groceries, error } = await supabase
                .from('grocery')
                .select('*')
                .eq('household_id', user?.householdID)
            if (error) {
                console.error("Error fetching groceries:", error);
                setData([]);
                return;
            }
            return groceries;
        }
        async function fetchData() {
        const groceries = await fetchGroceries();

            if (!groceries || groceries.length === 0) {
                setData([]);
                return;
            }
            const presetIds = groceries.map(g => g.preset);
            const { data: presets, error } = await supabase
                .from('preset')
                .select('*')
                .in('id', presetIds)
                .eq('household_id', user?.householdID);

            if (error) {
                console.error("Error fetching presets:", error);
                setData([]);
                return;
            }

            const presetMap = new Map<number, preset>();
            presets?.forEach((preset: preset) => {
                presetMap.set(preset.id, preset);
            });
            
            const tableData: GroceryOnTable[] = groceries.map((grocery: grocery) => {
                const preset = presetMap.get(grocery.preset || 0);
                return {
                    id: grocery.id ?? 0,
                    name: preset?.name ?? "",
                    quantity: grocery.quantity ?? 0,
                    unit: preset?.unit ?? "",
                    expirationDate:  Date.parse(grocery.expirationdate ?? ""),
                    icon: preset?.image ?? undefined,
                    deleteFunction: () => handleRemove(grocery.id),
                    setQuantityFunction: (quantity: number) => handleSetQuantity(grocery.id, quantity),
                };
            });
            setData(tableData);
        }
        if (user?.householdID) {
            fetchData();
        } else {
            setData([]);
        }
        const channel = supabase.channel('table-db-changes').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'grocery' },
            async () => {
                await fetchData();
            }
        ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.householdID, supabase]);
    return (
        <div>
        <DataTable
        columns={columns}
        data={data}
        />
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="destructive">
                    <AlertTriangle />{i18n.t('groceries.removeExpiredButton')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{i18n.t('groceries.removeExpiredTitle')}</DialogTitle>
                    <DialogDescription>
                        {i18n.t('groceries.removeExpiredDescription')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="destructive" onClick={async () => await supabase.rpc('delete_expired_groceries', {})}>
                        {i18n.t('groceries.removeExpiredAction')}
                    </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="ghost">
                            {i18n.t('common.cancel')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
                  <Button variant="ghost" className="text-white"
          onClick={() => {
            const background = document.querySelector("body");
            if (background) {
              background.style.backgroundImage = "url('https://v5.airtableusercontent.com/v3/u/41/41/1747620000000/mAG0SwwJ311vJ_DN3a2nJA/B9LFi6giiwfiRhRNrkFG8I9QB04FvrQ7UQLeCt3ekjhxpLGcQqP2MlSi8hgKvFmcZSei8D_wjRtAW_ZyrV9Dvttm7_wdlP3VbN7JzLvf8BfhAAXzQJmcnOZg__3Z70yACOBlplnI0iXmzHRfhuxMTIdlzdJ8t3BEdfu0m71eSVY/Sf6oCoKe1JUvJQIIXECCiXzSiJuGbBK980C9pbid1Ao')";
            }

          }}
          >
            {i18n.t('groceries.sunsetNeighborhood')}
          </Button>
        </div>
    );
    }