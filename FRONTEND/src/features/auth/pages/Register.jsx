import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './auth.form.scss'

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { HandleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const doNotRefresh = async (e) => {
    e.preventDefault();
    try {
      await HandleRegister(username, email, password);
      navigate('/'); // Redirect to home on success
    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  if (loading) return <h1>loading...</h1>

  return (
    <main className='login'>
      <div className='form-container'>
        <h1>REGISTER</h1>

        <form onSubmit={doNotRefresh}>
          <div className='input-container'>
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder='Enter Your username'
              value={username}
            />
          </div>

          <div className='input-container'>
            <label htmlFor="Email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder='Enter Your Email'
              value={email}
            />
          </div>

          <div className='input-container'>
            <label htmlFor="Password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder='Enter Your Password'
              value={password}
            />
          </div>

          <button className='btn' type="submit">Register</button>

        </form>

        <p>Already have an account? <Link to={"/login"}>Login</Link> </p>
      </div>
    </main>
  )
}

export default Register
