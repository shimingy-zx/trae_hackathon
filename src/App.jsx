import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { SendOutlined } from "@ant-design/icons";
import { RoleType, ChatStatus } from "@coze/api";
import { client, botId } from "./client";

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

// 使用 Coze API 获取回答
const getCozeAnswer = async (question) => {
  if (!botId) {
    console.error("botId is required");
    return ["Error: Bot ID is not configured"];
  }

  try {
    const response = await client.chat.createAndPoll({
      bot_id: botId,
      additional_messages: [
        {
          role: RoleType.User,
          content: question,
          content_type: "text",
        },
      ],
    });

    if (response.chat.status === ChatStatus.COMPLETED && response.messages) {
      // 返回助手的回答，格式化为 [role]:[type]:content 的形式
      return response.messages
        .filter((msg) => msg.role === "assistant")
        .map((msg) => `[${msg.role}]:[${msg.content_type}]:${msg.content}`);
    }

    return ["No response from bot"];
  } catch (error) {
    console.error("Error calling Coze API:", error);
    return ["Error: Failed to get response from bot"];
  }
};

function App() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [setHasConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(42, textarea.scrollHeight), 126);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [question]);

  const handleConfirm = async () => {
    if (question.trim() && !isLoading) {
      setIsLoading(true);
      const cozeAnswers = await getCozeAnswer(question);
      setAnswers(cozeAnswers);
      setHasConfirmed(true);
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />
        <ConfirmButton
          onClick={handleConfirm}
          disabled={!question.trim() || isLoading}
        >
          {isLoading ? "请稍等..." : "确认"}
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
      </AnswersContainer>
    </Container>
  );
}

export default App;
