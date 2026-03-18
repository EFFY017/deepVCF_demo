import { Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Note: In production import Card from '@onex/ui'

export default function PatientInfoCard({ data }) {
  const fields = [
    { label: '患者ID/报告编号', value: data.id },
    { label: '年龄', value: data.age },
    { label: '性别', value: data.gender },
    { label: '起病年龄', value: data.onsetAge },
    { label: '检测类型', value: data.testType },
    { label: '家系结构', value: data.familyStructure },
  ];

  return (
    <Card
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 0 }}
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined style={{ color: '#2563eb' }} />
          患者信息概览
        </span>
      }
    >
      {/* Info grid */}
      <div className="patient-info-grid">
        {fields.map((f) => (
          <div key={f.label} className="patient-info-cell">
            <Text
              type="secondary"
              style={{ display: 'block', fontSize: 11, marginBottom: 2 }}
            >
              {f.label}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</Text>
          </div>
        ))}
      </div>

      {/* Phenotype */}
      <div
        style={{
          padding: '12px 20px',
          fontSize: 13,
          color: '#374151',
          lineHeight: 1.75,
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <Text strong>表型说明：</Text>
        {data.phenotype}
      </div>
    </Card>
  );
}
