import React, { useState } from 'react'
import '../styles/Profile.css'
import DeleteIcon from '@material-ui/icons/Delete';
import db from '../firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
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

 

function ProfilePost({imgUrl,postId}) {

    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();
    const [open,setOpen]=useState(false);
    const postDelete=()=>{
        db.collection("posts").doc(postId).delete();
    }
    const handleChange=()=>{
        setOpen(true);
    }
    
    return (
<div>
        <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Delete</h2>
      <p id="simple-modal-description">
        This action will permanently delete this content from your account.
        Do you want to continue?
      </p>
      <div className="modal__button">
      <button className="modal__delete" onClick={postDelete}>Delete</button>
      <button className="modal__cancel" onClick={()=>setOpen(false)}>Cancel</button>
      </div>
      
    </div>
      </Modal>
        <div className="profile__postContainer">
              <div className="profile__post">
                        <div className="profile__postHeader">
                            
                            <DeleteIcon className="Profile__postDelete" onClick={handleChange} />
                            
                        </div>
            
                    <img className="profile__image" src={imgUrl} alt="post"/>
                    </div>
               
            
        </div>
        </div>
    )
}

export default ProfilePost
