import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interfaces ---
export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPayload {
  message: string;
  conversationHistory: ChatHistoryItem[];
}

export interface BotResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7113/api/chat'; 

  /**
   * Sends the user message and history to the backend.
   * The authInterceptor will automatically attach the JWT token.
   */
  sendMessageToApi(payload: ChatPayload): Observable<BotResponse> {
    return this.http.post<BotResponse>(this.apiUrl, payload);
  }
}