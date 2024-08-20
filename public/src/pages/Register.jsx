import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if(localStorage.getItem('chat-app-user')) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (handleValidation()) {
      const { password, username, email } = values;
      
      try {
        const {data} = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
        
        if(data.status === false) {
          toast.error(data.msg, toastOption);
        }
        if(data.status === true) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.user));
          navigate("/");
        }

      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  const toastOption = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  }

  const handleValidation = () => {
    const {password, confirmPassword, username, email} = values;
 
    if(password !== confirmPassword) {
      toast.error("Password and Confirm Password should be same.", toastOption);
      return false;
    }
    else if(username.length < 3) {
      toast.error("Username should be equal or greater than 3 characters", toastOption);
      return false;
    }
    else if(password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters", toastOption);
      return false;
    }
    else if(email==="") {
      toast.error("Email is required", toastOption);
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }
  return ( 
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={logo} alt="" />
            <h1>Chatify</h1>
          </div>
          <input type="text" placeholder="Username" name="username" onChange={handleChange} />

          <input type="email" placeholder="Email" name="email" onChange={handleChange} />

          <input type="password" placeholder="Password" name="password" onChange={handleChange} />

          <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} />

          <button type='submit'>Create User</button>
          <span>Already have an account ? <Link to="/login">Login</Link> </span>
        </form>
      </FormContainer>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0% 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.25s ease-in-out;
      &:hover{
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`

export default Register
