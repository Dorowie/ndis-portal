import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Define the exact shape your API expects for history
export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

// 2. Define the full request payload
export interface ChatPayload {
  message: string;
  conversationHistory: ChatHistoryItem[];
}

// 3. Define the response
export interface BotResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // TODO: Replace this with your actual backend endpoint
  private apiUrl = 'https://localhost:7113/api/chat'; 

  constructor(private http: HttpClient) {}

  sendMessageToApi(payload: ChatPayload): Observable<BotResponse> {
    return this.http.post<BotResponse>(this.apiUrl, payload);
  }
}