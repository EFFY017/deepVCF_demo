/**
 * EvidenceFeedback — A层：证据级别反馈
 *
 * 状态机：
 *   initial   → 只展示二态按钮（正确/有误），无提交按钮
 *   editing   → 选"有误"后展开问题多选 + 提交/取消
 *   submitted → 绿色高亮横条 + 反馈摘要 + 右侧"修改"按钮
 *
 * 特别规则：选"正确"立即自动提交，无需额外点击。
 */
import { useState } from 'react';
import { Button, Checkbox, Input, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';
import TriStateGroup from './shared/TriStateGroup';

const { TextArea } = Input;
const { Text } = Typography;

/* ── 静态配置 ──────────────────────────────────────────────────── */

const ISSUE_OPTIONS = [
  { label: '证据强度有误', value: 'wrong_strength' },
  { label: '证据引用的文献不相关', value: 'irrelevant_literature' },
  { label: '文献相关，但对文献内容的解读有误', value: 'misinterpretation' },
  { label: '该证据不应被采用', value: 'should_not_apply' },
  { label: '其他', value: 'other' },
];

const ISSUE_LABEL = Object.fromEntries(ISSUE_OPTIONS.map((o) => [o.value, o.label]));

const BINARY_OPTIONS = [
  { value: 'correct', label: '✓ 正确', activeType: 'correct' },
  { value: 'wrong',   label: '✗ 有误', activeType: 'wrong' },
];

const VERDICT_TAG = {
  correct: { label: '正确' },
  wrong:   { label: '有误' },
};

const PILL_STYLE = {
  correct: { border: '1px solid #bbf7d0', color: '#15803d', background: '#f0fdf4' },
  wrong:   { border: '1px solid #fecaca', color: '#b91c1c', background: '#fef2f2' },
};

/* ── 已提交行（极简） ────────────────────────────────────────── */

function SubmittedBanner({ verdict, issues, onModify }) {
  const pill = PILL_STYLE[verdict] ?? {};

  // 有误时构建摘要：第一项 + 超出数量
  let summary = null;
  if (verdict === 'wrong' && issues.length > 0) {
    const firstName = ISSUE_LABEL[issues[0]];
    summary = issues.length > 1 ? `${firstName} 等 ${issues.length} 项` : firstName;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        marginTop: 8,
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

export default function EvidenceFeedback({ evidenceId }) {
  const {
    evidenceFeedback,
    evidenceSubmitted,
    setEvidenceFeedback,
    updateEvidenceFeedback,
    clearEvidenceFeedback,
    submitEvidenceFeedback,
    unsubmitEvidenceFeedback,
  } = useFeedback();

  // Snapshot saved when entering modify mode, used to restore on cancel
  const [modifySnapshot, setModifySnapshot] = useState(null);

  const fb = evidenceFeedback[evidenceId] ?? {};
  const { verdict, issues = [], note = '' } = fb;
  const isSubmitted = evidenceSubmitted[evidenceId] ?? false;

  /* ── 操作 ────────────────────────────────────────────────────── */

  const handleVerdictChange = (v) => {
    if (v === 'correct') {
      // 正确：直接记录，立即提交
      setEvidenceFeedback(evidenceId, 'correct');
      submitEvidenceFeedback(evidenceId);
      setModifySnapshot(null);
    } else {
      // 'wrong' 或 null（取消选中）
      setEvidenceFeedback(evidenceId, v);
    }
  };

  const canSubmit = verdict === 'wrong' && issues.length > 0;

  const handleSubmit = () => {
    submitEvidenceFeedback(evidenceId);
    setModifySnapshot(null);
  };

  const handleCancel = () => {
    if (modifySnapshot !== null) {
      // 修改模式下取消：恢复上次提交的内容
      updateEvidenceFeedback(evidenceId, {
        verdict: modifySnapshot.verdict,
        issues: modifySnapshot.issues ?? [],
        note: modifySnapshot.note ?? '',
      });
      submitEvidenceFeedback(evidenceId);
      setModifySnapshot(null);
    } else {
      // 初始编辑取消：清空所有内容
      clearEvidenceFeedback(evidenceId);
    }
  };

  const handleModify = () => {
    setModifySnapshot({ verdict, issues: [...issues], note });
    unsubmitEvidenceFeedback(evidenceId);
  };

  /* ── 渲染：已提交 ─────────────────────────────────────────────── */

  if (isSubmitted) {
    return (
      <SubmittedBanner
        verdict={verdict}
        issues={issues}
        note={note}
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
        marginTop: 12,
      }}
    >
      {/* 标签 + 二态按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
          对此证据的评估：
        </Text>
        <TriStateGroup
          value={verdict ?? null}
          onChange={handleVerdictChange}
          options={BINARY_OPTIONS}
        />
      </div>

      {/* 展开详情（选"有误"时） */}
      {verdict === 'wrong' && (
        <Space
          direction="vertical"
          size={10}
          style={{ marginTop: 12, width: '100%' }}
          className="fb-detail-enter"
        >
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
              问题类型（可多选，至少选一项）<span style={{ color: '#dc2626' }}>*</span>
            </Text>
            <Checkbox.Group
              value={issues}
              onChange={(vals) => updateEvidenceFeedback(evidenceId, { issues: vals })}
            >
              <Space direction="vertical" size={6}>
                {ISSUE_OPTIONS.map((opt) => (
                  <Checkbox key={opt.value} value={opt.value}>
                    <Text style={{ fontSize: 13 }}>{opt.label}</Text>
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>

          {/* 仅当选了"其他"时展示文本输入 */}
          {issues.includes('other') && (
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                补充说明（选填，限 1000 字符）
              </Text>
              <TextArea
                rows={2}
                maxLength={1000}
                showCount
                placeholder="请描述具体问题..."
                value={note}
                onChange={(e) => updateEvidenceFeedback(evidenceId, { note: e.target.value })}
              />
            </div>
          )}
        </Space>
      )}

      {/* 提交 / 取消（选了"有误"才显示） */}
      {verdict === 'wrong' && (
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

      {/* 取消（选了"正确"处于修改态时也需要取消入口，实际不会发生因为正确会自动提交） */}
      {verdict === null && modifySnapshot !== null && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <Button size="small" onClick={handleCancel}>取消</Button>
        </div>
      )}
    </div>
  );
}
