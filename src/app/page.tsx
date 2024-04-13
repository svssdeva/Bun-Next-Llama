'use client'
import './page.css';
import {useRouter} from 'next/navigation';

export default function Home() {
    const router = useRouter()
    return (
        <main>
            <div className="container">
                <h2>Hello World</h2>
                <h1 className="mt-2">I am Deva :)</h1>
                <p className="mt-2"> @svssdeva</p>
                <div className="button-container">
                    <button className="button button-blink" onClick={() => router.push('/chat')}>
                        Start Chat with AI
                    </button>
                </div>
            </div>
        </main>
    );
}
