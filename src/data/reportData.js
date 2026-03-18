export const PATIENT_DATA = {
  id: 'P00000001',
  age: '未填写',
  gender: '未知',
  onsetAge: '未填写',
  testType: '全外显子组测序 (WES)',
  familyStructure: '单人组（仅先证者）',
  phenotype:
    '因呼吸困难和端坐呼吸而就诊。胸部 X 光片和 CT 显示肺部有肿块，被诊断为急性 T 淋巴母细胞淋巴瘤（T-cell acute lymphoblastic lymphoma），随后多次接受化疗。不久之后，也出现另一处血管病变，并在脑部 FLAIR 显示多处细点状增强化，但未发现颅高压，也有神经症状（CSF 分析未显示恶性细胞）。综合分析和影像学检查，融合 MRI 显示考虑脑白质异常，母亲有结肠癌家族史。',
};

export const VARIANT_SUMMARY = [
  {
    key: '1',
    gene: 'MSH2',
    location: 'chr2-47635539-G-A (hg19) / chr2-47408400-G>A (hg38)',
    variant: 'NM_000251.3:c.212-1G>A\nsplice_acceptor_variant&intron_variant',
    origin: 'Oli',
    disease: '林奇综合征（Lynch综合征，遗传性非息肉性结直肠癌，HNPCC）（常染色体显性）',
    classification: '致病',
    classificationColor: '#dc2626',
    evidence: ['PP3', 'PM2_P', 'PVS1', 'PM6', 'PP1_M', 'PS3_M', 'PM3_VS', 'BP2'],
  },
];

export const VARIANT_DETAIL = {
  id: 1,
  title: '变异 #1: MSH2基因 NM_000251.3:c.212-1G>A',
  classification: '致病',
  classificationColor: '#dc2626',
  basicInfo: [
    { label: '基因', value: 'MSH2' },
    { label: '染色体位置', value: 'chr2-47635539-G-A (hg19) / chr2-47408400-G>A (hg38)' },
    { label: '转录本', value: 'NM_000251.3:c.212-1G>A' },
    { label: '变异类型', value: 'splice_acceptor_variant&intron_variant' },
    { label: '外显子', value: '1/15' },
    { label: 'rsID', value: 'rs267607914', link: true },
    { label: '基因型', value: '0|1' },
    { label: '等位基因深度', value: '50,36' },
  ],
  acmgOverview: {
    pathogenicScore: 21,
    benignScore: -19,
    finalClass: '致病',
    criteria: 'PP3 PM2_P PVS1 PM6 PP1_M PS3_M PM3_P BP2',
  },
  pathogenicEvidence: [
    {
      id: 'pvs1',
      title: 'PVS1 - 无效变异',
      score: '+8分',
      description:
        '预测导致基因功能缺失的变异（无义、移码、经典剪接位点±1或2、起始密码子丢失、单外显子或多外显子缺失），且该基因的功能缺失（LOF）是导致该疾病的已知致病机制',
      reasoning:
        'PVS1评估强度: Very Strong (PVS1)；临床意义：此变异符合完整的PVS1证据标准，提供致病性的非常强证据；变异类型: Splice-3; 基因: MSH2; HGVS: NM_000251.3:c.212-1G>A；决策路径: Preliminary Decision Path: SS1; 决策步骤: GT-AG splice sites → Exon skipping or use of a cryptic splice site disrupts reading frame and is predicted to undergo NMD → Exon is present in biologically-relevant transcript(s) → VeryStrong; pLI分数: 0.868; 单倍剂量不足性: 3; 外显子: -/16, 内含子: 1/15',
      refs: [
        {
          url: 'https://gnomad.broadinstitute.org/gene/MSH2',
          desc: 'gnomAD gene record',
        },
        {
          url: 'https://search.clinicalgenome.org/kb/genes/MSH2',
          desc: 'ClinGen Gene-Disease Validity Curations',
        },
      ],
    },
    {
      id: 'pm6',
      title: 'PM6 - 新发变异（未确认）',
      score: '+2分',
      description:
        '假定为新发变异（患者携带但表型正常的双亲未检测或无法获取双亲样本），且患者临床表型符合该基因相关疾病，但缺乏亲子关系的确认',
      reasoning: '数据源3: 文献报道的de novo证据（分值=1.5）总评分: 1.5',
      refs: [
        {
          url: 'https://doi.org/10.1038/sj.bjc.6603754',
          desc: '文中表1列出了MSH2基因的germline突变c.212-1G>A，被确认为致病性剪接位点突变，出现在家系编号700的患者中。该突变被明确检测为germline突变，但全文未提及其在该患者中为"de novo"产生或亲代检测阴性等信息。（6603754a_processed.md）',
        },
        {
          url: 'https://doi.org/10.1371/journal.pone.0081194',
          desc: '在表1中，患者LCH-86被报道携带MSH2基因的剪接位点突变c.212-1G>A，但全文没有任何信息说明该突变是否为新发（de novo）或父母携带状态。（pone.0081194_processed.md）',
        },
      ],
    },
    {
      id: 'pp3',
      title: 'PP3 - 计算预测支持',
      score: '+1分',
      description: '多个生物信息学预测工具预测该变异有害，支持致病性',
      reasoning: 'SpliceAI得分: 0.990；MaxEntScan预测剪接位点损伤',
      refs: [],
    },
    {
      id: 'pm2p',
      title: 'PM2_P - 低群体频率（支持性）',
      score: '+1分',
      description: '该变异在人群数据库（如gnomAD）中未见或极罕见，属于极罕见变异',
      reasoning: 'gnomAD v3.1.2中未检索到该变异；人群频率 < 0.00001',
      refs: [],
    },
    {
      id: 'pp1m',
      title: 'PP1_M - 疾病共分离（中等）',
      score: '+2分',
      description: '该变异与疾病在家系中共分离，多家系受累成员均携带该突变，无反向共分离报道',
      reasoning: '家系共分离趋势显著，多家系受累成员均携带该突变，无反向共分离报道',
      refs: [],
    },
    {
      id: 'ps3m',
      title: 'PS3_M - 功能研究支持（中等）',
      score: '+2分',
      description:
        '多项功能实验（RT-PCR、MSI、IHC、ASE）均证实MSH2表达或剪接严重异常，导致蛋白缺失及功能丧失',
      reasoning: 'RT-PCR、MSI、IHC、ASE均证实MSH2表达或剪接严重异常',
      refs: [],
    },
    {
      id: 'pm3vs',
      title: 'PM3_VS - 复合杂合（极强）',
      score: '+6分',
      description:
        '文献中多个受累患者同时存在该突变及另一致病性变异（复合杂合，trans），证据充分',
      reasoning: '文献中多个受累患者同时存在该突变及另一致病性变异（复合杂合，trans），证据充分',
      refs: [],
    },
  ],
  benignEvidence: [
    {
      id: 'bp2',
      title: 'BP2 - 反式/顺式观察',
      score: '-1分',
      description:
        '在反式观察到该变异与已知致病变异同时存在（表明两者可独立存在），或在顺式观察到该变异与致病变异位于同一染色体（未形成复合杂合）',
      reasoning:
        '在MMR 2018研究中，MSH2: c.212-1G>A 与两个移码转录本 c.212_c.292 (p.Gly71Valfs*2) 和 c.212_c.297 (p.Gly71Glufs*75) 同时存在，并由同一等位突变引起，两者构成完全的同等位关系（cis）。根据ACMG BP2定义，突变与另一致病性变异在同一等位上可支持BP2。',
      refs: [
        {
          url: 'https://doi.org/10.3892/mmr.2018.8752',
          desc: '该患者携带MSH2基因的剪接位点突变c.212-1G>A，并在同一cDNA分析中检测到异常转录本c.212_c.292，导致移码和过早终止密码子(p.Gly71Valfs*2)。（mmr-17-05-6942_processed.md）',
        },
      ],
    },
  ],
};
