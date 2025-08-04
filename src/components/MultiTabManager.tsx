import { useEffect, useState } from 'react';
import { useDJflyStore, useUIActions, useUIState } from '@/store';

const channel = new BroadcastChannel('djfly-session');

const MultiTabManager = () => {
  const [tabId] = useState(() => Math.random().toString(36).substring(2));
  const { masterTabId } = useUIState();
  const { setMasterTabId } = useUIActions();

  useEffect(() => {
    if (!masterTabId) {
      setMasterTabId(tabId);
    }
  }, [masterTabId, setMasterTabId, tabId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'state-update' && payload.ui.masterTabId !== tabId) {
        useDJflyStore.setState(payload);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [tabId]);

  useEffect(() => {
    const unsubscribe = useDJflyStore.subscribe((state) => {
      if (state.ui.masterTabId === tabId) {
        channel.postMessage({
          type: 'state-update',
          payload: state,
        });
      }
    });

    return unsubscribe;
  }, [tabId]);

  return null;
};

export default MultiTabManager;
