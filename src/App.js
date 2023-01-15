import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Input } from '@mui/material';

// CSS component
import './App.css';

// Logo Import
import logo from './utils/logo.png';

// User Components
import Post from './Post';
import ImageUpload from './ImageUpload';
import {
  getData,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
  auth,
  updateProfile,
  signOut,
} from './firebase';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // if user is logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName == null) {
          // user was just created hence no username
          console.log(`displayName is ${authUser.displayName}`);
          return updateProfile(authUser, {
            displayName: username,
          });
        }
      }
      else {
        //logout functionality
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, username]);

  useEffect(() => {
    const getPosts = async () => {
      const snapshot = await getData();
      const postList = snapshot.docs.map(doc => ({
        post: doc.data(),
        id: doc.id,
      }));
      setPosts(postList);
    }
    getPosts();

  }, []);

  const signUp = async (e) => {
    e.preventDefault();
    const res = await registerWithEmailAndPassword(username, email, password);
    console.log(res);
    setUsername('');
    setEmail('');
    setPassword('');
    setOpenSignUp(false);
  }

  const signIn = async (e) => {
    e.preventDefault();
    const res = await logInWithEmailAndPassword(email, password);
    console.log(res);
    setEmail('');
    setPassword('');
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      >
        <Box sx={style} className='app__signup'>
          <form action="" className='app__signup'>
            <center>
              <img className='app__signUpLogo' src={logo} alt="App-logo" />
            </center>
            <h1>Create New Account</h1>
            <p onClick={() => { console.log('Sign In') }}>Or Sign in into your existing Account</p>
            <br />
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <Input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <Button onClick={signUp} >Sign Up</Button>

          </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <Box sx={style} className='app__signup'>
          <form action="" className='app__signup'>
            <center>
              <img className='app__signUpLogo' src={logo} alt="App-logo" />
            </center>
            <h1>Sign into existing Account</h1>
            <p onClick={() => { console.log('Sign up') }}>Or Sign Up for a new Account</p>
            <br />
            <Input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <Button onClick={signIn} >Sign In</Button>

          </form>
        </Box>
      </Modal>

      <div className='app__header'>
        <div className='app__title'>
          <img className='app__headerImage' src={logo} alt="App-logo" />
          <h1>AD's Social Media App</h1>
        </div>
        <div className='app__headerButtons'>
          {user ?
            (<Button onClick={() => signOut(auth)}>Logout</Button>)
            : (<div className='app__loginContainer'>
              <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            </div>)
          }
        </div>
      </div>

      <div className='app__imageUpload'>
        {user?.displayName ?
          (<ImageUpload username={user.displayName} />)
          : (
            <div>
              <h3>Login to Upload Posts</h3>
              <p>For new accounts this feature will be enabled after your next Login</p>
            </div>
          )
        }
      </div>

      <div className='app__posts'>
        {
          posts.map(({ id, post }) => {
            return (<Post
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              signedInUser={user}
            />)
          })
        }
      </div>

    </div>
  );
}


export default App;
