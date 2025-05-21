
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface SyncButtonProps {
  onSync: () => void;
  isSyncing: boolean;
}

const SyncButton: React.FC<SyncButtonProps> = ({ onSync, isSyncing }) => {
  return (
    <Button 
      variant="outline"
      onClick={onSync}
      disabled={isSyncing}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? "Syncing..." : "Sync with Go High Level"}
    </Button>
  );
};

export default SyncButton;
