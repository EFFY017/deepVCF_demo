import { createContext, useContext, useState } from 'react';

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  // A-layer: per-evidence feedback data
  const [evidenceFeedback, setEvidenceFeedbackMap] = useState({});
  // A-layer: tracks which evidence items have been locally submitted
  const [evidenceSubmitted, setEvidenceSubmitted] = useState({});

  // B-layer: per-variant feedback data
  const [variantFeedback, setVariantFeedbackMap] = useState({});
  // B-layer: tracks which variants have been locally submitted
  const [variantSubmitted, setVariantSubmitted] = useState({});

  // C-layer: report-level
  const [ratings, setRatings] = useState({ variant: 0, literature: 0, evidenceQuality: 0 });
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* ─── A-layer helpers ─────────────────────────────────────────── */

  const setEvidenceFeedback = (id, verdict) => {
    setEvidenceFeedbackMap(prev => ({
      ...prev,
      [id]: { issues: [], note: '', pmid: '', ...prev[id], verdict },
    }));
  };

  const updateEvidenceFeedback = (id, patch) => {
    setEvidenceFeedbackMap(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const clearEvidenceFeedback = (id) => {
    setEvidenceFeedbackMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEvidenceSubmitted(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const submitEvidenceFeedback = (id) => {
    setEvidenceSubmitted(prev => ({ ...prev, [id]: true }));
  };

  const unsubmitEvidenceFeedback = (id) => {
    setEvidenceSubmitted(prev => ({ ...prev, [id]: false }));
  };

  /* ─── B-layer helpers ─────────────────────────────────────────── */

  const setVariantFeedback = (id, verdict) => {
    setVariantFeedbackMap(prev => ({
      ...prev,
      [id]: { classification: '', reason: '', ...prev[id], verdict },
    }));
  };

  const updateVariantFeedback = (id, patch) => {
    setVariantFeedbackMap(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const clearVariantFeedback = (id) => {
    setVariantFeedbackMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setVariantSubmitted(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const submitVariantFeedback = (id) => {
    setVariantSubmitted(prev => ({ ...prev, [id]: true }));
  };

  const unsubmitVariantFeedback = (id) => {
    setVariantSubmitted(prev => ({ ...prev, [id]: false }));
  };

  // Lit-layer: per-literature feedback data
  const [literatureFeedback, setLiteratureFeedbackMap] = useState({});

  const setLiteratureFeedback = (refId, data) => {
    setLiteratureFeedbackMap(prev => ({ ...prev, [refId]: data }));
  };

  const clearLiteratureFeedback = (refId) => {
    setLiteratureFeedbackMap(prev => {
      const next = { ...prev };
      delete next[refId];
      return next;
    });
  };

  // Count evidence items that have been submitted
  const annotatedCount = Object.values(evidenceSubmitted).filter(Boolean).length;
  const totalEvidence = 8;

  return (
    <FeedbackContext.Provider
      value={{
        // A-layer
        evidenceFeedback,
        evidenceSubmitted,
        setEvidenceFeedback,
        updateEvidenceFeedback,
        clearEvidenceFeedback,
        submitEvidenceFeedback,
        unsubmitEvidenceFeedback,
        // B-layer
        variantFeedback,
        variantSubmitted,
        setVariantFeedback,
        updateVariantFeedback,
        clearVariantFeedback,
        submitVariantFeedback,
        unsubmitVariantFeedback,
        // C-layer
        ratings,
        setRatings,
        comment,
        setComment,
        submitted,
        setSubmitted,
        // Lit-layer
        literatureFeedback,
        setLiteratureFeedback,
        clearLiteratureFeedback,
        // Progress
        annotatedCount,
        totalEvidence,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);
