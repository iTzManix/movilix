import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { ASSISTANT_GREETINGS, ASSISTANT_RESPONSES } from '../data/mockAssistantMessages';
import type { ChatMessage } from '../types';

const SUGGESTIONS = [
  '¿Cómo está mi ruta?',
  'Reportes de trameaje',
  'Zonas críticas ahora',
  'Actividad de hoy',
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(ASSISTANT_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return ASSISTANT_RESPONSES.default;
}

function TypingIndicator() {
  return (
    <View style={styles.typingBubble}>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ translateY: 0 }}
          animate={{ translateY: -4 }}
          transition={{
            type: 'timing',
            duration: 400,
            loop: true,
            delay: i * 150,
            repeatReverse: true,
          }}
          style={styles.typingDot}
        />
      ))}
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 14 }}
      style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}
    >
      {!isUser && (
        <View style={styles.assistantAvatar}>
          <Ionicons name="chatbubble-ellipses" size={14} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.messageContent, isUser && styles.userContent]}>
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {message.content}
        </Text>
      </View>
    </MotiView>
  );
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: ASSISTANT_GREETINGS[0],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Asistente</Text>
        <Text style={styles.subtitle}>MoviliX AI</Text>
      </View>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          {SUGGESTIONS.map((suggestion, index) => (
            <MotiView
              key={suggestion}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: index * 100 }}
            >
              <Pressable
                style={styles.suggestionChip}
                onPress={() => sendMessage(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </Pressable>
            </MotiView>
          ))}
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <TypingIndicator />
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />
        <Pressable
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: 50,
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.textSecondary,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    gap: 12,
  },
  messageBubble: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageContent: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userContent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  messageText: {
    fontSize: Theme.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  typingContainer: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 40,
    paddingTop: Theme.spacing.sm,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: Theme.fontSize.base,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
