import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { ChatbotService, ChatPayload, ChatHistoryItem } from '../../../core/services/chatbot.services'; // Adjust path as needed

interface ChatMessage {
  text: string;
  sender: 'bot' | 'user';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  private chatbotService = inject(ChatbotService);

  isOpen = false; 
  showTooltip = true; 
  isTyping = false; 
  userInput = '';

  // The UI state (includes the initial greeting)
  messages: ChatMessage[] = [
    { text: "Hi! I'm here to help 😉 What can I do for you today?", sender: 'bot' }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.showTooltip = false; 
  }

  closeTooltip(event: Event) {
    event.stopPropagation();
    this.showTooltip = false;
  }

  sendMessage() {
    const textToSend = this.userInput.trim();
    if (!textToSend) return;

    // 1. Build the conversation history from current messages
    // We map 'bot' to 'assistant' and 'user' to 'user' to match your API schema
    const history: ChatHistoryItem[] = this.messages.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text
    }));

    // 2. Create the exact payload your API requires
    const payload: ChatPayload = {
      message: textToSend,
      conversationHistory: history
    };

    // 3. Immediately update the UI with the new user message
    this.messages.push({ text: textToSend, sender: 'user' });
    this.userInput = '';
    
    // 4. Show typing indicator and scroll down
    this.isTyping = true;
    this.scrollToBottom();

    // 5. Send the payload to the backend
    this.chatbotService.sendMessageToApi(payload).subscribe({
      next: (response) => {
        this.isTyping = false;
        // Append the backend's "reply" to our UI messages
        this.messages.push({ text: response.reply, sender: 'bot' });
        this.scrollToBottom();
      },
      error: (err) => {
        this.isTyping = false;
        console.error('Chat API Error:', err);
        this.messages.push({ 
          text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
          sender: 'bot' 
        });
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch(err) { }
  }
}