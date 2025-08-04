import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Eye, Edit, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableSkeleton, EmptyState } from '@/components/ui/DataTableSkeleton';
import { Campaign } from './types';
import { fetchCampaigns, deleteCampaign, sendCampaign } from './api';
import { CampaignForm } from './CampaignForm';
import { CampaignDetails } from './CampaignDetails';
// Utility for safe array mapping
function safeArray<T = any>(arr: any): T[] {
  return Array.isArray(arr) ? arr : [];
}

export const CampaignsList = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<Campaign | null>(null);

 
  const load = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const data = await fetchCampaigns();
      setItems(data);
    } catch (e) {
      setIsError(true);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => { load(); }, [load]);

  const handleAdd = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (c: Campaign) => { setSelected(c); setShowForm(true); };
  const handleView = (c: Campaign) => { setSelected(c); setShowDetails(true); };
  const handleSend = async (c: Campaign) => { await sendCampaign(c.id); load(); };

  // Always use a safe array for rendering
  const safeItems = safeArray(items);

  if (isLoading) {
    return <DataTableSkeleton rows={5} columns={5} />;
  }
  if (isError) {
    return (
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <div className="text-destructive text-lg font-bold">
          {t('common.error_loading_data') || "Error loading data"}
        </div>
        <Button onClick={load} className="glass-button bg-gradient-primary text-white">
          {t('common.retry') || "Retry"}
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">{t('campaigns.title')}</h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />{t('campaigns.add_campaign')}
        </Button>
      </div>

      <div className="overflow-x-auto glass-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">{t('campaigns.campaign_name')}</th>
              <th className="px-4 py-2">{t('campaigns.sent')}</th>
              <th className="px-4 py-2">{t('campaigns.delivered')}</th>
              <th className="px-4 py-2">{t('common.created_at') || 'Created'}</th>
              <th className="px-4 py-2">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {safeItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  <EmptyState
                    title={t('common.no_data')}
                    description={t('campaigns.no_campaigns') || ""}
                  />
                </td>
              </tr>
            ) : (
              safeItems.map((c) => (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.sent}</td>
                  <td className="px-4 py-2">{c.delivered}</td>
                  <td className="px-4 py-2">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleView(c)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(c)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleSend(c)}>
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCampaign(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CampaignForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setSelected(null); }}
        onSuccess={() => { setShowForm(false); load(); }}
        campaign={selected}
      />
      <CampaignDetails
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelected(null); }}
        campaign={selected}
        onEdit={(c) => { setShowDetails(false); handleEdit(c); }}
      />
    </div>
  );
};
