import { useState, useEffect, useRef } from "react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { PromptInputBox } from "@/components/ai-prompt-box";
import { Settings } from "lucide-react"; // Assuming you're using the settings panel from previous response
import axios from "axios";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import rehypeRaw from "rehype-raw"; // For rendering raw HTML (use with caution)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEFAULT_PROVIDER = import.meta.env.VITE_DEFAULT_AI_PROVIDER || "openai";

const DEFAULT_SYSTEM_PROMPT = `You are an expert Space Engineer with vast knowledge in aerospace engineering, astrophysics, orbital mechanics, spacecraft design, and space exploration. 

Your expertise includes:
- Rocket propulsion systems and spacecraft design
- Orbital mechanics and trajectory planning
- Space mission planning and operations
- Satellite technology and communications
- Planetary science and exploration
- Space station operations and life support systems
- Emerging space technologies and future missions

Provide detailed, accurate, and insightful responses based on your extensive knowledge.`;

export function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hello! I'm your AI Space Engineering Assistant. I can help you with questions about aerospace, orbital mechanics, spacecraft design, and space exploration. How can I assist you today?",
      sender: "ai",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [provider, setProvider] = useState(DEFAULT_PROVIDER);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [showSettings, setShowSettings] = useState(false); // State for settings panel
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message, files, voiceData) => {
    if (!message.trim() && (!files || files.length === 0) && !voiceData) return;

    const userMessageContent = voiceData
      ? `🎤 Voice message: ${message || "Transcribing..."}`
      : message;

    const userMessage = {
      id: Date.now(),
      content: userMessageContent,
      sender: "user",
      files: files || [],
      voiceData: voiceData || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("provider", provider);
      formData.append("systemPrompt", systemPrompt); // Send system prompt

      if (conversationId) {
        formData.append("conversationId", conversationId);
      }

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      if (voiceData) {
        formData.append("files", voiceData, "voice-recording.webm");
      }

      const response = await axios.post(`${API_URL}/chat/message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const {
        message: aiMessage,
        conversationId: newConvId,
        transcription,
      } = response.data;

      if (newConvId && !conversationId) {
        setConversationId(newConvId);
      }

      if (transcription && voiceData) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, content: `🎤 Voice: ${transcription}` }
              : msg
          )
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: aiMessage,
          sender: "ai",
        },
      ]);
    } catch (error) {
      console.error("Error calling AI API:", error);

      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: `❌ Error: ${errorMessage}. Please try again.`,
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      if (conversationId) {
        await axios.delete(`${API_URL}/chat/history/${conversationId}`);
      }
      setMessages([
        {
          id: 1,
          content: "Conversation cleared. How can I help you?",
          sender: "ai",
        },
      ]);
      setConversationId(null);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const getSenderName = (sender) => {
    return sender === "user"
      ? "You"
      : `NoorBIT AI Assistant`;
  };

  const presetPrompts = [
    {
      name: "Space Engineer",
      prompt: DEFAULT_SYSTEM_PROMPT,
    },
    {
      name: "Astrophysicist",
      prompt:
        "You are an expert Astrophysicist specializing in stellar evolution, cosmology, black holes, and the physics of the universe. Provide scientifically accurate explanations with relevant equations and theories when appropriate.",
    },
    {
      name: "Mission Controller",
      prompt:
        "You are a NASA Mission Controller with experience in spacecraft operations, mission planning, and real-time problem solving. Provide practical, operational insights based on actual space missions.",
    },
    {
      name: "General Assistant",
      prompt:
        "You are a helpful AI assistant. Provide clear, concise, and accurate responses to user questions.",
    },
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            NoorBIT AI Space Assistant
          </h1>
          {/* <p className="text-sm text-muted-foreground">
            Using {provider.toUpperCase()} • Expert Space Engineer Mode
          </p> */}
        </div>
        <div className="flex gap-2">
          {/* Provider Selector */}
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm"
            disabled={isLoading}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-accent transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          {/* Clear History Button */}
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm hover:bg-accent transition-colors"
            disabled={isLoading}
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Settings Panel  */}
      {showSettings && (
        <div className="border-b bg-card p-4">
          <h2 className="text-lg font-semibold mb-2 text-foreground">
            AI Settings
          </h2>
          <div className="mb-4">
            <label
              htmlFor="system-prompt"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              System Prompt (AI Persona)
            </label>
            <textarea
              id="system-prompt"
              className="w-full p-2 rounded-md border border-border bg-background text-foreground text-sm resize-y min-h-[100px]"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Define the AI's role and behavior..."
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Preset Prompts
            </label>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setSystemPrompt(preset.prompt)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs hover:bg-accent transition-colors"
                  disabled={isLoading}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            Close Settings
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden p-2">
        <ChatMessageList>
          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <ChatBubble
                key={message.id}
                variant={isUser ? "sent" : "received"}
              >
                <div
                  className={`flex items-start gap-3 ${
                    isUser
                      ? "justify-end flex-row-reverse text-right"
                      : "justify-start"
                  }`}
                >
                  {/* Avatar */}
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={
                      isUser
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                    }
                    fallback={isUser ? "U" : "AI"}
                  />

                  {/* Message + Sender Name */}
                  <div className="max-w-[90%]">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {getSenderName(message.sender)}
                    </p>
                    <ChatBubbleMessage variant={isUser ? "sent" : "received"}>
                      {/* Render AI messages with ReactMarkdown */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <div className="prose dark:prose-invert max-w-none prose-sm">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Custom components for better styling
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  className="text-blue-400 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ),
                              code: ({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) => {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  <pre className="bg-gray-800 p-3 rounded-md overflow-x-auto my-2">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code
                                    className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              pre: ({ node, ...props }) => (
                                <pre
                                  className="bg-gray-800 p-3 rounded-md overflow-x-auto my-2"
                                  {...props}
                                />
                              ),
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="text-2xl font-bold mt-4 mb-2"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-xl font-bold mt-3 mb-2"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-lg font-bold mt-2 mb-1"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  className="mb-2 leading-relaxed"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc list-inside mb-2 space-y-1"
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="list-decimal list-inside mb-2 space-y-1"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="ml-4" {...props} />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-4 border-gray-500 pl-4 italic my-2"
                                  {...props}
                                />
                              ),
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-2">
                                  <table
                                    className="min-w-full border-collapse border border-gray-600"
                                    {...props}
                                  />
                                </div>
                              ),
                              thead: ({ node, ...props }) => (
                                <thead className="bg-gray-700" {...props} />
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  className="border border-gray-600 px-4 py-2 text-left font-semibold"
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td
                                  className="border border-gray-600 px-4 py-2"
                                  {...props}
                                />
                              ),
                              tr: ({ node, ...props }) => (
                                <tr
                                  className="hover:bg-gray-800/50"
                                  {...props}
                                />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="font-bold text-white"
                                  {...props}
                                />
                              ),
                              em: ({ node, ...props }) => (
                                <em className="italic" {...props} />
                              ),
                              hr: ({ node, ...props }) => (
                                <hr
                                  className="my-4 border-gray-600"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {/* Display uploaded image */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(message.files[0])}
                            alt="Uploaded"
                            className="max-w-full max-h-[200px] rounded-md object-cover"
                          />
                        </div>
                      )}

                      {/* Display voice recording */}
                      {message.voiceData && (
                        <div className="mt-2">
                          <audio
                            controls
                            src={URL.createObjectURL(message.voiceData)}
                            className="max-w-full"
                          />
                        </div>
                      )}
                    </ChatBubbleMessage>
                  </div>
                </div>
              </ChatBubble>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <ChatBubble variant="received">
              <div className="flex items-start gap-3">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                  fallback="AI"
                />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    AI Assistant
                  </p>
                  <ChatBubbleMessage isLoading />
                </div>
              </div>
            </ChatBubble>
          )}

          <div ref={messagesEndRef} />
        </ChatMessageList>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t bg-card">
        <PromptInputBox
          onSend={handleSendMessage}
          isLoading={isLoading}
          placeholder="Type your message, upload an image, or record voice..."
        />
      </div>
    </div>
  );
}
