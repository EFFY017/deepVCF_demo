/**
 * EvidenceFeedback — A层：证据级别反馈
 *
 * 状态机：
 *   initial  → 只展示三态按钮（左对齐），无按钮
 *   editing  → 三态按钮 + 详情展开 + 提交/取消（取消回 initial）
 *   submitted → 绿色高亮横条 + 反馈内容摘要 + 右侧"修改"按钮
 */
import { Button, Checkbox, Input, Space, Tag, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';
import TriStateGroup from './shared/TriStateGroup';

const { TextArea } = Input;
const { Text } = Typography;

/* ── 静态配置 ──────────────────────────────────────────────────── */

const ISSUE_OPTIONS = [
  { label: '证据强度判定有误（如该 Moderate 标成了 Strong）', value: 'strength' },
  { label: '引用文献不相关', value: 'irrelevant' },
  { label: '文献相关但内容解读有误', value: 'misread' },
  { label: '该证据不应被采用', value: 'invalid' },
];

const ISSUE_LABEL = {
  strength:   '证据强度判定有误',
  irrelevant: '引用文献不相关',
  misread:    '文献相关但内容解读有误',
  invalid:    '该证据不应被采用',
};

const TRISTATE_OPTIONS = [
  { value: 'correct',   label: '✓ 正确',   activeType: 'correct' },
  { value: 'wrong',     label: '✗ 有误',   activeType: 'wrong' },
  { value: 'uncertain', label: '➖ 不确定', activeType: 'uncertain' },
];

const VERDICT_TAG = {
  correct:   { label: '✓ 正确',   color: '#22c55e', bg: '#dcfce7', text: '#166534' },
  wrong:     { label: '✗ 有误',   color: '#dc2626', bg: '#fee2e2', text: '#991b1b' },
  uncertain: { label: '➖ 不确定', color: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
};

/* ── 已提交高亮横条 ─────────────────────────────────────────────── */

function SubmittedBanner({ verdict, issues, note, pmid, onModify }) {
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

          {/* 详情摘要（仅 wrong 时） */}
          {verdict === 'wrong' && (issues.length > 0 || note || pmid) && (
            <div style={{ marginTop: 6, paddingLeft: 23, fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
              {tag && <div>反馈类型：{tag.label}</div>}
              {issues.length > 0 && (
                <div>
                  问题类型：
                  {issues.map((v) => (             
                      ISSUE_LABEL[v]                   
                  ))}
                </div>
              )}
              {note && <div>补充说明：{note}</div>}
              {pmid && <div>PMID：<span style={{ fontFamily: 'monospace' }}>{pmid}</span></div>}
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

  const fb      = evidenceFeedback[evidenceId] ?? {};
  const { verdict, issues = [], note = '', pmid = '' } = fb;
  const isSubmitted = evidenceSubmitted[evidenceId] ?? false;

  /* ── 操作 ────────────────────────────────────────────────────── */

  // 提交：标记为已提交
  const handleSubmit = () => submitEvidenceFeedback(evidenceId);

  // 取消：清空所有内容，回到 initial
  const handleCancel = () => clearEvidenceFeedback(evidenceId);

  // 修改：退回编辑态（值保留）
  const handleModify = () => unsubmitEvidenceFeedback(evidenceId);

  /* ── 渲染：已提交 ─────────────────────────────────────────────── */

  if (isSubmitted) {
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
        <SubmittedBanner
          verdict={verdict}
          issues={issues}
          note={note}
          pmid={pmid}
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
        marginTop: 12,
      }}
    >
      {/* 标签 + 三态按钮（左对齐） */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
          对此证据的评估：
        </Text>
        <TriStateGroup
          value={verdict ?? null}
          onChange={(v) => setEvidenceFeedback(evidenceId, v)}
          options={TRISTATE_OPTIONS}
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
              问题类型（可多选）
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

          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              补充说明（选填）
            </Text>
            <TextArea
              rows={2}
              placeholder="请描述具体问题..."
              value={note}
              onChange={(e) => updateEvidenceFeedback(evidenceId, { note: e.target.value })}
            />
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              补充 PMID（选填）
            </Text>
            <Input
              placeholder="如: 12345678, 87654321"
              value={pmid}
              onChange={(e) => updateEvidenceFeedback(evidenceId, { pmid: e.target.value })}
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
