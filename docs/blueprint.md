# **App Name**: LoginSnake

## Core Features:

- Email Login: Implement email login using Firebase Authentication. The firebaseConfig is: apiKey: AIzaSyCp54vCMkhov2JaLx5uo7t0sH0GMCyVbOI, authDomain: yunduanziliaokushiwu05.firebaseapp.com, projectId: yunduanziliaokushiwu05, storageBucket: yunduanziliaokushiwu05.firebasestorage.app, messagingSenderId: 28862711553, appId: 1:28862711553:web:ad423957314fcd1a0fbd00
- Google Login: Implement Google login using Firebase Authentication.
- Account Management: Implement registration, login, display name change, password change, email verification, password reset, logout, and account deletion using Firebase Authentication.
- Snake Game UI: Create a simple Snake game interface.
- Login Redirection: After successful login, redirect the user to the Snake game.

## Style Guidelines:

- Primary color: Dark Green (#1B5E20) for the snake game.
- Secondary color: Light Green (#AED581) for the snake food.
- Accent: Yellow (#FFEB3B) for highlighting important elements.
- Clean and readable sans-serif font for the entire application.
- Simple and clear icons for account management actions.
- Clean and intuitive layout for both login and game screens.
- Smooth transitions between login and game screens.

## Original User Request:
使用firebase authentication的Email登入與 Google 作為網頁登入方式

註冊、登入、更改顯示名稱、修改密碼、驗證信箱、忘記密碼、登出、刪除帳號、Google帳號登入

登入後切換到貪吃蛇遊戲畫面

const firebaseConfig = {
  apiKey: "AIzaSyCp54vCMkhov2JaLx5uo7t0sH0GMCyVbOI",
  authDomain: "yunduanziliaokushiwu05.firebaseapp.com",
  projectId: "yunduanziliaokushiwu05",
  storageBucket: "yunduanziliaokushiwu05.firebasestorage.app",
  messagingSenderId: "28862711553",
  appId: "1:28862711553:web:ad423957314fcd1a0fbd00"
};
  