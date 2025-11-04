import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/shared/ui/dialog";
import { Button } from "@/infrastructure/shared/ui/button";
import { Input } from "@/infrastructure/shared/ui/input";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";

interface AssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onAssign: (selectedIds: string[]) => void;
  items?: Array<{
    id: string;
    name: string;
    role?: string;
    status?: string;
  }>;
  multiSelect?: boolean;
}

export const AssignDialog = ({
  isOpen,
  onClose,
  title,
  onAssign,
  items = [],
  multiSelect = false,
}: AssignDialogProps) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    if (multiSelect) {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter((selectedId) => selectedId !== id)
          : [...prev, id],
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleAssign = () => {
    onAssign(selectedIds);
    setSelectedIds([]);
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${direction === "rtl" ? "right-3" : "left-3"}`}
            />
            <Input
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`glass border-white/20 ${direction === "rtl" ? "pr-10" : "pl-10"}`}
            />
          </div>

          {/* Selected items */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                {selectedIds.map((id) => {
                  const item = items.find((i) => i.id === id);
                  return item ? (
                    <Badge
                      key={id}
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/30"
                    >
                      {item.name}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                        onClick={() => handleSelect(id)}
                      />
                    </Badge>
                  ) : null;
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Items list */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(item.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer
                      transition-all duration-200 border
                      ${
                        isSelected
                          ? "bg-primary/10 border-primary/30 shadow-glow"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center
                      ${
                        isSelected
                          ? "from-primary to-primary-glow shadow-glow"
                          : "from-muted/20 to-muted/10"
                      }
                    `}
                    >
                      <User
                        className={`h-5 w-5 ${isSelected ? "text-white" : "text-muted-foreground"}`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {item.name}
                      </div>
                      {item.role && (
                        <div className="text-sm text-muted-foreground">
                          {item.role}
                        </div>
                      )}
                    </div>

                    {item.status && (
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    )}

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No items found
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 glass-button"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={selectedIds.length === 0}
              className="flex-1 bg-gradient-primary text-white shadow-glow disabled:opacity-50 disabled:shadow-none"
            >
              {t("common.confirm")} ({selectedIds.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
