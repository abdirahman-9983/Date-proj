// src/lib/dateResponseService.js
// ─────────────────────────────────────────────────────────────────────────────
//  Data-access layer — all Supabase queries live here.
//  Components never touch the supabase client directly.
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from './supabase';

/**
 * Save a completed date plan to the `date_responses` table.
 *
 * @param {string}  name
 * @param {object}  datePlan  – the full datePlan state object from App.jsx
 * @returns {{ data, error }}
 */
export async function saveDateResponse(name, datePlan) {
  const payload = {
    name:           name || null,
    accepted:       datePlan.accepted ?? true,
    free_day:       datePlan.freeDay       || null,
    vibe:           datePlan.vibe          || null,
    food:           datePlan.food          || null,
    perfect_date:   datePlan.perfectDate   || null,
    date:           datePlan.date          || null,
    time:           datePlan.time          || null,
    location:       datePlan.location === 'Other'
                      ? (datePlan.customLocation || 'Other')
                      : (datePlan.location || null),
    message:        datePlan.message       || null,
  };

  const { data, error } = await supabase
    .from('date_responses')
    .insert([payload])
    .select()
    .single();

  return { data, error };
}

/**
 * Fetch ALL date responses — used by the admin dashboard.
 * Ordered newest-first.
 *
 * @returns {{ data, error }}
 */
export async function fetchDateResponses() {
  const { data, error } = await supabase
    .from('date_responses')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Fetch a single response by its UUID.
 *
 * @param {string} id
 * @returns {{ data, error }}
 */
export async function fetchDateResponseById(id) {
  const { data, error } = await supabase
    .from('date_responses')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

/**
 * Delete a response by ID (admin only).
 *
 * @param {string} id
 * @returns {{ error }}
 */
export async function deleteDateResponse(id) {
  const { error } = await supabase
    .from('date_responses')
    .delete()
    .eq('id', id);

  return { error };
}
