import React, { useEffect, useState } from 'react'
import '../styles/Post.css'
import {Avatar} from '@material-ui/core'
import db from '../firebase'
import firebase from 'firebase'

function Post({username,imgUrl,caption,postId,user,timestamp,dp}) {

    const [comment,setComment]=useState('');
    const [comments,setComments]=useState([]);
    
    

    useEffect(()=>{
        let unSubscribe;
        if(postId){
            unSubscribe= db.collection("posts").doc(postId).collection("comments").orderBy("timestamp","desc").onSnapshot(snapshoot=>{
                setComments(snapshoot.docs.map(doc=>doc.data()))
            })
            
        }
        return ()=>{
            unSubscribe();
        }
    },[postId])


    const postComment=(e)=>{
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment("");
    }
    

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar className="post__avatar" src={user?.displayName===username?(dp):(null)}/>
                <h3>{username}</h3>
            </div>
            <img className="post__image"src={imgUrl} alt="post"/>
            <span className="post__time">{new Date(timestamp?.toDate()).toUTCString()}</span>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            <div className="post__comment">
                {comments.map(comment=>[
                    <h4 className="post__commentText"><strong>{comment.username}</strong> {comment.text}</h4>
                ])}
            </div>

            <form className="post__commentbox"> 
                <input className="post__input" type="text" placeholder="Add a comment..." value={comment} onChange={e=>setComment(e.target.value)}></input>
                <button className="post__button" disabled={!comment} type='submit' onClick={postComment}>Post</button>
            </form>
        </div>
    )
}

export default Post
