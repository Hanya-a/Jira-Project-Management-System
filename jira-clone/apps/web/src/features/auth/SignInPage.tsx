import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout } from './components/auth-layout';
import {
  SignInForm,
  type SignInFormValues,
} from './components/sign-in-form';
import { ROUTES } from '../../routes/paths';
import {
  apiClient,
  setAuthTokens,
  setStorageItem,
  STORAGE_KEYS,
} from '@jira-clone/shared';

export function SignInPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Stores the username that successfully passed the first login step.
  const [twoFactorUsername, setTwoFactorUsername] = useState('');

  // Controls whether the 2FA modal is visible.
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);

  // Six separate inputs for the 6-digit code.
  const [code, setCode] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [twoFactorError, setTwoFactorError] = useState<
    string | undefined
  >();

  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // --------------------------------------------------------------------------
  // STEP 1: Username + password login
  // --------------------------------------------------------------------------

  const handleSubmit = async ({
    username,
    password,
  }: SignInFormValues) => {
    try {
      setLoading(true);
      setError(undefined);

      const response = await apiClient.post(
        '/authentication/login/',
        {
          username,
          password,
        }
      );

      // The backend tells us that this account needs 2FA.
      if (response.data.requires_2fa) {
        setTwoFactorUsername(username);

        setCode([
          '',
          '',
          '',
          '',
          '',
          '',
        ]);

        setTwoFactorError(undefined);
        setShowTwoFactorModal(true);

        return;
      }

      // Normal login without 2FA.
      setAuthTokens({
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      });

      setStorageItem(
        STORAGE_KEYS.CURRENT_USER,
        response.data.username,
        'web'
      );

      navigate(ROUTES.PROTECTED.HOME);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          'Invalid username or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 2FA CODE INPUT
  // --------------------------------------------------------------------------

  const handleCodeChange = (
    index: number,
    value: string
  ) => {
    // Only allow numbers.
    const digit = value.replace(/\D/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = digit;

    setCode(newCode);
    setTwoFactorError(undefined);

    // Automatically move to the next box.
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move backwards when pressing Backspace on an empty input.
    if (
      event.key === 'Backspace' &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move backwards with the left arrow.
    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move forwards with the right arrow.
    if (
      event.key === 'ArrowRight' &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pastedCode) {
      return;
    }

    const newCode = [
      '',
      '',
      '',
      '',
      '',
      '',
    ];

    pastedCode
      .split('')
      .forEach((digit, index) => {
        newCode[index] = digit;
      });

    setCode(newCode);
    setTwoFactorError(undefined);

    const nextIndex = Math.min(
      pastedCode.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // --------------------------------------------------------------------------
  // STEP 2: Verify 2FA
  // --------------------------------------------------------------------------

  const handleVerifyTwoFactor = async () => {
    const enteredCode = code.join('');

    if (enteredCode.length !== 6) {
      setTwoFactorError(
        'Please enter the 6-digit verification code.'
      );
      return;
    }

    try {
      setTwoFactorLoading(true);
      setTwoFactorError(undefined);

      const response = await apiClient.post(
        '/authentication/2fa/verify/',
        {
          username: twoFactorUsername,
          code: enteredCode,
        }
      );

      // Backend returns the JWT tokens after successful verification.
      setAuthTokens({
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      });

      setStorageItem(
        STORAGE_KEYS.CURRENT_USER,
        response.data.username,
        'web'
      );

      setShowTwoFactorModal(false);

      navigate(ROUTES.PROTECTED.HOME);
    } catch (err: any) {
      setTwoFactorError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          err.response?.data?.code?.[0] ||
          'Invalid 2FA code.'
      );

      // Clear the code so the user can enter it again.
      setCode([
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      inputRefs.current[0]?.focus();
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Close 2FA modal
  // --------------------------------------------------------------------------

  const handleCloseTwoFactorModal = () => {
    if (twoFactorLoading) {
      return;
    }

    setShowTwoFactorModal(false);
    setTwoFactorError(undefined);
    setCode([
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  };

  return (
    <>
      <AuthLayout
        title="Welcome back"
        subtitle="Enter your credentials to access your account"
        footer={
          <>
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.AUTH.SIGN_UP}>
              Sign up
            </Link>
          </>
        }
      >
        <SignInForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </AuthLayout>

      {/* ------------------------------------------------------------------ */}
      {/* 2FA MODAL                                                         */}
      {/* ------------------------------------------------------------------ */}

      {showTwoFactorModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="two-factor-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseTwoFactorModal();
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '32px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-ink)',
              boxShadow:
                '0 20px 60px rgba(0, 0, 0, 0.25)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                id="two-factor-title"
                style={{
                  margin: '0 0 8px',
                  fontSize: '22px',
                  fontWeight: 600,
                }}
              >
                Two-Factor Authentication
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: 1.5,
                  color: 'var(--color-ink-muted)',
                }}
              >
                Enter the 6-digit code from your
                authenticator app.
              </p>
            </div>

            {/* Six digit inputs */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={twoFactorLoading}
                  autoFocus={index === 0}
                  aria-label={`Verification code digit ${
                    index + 1
                  }`}
                  onChange={(event) =>
                    handleCodeChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleCodeKeyDown(
                      index,
                      event
                    )
                  }
                  onPaste={handleCodePaste}
                  style={{
                    width: '44px',
                    height: '52px',
                    boxSizing: 'border-box',
                    border: '1px solid var(--color-line)',
                    borderRadius: '8px',
                    backgroundColor:
                      'var(--color-background)',
                    color: 'var(--color-ink)',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            {twoFactorError && (
              <div
                role="alert"
                style={{
                  marginBottom: '16px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor:
                    'rgba(220, 38, 38, 0.08)',
                  color: '#dc2626',
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              >
                {twoFactorError}
              </div>
            )}

            <button
              type="button"
              disabled={twoFactorLoading}
              onClick={() => {
                void handleVerifyTwoFactor();
              }}
              style={{
                width: '100%',
                padding: '11px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor:
                  'var(--color-primary)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: twoFactorLoading
                  ? 'not-allowed'
                  : 'pointer',
                opacity: twoFactorLoading
                  ? 0.7
                  : 1,
              }}
            >
              {twoFactorLoading
                ? 'Verifying...'
                : 'Verify'}
            </button>

            <button
              type="button"
              disabled={twoFactorLoading}
              onClick={handleCloseTwoFactorModal}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-ink-muted)',
                fontSize: '13px',
                cursor: twoFactorLoading
                  ? 'not-allowed'
                  : 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignInPage;
