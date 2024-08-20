import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from "buffer";

export default function SetAvatar() {

  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    if(!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    }
  }, []);

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

  const setProfilePicture = async () => {
    if(selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOption)
    }
    else {
      // Fetch the user from localStorage
      const user = await JSON.parse(localStorage.getItem('chat-app-user'));
      try {
        const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar]
        })
        if(data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        }
        else {
          toast.error("Error Setting avatar. Please try again.", toastOption)
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  
  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const response = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = Buffer.from(response.data);
          data.push(buffer.toString('base64'));
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded. Retrying...');
          } else {
            console.error('Error fetching image:', error);
          }
        }
      }
      if(data.length === 0) {
        toast.info("Can't load Avatar", toastOption);
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchData();
  }, []); 

  return (
    <>
      {isLoading
      ? (<Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>)
      : (<Container>
        <div className="title-container">
          <h1>Pick an avatar as your profile picture</h1>
        </div>
        {avatars.length === 0 
          ? <div className='limit'>Limit Reached. Please try again after some time.</div>
          : <div className='avatars'>
            {avatars.map((avatar, index)=>{
              return (
                <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                  <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelectedAvatar(index)}/>
                </div>
              )
            })}
          </div>}
        {avatars.length && <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>}
      </Container>)}
      <ToastContainer/>
    </>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .limit {
    color: white;
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      &:hover {
        border-color: #997af0;
      }
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .avatar.selected {
      border: 0.4rem solid #4e0eff;
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
`;