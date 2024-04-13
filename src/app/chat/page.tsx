'use client'

import {Ollama} from "ollama";
import {atom} from "jotai/vanilla/atom";
import {useAtom} from "jotai/ts3.8/esm/react/useAtom";

const ollama = new Ollama({host: "http://localhost:11434"});

const response = async (messages: { sender: "user" | "bot"; text: string }[]) => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "user") {
        const chatResponse = await ollama.chat({
            model: "llama2",
            messages: messages.map(({sender, text}) => ({role: "user", content: text})),
            stream: false,
        });

        return chatResponse?.message?.content || "";
    }
    return "";
};
export default function Chat() {
    const loading = atom(false);
    const [isLoading, setIsLoading] = useAtom(loading);
    return (
        <>
            <h1>Chat</h1>
        </>
    );
}
