import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { axiosWithAuth } from '../helpers/axiosWithAuth'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.clear();
    redirectToLogin();
    setMessage("Goodbye!")
  }

  const login = async ({ username, password }) => {
    setSpinnerOn(true);
    const {data} = await axiosWithAuth().post(loginUrl, {username, password});
    setMessage(data.message);
    localStorage.setItem('token', data.token);
    redirectToArticles()
  }

  const getArticles = async () => {
    setSpinnerOn(true);
    const { data } = await axiosWithAuth().get(articlesUrl);
    setArticles(data.articles);
    setMessage(data.message);
    setSpinnerOn(false);
  }

  const postArticle = async article => {
    setSpinnerOn(true);
    const { data } = await axiosWithAuth().post(articlesUrl, article);
    setMessage(data.message);
    setArticles([...articles, data.article]);
    setSpinnerOn(false);
  }

  const updateArticle = async ({ article_id, article }) => {
    setSpinnerOn(true);
    const { data } = await axiosWithAuth().put(`${articlesUrl}/${article_id}`, article);
    setMessage(data.message);
    const copy = [...articles];
    const indexOfArticle = copy.findIndex(art => art.article_id === article_id);
    copy[indexOfArticle] = data.article;
    setArticles(copy);
    setCurrentArticleId(null);
    setSpinnerOn(false);
  }

  const deleteArticle = async article_id => {
    setSpinnerOn(true);
    const { data } = await axiosWithAuth().delete(`${articlesUrl}/${article_id}`);
    setMessage(data.message);
    setArticles(articles.filter(art => art.article_id !== article_id))
    setSpinnerOn(false);
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm spinnerOn={spinnerOn} articles={articles} setCurrentArticleId={setCurrentArticleId} currentArticle={articles.find(art => art.article_id === currentArticleId)} postArticle={postArticle} updateArticle={updateArticle} />
              <Articles currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} redirectToLogin={redirectToLogin} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}