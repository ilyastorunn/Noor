import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, LockKeyhole, LogIn, Mail, UserRoundPlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { formatAuthError, signInWithEmail, signUpWithEmail } from '@/services/auth';
import { BorderRadius, DesignTokens, Spacing } from '@/constants/theme';

export default function AuthScreen() {
  const router = useRouter();
  const { user, firebaseConfigured, authError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/quran');
    }
  }, [router, user]);

  const isSignup = mode === 'signup';

  const handleSubmit = async () => {
    if (!firebaseConfigured) {
      setErrorMessage(authError ?? 'Firebase is not configured.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Enter your email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await Haptics.selectionAsync();

      if (isSignup) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      setErrorMessage(formatAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.select({ ios: 'padding', default: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={18} color={DesignTokens.text.heading} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Qur&apos;an Account</Text>
            <Text style={styles.title}>
              {isSignup ? 'Save your place across devices.' : 'Return to your last ayah.'}
            </Text>
            <Text style={styles.subtitle}>
              Sign in to unlock bookmarks, synced reading progress, streaming recitation, and
              premium downloads.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.modeRow}>
              <Pressable
                style={[styles.modeButton, !isSignup && styles.modeButtonActive]}
                onPress={() => setMode('signin')}
              >
                <LogIn
                  size={16}
                  color={!isSignup ? DesignTokens.text.onPrimary : DesignTokens.text.body}
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    !isSignup && styles.modeButtonTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeButton, isSignup && styles.modeButtonActive]}
                onPress={() => setMode('signup')}
              >
                <UserRoundPlus
                  size={16}
                  color={isSignup ? DesignTokens.text.onPrimary : DesignTokens.text.body}
                />
                <Text
                  style={[styles.modeButtonText, isSignup && styles.modeButtonTextActive]}
                >
                  Create Account
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputShell}>
                <Mail size={16} color={DesignTokens.text.muted} />
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor={DesignTokens.text.muted}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputShell}>
                <LockKeyhole size={16} color={DesignTokens.text.muted} />
                <TextInput
                  autoCapitalize="none"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  secureTextEntry
                  placeholder="At least 6 characters"
                  placeholderTextColor={DesignTokens.text.muted}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {!firebaseConfigured ? (
              <View style={styles.configCard}>
                <Text style={styles.configTitle}>Firebase setup required</Text>
                <Text style={styles.configBody}>
                  {authError ??
                    'Build the app with an iOS development build and a valid GoogleService-Info.plist to enable sign in.'}
                </Text>
              </View>
            ) : null}

            <Pressable
              disabled={!firebaseConfigured || submitting}
              style={[
                styles.submitButton,
                (!firebaseConfigured || submitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color={DesignTokens.text.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignup ? 'Create account' : 'Sign in'}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.background.primary,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  backButtonText: {
    color: DesignTokens.text.heading,
    fontSize: 15,
  },
  hero: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  eyebrow: {
    fontSize: 12,
    color: DesignTokens.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: DesignTokens.text.heading,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: DesignTokens.text.body,
  },
  card: {
    backgroundColor: DesignTokens.background.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.border.subtle,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: DesignTokens.background.surfaceAlt,
  },
  modeButtonActive: {
    backgroundColor: DesignTokens.accent.primary,
  },
  modeButtonText: {
    color: DesignTokens.text.body,
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: DesignTokens.text.onPrimary,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    color: DesignTokens.text.heading,
    fontSize: 14,
    fontWeight: '600',
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: DesignTokens.border.light,
    backgroundColor: DesignTokens.background.primary,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    color: DesignTokens.text.heading,
    fontSize: 16,
    paddingVertical: Spacing.md,
  },
  errorText: {
    color: '#FCA5A5',
    lineHeight: 20,
  },
  configCard: {
    backgroundColor: 'rgba(248, 215, 148, 0.08)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 215, 148, 0.2)',
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  configTitle: {
    color: DesignTokens.text.heading,
    fontSize: 14,
    fontWeight: '600',
  },
  configBody: {
    color: DesignTokens.text.body,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: DesignTokens.accent.primary,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: DesignTokens.text.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
