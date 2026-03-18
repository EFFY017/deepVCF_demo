/**
 * VariantFeedback — B层：变异级别反馈
 *
 * 状态机：
 *   initial   → 问题 + 三态按钮，无提交按钮
 *   editing   → 三态按钮 + 详情展开 + 提交/取消
 *   submitted → 绿色高亮横条 + 反馈摘要 + 右侧"修改"按钮
 *
 * 二级字段：
 *   agree     → 无，提交按钮立即可用
 *   disagree  → 致病评级（必填）+ 简要理由（选填）
 *   uncertain → 补充说明（选填，限 1000 字符）
 */
import { useState } from 'react';
import { Button, Input, Radio, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';
import TriStateGroup from './shared/TriStateGroup';

const { TextArea } = Input;
const { Text } = Typography;

/* ── 静态配置 ──────────────────────────────────────────────────── */

const TRISTATE_OPTIONS = [
  { value: 'agree',     label: '✓ 同意',   activeType: 'agree' },
  { value: 'disagree',  label: '✗ 不同意', activeType: 'disagree' },
  { value: 'uncertain', label: '— 不确定', activeType: 'uncertain' },
];

const CLASSIFICATIONS = [
  { value: 'P',   label: '致病 (P)' },
  { value: 'LP',  label: '可能致病 (LP)' },
  { value: 'VUS', label: '意义不明 (VUS)' },
  { value: 'LB',  label: '可能良性 (LB)' },
  { value: 'B',   label: '良性 (B)' },
];
const CLASS_LABEL = Object.fromEntries(CLASSIFICATIONS.map((c) => [c.value, c.label]));

const VERDICT_TAG = {
  agree:     { label: '同意' },
  disagree:  { label: '不同意' },
  uncertain: { label: '不确定' },
};

const PILL_STYLE = {
  agree:     { border: '1px solid #bbf7d0', color: '#15803d', background: '#f0fdf4' },
  disagree:  { border: '1px solid #fecaca', color: '#b91c1c', background: '#fef2f2' },
  uncertain: { border: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc' },
};

/* ── 已提交行（极简） ────────────────────────────────────────── */

function SubmittedBanner({ verdict, classification, reason, onModify }) {
  const pill = PILL_STYLE[verdict] ?? {};

  // 构建摘要：disagree 显示所选分类，uncertain 显示补充说明（截断）
  let summary = null;
  if (verdict === 'disagree' && classification) {
    summary = CLASS_LABEL[classification];
  } else if (verdict === 'uncertain' && reason) {
    summary = reason.length > 20 ? reason.slice(0, 20) + '…' : reason;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        marginTop: 4,
        borderTop: '1px solid #f1f5f9',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
        <CheckCircleOutlined style={{ color: '#86efac', fontSize: 12, flexShrink: 0 }} />
        <span
          style={{
            ...pill,
            fontSize: 11,
            padding: '0 6px',
            borderRadius: 3,
            lineHeight: '18px',
            whiteSpace: 'nowrap',
          }}
        >
          {VERDICT_TAG[verdict]?.label}
        </span>
        {summary && (
          <span
            style={{
              fontSize: 11,
              color: '#94a3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {summary}
          </span>
        )}
      </div>
      <Button
        type="text"
        size="small"
        style={{ color: '#94a3b8', fontSize: 12, padding: '0 4px', height: 'auto', flexShrink: 0 }}
        onClick={onModify}
      >
        修改
      </Button>
    </div>
  );
}

/* ── 主组件 ─────────────────────────────────────────────────────── */

export default function VariantFeedback({ variantId }) {
  const {
    variantFeedback,
    variantSubmitted,
    setVariantFeedback,
    updateVariantFeedback,
    clearVariantFeedback,
    submitVariantFeedback,
    unsubmitVariantFeedback,
  } = useFeedback();

  // Snapshot for cancel-in-modify behavior
  const [modifySnapshot, setModifySnapshot] = useState(null);

  const fb = variantFeedback[variantId] ?? {};
  const { verdict, classification = '', reason = '' } = fb;
  const isSubmitted = variantSubmitted[variantId] ?? false;

  /* ── 提交按钮可用性 ───────────────────────────────────────────── */

  const canSubmit =
    verdict === 'agree' ||
    verdict === 'uncertain' ||
    (verdict === 'disagree' && !!classification);

  /* ── 操作 ────────────────────────────────────────────────────── */

  const handleSubmit = () => {
    submitVariantFeedback(variantId);
    setModifySnapshot(null);
  };

  const handleCancel = () => {
    if (modifySnapshot !== null) {
      updateVariantFeedback(variantId, {
        verdict: modifySnapshot.verdict,
        classification: modifySnapshot.classification ?? '',
        reason: modifySnapshot.reason ?? '',
      });
      submitVariantFeedback(variantId);
      setModifySnapshot(null);
    } else {
      clearVariantFeedback(variantId);
    }
  };

  const handleModify = () => {
    setModifySnapshot({ verdict, classification, reason });
    unsubmitVariantFeedback(variantId);
  };

  /* ── 渲染：已提交 ─────────────────────────────────────────────── */

  if (isSubmitted) {
    return (
      <SubmittedBanner
        verdict={verdict}
        classification={classification}
        reason={reason}
        onModify={handleModify}
      />
    );
  }

  /* ── 渲染：编辑态 ─────────────────────────────────────────────── */

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '14px 16px',
        marginTop: 4,
      }}
    >
      {/* 问题 + 三态按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 13, color: '#64748b', flexShrink: 0 }}>
          您是否同意该变异的致病性分类？
        </Text>
        <TriStateGroup
          value={verdict ?? null}
          onChange={(v) => setVariantFeedback(variantId, v)}
          options={TRISTATE_OPTIONS}
        />
      </div>

      {/* disagree：致病评级（必填）+ 理由（选填） */}
      {verdict === 'disagree' && (
        <Space
          direction="vertical"
          size={10}
          style={{ marginTop: 12, width: '100%' }}
          className="fb-detail-enter"
        >
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
              正确分类 <span style={{ color: '#dc2626' }}>*</span>
            </Text>
            <Radio.Group
              className="radio-pill-group"
              value={classification}
              onChange={(e) => updateVariantFeedback(variantId, { classification: e.target.value })}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}
            >
              {CLASSIFICATIONS.map((c) => (
                <Radio.Button key={c.value} value={c.value}>
                  {c.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              简要理由（选填，限 1000 字符）
            </Text>
            <TextArea
              rows={2}
              maxLength={1000}
              showCount
              placeholder="请简要说明您不同意的理由..."
              value={reason}
              onChange={(e) => updateVariantFeedback(variantId, { reason: e.target.value })}
            />
          </div>
        </Space>
      )}

      {/* uncertain：补充说明（选填） */}
      {verdict === 'uncertain' && (
        <Space
          direction="vertical"
          size={10}
          style={{ marginTop: 12, width: '100%' }}
          className="fb-detail-enter"
        >
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              补充说明（选填，限 1000 字符）
            </Text>
            <TextArea
              rows={2}
              maxLength={1000}
              showCount
              placeholder="请描述您的不确定原因..."
              value={reason}
              onChange={(e) => updateVariantFeedback(variantId, { reason: e.target.value })}
            />
          </div>
        </Space>
      )}

      {/* 提交 / 取消（选了 verdict 才显示） */}
      {verdict && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }} className="fb-detail-enter">
          <Button size="small" onClick={handleCancel}>取消</Button>
          <Button
            size="small"
            type="primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </div>
      )}
    </div>
  );
}
