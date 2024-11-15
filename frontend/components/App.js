import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()

  const redirectToLogin = () => {
    navigate('/')
  }

  const redirectToArticles = () => {
    navigate('/articles')
  }

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin() // Redirect to login screen
  }

  const login = async ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store the token
        localStorage.setItem('token', data.token)
        setMessage('Login successful!')
        redirectToArticles() // Redirect to articles screen
      } else {
        setMessage(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setSpinnerOn(false)
    }
  }

  const getArticles = async () => {
    setMessage('')
    setSpinnerOn(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        redirectToLogin()
        return
      }

      const response = await fetch(articlesUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (response.ok) {
        setArticles(data.articles)
        setMessage('Articles loaded successfully.')
      } else if (response.status === 401) {
        // Token may be invalid, redirect to login
        setMessage('Session expired. Please log in again.')
        redirectToLogin()
      } else {
        setMessage('Failed to load articles.')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setSpinnerOn(false)
    }
  }

  const postArticle = async (article) => {
    setMessage('')
    setSpinnerOn(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        redirectToLogin()
        return
      }

      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article),
      })

      const data = await response.json()

      if (response.ok) {
        setArticles([...articles, data.article]) // Add new article to state
        setMessage('Article created successfully.')
      } else {
        setMessage(data.message || 'Failed to create article.')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setSpinnerOn(false)
    }
  }

  const updateArticle = async ({ article_id, article }) => {
    setMessage('')
    setSpinnerOn(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        redirectToLogin()
        return
      }

      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article),
      })

      const data = await response.json()

      if (response.ok) {
        setArticles(articles.map(art => art.article_id === article_id ? data.article : art))
        setMessage('Article updated successfully.')
      } else {
        setMessage(data.message || 'Failed to update article.')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setSpinnerOn(false)
    }
  }

  const deleteArticle = async (article_id) => {
    setMessage('')
    setSpinnerOn(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        redirectToLogin()
        return
      }

      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()

      if (response.ok) {
        setArticles(articles.filter(art => art.article_id !== article_id))
        setMessage('Article deleted successfully.')
      } else {
        setMessage(data.message || 'Failed to delete article.')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setSpinnerOn(false)
    }
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} />
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
