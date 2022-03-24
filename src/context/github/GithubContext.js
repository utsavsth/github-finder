import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({children}) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  }

  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get single user
  const getUser = async (login) => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        //Authorization: `token ${GITHUB_TOKEN}`
      }
    });

    if(response.status === 404){
      window.location = '/notfound'
    } else {
      const data = await response.json();

      dispatch({
        type: 'GET_USER',
        payload: data
      })
      //console.log(data);
    }
    
  }

  // Get user repos
  const getUserRepos = async (login) => {
    setLoading();

    const params = new URLSearchParams({
      sort: 'stars',
      per_page: 10,
    })
    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
      headers: {
        //Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    const data = await response.json();

    dispatch({
      type: 'GET_REPOS',
      payload: data
    })
    //console.log(data);
  }

  // Get initial users (testing purposes)
  const fetchUsers = async () => {
    setLoading();

    
    const response = await fetch(`${GITHUB_URL}/users`, {
      headers: {
        //Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    const data = await response.json();

    dispatch({
      type: 'GET_USERS',
      payload: data
    })
    //console.log(data);
  }

  // Clear users from state
  const clearUsers = async () => {
    dispatch({
      type: 'CLEAR_USERS'
    })
  }

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' })

  return <GithubContext.Provider value={{
    ...state,
    dispatch,
    fetchUsers,
    getUser,
    getUserRepos,
    clearUsers,
  }}>
    {children}
  </GithubContext.Provider>
}

export default GithubContext