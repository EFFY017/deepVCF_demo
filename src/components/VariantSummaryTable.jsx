import { Card, Table, Tag, Typography } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';

// Note: In production import Card, Table, Tag from '@onex/ui'

const { Text } = Typography;

export default function VariantSummaryTable({ variants }) {
  const columns = [
    {
      title: '基因 (Gene)',
      dataIndex: 'gene',
      key: 'gene',
      render: (v) => <Text strong>{v}</Text>,
      width: 80,
    },
    {
      title: '染色体位置 (hg19 / hg38)',
      dataIndex: 'location',
      key: 'location',
      render: (v) => (
        <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>
      ),
    },
    {
      title: '变异信息 (Variant)',
      dataIndex: 'variant',
      key: 'variant',
      render: (v) => (
        <Text style={{ fontSize: 12, whiteSpace: 'pre-line' }}>{v}</Text>
      ),
    },
    {
      title: '来源',
      dataIndex: 'origin',
      key: 'origin',
      width: 60,
    },
    {
      title: '疾病名称 & 遗传方式',
      dataIndex: 'disease',
      key: 'disease',
      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '致病性评级',
      dataIndex: 'classification',
      key: 'classification',
      render: (v, row) => (
        <Tag
          color={row.classificationColor}
          style={{ fontWeight: 600, borderRadius: 20, border: 'none' }}
        >
          {v}
        </Tag>
      ),
      width: 90,
    },
    {
      title: '证据列表',
      dataIndex: 'evidence',
      key: 'evidence',
      render: (tags) => (
        <div>
          {tags.map((t) => (
            <span key={t} className="ev-tag">
              {t}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="section-header">
        <ExperimentOutlined style={{ color: '#2563eb' }} />
        可能解释患者主要表型的变异
      </div>
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={variants}
          pagination={false}
          size="middle"
          style={{ borderRadius: 12 }}
        />
        {/* Results note */}
        <div
          style={{
            margin: '12px 20px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 13,
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 6 }}>
            结果说明：
          </Text>
          <Text style={{ color: '#374151' }}>
            本次检测发现的MSH2基因致病性变异已在多项文献及临床数据库证据充分证实与林奇综合征（遗传性非息肉性结直肠癌，HNPCC）相关。该变异经文献及临床数据库证据充分证实，强烈支持致病性判定。建议结合家系表型进行优化筛查和随访，推荐家系相关遗传咨询。
          </Text>
        </div>
      </Card>
    </>
  );
}
