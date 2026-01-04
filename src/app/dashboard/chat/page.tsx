import { ChatInterface } from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-3xl font-bold">Tradeo</h1>
        <p className="text-muted-foreground mt-1">
          Get guidance based on the PB Blake Mechanical Trading Model
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}
