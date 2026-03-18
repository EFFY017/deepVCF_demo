/**
 * TriStateGroup — 三态按钮组
 * 用于证据级（A层）和变异级（B层）反馈。
 * 对应基础组件库的 oVariant="tristate" Button 变体。
 */
import { Button, Space } from 'antd';

const ACTIVE_CLASS = {
  correct:   'active-correct',
  wrong:     'active-wrong',
  uncertain: 'active-uncertain',
  agree:     'active-correct',
  disagree:  'active-wrong',
};

/**
 * @param {string|null} value  - 当前选中值
 * @param {Function}    onChange - (value: string|null) => void
 * @param {Array}  options  - [{ value, label, activeType }]
 */
export default function TriStateGroup({ value, onChange, options }) {
  const handleClick = (optValue) => {
    // 再次点击当前选中项 → 取消选中
    onChange(optValue === value ? null : optValue);
  };

  return (
    <Space size={8} wrap>
      {options.map((opt) => {
        const isActive = value === opt.value;
        const activeClass = isActive ? (ACTIVE_CLASS[opt.activeType] ?? '') : '';
        return (
          <Button
            key={opt.value}
            className={`tri-btn${activeClass ? ` ${activeClass}` : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </Space>
  );
}
