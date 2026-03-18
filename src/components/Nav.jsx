import { Button, Space } from 'antd';
import { LeftOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';

// Note: In production import Button from '@onex/ui'

export default function Nav() {
  return (
    <>
      {/* Navigation bar */}
      <header className="nav-bar">
        <Button
          className="nav-back-btn"
          icon={<LeftOutlined />}
          ghost
          size="small"
          onClick={() => history.back()}
        >
          返回
        </Button>

        <div className="nav-title-wrap">
          <h1>🧬 基因变异ACMG智能诊断平台</h1>
          <p>基于ACMG/AMP指南的变异致病性评估系统</p>
        </div>

        {/* spacer to balance the back button */}
        <div style={{ width: 80 }} />
      </header>

      {/* Action bar */}
      <div className="action-bar">
        <Space>
          <Button icon={<FilePdfOutlined />}>导出PDF</Button>
          <Button icon={<FileWordOutlined />} type="primary">
            导出Word
          </Button>
        </Space>
      </div>
    </>
  );
}
