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

  messages: ChatMessage[] = [
    { text: "Hi! I'm here to help What can I do for you today?", sender: 'bot' }
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
    if (this.isOverWordLimit || this.currentWordCount === 0) return;

    const textToSend = this.userInput.trim();
    if (!textToSend) return;


    const history: ChatHistoryItem[] = this.messages.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text
    }));


    const payload: ChatPayload = {
      message: textToSend,
      conversationHistory: history
    };


    this.messages.push({ text: textToSend, sender: 'user' });
    this.userInput = '';
    

    this.isTyping = true;
    this.scrollToBottom();


    this.chatbotService.sendMessageToApi(payload).subscribe({
      next: (response) => {
        this.isTyping = false;
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

  

  get currentWordCount(): number {
    const trimmed = this.userInput.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  get isOverWordLimit(): boolean {
    return this.currentWordCount > 500;
  }
  

  onKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); 
        // Only send if they are under the limit!
        if (!this.isOverWordLimit) {
          this.sendMessage();
        }
      }
    }

  // Truncates the input if it exceeds 500 words
  enforceWordLimit() {
    const words = this.userInput.split(/\s+/);
    
    // Check if the array length exceeds 500 (ignoring trailing spaces)
    if (words.filter(w => w.length > 0).length > 500) {
      // Re-join only the first 500 words and append a space so they can keep typing if they backspace
      this.userInput = words.slice(0, 500).join(' ') + ' ';
    }
  }
}