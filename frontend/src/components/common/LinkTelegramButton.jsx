import { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../context/AlertContext';
import { useLanguage } from '../../hooks/useLanguage';

const LinkTelegramButton = ({ loading, setLoading }) => {
  const telegramWrapperRef = useRef(null);

  const { linkTelegramAccount } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useLanguage();

  const onTelegramAuth = async (user) => {
    try {
      setLoading(true);
      const data = await linkTelegramAccount(user);
      if (data?.success) {
        showAlert(data?.message || t.admin.telegramLinkedSuccess || 'Telegram account linked successfully', {
          duration: 2500,
          type: 'success',
        });
      } else {
        showAlert(data?.error || t.admin.failedToLinkTelegram || 'Failed to link Telegram account', {
          duration: 2500,
          type: 'warning',
        });
      }
    } catch (error) {
      console.error('Telegram link failed:', error);
      showAlert(
        error?.response?.data?.error ||
          error?.message ||
          t.admin.failedToLinkTelegram ||
          'Failed to link Telegram account',
        { duration: 2500, type: 'warning' }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22';
    scriptElement.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_NAME);
    scriptElement.setAttribute('data-size', 'medium');
    scriptElement.setAttribute('data-onauth', 'onTelegramAuth(user)');
    scriptElement.setAttribute('data-userpic', 'false');
    scriptElement.setAttribute('data-request-access', 'write');
    scriptElement.async = true;

    window.onTelegramAuth = onTelegramAuth;

    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(scriptElement);
    }

    return () => {
      if (telegramWrapperRef.current) {
        telegramWrapperRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div ref={telegramWrapperRef} className="min-h-[24px]" />
      {loading && (
        <span className="text-xs text-secondary">{t.admin.linking || 'Linking...'}</span>
      )}
    </div>
  );
};

export default LinkTelegramButton;
