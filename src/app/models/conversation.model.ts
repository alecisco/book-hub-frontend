export interface StartConversationDto {
    initiatorUserId: string;
    receiverNickname: string;
  }
  
  export interface ConversationDto {
    id: number;
    initiatorUserNickname: string;
    receiverUserNickname: string;
    lastMessage: string;
    unreadMessagesCount: number;
  }
  
  export interface MessageDto {
    senderNickname: string;
    text: string;
    timestamp: Date;
  }
  