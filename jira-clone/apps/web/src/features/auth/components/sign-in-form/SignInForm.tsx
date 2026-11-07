import { useState } from 'react';

import type { CSSProperties, FC, FormEvent } from 'react';

import { useNavigate } from 'react-router';

import { Input, Button, Text } from '../../../../components/base';

import { ROUTES } from '../../../../routes/paths';

import styles from './SignInForm.module.css';

// ============================================================================
// ICONS — inline, theme-aware (inherit currentColor from the input)
// ============================================================================

interface IconProps {
  size?: number;
}

const MailIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="4" width="16" height="11" rx="2" />
    <polyline points="5 15 12 21 19 15" />
  </svg>
);

const KeyIcon: FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="7" r="4" />
    <line x1="12" y1="11" x2="12" y2="20" />
    <polyline points="12 16 16 16 16 20" />
  </svg>
);

// ============================================================================
// Types
// ============================================================================

export interface SignInFormValues {
  /** Trimmed username */
  username: string;

  /** Raw password */
  password: string;
}

export interface SignInFormProps {
  /** Prefilled username value */
  initialUsername?: string;

  /** Prefilled password value */
  initialPassword?: string;

  /** Submit handler — replaces the default mock navigation once the API lands */
  onSubmit?: (values: SignInFormValues) => void | Promise<void>;

  /** Submit button label */
  submitLabel?: string;

  /** Loading state (disables fields and shows a spinner) */
  loading?: boolean;

  /** Form-level error banner (e.g. "Invalid username or password") */
  error?: string;

  /** Container style override. */
  style?: CSSProperties;

  /** Additional CSS class. */
  className?: string;

  /** Test identifier. */
  testID?: string;
}

/**
 * SignInForm — username/password sign-in form composed from base primitives.
 *
 * Validates locally (required fields), renders inline field errors,
 * and submits via `onSubmit` when provided.
 */
export const SignInForm: FC<SignInFormProps> = ({
  initialUsername = '',
  initialPassword = '',
  onSubmit,
  submitLabel = 'Sign In',
  loading = false,
  error,
  style,
  className = '',
  testID,
}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);

  const [usernameError, setUsernameError] = useState<string | undefined>(
    undefined
  );

  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();

    const trimmedUsername = username.trim();

    const nextUsernameError = !trimmedUsername
      ? 'Username is required.'
      : undefined;

    const nextPasswordError =
      password === '' ? 'Password is required.' : undefined;

    setUsernameError(nextUsernameError);
    setPasswordError(nextPasswordError);

    if (nextUsernameError || nextPasswordError) {
      return;
    }

    if (onSubmit) {
      void onSubmit({
        username: trimmedUsername,
        password,
      });
      return;
    }

    navigate(ROUTES.PROTECTED.HOME);
  };

  return (
    <form
      className={`${styles.form} ${className}`}
      style={style}
      data-testid={testID}
      onSubmit={handleSubmit}
      noValidate
    >
      <Input
        label="Username"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setUsernameError(undefined);
        }}
        error={usernameError}
        leftIcon={<MailIcon size={16} />}
        autoFocus
        disabled={loading}
        containerStyle={{ marginBottom: 0 }}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(undefined);
        }}
        error={passwordError}
        leftIcon={<KeyIcon size={16} />}
        disabled={loading}
        containerStyle={{ marginBottom: 0 }}
      />

      {error && (
        <div className={styles.errorBanner} role="alert">
          <Text variant="errorText" color="var(--color-warn)">
            {error}
          </Text>
        </div>
      )}

      <Button
        label={submitLabel}
        variant="primary"
        size="md"
        fullWidth
        loading={loading}
        disabled={loading}
        onPress={() => handleSubmit()}
      />

      {/* Hidden native submit button — enables Enter-to-submit from the inputs. */}
      <button
        type="submit"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'none' }}
      >
        Submit
      </button>
    </form>
  );
};

export default SignInForm;
