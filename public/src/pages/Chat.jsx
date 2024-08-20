import React, {useState, useEffect, useRef} from 'react';
import {navigate, useNavigate} from 'react-router-dom';
import styled from "styled-components";
import axios, { formToJSON } from "axios";
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";

function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")) {
      navigate('/login');
    }
    else {
      setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')))
      setIsLoaded(true);
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          if (currentUser.isAvatarImageSet) {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } else {
            navigate("/setAvatar");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
  
    fetchData();
  }, [currentUser]);
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <Container> 
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        
        {isLoaded && !currentChat ? (
          <Welcome currentUser={currentUser} />
        ) : (
          currentUser && currentChat && <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
        )}
        
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat