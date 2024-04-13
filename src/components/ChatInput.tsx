'use client';

import {useState} from 'react';
import './ChatInput.css';

interface ChatInputProps {
    onSubmit: (message: string) => void;
}

const ChatInput = (props: ChatInputProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSubmit(inputValue);
        setInputValue(''); // Clear the input after submitting
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input"
                placeholder="Type your message..."
            />
            <button type="submit" className="button">
                Send
            </button>
        </form>
    );
};

export default ChatInput;
