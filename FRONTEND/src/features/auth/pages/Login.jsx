import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './auth.form.scss'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { HandleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const doNotRefresh = async (e) => {
    e.preventDefault();
    try {
      await HandleLogin(email, password);
      navigate('/'); // Use navigate function correctly
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  if (loading) return <h1>loading...</h1>

  return (
    <main className='login'>
      <div className='form-container'>
        <h1>LOGIN</h1>

        <form onSubmit={doNotRefresh}>
          <div className='input-container'>
            <label htmlFor="Email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder='Enter Your Email'

            />
          </div>
          <div className='input-container'>
            <label htmlFor="Password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder='Enter Your Password'

            />
          </div>
          <button className='btn' type="submit">
            Login
          </button>
        </form>

        <p>Don't have an account? <Link to={"/register"}>Register</Link> </p>
      </div>
    </main>
  )
}

export default Login
