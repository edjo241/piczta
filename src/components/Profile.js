import React, { useEffect, useState } from 'react'
import {  withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import '../styles/Profile.css'
import db ,{auth,storage}from '../firebase'
import {Avatar,Button,Input} from '@material-ui/core';
import ProfilePost from './ProfilePost'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

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

function Profile() {
    const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
    const [posts,setPosts]=useState([]);
    const [user,setUser]=useState("");
    const [profileImage,setProfileImage]=useState("");
    const [openSignIn,setOpenSignIn]=useState(false);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
   const myPosts=posts.filter(({post,id})=>(post.username===user?.displayName))

    
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
             console.log(user.user);
           } else{
                   setUser(null);
           }
         })
       
         return()=>{
           //clean up
           unSubscribe();
         }
       },[user])

       const handleChange=(e)=>{
           if(e.target.files[0]){
               setProfileImage(e.target.files[0]);
           }
           
       }
      

        const handleUpload=()=>{
           const uploadTask=storage.ref(`profile_image/${profileImage.name}`).put(profileImage);
           uploadTask.on(
            "state_changes",
            (snapshot)=>{
                
            },
            (error)=>{
                console.log(error);
                alert(error.messages);
            },
                ()=>{
                   storage.ref('profile_image').child(profileImage.name).getDownloadURL()
                   .then(url=>{
                       user.updateProfile({
                           photoURL:url
                       })
                       
                       setProfileImage("");
                       db.collection("profile_picture").add({
                           profile_pic:user.photoURL,
                           username:user.displayName
                       })
                   })
               }
           )
           

       }

    const signIn=(e)=>{
        e.preventDefault();
        auth.signInWithEmailAndPassword(email,password)
        .catch(error=>alert(error.messages))
        setOpenSignIn(false);
      }
    
      
    return (
        <div className="profile">
           
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
            <div className="profile__header">
                <Link to="/">
            <h1 className="profile__headerName"><strong><i>PicZzta</i></strong></h1>
            </Link>
            {user ?
            
       (<div>
           <Button  color="primary" variant="contained" onClick={()=>auth.signOut()}>Log Out</Button>
           </div>):(
           <div >
         <Button className="app__button1"  color="primary" variant="contained"  onClick={()=>setOpenSignIn(true)}>Log in</Button>
       </div>
       )}
            </div>
            <div className="profile__info">
                <Avatar className="profile__avatar" src={user?.photoURL}/>
                <h4 className="profile__username">{user?.displayName}</h4>
                <input type="file"  onChange={handleChange}></input>
                <button   disabled={!profileImage} onClick={handleUpload}>Upload Profile Picture</button>
            </div>
           
           <div className={`profilePost__container1 ${myPosts.length===0 && 'test'}`}>
               {myPosts.length===0?(<h4 className="profile__noPost">No Posts To Show</h4>):(myPosts.map(({post,id})=>(<ProfilePost imgUrl={post.imageUrl} key={id} postId={id} />)))}
          
            </div>
        
            
            
            
        </div>
    )
}

export default withRouter(Profile) 
