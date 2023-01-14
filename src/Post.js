import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@mui/material';

// CSS Import
import './Post.css'

// User Imports
import { getComments, addComment } from './firebase';

const Post = ({ postId, username, caption, imageUrl, signedInUser }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const getData = async () => {
            const snapshot = await getComments(postId);
            setComments(snapshot.docs.map((doc) => doc.data()));
        }
        getData();

        return (() => {
            getData();
        })
    }, [postId, comments]);

    const postComment = (e) => {
        e.preventDefault();
        addComment(postId, comment, signedInUser.displayName);
        setComment('');
    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                    className='post__avatar'
                    src=""
                    alt="avatar"
                />
                <h3>{username}</h3>
            </div>
            <img className='post__image' src={imageUrl} alt="post" />
            <h4 className='post__text'><strong>{username} </strong>{caption}</h4>
            <div className='post__comments'>
                {comments.map((comment) => {
                    return (<p>
                        <strong>{comment.username}</strong> {comment.comment}
                    </p>)
                })}
            </div>

            {signedInUser ?
                (<form className='post__commentBox'>
                    <input
                        className='post__input'
                        placeholder='Comment on post...'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <Button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        POST
                    </Button>
                </form>)
                : (
                    <div className='post__notSignedIn'>
                        <p>Login to Comment on this Post</p>
                    </div>
                )
            }


        </div>
    )
}

export default Post