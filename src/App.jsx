import { useState } from 'react'
import styled from 'styled-components'
import { SendOutlined } from '@ant-design/icons'

// 样式组件
const Container = styled.div`
  width: 360px;
  min-height: 100vh;
  padding: 16px;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
`

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`

const QuestionInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
`

const ConfirmButton = styled.button`
  padding: 0 20px;
  background: #1890ff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
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
`

const AnswerItem = styled.div`
  background: white;
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
    transform: translateY(-1px);
  }

  span {
    color: #333;
    font-size: 14px;
    line-height: 1.5;
  }
`

const SendIcon = styled(SendOutlined)`
  color: #1890ff;
  font-size: 16px;
  opacity: 0.8;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    background: rgba(24, 144, 255, 0.1);
  }
`

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
`

// 模拟回答生成器
const generateAnswers = (question) => {
  const baseAnswers = [
    `关于"${question}"，我建议可以这样处理...`,
    `针对"${question}"这个问题，建议您...`,
    `您提到的"${question}"，可以考虑以下方案...`
  ]
  return baseAnswers
}

// 模拟更多回答生成器
const generateMoreAnswers = (question) => {
  return [
    `除了上述建议，对于"${question}"，还可以...`,
    `另外，处理"${question}"时，也可以考虑...`
  ]
}

function App() {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)

  const handleConfirm = () => {
    if (question.trim()) {
      setAnswers(generateAnswers(question))
      setHasConfirmed(true)
      setShowMore(false)
    }
  }

  const handleMoreAnswers = () => {
    const moreAnswers = generateMoreAnswers(question)
    setAnswers([...answers, ...moreAnswers])
    setShowMore(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <Container>
      <InputContainer>
        <QuestionInput 
          placeholder="请输入问题"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <ConfirmButton 
          onClick={handleConfirm}
          disabled={!question.trim()}
        >
          确认
        </ConfirmButton>
      </InputContainer>
      
      {answers.map((answer, index) => (
        <AnswerItem key={index}>
          <span>{answer}</span>
          <SendIcon />
        </AnswerItem>
      ))}
      
      {hasConfirmed && !showMore && (
        <MoreButton onClick={handleMoreAnswers}>
          更多回答
        </MoreButton>
      )}
    </Container>
  )
}

export default App
