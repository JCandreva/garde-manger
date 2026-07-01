import HouseholdSetter from "@/components/householdSetter";
import NewPresetForm from "@/components/newPresetForm";
import PresetList from "@/app/presets/presetList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import i18n from "@/lib/i18n";

export default function Presets() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h2>{i18n.t('nav.presets')}</h2>
        <HouseholdSetter />
        <PresetList />
          <Dialog>
            <DialogTrigger asChild>
              <Button><CirclePlus />{i18n.t('common.add')}</Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{i18n.t('presetForm.title')}</DialogTitle>
                <DialogDescription>
                  {i18n.t('presetForm.description')}
                </DialogDescription>
              </DialogHeader>
              <NewPresetForm />
              </DialogContent>
          </Dialog>
        </main>
        </div>
    );
    }

export const metadata = {
    title: `${i18n.t('brand.name')} | ${i18n.t('nav.presets')}`,
    description: i18n.t('metadata.presets')
};