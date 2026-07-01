'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/lib/hooks";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import i18n from "@/lib/i18n";

export default function JoinHouseholdComponent(){
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
    const handleJoinHousehold = async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) {
        alert(i18n.t('joinHousehold.loginRequired'));
            return;
        }
        if (!inviteCode) {
        alert(i18n.t('joinHousehold.enterCodeAlert'));
            return;
        }
        const { data, error } = await supabase
            .from('household_invite_codes')
            .select('*')
            .eq('code', inviteCode)
            .single();
        if (error) {
            alert(i18n.t('joinHousehold.joinError', { message: error.message }));
            setInviteCode("");
            return;
        }
        if (!data) {
            alert(i18n.t('joinHousehold.invalidCode'));
            setInviteCode("");
            return;
        }
        const { error: joinError } = await supabase
        .rpc('insert_household_member', {
            _user_id: userId,
            _household_id: data.household_id,
            _role: 'member',
            _used_join_code: inviteCode
        })
        if (joinError) {
            alert(i18n.t('joinHousehold.joinError', { message: joinError.message }));
            setInviteCode("");
            return;
        }
            alert(i18n.t('joinHousehold.success'));
            setInviteCode("");  
            window.location.reload();
     
    }
    if (!isOwner) {
        return;
    }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h2 className="text-2xl font-bold">{i18n.t('joinHousehold.title')}</h2>
            <div>
                <Label className="text-lg font-semibold">{i18n.t('joinHousehold.label')}</Label>
                <Input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
                <Button onClick={handleJoinHousehold}>{i18n.t('joinHousehold.joinButton')}</Button>
            </div>
        </div>
    );
}