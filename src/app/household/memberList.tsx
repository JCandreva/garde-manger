'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '@/database.types';
import type { PostgrestError } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/lib/hooks';
import i18n from '@/lib/i18n';

export default function MemberList() {
    // Adjust the type below to match your actual row type
    type HouseholdMember = Database['public']['Tables']['household_members']['Row'];
    const user = useAppSelector((state) => state.user.user);
    const [members, setMembers] = useState<HouseholdMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PostgrestError>();
    const supabase = createClient();
    useEffect(() => {
        const fetchMembers = async () => {
            if (!user?.householdID) {
                setMembers([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            const { data, error } = await supabase
                .from('household_members')
                .select('*')
                .eq('household_id', user?.householdID);
            if (error) {
                console.error('Error fetching household members:', error);
                setError(error);
                setMembers([]);
            }
            else {
                setMembers(data || []);
            }
            setLoading(false);
        };
        fetchMembers();
    }, [supabase, user]);
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h2 className="text-2xl font-bold">{i18n.t('household.membersTitle')}</h2>
            {loading ? <Skeleton className="w-full h-10" /> : 
                members.map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                        <h3>{member.user_id}</h3>
                        <p>{error ? error.message : ""}</p>
                    </div>
                ))}
        </div>
    );
}