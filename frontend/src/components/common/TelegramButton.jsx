import { useEffect, useRef } from 'react';
import { telegram } from './icons'
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { useAlert } from '../../context/AlertContext';
import { useLanguage } from '../../hooks/useLanguage';

const TelegramButton = ({ loading, setLoading, telegramLoading }) => {
  const telegramWrapperRef = useRef(null);

  const { onTelegramLogin } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { t } = useLanguage();

  const onTelegramAuth = async (user) => {
    try {
      setLoading(true);
      const data = await onTelegramLogin(user);
      showAlert(data?.message || t.common.telegram.loginSuccess, { duration: 2500, type: 'success' });
      const path = localStorage.getItem("path");
      navigate(path || '/', { replace: true });
    } catch (error) {
      console.error('Telegram login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://telegram.org/js/telegram-widget.js?22";
    scriptElement.setAttribute(
      "data-telegram-login",
      import.meta.env.VITE_TELEGRAM_BOT_NAME
    );
    scriptElement.setAttribute("data-size", "large");
    scriptElement.setAttribute("data-onauth", "onTelegramAuth(user)");
    scriptElement.setAttribute("data-userpic", "false");
    scriptElement.setAttribute("data-request-access", "write");
    scriptElement.async = true;

    window.onTelegramAuth = onTelegramAuth;

    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(scriptElement);
    }

    // Clean up script when component unmounts
    return () => {
      if (telegramWrapperRef.current) {
        telegramWrapperRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <>
      <button className={`btn-outline max-w-full ${loading || telegramLoading ? "disable" : ""}`} disabled={loading || telegramLoading} >
        <img src={telegram} alt="Telegram" className="w-5 h-5" />
        {t.common.telegram.continueWith}
      </button>
      <div className='opacity-0' ref={telegramWrapperRef}></div>
    </>
  )
}

export default TelegramButton