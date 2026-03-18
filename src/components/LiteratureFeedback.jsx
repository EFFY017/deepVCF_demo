/**
 * LiteratureFeedback — 文献引用反馈
 *
 * 状态机：
 *   idle     → 👍 / 👎 两个按钮（均未高亮）
 *   up       → 直接保存，👍 高亮
 *   down     → 展开原因面板 + 提交/取消；提交后 👎 高亮 + 已选原因高亮显示
 *
 * 用户可随时切换：
 *   点击 👍 覆盖为正向反馈；点击 👎 重新打开面板。
 */
import { useState } from 'react';
import { Button, Checkbox, Input, Space, Typography } from 'antd';
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';

const { TextArea } = Input;
const { Text } = Typography;

/* ── 静态配置 ──────────────────────────────────────────────────── */

const REASON_OPTIONS = [
  { value: 'not_relevant',         label: '文献不相关' },
  { value: 'outdated',             label: '文献已过时' },
  { value: 'questionable_source',  label: '来源可疑' },
  { value: 'incorrect_information',label: '文献信息有误' },
  { value: 'better_source_available', label: '有更好的文献可替代' },
];

const REASON_LABEL = Object.fromEntries(REASON_OPTIONS.map((o) => [o.value, o.label]));

/* ── 主组件 ─────────────────────────────────────────────────────── */

export default function LiteratureFeedback({ refId }) {
  const { literatureFeedback, setLiteratureFeedback } = useFeedback();

  const saved = literatureFeedback[refId];
  const savedVerdict = saved?.verdict ?? null;

  // 👎 表单本地草稿
  const [formOpen, setFormOpen] = useState(false);
  const [draftReasons, setDraftReasons] = useState([]);
  const [draftNote, setDraftNote] = useState('');

  /* ── 操作 ────────────────────────────────────────────────────── */

  const handleThumbUp = () => {
    setLiteratureFeedback(refId, { verdict: 'up', reasons: [], note: '' });
    setFormOpen(false);
  };

  const handleThumbDown = () => {
    // 用上次已提交的 👎 数据初始化草稿
    if (saved?.verdict === 'down') {
      setDraftReasons([...(saved.reasons ?? [])]);
      setDraftNote(saved.note ?? '');
    } else {
      setDraftReasons([]);
      setDraftNote('');
    }
    setFormOpen(true);
  };

  const handleSubmit = () => {
    setLiteratureFeedback(refId, { verdict: 'down', reasons: draftReasons, note: draftNote });
    setFormOpen(false);
  };

  const handleCancel = () => {
    setFormOpen(false);
  };

  const canSubmit = draftReasons.length > 0;

  /* ── 渲染 ────────────────────────────────────────────────────── */

  return (
    <div style={{ marginTop: 8 }}>
      {/* 👍 / 👎 按钮行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          文献引用是否准确？
        </Text>
        <button
          onClick={handleThumbUp}
          style={{
            border: '1px solid',
            borderColor: savedVerdict === 'up' ? '#22c55e' : '#d1d5db',
            borderRadius: 6,
            padding: '2px 8px',
            cursor: 'pointer',
            color: savedVerdict === 'up' ? '#15803d' : '#6b7280',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: savedVerdict === 'up' ? 600 : 400,
            background: savedVerdict === 'up' ? '#f0fdf4' : 'transparent',
            transition: 'all 0.15s',
          }}
          aria-label="有帮助"
        >
          {savedVerdict === 'up' ? (
            <LikeFilled style={{ fontSize: 13 }} />
          ) : (
            <LikeOutlined style={{ fontSize: 13 }} />
          )}
          <span style={{ fontSize: 12 }}>准确</span>
        </button>

        <button
          onClick={handleThumbDown}
          style={{
            border: '1px solid',
            borderColor: savedVerdict === 'down' ? '#dc2626' : '#d1d5db',
            borderRadius: 6,
            padding: '2px 8px',
            cursor: 'pointer',
            color: savedVerdict === 'down' ? '#991b1b' : '#6b7280',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: savedVerdict === 'down' ? 600 : 400,
            background: savedVerdict === 'down' ? '#fef2f2' : 'transparent',
            transition: 'all 0.15s',
          }}
          aria-label="有问题"
        >
          {savedVerdict === 'down' ? (
            <DislikeFilled style={{ fontSize: 13 }} />
          ) : (
            <DislikeOutlined style={{ fontSize: 13 }} />
          )}
          <span style={{ fontSize: 12 }}>有误</span>
        </button>
      </div>

      {/* 已提交 👎 时展示高亮原因标签 */}
      {savedVerdict === 'down' && !formOpen && saved?.reasons?.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {saved.reasons.map((r) => (
            <span
              key={r}
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                borderRadius: 4,
                padding: '1px 8px',
                fontSize: 11,
              }}
            >
              {REASON_LABEL[r]}
            </span>
          ))}
          {saved.note && (
            <span style={{ fontSize: 11, color: '#64748b', marginLeft: 4 }}>
              补充：{saved.note}
            </span>
          )}
        </div>
      )}

      {/* 👎 原因面板 */}
      {formOpen && (
        <div
          style={{
            marginTop: 8,
            background: '#fff9f9',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: '12px 14px',
          }}
          className="fb-detail-enter"
        >
          <div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
              问题原因（可多选，至少选一项）<span style={{ color: '#dc2626' }}>*</span>
            </Text>
            <Checkbox.Group
              value={draftReasons}
              onChange={setDraftReasons}
            >
              <Space direction="vertical" size={4}>
                {REASON_OPTIONS.map((opt) => (
                  <Checkbox key={opt.value} value={opt.value}>
                    <Text style={{ fontSize: 12 }}>{opt.label}</Text>
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>

          {/* 补充说明：始终展示；当选了"有更好的文献可替代"时提示填写 PMID */}
          <div style={{ marginTop: 10 }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              补充说明（选填，限 1000 字符）
            </Text>
            <TextArea
              rows={2}
              maxLength={1000}
              showCount
              placeholder={
                draftReasons.includes('better_source_available')
                  ? '在此填写推荐文献的 PMID 或链接，帮助我们更好地优化'
                  : '请补充具体描述...'
              }
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
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
        </div>
      )}
    </div>
  );
}
