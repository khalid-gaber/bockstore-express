"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const Like = require('../models/Like');
const Dislike = require('../models/Dislike');
const Post = require('../models/Post');
const mongoose_1 = __importDefault(require("mongoose"));
function createRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_JWT_KEY, { expiresIn: '7d' });
}
function createAccessToken(userId) {
    return jwt.sign({ userId }, process.env.ACCESS_JWT_KEY, { expiresIn: '15m' });
}
//handling likes//////////
function addLike(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        // make sure that user has not already add like to this post
        const post = yield Post.findOne({ _id: postId, likes: { $in: [userId] } }).lean();
        if (post) {
            return post;
        }
        else {
            //delete dislike on this post (if any) first
            yield deleteDislike(userId, postId);
            const like = yield Like.create({
                user: userId,
                post: postId
            });
            yield Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            const post = yield Post.findOne({ _id: postId }).lean();
            return post;
        }
    });
}
function deleteLike(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const like = yield Like.findOneAndDelete({
            user: userId,
            post: postId
        }).lean();
        yield Post.updateOne({ _id: postId }, { $pull: { likes: userId } }).lean();
        const post = yield Post.findOne({ _id: postId }).lean();
        return post;
    });
}
/////////////////////////////
//handling dislikes/////////
function addDislike(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        // make sure that user has not already add dislike to this post
        const post = yield Post.findOne({ _id: postId, dislikes: { $in: [userId] } }).lean();
        if (post) {
            return post;
        }
        else {
            //delete like on this post (if any) first
            yield deleteLike(userId, postId);
            const dislike = yield Dislike.create({
                user: userId,
                post: postId
            });
            yield Post.updateOne({ _id: postId }, { $push: { dislikes: userId } });
            const post = yield Post.findOne({ _id: postId }).lean();
            return post;
        }
    });
}
function deleteDislike(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const dislike = yield Dislike.findOneAndDelete({
            user: userId,
            post: postId
        }).lean();
        yield Post.updateOne({ _id: postId }, { $pull: { dislikes: userId } }).lean();
    });
}
/////////////////////////////
//get post after interacting/////////
function getInteractedPost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield Post.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(postId) }
            },
            {
                $project: {
                    image: 1,
                    content: 1,
                    createdAt: 1,
                    upatedAt: 1,
                    comments: 1,
                    commentsNumber: { $size: "$comments" },
                    likesNumber: { $size: "$likes" },
                    dislikesNumber: { $size: "$dislikes" },
                    isLiked: {
                        $in: [new mongoose_1.default.Types.ObjectId(userId), "$likes"]
                    },
                    isDisliked: {
                        $in: [new mongoose_1.default.Types.ObjectId(userId), "$dislikes"]
                    },
                },
            },
        ]);
        return post[0];
    });
}
/////////////////////////////
//get post after comment changing/////////
function postAfterCommentChange(postId_1) {
    return __awaiter(this, arguments, void 0, function* (postId, userId = '') {
        let userObjectId;
        try {
            userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        }
        catch (err) {
            userObjectId = '';
        }
        let post = yield Post.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: '$user' },
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
                        isCommented: { $eq: ["$comments.user._id", userObjectId] }
                    },
                    likesNumber: { $size: "$likes" },
                    dislikesNumber: { $size: "$dislikes" },
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
                    commentsNumber: { $size: "$comments" },
                }
            },
        ]);
        if (!post[0].comments[0]._id) {
            post[0].comments = [];
            post[0].commentsNumber = 0;
        }
        return post[0];
    });
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
};
