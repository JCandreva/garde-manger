import HouseholdSetter from "@/components/householdSetter";
import CreateInviteCodeComponent from "./createInviteCode";
import MemberList from "./memberList";
import JoinHouseholdComponent from "./joinHousehold";
import i18n from "@/lib/i18n";

export default function HouseholdPage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <HouseholdSetter />
        <h2>{i18n.t('household.title')}</h2>
        <p>{i18n.t('household.description')}</p>
            <div className="flex flex-row gap-4">
            <CreateInviteCodeComponent />
            <JoinHouseholdComponent />
            </div>
            <MemberList />
        </main>
        </div>
    )
    }

export const metadata = {
    title: `${i18n.t('brand.name')} | ${i18n.t('nav.household')}`,
    description: i18n.t('metadata.household')
};