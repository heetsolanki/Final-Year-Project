import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ConfirmModal from "../components/ui/ConfirmModal";

const ConfirmModalContext = createContext(null);

export const ConfirmModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeConfirmModal = useCallback(() => {
    if (isLoading) return;
    setModalConfig(null);
  }, [isLoading]);

  const openConfirmModal = useCallback((config) => {
    setModalConfig(config);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!modalConfig?.onConfirm) {
      setModalConfig(null);
      return;
    }

    try {
      setIsLoading(true);
      await modalConfig.onConfirm();
      setModalConfig(null);
    } catch (error) {
      console.error("Confirm modal action failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [modalConfig]);

  const value = useMemo(
    () => ({ openConfirmModal, closeConfirmModal }),
    [closeConfirmModal, openConfirmModal],
  );

  return (
    <ConfirmModalContext.Provider value={value}>
      {children}
      {modalConfig ? (
        <ConfirmModal
          title={modalConfig.title}
          description={modalConfig.description}
          icon={modalConfig.icon}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          onConfirm={handleConfirm}
          onCancel={closeConfirmModal}
          type={modalConfig.type}
          confirmDisabled={modalConfig.confirmDisabled}
          isLoading={isLoading}
        >
          {modalConfig.children}
        </ConfirmModal>
      ) : null}
    </ConfirmModalContext.Provider>
  );
};

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);

  if (!context) {
    throw new Error("useConfirmModal must be used within ConfirmModalProvider");
  }

  return context;
};
