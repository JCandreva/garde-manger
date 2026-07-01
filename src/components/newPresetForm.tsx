'use client';
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Camera, CirclePlus } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { createClient } from "@/utils/supabase/client";
import i18n from "@/lib/i18n";

export default function NewGroceryForm() {
  const [groceryName, setGroceryName] = useState("");
  const [groceryUnit, setGroceryUnit] = useState("");
  const [groceryBarcode, setGroceryBarcode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [groceryImage, setGroceryImage] = useState<File | null>(null);
  const user = useAppSelector((state) => state.user.user);
  const supabase = createClient();
  const addPresettoDatabase = async (preset: { name: string; unit: string; barcode?: string; image?: string }) => {
    if (!user?.householdID) return; // Ensure household is set before adding preset
    const { error } = await supabase
      .from('preset')
      .insert({
        name: preset.name,
        unit: preset.unit,
        barcode: preset.barcode,
        image: preset.image,
        household_id: user.householdID,
      });
    if (error) {
      console.error("Error adding preset to database:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const base64 = groceryImage ? await toBase64(groceryImage as File) : null;
    if (groceryName.trim() === "") return;
    addPresettoDatabase({
        name: groceryName,
        unit: groceryUnit,
        barcode: groceryBarcode.trim(),
        image: base64 as string,
      });
    setGroceryName("");
    setGroceryUnit("");
    setGroceryBarcode("");
    setGroceryImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
      <Input
        type="text"
        value={groceryName}
        onChange={(e) => setGroceryName(e.target.value)}
        placeholder={i18n.t('presetForm.namePlaceholder')}
      />
      <Input
        type="text"
        value={groceryUnit}
        onChange={(e) => setGroceryUnit(e.target.value)}
        placeholder={i18n.t('presetForm.unitPlaceholder')}
      />
    <div className="flex flex-row gap-2">
      <Input
        type="text"
        value={groceryBarcode}
        onChange={(e) => setGroceryBarcode(e.target.value)}
        placeholder={i18n.t('presetForm.barcodePlaceholder')}
      />
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon"><Camera /></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.t('presetForm.scanTitle')}</DialogTitle>
            <DialogDescription>
              {i18n.t('presetForm.scanDescription')}
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
        ]} onScan={(result) => {setGroceryBarcode(result[0].rawValue); setScannerOpen(false)}}/>
        </DialogContent>
      </Dialog>
      </div>
      <div>
      <Label>{i18n.t('presetForm.imageLabel')}</Label>
      <Input type="file" onChange={(e) => setGroceryImage(e.target.files ? e.target.files[0] : null)} />
      </div>
      <DialogFooter>
      <DialogClose asChild className="w-full">
      <Button type="submit">
        <CirclePlus /> {i18n.t('presetForm.submit')}
      </Button>
      </DialogClose>
      </DialogFooter>
    </form>
  );
}
const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};