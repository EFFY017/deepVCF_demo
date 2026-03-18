/**
 * Design Token Configuration
 * Maps to the base component library's theme system (built on Ant Design).
 * In production, these tokens are configured centrally in the base component library.
 */
export const themeConfig = {
  token: {
    // Brand
    colorPrimary: '#2563eb',
    colorPrimaryHover: '#1d4ed8',
    colorPrimaryBg: '#eff6ff',

    // Semantic
    colorSuccess: '#22c55e',
    colorSuccessBg: '#dcfce7',
    colorError: '#dc2626',
    colorErrorBg: '#fee2e2',
    colorWarning: '#f59e0b',

    // Neutrals
    colorBgLayout: '#f8fafc',
    colorBgContainer: '#ffffff',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    colorSplit: '#f1f5f9',

    // Shape
    borderRadius: 12,
    borderRadiusSM: 8,
    borderRadiusLG: 16,
    borderRadiusXS: 4,

    // Typography
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    lineHeight: 1.6,

    // Shadow
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    boxShadowSecondary: '0 2px 8px rgba(37,99,235,0.12)',
  },
  components: {
    Card: {
      headerBg: 'transparent',
      paddingLG: 20,
    },
    Collapse: {
      borderRadiusLG: 8,
      contentPadding: '14px 16px',
    },
    Rate: {
      starColor: '#f59e0b',
      starSize: 22,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      headerSortActiveBg: '#f8fafc',
      rowHoverBg: '#f8fafc',
    },
    Descriptions: {
      labelBg: '#f8fafc',
    },
  },
};
