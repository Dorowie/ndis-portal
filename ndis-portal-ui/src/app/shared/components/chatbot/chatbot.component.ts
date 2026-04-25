import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  sender: 'bot' | 'user';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  isOpen = false; // FIX: Starts closed on page refresh
  showTooltip = true; // Tooltip shows initially
  isTyping = false; // Controls the typing animation
  userInput = '';

  messages: ChatMessage[] = [
    { text: "Hi! I'm here to help 😉 What can I do for you today?", sender: 'bot' }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.showTooltip = false; // Once interacted, hide the tooltip permanently
  }

  closeTooltip(event: Event) {
    event.stopPropagation();
    this.showTooltip = false;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({ text: this.userInput, sender: 'user' });
    this.userInput = '';
    
    // Show typing indicator
    this.isTyping = true;
    this.scrollToBottom();

    // Mock backend delay (1.5 seconds)
    setTimeout(() => {
      this.isTyping = false; // Hide typing indicator
      this.messages.push({ text: "This is a mockup response! Backend integration pending.", sender: 'bot' });
      this.scrollToBottom();
    }, 1500);
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