'use client'
import i18n from "@/lib/i18n";

export default function ErrorPage() {
  return <p>{i18n.t('errors.generic')}</p>
}