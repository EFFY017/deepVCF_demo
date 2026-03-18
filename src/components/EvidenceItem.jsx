/**
 * EvidenceItem — 单条 ACMG 证据折叠项
 *
 * 使用 Ant Design Collapse 实现可展开/折叠。
 * 折叠态标题旁通过 Badge dot 显示反馈状态（绿/红/灰圆点）。
 * 展开后底部渲染 EvidenceFeedback（A层）。
 */
import { Badge, Card, Collapse, Space, Tag, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useFeedback } from '../context/FeedbackContext';
import EvidenceFeedback from './EvidenceFeedback';

// Note: In production import Collapse, Card, Tag from '@onex/ui'

const { Text, Paragraph } = Typography;

const DOT_COLOR = {
  correct: '#22c55e',
  wrong: '#dc2626',
  uncertain: '#94a3b8',
};

/** Reference card with yellow background */
function RefCard({ url, desc }) {
  return (
    <Card className="ref-card" size="small" bordered={false}>
      <div className="ref-card-title">
        <LinkOutlined style={{ marginRight: 4 }} />
        参考文献:
      </div>
      <a href={url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: 13 }}>
        {url}
      </a>
      {desc && (
        <Text
          style={{
            display: 'block',
            fontSize: 12,
            color: '#6b7280',
            fontStyle: 'italic',
            marginTop: 4,
            lineHeight: 1.6,
          }}
        >
          {desc}
        </Text>
      )}
    </Card>
  );
}

export default function EvidenceItem({ evidence, isPathogenic = true }) {
  const { evidenceFeedback } = useFeedback();
  const fb = evidenceFeedback[evidence.id];
  const dotColor = fb ? DOT_COLOR[fb.verdict] : null;

  const label = (
    <Space size={8}>
      {dotColor && (
        <Badge
          dot
          color={dotColor}
          style={{ marginTop: -2 }}
        />
      )}
      <Text strong style={{ color: '#2563eb', fontSize: 14 }}>
        {evidence.title}
      </Text>
    </Space>
  );

  const extra = (
    <Tag
      color={isPathogenic ? '#2563eb' : '#64748b'}
      style={{
        fontWeight: 700,
        borderRadius: 20,
        border: 'none',
        fontSize: 12,
        marginRight: 0,
      }}
    >
      {evidence.score}
    </Tag>
  );

  const panelContent = (
    <div>
      <Paragraph style={{ fontSize: 13, color: '#374151', marginBottom: 10 }}>
        {evidence.description}
      </Paragraph>

      {evidence.reasoning && (
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 13 }}>
            判定依据：
          </Text>
          <ul style={{ paddingLeft: 16, marginTop: 4 }}>
            <li style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
              {evidence.reasoning}
            </li>
          </ul>
        </div>
      )}

      {evidence.refs?.map((ref, i) => (
        <RefCard key={i} url={ref.url} desc={ref.desc} />
      ))}

      {/* A-layer feedback */}
      <EvidenceFeedback evidenceId={evidence.id} />
    </div>
  );

  return (
    <Collapse
      className="evidence-collapse"
      ghost={false}
      items={[
        {
          key: evidence.id,
          label,
          extra,
          children: panelContent,
          styles: {
            header: { background: '#eff6ff' },
          },
        },
      ]}
    />
  );
}
