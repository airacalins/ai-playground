import axios from 'axios';
import { useState } from 'react';
import TypingIndicator from './TypingIndicator';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import popSound from '../../assets/sounds/pop.mp3';
import notificationSound from '../../assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

export type ChatFormData = {
  prompt: string;
};

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      setError('');
      popAudio.play();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: crypto.randomUUID(),
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      notificationAudio.play();
    } catch (error) {
      console.error(error);
      setError('Something went wrong, try again!');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <p className="font-bold text-mist-700">AI Playground</p>
      <div className="flex flex-col flex-1 gap-4 mb-8 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} isBotTyping={isBotTyping} />
    </div>
  );
};

export default ChatBot;
