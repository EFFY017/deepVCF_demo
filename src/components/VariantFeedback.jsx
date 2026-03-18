/**
 * VariantFeedback — B层：变异级别反馈
 *
 * 状态机：
 *   initial  → 只展示问题 + 三态按钮（左对齐），无按钮
 *   editing  → 三态按钮 + 详情展开 + 提交/取消（取消回 initial）
 *   submitted → 绿色高亮横条 + 反馈内容摘要 + 右侧"修改"按钮
 */
import { Button, Input, Radio, Space, Tag, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
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
  agree:     { label: '✓ 同意',   bg: '#dcfce7', text: '#166534' },
  disagree:  { label: '✗ 不同意', bg: '#fee2e2', text: '#991b1b' },
  uncertain: { label: '— 不确定', bg: '#f1f5f9', text: '#475569' },
};

/* ── 已提交高亮横条 ─────────────────────────────────────────────── */

function SubmittedBanner({ verdict, classification, reason, onModify }) {
  const tag = VERDICT_TAG[verdict];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 8,
          padding: '10px 14px',
          gap: 12,
        }}
      >
        {/* 左侧：图标 + 主文字 + 反馈内容 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 主行 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <CheckCircleFilled style={{ color: '#22c55e', fontSize: 15, flexShrink: 0 }} />
            <Text strong style={{ color: '#15803d', fontSize: 13 }}>
              反馈已记录，感谢您的校准
            </Text>
          </div>

          {/* 详情摘要（仅 disagree 时） */}
          {verdict === 'disagree' && (classification || reason) && (
            <div style={{ marginTop: 6, paddingLeft: 23, fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
              {tag && <div>反馈类型：{tag.label}</div>}
              {classification && (
                <div>
                  正确分类：
                  {CLASS_LABEL[classification]}
                </div>
              )}
              {reason && <div>理由：{reason}</div>}
            </div>
          )}
        </div>

        {/* 右侧：修改链接 */}
        <Button
          type="link"
          size="small"
          style={{ color: '#16a34a', padding: 0, flexShrink: 0, fontWeight: 500 }}
          onClick={onModify}
        >
          修改
        </Button>
      </div>
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

  const fb      = variantFeedback[variantId] ?? {};
  const { verdict, classification = '', reason = '' } = fb;
  const isSubmitted = variantSubmitted[variantId] ?? false;

  /* ── 操作 ────────────────────────────────────────────────────── */

  const handleSubmit = () => submitVariantFeedback(variantId);
  const handleCancel = () => clearVariantFeedback(variantId);
  const handleModify = () => unsubmitVariantFeedback(variantId);

  /* ── 渲染：已提交 ─────────────────────────────────────────────── */

  if (isSubmitted) {
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
        <SubmittedBanner
          verdict={verdict}
          classification={classification}
          reason={reason}
          onModify={handleModify}
        />
      </div>
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
      {/* 问题 + 三态按钮（左对齐） */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 13, color: '#64748b', flexShrink: 0 }}>
          您是否同意该变异的致病性分类？
        </Text>
        <TriStateGroup
          value={verdict ?? null}
          onChange={(v) => setVariantFeedback(variantId, v)}
          options={TRISTATE_OPTIONS}
        />
      </div>

      {/* 展开详情（选"不同意"时） */}
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
              简要理由（选填）
            </Text>
            <TextArea
              rows={2}
              placeholder="请简要说明您不同意的理由..."
              value={reason}
              onChange={(e) => updateVariantFeedback(variantId, { reason: e.target.value })}
            />
          </div>
        </Space>
      )}

      {/* 提交 / 取消（选了 verdict 才显示） */}
      {verdict !== null && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }} className="fb-detail-enter">
          <Button size="small" onClick={handleCancel}>取消</Button>
          <Button size="small" type="primary" onClick={handleSubmit}>提交</Button>
        </div>
      )}
    </div>
  );
}
