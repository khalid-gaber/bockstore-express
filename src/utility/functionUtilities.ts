const jwt = require('jsonwebtoken');
const Like = require('../models/Like');
const Dislike = require('../models/Dislike');
const Post = require('../models/Post')
import mongoose from 'mongoose';

function createRefreshToken(userId: string) {
    return jwt.sign({userId},process.env.REFRESH_JWT_KEY, {expiresIn: '7d'});
}

function createAccessToken(userId: string) {
    return jwt.sign({userId},process.env.ACCESS_JWT_KEY, {expiresIn: '15m'});
}


//handling likes//////////
async function addLike (userId: string, postId: string) {
    // make sure that user has not already add like to this post
    const post = await Post.findOne({_id: postId, likes: {$in: [userId]}}).lean();
    if(post) {
        return post;
    } else {
        //delete dislike on this post (if any) first
        await deleteDislike(userId, postId);

        const like = await Like.create({
            user: userId, 
            post: postId
        });
        await Post.updateOne(
            {_id: postId}, 
            { $push: { likes: userId } },
        )
        const post = await Post.findOne({_id: postId}).lean();
        return post;
    }
}

async function deleteLike (userId: string, postId: string) {
    const like = await Like.findOneAndDelete({
        user: userId, 
        post: postId
    }).lean();
    await Post.updateOne(
        {_id: postId}, 
        { $pull: { likes: userId }},
    ).lean();
    const post = await Post.findOne({_id: postId}).lean();
    return post;
}
/////////////////////////////

//handling dislikes/////////
async function addDislike (userId: string, postId: string) {
    // make sure that user has not already add dislike to this post
    const post = await Post.findOne({_id: postId, dislikes: {$in: [userId]}}).lean();
    if(post) {
        return post;
    } else {
        //delete like on this post (if any) first
        await deleteLike(userId , postId);
        
        const dislike = await Dislike.create({
            user: userId, 
            post: postId
        });
        await Post.updateOne(
            {_id: postId}, 
            { $push: { dislikes: userId } },
        )
        const post = await Post.findOne({_id: postId}).lean();
        return post;
    }
}

async function deleteDislike (userId: string, postId: string) {
    const dislike = await Dislike.findOneAndDelete({
        user: userId, 
        post: postId
    }).lean();
    await Post.updateOne(
        {_id: postId}, 
        { $pull: { dislikes: userId }},
    ).lean();
}
/////////////////////////////

//get post after interacting/////////
async function getInteractedPost(userId: string, postId: string) {
    const post = await Post.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(postId as string) }
        },
        {
            $project: {
                image: 1,
                content: 1,
                createdAt: 1,
                upatedAt: 1,
                comments: 1,
                commentsNumber: {$size: "$comments"},
                likesNumber: {$size: "$likes"},
                dislikesNumber: {$size: "$dislikes"},
                isLiked: {
                    $in: [new mongoose.Types.ObjectId(userId), "$likes"]
                },
                isDisliked: {
                    $in: [new mongoose.Types.ObjectId(userId), "$dislikes"]
                },
            },
        },
    ])
    return post[0];
}
/////////////////////////////

//get post after comment changing/////////
async function postAfterCommentChange(postId: string, userId='') {
    let userObjectId;
    try {
        userObjectId = new mongoose.Types.ObjectId(userId);
    }catch(err) {
        userObjectId = '';
    }

    let post = await Post.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(postId) }
        },
        {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
        },
        {$unwind: '$user'},
        {
            $lookup: {
              from: "comments",
              localField: "comments",
              foreignField: "_id",
              as: "comments",
            },
        },
        {
            $unwind: {
              path: "$comments",
              preserveNullAndEmptyArrays: true
            }
        },     
        {
            $lookup: {
              from: "users",
              localField: "comments.user",
              foreignField: "_id",
              as: "comments.user",
            },
        },
        {
            $unwind: {
              path: "$comments.user",
              preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                "comments.isCommented": { $eq: ["$user._id", userObjectId] }
            }
        },            
        {
            $project: {
                image: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                'user._id': 1,
                'user.username': 1,
                'user.avatar': 1,
                comments: {
                    '_id': 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.avatar': 1,
                    'content': 1,
                    'createdAt': 1,
                    'updatedAt': 1,
                    isCommented: { $eq: ["$comments.user._id", userObjectId]}
                },
                likesNumber: {$size: "$likes"},
                dislikesNumber: {$size: "$dislikes"},
                isLiked: {
                    $in: [userObjectId, "$likes"]
                },
                isDisliked: {
                    $in: [userObjectId, "$dislikes"]
                },
            },
        },
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                image: { $first: "$image" },
                content: { $first: "$content" },
                comments: { $push: "$comments" },
                commentsNumber: { $first: "$commentsNumber" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                likesNumber: { $first: "$likesNumber" },
                dislikesNumber: { $first: "$dislikesNumber" },
                isLiked: { $first: "$isLiked" },
                isDisliked: { $first: "$isDisliked" },
            }          
        },
        {
            $addFields: { 
                commentsNumber: {$size: "$comments"},
            }
        },
    ])
    if(!post[0].comments[0]._id){
        post[0].comments = [];
        post[0].commentsNumber = 0;
    }
    return post[0];
}
/////////////////////////////


module.exports = {
    createRefreshToken,
    createAccessToken,
    addLike,
    deleteLike,
    addDislike,
    deleteDislike,
    getInteractedPost,
    postAfterCommentChange,
}

