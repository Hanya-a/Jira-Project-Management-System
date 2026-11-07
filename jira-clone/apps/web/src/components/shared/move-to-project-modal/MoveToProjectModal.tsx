import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Modal } from '../modal/Modal';
import { Button, Text } from '../../base';
import { getProjects, moveCardToProject, type ProjectRecord, type Card } from '@jira-clone/shared';

export interface MoveToProjectModalProps {
  visible: boolean;
  card: Card | null;
  currentProjectKey: string;
  onClose: () => void;
  onMoved: (cardKey: string) => void;
}

export const MoveToProjectModal: FC<MoveToProjectModalProps> = ({
  visible,
  card,
  currentProjectKey,
  onClose,
  onMoved,
}) => {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) return;
    setSelectedKey(null);
    setError(undefined);
    getProjects().then((all) =>
      setProjects(all.filter((p) => p.key !== currentProjectKey))
    );
  }, [visible, currentProjectKey]);

  const handleSubmit = async () => {
    if (!card || !selectedKey) return;
    try {
      setSubmitting(true);
      setError(undefined);
      await moveCardToProject(card.key, selectedKey);
      onMoved(card.key);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to move card.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!card) return null;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={card.key}
      subtitle="Move to Project"
      presentation="dialog"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button label="Cancel" variant="ghost" size="sm" onPress={onClose} />
          <Button
            label="Move"
            variant="primary"
            size="sm"
            disabled={!selectedKey || submitting}
            loading={submitting}
            onPress={handleSubmit}
          />
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text variant="bodySmall" bold>{card.title}</Text>
        {error && (
          <Text variant="errorText" color="var(--color-warn)">
            {error}
          </Text>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          {projects.length === 0 && (
            <Text variant="caption" muted>No other projects available.</Text>
          )}
          {projects.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedKey(p.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 'var(--radius-card)',
                border: `1px solid ${selectedKey === p.key ? 'var(--color-accent)' : 'var(--color-line)'}`,
                backgroundColor: selectedKey === p.key ? 'var(--color-accent-soft)' : 'var(--color-surface)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Text variant="bodySmall" bold>{p.key}</Text>
              <Text variant="bodySmall">{p.name}</Text>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default MoveToProjectModal;