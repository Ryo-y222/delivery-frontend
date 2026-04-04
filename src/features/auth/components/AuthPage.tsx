import { useState } from 'react';

export function AuthPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("送信",email, password);
    }
  return (
    <div>
      <h1>ログイン</h1>
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />
    </div>
  );
}