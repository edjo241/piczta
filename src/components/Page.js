import { useEffect, useState } from 'react';
import '../styles/App.css';
import Post from './Post'
import db,{auth} from '../firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Avatar, Button, IconButton, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import {Link} from 'react-router-dom'
import * as Scroll from 'react-scroll'

const scroll=Scroll.animateScroll;

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Page() {
  


  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [open,setOpen]=useState(false);
  const [posts,setPosts]=useState([]);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [user,setUser]=useState(null);
  const [openSignIn,setOpenSignIn]=useState(false);
  useEffect(()=>{
    db.collection("posts").orderBy("timestamp","desc").onSnapshot(snapshoot=>{
      setPosts(snapshoot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      })))
    })

   
   
  },[posts])
 
  useEffect(()=>{
   const unSubscribe= auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        setUser(authUser);
      } else{
              setUser(null);
      }
    })
  

    return()=>{
      //clean up
      unSubscribe();
    }
  },[user,username])

  const signUp=(e)=>{

    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch(error=>alert(error.messages));
    setOpen(false);
  }

  const signIn=(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch(error=>alert(error.messages))
    setOpenSignIn(false);
  }

  
    
  return (
  <div>  

{user?(
  <div className="app">
<Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <div style={modalStyle} className={classes.paper}>
          
              <center><h1 className="app__headerModal">PicZzta</h1></center>
              <form className="app__modal value={} onChange={()=>setUsername(e.target.value)}">
                <Input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                <Input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <Input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <Button type="submit" color="secondary" variant="contained" onClick={signUp}>Sign Up</Button>
                
              </form>
    </div>
</Modal>

<Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <div style={modalStyle} className={classes.paper}>
              <center><h1 className="app__headerModal">PicZzta</h1></center>
              <form className="app__modal value={} onChange={()=>setUsername(e.target.value)}">
                <Input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <Input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <Button type="submit" color="primary" variant="contained" onClick={signIn}>Log In</Button>
              </form>
    </div>
</Modal>
      <div className="app__header">
        <h1><strong><i>PicZzta</i></strong></h1>
        <div className="app__headerLogin">
        
        
        <Link to="/user">
          
        <IconButton>
          <Avatar className="outline" src={user?.photoURL}/>
          <h6 className="text">{user?.displayName}</h6>
        </IconButton>
        
        </Link>
        <button className="app__upload" onClick={()=>scroll.scrollToBottom()}>Upload</button>
        {user &&
        (<Button  className="app__logoutButton"color="primary" size="small" variant="contained" onClick={()=>auth.signOut()}>Log Out</Button>)}
       
        </div>
        
      </div>
      
      <div className="app__posts">
      {posts.map(({post,id})=>(<Post key={id} user={user} postId={id} username={post.username} imgUrl={post.imageUrl} caption={post.caption} timestamp={post.timestamp} dp={user?.photoURL} />))}
      </div>
     

      {user?.displayName?(<ImageUpload username={user.displayName}/>):(<h3>Sorry you need to login to upload</h3>)}

      

    </div>):
    (
      <div>
        <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <div style={modalStyle} className={classes.paper}>
              <center><h1 className="app__headerModal">PicZzta</h1></center>
              <form className="app__modal value={} onChange={()=>setUsername(e.target.value)}">
                <Input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                <Input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <Input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <Button type="submit" onClick={signUp} color="secondary" variant="contained">Sign Up</Button>
              </form>
    </div>
</Modal>

<Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <div style={modalStyle} className={classes.paper}>
              <center><h1 className="app__headerModal">PicZzta</h1></center>
              <form className="app__modal value={} onChange={()=>setUsername(e.target.value)}">
                <Input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <Input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <Button type="submit"  color="primary" variant="contained" onClick={signIn}>Log In</Button>
              </form>
    </div>
</Modal>
       <div className="app__header">
       <h1><strong><i>PicZzta</i></strong></h1>

       {user ?
       (<Button onClick={()=>auth.signOut()}>Log Out</Button>):(
       <div className="app__loginContainer">
         <Button className="app__button1"  color="primary" variant="contained"  onClick={()=>setOpenSignIn(true)}>Log in</Button>
         <button className="app__button2" color="primary" variant="contained" onClick={()=>setOpen(true)}>Sign Up</button>
       </div>
       )}
       
        {user && <Link to="/user">
       <IconButton>
         <Avatar src={user?.photoURL}/>
       </IconButton>
       
       </Link>} 
      
       
     </div>
      <div className="app__logout">
      <h4>Log in to see Posts</h4>
      <p className="app__devInfo"><i>Developer:Edwin Joseph</i></p>
    </div>
    </div>
    )}
      
    </div>   

      
  );
}

export default Page;
