import React, { useState } from 'react';
import { UnifiedDashboard } from './pages/UnifiedDashboard';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { ToastContainer, ToastMessage, ToastType } from './components/common/Toast';

export function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);

  const addToast = (type: ToastType, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#0F172A] font-sans antialiased selection:bg-[#EBF4FF] selection:text-[#0F6FBF]">
      {/* Unified Single-Dashboard Clinical Workstation */}
      <UnifiedDashboard
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onToast={addToast}
      />

      {/* Global AI Engine & Session Configuration Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onToast={addToast}
      />

      {/* Notification Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
