'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/hooks";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import i18n from "@/lib/i18n";

export default function CreateInviteCodeComponent() {
    const supabase = createClient();
    const user = useAppSelector((state) => state.user.user);
    const [isOwner, setIsOwner] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    useEffect(() => {
        const checkOwnership = async () => {
            if (!user?.householdID) {
                setIsOwner(false);
                return;
            }
            const { data, error } = await supabase
                .rpc('is_user_owner', {})
            if (error) {
                console.error("Error checking ownership:", error);
                setIsOwner(false);
            } else {
                setIsOwner(data || false);
            }
        }
        checkOwnership();
        
    }, [supabase, user]);
        const handleCreateInviteCode = async () => {
        if (!inviteCode) {
            alert(i18n.t('inviteCode.enterCodeAlert'));
            return;
        }
        const { error } = await supabase
            .from('household_invite_codes')
            .insert([{ code: inviteCode, household_id: user?.householdID }]);
        if (error) {
            alert(i18n.t('inviteCode.createError', { message: error.message }));
            setInviteCode("");
        } else {
            alert(i18n.t('inviteCode.createSuccess'));
            setInviteCode("");
        }
    };
    const handleQuitHousehold = async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) {
            alert(i18n.t('inviteCode.loginRequired'));
            return;
        }
        const { error } = await supabase
            .from('household_members')
            .delete()
            .eq('user_id', userId)
        if (error) {
            alert(i18n.t('inviteCode.quitError', { message: error.message }));
            return;
        }
        alert(i18n.t('inviteCode.quitSuccess'));
        window.location.reload();
    }
    if (!isOwner) {
        return(
            <Button variant="destructive" onClick={handleQuitHousehold}>{i18n.t('inviteCode.quitButton')}</Button>
        );
    }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-2xl font-bold">{i18n.t('inviteCode.title')}</h1>
            <div>
            <Label className="text-lg font-semibold">{i18n.t('inviteCode.label')}</Label>
            <Input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder={i18n.t('inviteCode.placeholder')} className="w-full max-w-xs" />
            <Button onClick={handleCreateInviteCode} className="mt-4" disabled={!inviteCode}>
                {i18n.t('inviteCode.createButton')}
            </Button>
            </div>
        </div>
    );
}