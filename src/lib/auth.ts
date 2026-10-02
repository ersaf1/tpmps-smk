import 'server-only';

import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import type { AuthProfile, DocumentRole } from '@/types/documents';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  position_name: string;
  role: DocumentRole;
  unit_id: string | null;
  must_change_password: boolean;
  unit: { name: string } | { name: string }[] | null;
}

function relationName(value: ProfileRow['unit']) {
  if (Array.isArray(value)) return value[0]?.name ?? null;
  return value?.name ?? null;
}

export async function getCurrentProfile(): Promise<AuthProfile | null> {
  const supabase = await serverClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, position_name, role, unit_id, must_change_password, unit:document_units!unit_id(name)')
    .eq('id', authData.user.id)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  const row = data as unknown as ProfileRow;
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    positionName: row.position_name,
    role: row.role,
    unitId: row.unit_id,
    unitName: relationName(row.unit),
    mustChangePassword: row.must_change_password
  };
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  return profile;
}
