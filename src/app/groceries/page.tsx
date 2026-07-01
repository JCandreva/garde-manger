import NewGroceryForm from "@/components/newGroceryForm";
import NotificationManager from "@/components/notifcationManager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogDescription, DialogTitle  } from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import GroceryList from "./groceryList";
import HouseholdSetter from "@/components/householdSetter";
import i18n from "@/lib/i18n";


export default function Groceries() {

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h2>{i18n.t('groceries.title')}</h2>
          <HouseholdSetter />
          <GroceryList />
          <Dialog>
            <DialogTrigger asChild>
            <Button><CirclePlus />{i18n.t('common.add')}</Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
              <DialogTitle>{i18n.t('groceries.addDialogTitle')}</DialogTitle>
                <DialogDescription>
                {i18n.t('groceries.addDialogDescription')}
                </DialogDescription>
              </DialogHeader>
              <NewGroceryForm />
              </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
            <Button>{i18n.t('groceries.notificationsButton')}</Button>
              </DialogTrigger>
          <DialogContent>
              <DialogHeader>
              <DialogTitle>{i18n.t('groceries.notificationsDialogTitle')}</DialogTitle>
                <DialogDescription>
                {i18n.t('groceries.notificationsDialogDescription')}
                </DialogDescription>
              </DialogHeader>
              <NotificationManager />
              </DialogContent>
          </Dialog>

        </main>
      </div>
  );
}
export const metadata = {
  title: `${i18n.t('brand.name')} | ${i18n.t('groceries.title')}`,
  description: i18n.t('metadata.groceries')
};
