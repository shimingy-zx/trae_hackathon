import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { SendOutlined } from "@ant-design/icons";

// 样式组件
const Container = styled.div`
  width: 360px;
  min-height: 100vh;
  padding: 16px;
  margin-top: 16px;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const QuestionInput = styled.textarea`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  min-height: 42px;
  max-height: 126px; /* 5行文本的最大高度：14px * 1.5 * 5 + 10px * 2 = 126px */
  resize: none;
  line-height: 1.5;
  font-family: inherit;
  display: block;
  margin: 0;
  overflow-y: auto;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`;

const ConfirmButton = styled.button`
  padding: 0 20px;
  height: 42px;
  background: #1890ff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  align-self: flex-start;
  line-height: 42px;

  &:hover {
    background: #40a9ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  }

  &:active {
    background: #096dd9;
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AnswersContainer = styled.div`
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 4px;
  margin-right: -4px;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

const AnswerItem = styled.div`
  background: white;
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
    transform: translateY(-1px);
  }

  .answer-text {
    color: #333;
    font-size: 14px;
    line-height: 1.6;
    flex: 1;
    margin-right: 16px;
    padding: 2px 0;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .icon-wrapper {
    padding: 4px;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin-top: 2px;

    &:hover {
      background: rgba(24, 144, 255, 0.1);
    }
  }
`;

const SendIcon = styled(SendOutlined)`
  color: #1890ff;
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
`;

const MoreButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #1890ff;
  color: #1890ff;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(24, 144, 255, 0.05);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    border-color: #d9d9d9;
    color: #d9d9d9;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AnswerCount = styled.div`
  text-align: right;
  color: #999;
  font-size: 12px;
  margin-top: 8px;
`;

// 模拟回答生成器
const generateAnswers = (question) => {
  const baseAnswers = [
    `关于"${question}"，我建议可以这样处理...`,
    `针对"${question}"这个问题，建议您...`,
    `您提到的"${question}"，可以考虑以下方案...`,
  ];
  return baseAnswers;
};

// 模拟更多回答生成器
const generateMoreAnswers = (question, currentCount) => {
  const templates = [
    `此外，关于"${question}"，还可以...`,
    `对于"${question}"，还有一种解决方案是...`,
    `处理"${question}"时，也可以考虑...`,
    `补充一点，针对"${question}"...`,
    `另外一个处理"${question}"的思路是...`,
    `从其他角度看"${question}"，可以...`,
    `结合实际情况，对于"${question}"...`,
    `基于最佳实践，处理"${question}"时...`,
    `考虑到效率，解决"${question}"可以...`,
  ];

  // 随机选择两个不重复的回答
  const remainingAnswers = templates.slice(currentCount - 3);
  return remainingAnswers.slice(0, 2);
};

const MAX_ANSWERS = 12;

function App() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 重置高度以获取正确的 scrollHeight
      textarea.style.height = "auto";
      // 计算新高度（考虑 padding）
      const newHeight = Math.min(
        Math.max(42, textarea.scrollHeight), // 最小高度 42px
        126 // 最大高度：5行文本 = (14px * 1.5 * 5) + (10px * 2) = 126px
      );
      textarea.style.height = `${newHeight}px`;
    }
  };

  // 监听输入变化时调整高度
  useEffect(() => {
    adjustHeight();
  }, [question]);

  const handleConfirm = () => {
    if (question.trim()) {
      setAnswers(generateAnswers(question));
      setHasConfirmed(true);
    }
  };

  const handleMoreAnswers = () => {
    const moreAnswers = generateMoreAnswers(question, answers.length);
    setAnswers([...answers, ...moreAnswers]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  const handleInput = (e) => {
    setQuestion(e.target.value);
  };

  return (
    <Container>
      <InputContainer>
        <QuestionInput
          ref={textareaRef}
          placeholder="请输入问题"
          value={question}
          onChange={handleInput}
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <ConfirmButton onClick={handleConfirm} disabled={!question.trim()}>
          确认
        </ConfirmButton>
      </InputContainer>

      <AnswersContainer>
        {answers.map((answer, index) => (
          <AnswerItem key={index}>
            <span className="answer-text">{answer}</span>
            <div className="icon-wrapper">
              <SendIcon />
            </div>
          </AnswerItem>
        ))}

        {hasConfirmed && answers.length < MAX_ANSWERS && (
          <>
            <MoreButton onClick={handleMoreAnswers}>更多回答</MoreButton>
            <AnswerCount>
              {answers.length} / {MAX_ANSWERS} 条回答
            </AnswerCount>
          </>
        )}
      </AnswersContainer>
    </Container>
  );
}

export default App;
