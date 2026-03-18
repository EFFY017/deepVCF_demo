/**
 * FloatingFeedback — D层：悬浮反馈入口
 *
 * 固定于页面右下角，实时展示已标注证据条数。
 * 点击后平滑滚动至报告级别反馈区域。
 * 提交后切换为"已反馈"绿色状态。
 */
import { useFeedback } from '../context/FeedbackContext';
import { CheckCircleFilled, MessageFilled } from '@ant-design/icons';

export default function FloatingFeedback() {
  const { annotatedCount, totalEvidence, submitted } = useFeedback();

  const handleClick = () => {
    if (submitted) return;
    const section = document.getElementById('report-feedback-section');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      className={`floating-feedback-btn ${submitted ? 'submitted' : ''}`}
      onClick={handleClick}
      aria-label={submitted ? '已反馈' : '提交诊断反馈'}
    >
      {submitted ? (
        <>
          <CheckCircleFilled style={{ fontSize: 18 }} />
          <span>已反馈</span>
        </>
      ) : (
        <>
          <MessageFilled style={{ fontSize: 18 }} />
          <span>提交诊断反馈</span>
          <span className="fab-progress-tag">
            已标注 {annotatedCount}/{totalEvidence} 条证据
          </span>
        </>
      )}
    </button>
  );
}
