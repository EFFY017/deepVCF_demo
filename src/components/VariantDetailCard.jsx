/**
 * VariantDetailCard — 变异详情卡片（可折叠）
 *
 * 包含：
 *   - 浅蓝色卡片头（基因 + 变异名 + 致病性 Badge）
 *   - 基本信息区（Descriptions）
 *   - ACMG 评分总览（灰底自定义 Grid）
 *   - B层 VariantFeedback
 *   - 致病性证据 / 良性证据（EvidenceItem × N）
 */
import { useState } from 'react';
import { Card, Descriptions, Space, Tag, Typography } from 'antd';
import { BarChartOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import VariantFeedback from './VariantFeedback';
import EvidenceItem from './EvidenceItem';

// Note: In production import Card, Descriptions from '@onex/ui'

const { Text } = Typography;

/** 4-column ACMG score overview grid */
function AcmgOverview({ data }) {
  const cells = [
    { label: '致病性证据总分', value: `${data.pathogenicScore}分` },
    { label: '良性证据总分', value: `${data.benignScore}分` },
    {
      label: '最终分类',
      value: (
        <Text style={{ color: '#dc2626', fontWeight: 700 }}>
          {data.finalClass}
        </Text>
      ),
    },
    {
      label: '分类标准',
      value: (
        <Text style={{ fontSize: 12 }}>{data.criteria}</Text>
      ),
    },
  ];

  return (
    <div className="acmg-overview-wrap">
      <div className="acmg-overview-header">
        <BarChartOutlined style={{ color: '#2563eb' }} />
        ACMG评分总览
      </div>
      <div className="acmg-grid">
        {cells.map((c) => (
          <div key={c.label} className="acmg-cell">
            <div className="acmg-cell-label">{c.label}</div>
            <div className="acmg-cell-value">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Section title for evidence groups */
function EvidenceSectionTitle({ color, children }) {
  return (
    <div
      style={{
        padding: '14px 20px 10px',
        fontSize: 14,
        fontWeight: 700,
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ color, fontSize: 10 }}>■</span>
      {children}
    </div>
  );
}

export default function VariantDetailCard({ variant }) {
  const [expanded, setExpanded] = useState(true);

  const descItems = variant.basicInfo.map((item) => ({
    key: item.label,
    label: item.label,
    children: item.link ? (
      <a href="#" style={{ color: '#2563eb' }}>
        {item.value}
      </a>
    ) : (
      item.value
    ),
  }));

  return (
    <Card
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 0 }}
      bordered
      /* Override card header with custom element */
      title={null}
    >
      {/* Custom header */}
      <div
        className="variant-card-header"
        onClick={() => setExpanded((p) => !p)}
      >
        <h3>{variant.title}</h3>
        <Space>
          <Tag
            color={variant.classificationColor}
            style={{ fontWeight: 600, borderRadius: 20, border: 'none' }}
          >
            {variant.classification}
          </Tag>
          {expanded ? (
            <UpOutlined style={{ color: '#2563eb' }} />
          ) : (
            <DownOutlined style={{ color: '#2563eb' }} />
          )}
        </Space>
      </div>

      {expanded && (
        <>
          {/* Basic info */}
          <div style={{ padding: '14px 20px' }}>
            <Descriptions
              items={descItems}
              column={2}
              size="small"
              labelStyle={{ color: '#64748b', fontSize: 13 }}
              contentStyle={{ fontSize: 13 }}
            />
          </div>

          {/* ACMG overview + B-layer feedback (no box, right-aligned) */}
          <AcmgOverview data={variant.acmgOverview} />
          <div style={{ padding: '10px 20px 16px' }}>
            <VariantFeedback variantId={variant.id} />
          </div>

          {/* Pathogenic evidence */}
          <EvidenceSectionTitle color="#dc2626">
            致病性证据 (Pathogenic Evidence)
          </EvidenceSectionTitle>
          <div style={{ padding: '0 20px 8px' }}>
            {variant.pathogenicEvidence.map((ev) => (
              <div key={ev.id} style={{ marginBottom: 8 }}>
                <EvidenceItem evidence={ev} isPathogenic />
              </div>
            ))}
          </div>

          {/* Benign evidence */}
          <EvidenceSectionTitle color="#2563eb">
            良性证据 (Benign Evidence)
          </EvidenceSectionTitle>
          <div style={{ padding: '0 20px 16px' }}>
            {variant.benignEvidence.map((ev) => (
              <div key={ev.id} style={{ marginBottom: 8 }}>
                <EvidenceItem evidence={ev} isPathogenic={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
