'use client';

import {useCallback, useEffect} from 'react';
import {atom, useAtom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import './page.css';
import Loading from '@/components/Loading';
import ChatInput from '@/components/ChatInput';


export type Message = {
    sender: 'user' | 'bot';
    text: string;
};

const messagesAtom = atomWithStorage<Message[]>('messages', []);
const loadingAtom = atom<boolean>(false);
const response = async (messages: Message[]) => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.sender === 'user') {
        const res = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "model": "llama2",
                "messages": [
                    {
                        "role": "user",
                        "content": lastMessage.text
                    }
                ],
                "stream": false
            }),
        });
        if (res.ok) {
            const data = await res.json();
            return data.message || '';
        }
    }

    return '';
};

export default function ChatPage() {
    const [messages, setMessages] = useAtom(messagesAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    useEffect(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    const handleSubmit = useCallback(
        async (message: string) => {
            setIsLoading(true);
            const newMessage: Message = {sender: 'user', text: message};
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            const botResponse = await response([...messages, newMessage]);
            console.log('61', botResponse);
            if (botResponse && botResponse.content) {
                const botMessage: Message = {sender: 'bot', text: botResponse?.content};
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
            setIsLoading(false);
        },
        [messages, setMessages, setIsLoading]
    );

    return (
        <div className="chat-container">
            {isLoading ? (
                <Loading/>
            ) : (
                <>
                    <div className="chat-history">
                        <div className="chat-messages">
                            {messages.map((message, index) => {
                                const parts = typeof message?.text === 'string' ? message?.text.split(/(`[^`]*`)/g) : [];
                                return (
                                    <div
                                        key={index}
                                        className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                                    >
                                        {parts.map((part, partIndex) =>
                                                part.startsWith('`') && part.endsWith('`') ? (
                                                    <pre key={partIndex}>
                            <code>{part.slice(1, -1)}</code>
                        </pre>
                                                ) : (
                                                    part
                                                )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="chat-input">
                        <ChatInput onSubmit={handleSubmit}/>
                    </div>
                </>
            )}
        </div>
    );
}
