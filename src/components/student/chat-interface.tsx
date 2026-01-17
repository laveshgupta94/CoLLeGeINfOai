'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, Send, User } from 'lucide-react';
import { getAiResponse } from '@/app/chat/actions';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

type Message = {
    id: number;
    role: 'user' | 'assistant';
    text: string;
};

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
      {id: 0, role: 'assistant', text: 'Hello! I am CampusConnect AI. How can I help you today?'}
    ]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessage: Message = { id: Date.now(), role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');

        startTransition(async () => {
            const response = await getAiResponse(currentInput);

            if (response.answer) {
                const assistantMessage: Message = { id: Date.now() + 1, role: 'assistant', text: response.answer };
                setMessages((prev) => [...prev, assistantMessage]);
            } else if (response.error) {
                const errorMessage: Message = { id: Date.now() + 1, role: 'assistant', text: response.error };
                setMessages((prev) => [...prev, errorMessage]);
            }
        });
    };
    
    useEffect(() => {
        const viewport = scrollAreaViewportRef.current;
        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);


    return (
        <Card className="flex flex-col h-[calc(100vh-12rem)] w-full max-w-3xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className='font-headline'>CampusConnect AI</CardTitle>
                <CardDescription>Your personal college assistant. Ask me anything!</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full" viewportRef={scrollAreaViewportRef}>
                    <div className="space-y-6 px-4 pb-4">
                        {messages.map((message) => (
                            <div key={message.id} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {message.role === 'assistant' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarFallback className="bg-primary text-primary-foreground"><GraduationCap size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn('max-w-[80%] rounded-lg px-4 py-2 shadow-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarFallback><User size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex items-start gap-3 justify-start">
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback className="bg-primary text-primary-foreground"><GraduationCap size={18} /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-[75%] rounded-lg px-4 py-3 bg-muted shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about events, exams, attendance..."
                        disabled={isPending}
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" disabled={isPending || !input.trim()} size="icon" aria-label="Send message">
                        <Send size={18} />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
