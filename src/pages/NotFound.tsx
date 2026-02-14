import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent transition-colors duration-300">
      <GlobalHeader className="absolute top-6 right-6" authenticated={false} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">{t("pageNotFound")}</p>
        <Button asChild>
          <a href="/" className="text-primary-foreground">
            {t("returnHome")}
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
