/**
 * App — 根组件
 *
 * 提供 FeedbackContext，组合所有页面模块：
 *   Nav → PatientInfoCard → VariantSummaryTable → VariantDetailCard
 *   → ConclusionCard → ReportFeedback + FloatingFeedback
 */
import { Card, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { FeedbackProvider } from './context/FeedbackContext';
import { PATIENT_DATA, VARIANT_SUMMARY, VARIANT_DETAIL } from './data/reportData';
import Nav from './components/Nav';
import PatientInfoCard from './components/PatientInfoCard';
import VariantSummaryTable from './components/VariantSummaryTable';
import VariantDetailCard from './components/VariantDetailCard';
import ReportFeedback from './components/ReportFeedback';

const { Title, Text, Paragraph } = Typography;

/** 综合分析结论卡片（静态内容） */
function ConclusionCard() {
  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb' }}>
          <FileTextOutlined />
          综合分析结论
        </span>
      }
    >
      <Title level={4} style={{ marginTop: 0 }}>
        遗传检测报告结论
      </Title>

      <Title level={5} style={{ color: '#374151', fontWeight: 600 }}>
        1. 检测结果总结
      </Title>
      <Paragraph style={{ fontSize: 13, color: '#374151' }}>
        {'本次遗传检测在MSH2基因（NM_000251.3:c.212-1G>A；chr2-47635539-G-A）发现一个明确的致病性剪接受体位点变异，经文献及临床数据库证据充分证实与林奇综合征（Lynch综合征，遗传性非息肉性结直肠癌，HNPCC，OMIM:120435）相关。该综合征属于常染色体显性遗传肿瘤易感综合征，主要导致早发性结直肠癌以及多种实体瘤风险显著增加。'}
      </Paragraph>

      <Title level={5} style={{ color: '#374151', fontWeight: 600 }}>
        2. ACMG变异分类与证据阐述
      </Title>
      <Paragraph style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
        该MSH2变异按照ACMG指南经多项证据评估，判定为"致病（Pathogenic，P）"：
      </Paragraph>
      <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 20, lineHeight: 2.2, marginBottom: 12 }}>
        <li>
          <Text strong>PVS1（非常强）：</Text>
          经典剪接位点（-1位点）变异，预测导致MSH2功能丧失，DNA错配修复系统功能受损
        </li>
        <li>
          <Text strong>PM2_P（支持性）：</Text>
          该变异在人群数据库（如gnomAD）中未见，属于极罕见变异
        </li>
        <li>
          <Text strong>PP3（支持性）：</Text>
          多个生物信息学预测（如SpliceAI）得分极高（0.990），表明剪接功能严重受损
        </li>
        <li>
          <Text strong>PM6（中等）：</Text>
          多文献报道患者临床表型与该变异符合，但缺乏明确亲代样本或亲缘关系验证
        </li>
        <li>
          <Text strong>BP2（反向，-1）：</Text>
          该变异在RNA层面同时出现两个异常剪接转录本，均源自同一等位（cis），实际不影响致病性总体判定
        </li>
      </ul>
      <Paragraph style={{ fontSize: 13, color: '#374151' }}>
        总分21分，致病性证据极为充分，判定为Pathogenic。
      </Paragraph>
    </Card>
  );
}

export default function App() {
  return (
    <FeedbackProvider>
      <div className="page-layout">
        <Nav />
        <div className="main-container">
          <PatientInfoCard data={PATIENT_DATA} />
          <VariantSummaryTable variants={VARIANT_SUMMARY} />
          <VariantDetailCard variant={VARIANT_DETAIL} />
          <ConclusionCard />
          <ReportFeedback />
        </div>
      </div>
    </FeedbackProvider>
  );
}
