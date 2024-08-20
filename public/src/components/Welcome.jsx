import React, {useState, useEffect} from 'react'
import Robot from '../assets/robot.gif';
import styled from 'styled-components';

export default function Welcome({currentUser}) {

  return (
    <Container>
      <img src={Robot} alt="Robot" /> 
      <h1>Welcome, <span>{currentUser.username}!</span> </h1>
      <h3>Please select a chat to start Messaging</h3>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  img{
    height: 20rem;
  }
  span{
    color: #4e0eff;
  }
  h3{
    padding-top: 0.5rem;
  }
`;