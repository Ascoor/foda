import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";

interface PlaceholderOptions {
  titleKey: string;
  descriptionKey: string;
  actionLabelKey?: string;
}

export const createPlaceholderPage = ({
  titleKey,
  descriptionKey,
  actionLabelKey = "placeholders.backToDashboard",
}: PlaceholderOptions) => {
  const Placeholder = () => {
    const { t } = useTranslation();

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-4xl flex-col gap-6"
      >
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-primary shadow-lg">
          <h1 className="text-3xl font-semibold">{t(titleKey)}</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary/80">{t(descriptionKey)}</p>
        </section>

        <Card className="overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsla(var(--primary)/0.12),_transparent_70%)]" />
          <CardHeader className="relative">
            <CardTitle className="text-lg">{t("placeholders.comingSoonTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4 text-sm text-muted-foreground">
            <p>{t("placeholders.comingSoonBody")}</p>
            <Button
              asChild
              variant="glass"
              className="inline-flex w-max items-center gap-2 rounded-full px-5 py-2"
            >
              <a href="/dashboard">
                {t(actionLabelKey)}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  Placeholder.displayName = `${titleKey.replace(/\./g, "-")}PlaceholderPage`;
  return Placeholder;
};
