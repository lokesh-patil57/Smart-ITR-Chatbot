const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  TAX_YEAR: '2024-25',
  MAX_MESSAGE_LENGTH: 500,
  CHAT_HISTORY_LIMIT: 50,
  THEME: {
    light: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      text: '#333333',
      accent: '#2196f3'
    },
    dark: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      text: '#ffffff',
      accent: '#2196f3'
    }
  }
};

export default config; 