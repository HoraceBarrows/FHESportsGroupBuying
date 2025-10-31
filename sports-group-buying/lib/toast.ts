type ToastType = 'info' | 'success' | 'error';

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error-message, .success-message, .info-message');
    existingMessages.forEach((msg) => {
      (msg as HTMLElement).style.opacity = '0';
      setTimeout(() => msg.remove(), 300);
    });

    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.opacity = '0';
    messageDiv.style.transition = 'opacity 0.3s ease';

    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(messageDiv, container.firstChild);

      // Fade in
      setTimeout(() => (messageDiv.style.opacity = '1'), 10);

      // Auto dismiss after 5 seconds
      const timeout = type === 'error' ? 8000 : 5000;
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.style.opacity = '0';
          setTimeout(() => messageDiv.remove(), 300);
        }
      }, timeout);
    }
  },

  info: (message: string) => toast.show(message, 'info'),
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
};
