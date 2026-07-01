import ExpiryCalenderComponent from "./calendar";
import i18n from "@/lib/i18n";

export default function ExpiryCalendarPage() {

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{i18n.t('expiryCalendar.title')}</h1>
            <p className="text-muted-foreground">{i18n.t('expiryCalendar.description')}</p>
            <ExpiryCalenderComponent />
        </div>
    );
}
export const metadata = {
    title: `${i18n.t('brand.name')} | ${i18n.t('nav.expiryCalendar')}`,
    description: i18n.t('metadata.expiryCalendar')
};