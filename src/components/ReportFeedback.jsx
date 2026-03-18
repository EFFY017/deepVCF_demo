/**
 * ReportFeedback — C层：报告级别反馈（整体反馈卡片）
 *
 * 状态机：
 *   editing   → 文本框 + 关键能力评分；提交按钮在文本框非空时高亮；含取消按钮
 *   submitted → "您的反馈已提交" 横条 + "修改"按钮
 *
 * 修改流程：
 *   点击修改 → 回到编辑态，回填上次内容；取消 → 恢复上次提交内容；提交 → 覆盖
 */
import { useState } from 'react';
import { Button, Card, Rate, Space, Typography, message } from 'antd';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';

const { Text, Title } = Typography;

const RATING_ITEMS = [
  { key: 'variant',       label: '变异位点发现能力' },
  { key: 'literature',    label: '文献检索相关性' },
  { key: 'evidenceQuality', label: '文献理解与证据提取质量' },
];

const OptionalTag = () => (
  <span
    style={{
      background: '#f1f5f9',
      color: '#94a3b8',
      fontSize: 10,
      padding: '1px 6px',
      borderRadius: 4,
      marginLeft: 6,
      fontWeight: 400,
    }}
  >
    选填
  </span>
);

export default function ReportFeedback() {
  const { ratings, setRatings, comment, setComment, submitted, setSubmitted } =
    useFeedback();

  // Track whether we're in "modify" mode and store snapshot for cancel
  const [isModifying, setIsModifying] = useState(false);
  const [modifySnapshot, setModifySnapshot] = useState(null);

  const canSubmit = comment.trim().length > 0;

  const handleSubmit = () => {
    setSubmitted(true);
    setIsModifying(false);
    setModifySnapshot(null);
    message.success({
      content: '反馈已提交！感谢您的专业评估，您的反馈将帮助我们持续优化 AI 诊断质量。',
      duration: 4,
      icon: <CheckCircleOutlined style={{ color: '#22c55e' }} />,
    });
  };

  const handleCancel = () => {
    if (isModifying && modifySnapshot !== null) {
      // 修改模式取消：恢复上次提交内容
      setComment(modifySnapshot.comment);
      setRatings(modifySnapshot.ratings);
      setSubmitted(true);
      setIsModifying(false);
      setModifySnapshot(null);
    } else {
      // 初始编辑取消：清空内容
      setComment('');
    }
  };

  const handleModify = () => {
    setModifySnapshot({ comment, ratings: { ...ratings } });
    setSubmitted(false);
    setIsModifying(true);
  };

  /* ── 已提交状态 ──────────────────────────────────────────────── */

  if (submitted) {
    return (
      <div id="report-feedback-section">
        <Card style={{ marginBottom: 80 }} bodyStyle={{ padding: 0 }} bordered>
          <div className="report-feedback-header">
            <Title level={5} style={{ color: '#1e3a8a', margin: 0 }}>
              整体反馈
            </Title>
          </div>
          <div
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircleOutlined style={{ fontSize: 13, color: '#86efac' }} />
              <Text style={{ fontSize: 13, color: '#94a3b8' }}>已记录整体反馈</Text>
            </div>
            <Button
              type="text"
              size="small"
              style={{ color: '#94a3b8', fontSize: 12, padding: '0 4px', height: 'auto' }}
              onClick={handleModify}
            >
              修改
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ── 编辑态 ──────────────────────────────────────────────────── */

  return (
    <div id="report-feedback-section">
      <Card style={{ marginBottom: 80 }} bodyStyle={{ padding: 0 }} bordered>
        {/* Header */}
        <div className="report-feedback-header">
          <Title level={5} style={{ color: '#1e3a8a', margin: 0 }}>
            整体反馈
          </Title>
          <Text style={{ fontSize: 12, color: '#3b82f6', display: 'block', marginTop: 3 }}>
            您的反馈将帮助我们持续优化 AI 诊断质量，感谢您的专业评估
          </Text>
        </div>

        <div style={{ padding: 20 }}>
          {/* Block: Capability rating
          <div
            style={{
              marginBottom: 24,
              paddingBottom: 24,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 14 }}>
              关键能力评分
              <OptionalTag />
            </Text>

            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              {RATING_ITEMS.map((item) => (
                <div key={item.key} className="star-rating-row">
                  <Text style={{ fontSize: 13, color: '#374151' }}>{item.label}</Text>
                  <Rate
                    value={ratings[item.key]}
                    onChange={(val) =>
                      setRatings((prev) => ({ ...prev, [item.key]: val }))
                    }
                  />
                </div>
              ))}
            </Space>
          </div> */}

          {/* Block: Free text */}
          <div style={{ marginBottom: 0 }}>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 6 }}>
              补充反馈
              <OptionalTag />
            </Text>
            <textarea
              style={{
                width: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                fontFamily: 'inherit',
                background: '#f8fafc',
                color: '#0f172a',
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
              rows={3}
              maxLength={2000}
              placeholder="请补充您的其他反馈"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                e.target.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.background = '#f8fafc';
              }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              {comment.length} / 2000
            </div>
          </div>

          {/* Submit + Cancel */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <Button
              type="text"
              style={{ color: '#64748b', padding: '0 4px' }}
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              disabled={!canSubmit}
              style={{ fontWeight: 600 }}
              onClick={handleSubmit}
            >
              提交反馈
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
