import { redirect } from "next/navigation";
import i18n from "@/lib/i18n";

export default function Home() {
    redirect('/groceries');
    return null;
}
export const metadata = {
    title: i18n.t('home.title'),
    description: i18n.t('home.description')
};