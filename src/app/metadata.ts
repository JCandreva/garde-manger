import type { Metadata } from "next";
import i18n from "@/lib/i18n";

export const metadata: Metadata = {
  title: i18n.t('home.title'),
  description: i18n.t('home.description'),
};