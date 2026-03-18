/**
 * ReportFeedback — C层：报告级别反馈（整体反馈卡片）
 *
 * 内容（按原型最终版）：
 *   - 关键能力评分：变异位点发现能力 / 文献检索相关性 / 文献理解与证据提取质量（Rate，选填）
 *   - 补充反馈：自由文本（选填）
 *   - 提交反馈按钮
 */
import { Button, Card, Rate, Space, Typography, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';

// Note: In production import Card, Rate, Button from '@onex/ui'

const { Text, Title } = Typography;

const RATING_ITEMS = [
  { key: 'variant', label: '变异位点发现能力' },
  { key: 'literature', label: '文献检索相关性' },
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

  const handleSubmit = () => {
    setSubmitted(true);
    message.success({
      content: '反馈已提交！感谢您的专业评估，您的反馈将帮助我们持续优化 AI 诊断质量。',
      duration: 4,
      icon: <CheckCircleFilled style={{ color: '#22c55e' }} />,
    });
  };

  return (
    <div id="report-feedback-section">
      <Card
        style={{ marginBottom: 80 }}
        bodyStyle={{ padding: 0 }}
        bordered
      >
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
          {/* Block: Capability rating */}
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
                  <Text style={{ fontSize: 13, color: '#374151' }}>
                    {item.label}
                  </Text>
                  <Rate
                    value={ratings[item.key]}
                    onChange={(val) =>
                      setRatings((prev) => ({ ...prev, [item.key]: val }))
                    }
                  />
                </div>
              ))}
            </Space>
          </div>

          {/* Block: Additional comment */}
          <div style={{ marginBottom: 0 }}>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 6 }}>
              补充反馈
              <OptionalTag />
            </Text>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>
              请在此描述
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
              }}
              rows={3}
              placeholder="例：test2 的文献引用正确但对特定段落的理解有误..."
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
          </div>

          {/* Submit */}
          {submitted ? (
            <div
              style={{
                marginTop: 16,
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: 8,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontWeight: 600,
                color: '#166534',
                fontSize: 14,
              }}
            >
              <CheckCircleFilled style={{ fontSize: 18 }} />
              反馈已提交！感谢您的专业评估。
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              block
              style={{ marginTop: 16, borderRadius: 12, fontWeight: 600, height: 44 }}
              onClick={handleSubmit}
            >
              提交反馈
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
