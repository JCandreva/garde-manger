'use client';
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Camera, CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Scanner } from "@yudiel/react-qr-scanner"
import { createClient } from "@/utils/supabase/client";
import i18n from "@/lib/i18n";

export default function NewGroceryForm() {
  const user = useAppSelector((state) => state.user.user);
  const supabase = createClient();
  const [presets, setPresets] = useState<{ id: number; name: string; barcode?: string }[]>([]);
  useEffect(() => {
    const fetchPresets = async () => {
      if (!user?.householdID) return; // Ensure household is set before fetching presets
      const { data, error } = await supabase
        .from('preset')
        .select('id, name, barcode')
        .eq('household_id', user.householdID);
      if (error) {
        console.error("Error fetching presets:", error);
      }
      else {
        setPresets(data || []);
      }
    };
    fetchPresets();
  }, [user?.householdID, supabase]);

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [groceryQuantity, setGroceryQuantity] = useState(1);
  const [groceryExpirationDate, setGroceryExpirationDate] = useState(new Date());
  const [groceryBarcode, setGroceryBarcode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPreset === null) return;
    await supabase
      .from('grocery')
      .insert({
        preset: selectedPreset,
        quantity: groceryQuantity,
        expirationdate: groceryExpirationDate,
        household_id: user?.householdID,
      })
    setSelectedPreset(null);
    setGroceryQuantity(1);
    setGroceryExpirationDate(new Date());
  };
  const setBarcode = (barcode: string) => {
    setGroceryBarcode(barcode);
    const preset = presets.find((preset) => preset.barcode === barcode);
    if (preset) {
      setSelectedPreset(preset.id);
    }
  };
  return (
    <Tabs defaultValue="select">
      <TabsList>
        <TabsTrigger value="select">{i18n.t('groceryForm.selectTab')}</TabsTrigger>
        <TabsTrigger value="barcode">{i18n.t('groceryForm.barcodeTab')}</TabsTrigger>
      </TabsList>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[32px]">
      <TabsContent value="select">
          <Select onValueChange={(value) => setSelectedPreset(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={i18n.t('groceryForm.presetPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id.toString()}>
                {preset.name}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
    </TabsContent>
      <TabsContent value="barcode">
                <div className="flex flex-row gap-2">
                  <Input
                    type="text"
                    value={groceryBarcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  placeholder={i18n.t('groceryForm.barcodePlaceholder')}
                  />
                  <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"><Camera /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{i18n.t('groceryForm.scanTitle')}</DialogTitle>
                        <DialogDescription>
                          {i18n.t('groceryForm.scanDescription')}
                        </DialogDescription>
                      </DialogHeader>
                      <Scanner formats={[
                      "qr_code",
                      "micro_qr_code",
                      "rm_qr_code",
                      "maxi_code",
                      "pdf417",
                      "aztec",
                      "data_matrix",
                      "matrix_codes",
                      "dx_film_edge",
                      "databar",
                      "databar_expanded",
                      "codabar",
                      "code_39",
                      "code_93",
                      "code_128",
                      "ean_8",
                      "ean_13",
                      "itf",
                      "linear_codes",
                      "upc_a",
                      "upc_e",
                    ]} onScan={(result) => {setBarcode(result[0].rawValue); setScannerOpen(false)}}/>
                    </DialogContent>
                  </Dialog>
                  <Label>{presets.find(preset => preset.barcode === groceryBarcode)?.name || i18n.t('groceryForm.barcodeMatchNone')}</Label>
                </div>
              
             
        </TabsContent>
         <Input
                type="number"
                value={groceryQuantity}
                onChange={(e) => setGroceryQuantity(Number(e.target.value))}
           placeholder={i18n.t('groceryForm.quantityPlaceholder')}
              />
              <Input
                type="date"
                value={new Date(groceryExpirationDate).toISOString().split("T")[0]}
                onChange={(e) => setGroceryExpirationDate(new Date(e.target.value))}
           placeholder={i18n.t('groceryForm.expirationPlaceholder')}
              />
              <DialogFooter>
              <DialogClose asChild>
              <Button type="submit" className="w-full">
                <CirclePlus /> {i18n.t('groceryForm.submit')}
              </Button>
              </DialogClose>
              </DialogFooter>
            </form>

    </Tabs>
  );
}